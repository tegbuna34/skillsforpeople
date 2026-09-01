/**
 * One-time (idempotent) migration: Notion → Supabase.
 *
 * Reads Published skills, their linked episodes, and the contributors database
 * from Notion, then upserts them into Supabase's `contributors`, `episodes`,
 * and `skills` tables. Uses `notion_id` as the natural key so re-runs update
 * existing rows in place instead of duplicating.
 *
 * Requires these env vars in .env.local when running locally:
 *   NOTION_TOKEN
 *   NOTION_SKILLS_DATA_SOURCE_ID
 *   NOTION_EPISODES_DATA_SOURCE_ID
 *   NOTION_CONTRIBUTORS_DATA_SOURCE_ID
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run:  npx tsx scripts/migrate-notion-to-supabase.ts
 */

import { config } from "dotenv";
import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const {
  NOTION_TOKEN,
  NOTION_SKILLS_DATA_SOURCE_ID,
  NOTION_EPISODES_DATA_SOURCE_ID,
  NOTION_CONTRIBUTORS_DATA_SOURCE_ID,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

function required(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const notion = new Client({ auth: required("NOTION_TOKEN", NOTION_TOKEN) });
const sb = createClient(
  required("SUPABASE_URL", SUPABASE_URL),
  required("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY),
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---- Notion field readers (same logic as the old lib/*.ts) ----

function readTitle(prop: any): string {
  return (prop?.title ?? []).map((t: any) => t.plain_text ?? "").join("").trim();
}
function readRichText(prop: any): string {
  return (prop?.rich_text ?? []).map((t: any) => t.plain_text ?? "").join("").trim();
}
function readSelect(prop: any): string {
  return prop?.select?.name ?? "";
}
function readMultiSelect(prop: any): string[] {
  return (prop?.multi_select ?? []).map((o: any) => o.name).filter(Boolean);
}
function readUrl(prop: any): string | null {
  const v = prop?.url;
  return typeof v === "string" && v.length > 0 ? v : null;
}
function readDate(prop: any): string | null {
  return prop?.date?.start ?? null;
}
function readCreatedTime(prop: any): string | null {
  return prop?.created_time ?? null;
}
function readRelationIds(prop: any): string[] {
  return (prop?.relation ?? []).map((r: any) => r.id).filter(Boolean);
}
function readFirstFileUrl(prop: any): string | null {
  const files = prop?.files ?? [];
  for (const f of files) {
    const url = f?.file?.url ?? f?.external?.url;
    if (typeof url === "string" && url.length > 0) return url;
  }
  return null;
}
function readEpisodeUrl(p: any): string {
  const candidates = ["userDefined:URL", "URL", "Episode URL", "Link", "url"];
  for (const name of candidates) {
    const v = readUrl(p[name]);
    if (v) return v;
  }
  return "";
}
function parseSteps(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
}

async function queryAll(dataSourceId: string, extra: any = {}): Promise<any[]> {
  const pages: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res: any = await notion.databases.query({
      database_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
      ...extra,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function main() {
  required(
    "NOTION_SKILLS_DATA_SOURCE_ID",
    NOTION_SKILLS_DATA_SOURCE_ID
  );
  required(
    "NOTION_EPISODES_DATA_SOURCE_ID",
    NOTION_EPISODES_DATA_SOURCE_ID
  );
  required(
    "NOTION_CONTRIBUTORS_DATA_SOURCE_ID",
    NOTION_CONTRIBUTORS_DATA_SOURCE_ID
  );

  console.log("Reading Notion…");

  const [skillPages, episodePages, contributorPages] = await Promise.all([
    queryAll(NOTION_SKILLS_DATA_SOURCE_ID!, {
      filter: { property: "Status", select: { equals: "Published" } },
    }),
    queryAll(NOTION_EPISODES_DATA_SOURCE_ID!),
    queryAll(NOTION_CONTRIBUTORS_DATA_SOURCE_ID!),
  ]);

  console.log(
    `  skills: ${skillPages.length}, episodes: ${episodePages.length}, contributors: ${contributorPages.length}`
  );

  // ---- Contributors first (skills reference them) ----

  const contributorNotionIdToDbId = new Map<string, string>();
  const contributorRows = contributorPages
    .map((page) => {
      const p: any = page.properties;
      const slug = readRichText(p["Contributor Slug"]);
      const name = readTitle(p["Contributor Name"]);
      if (!slug || !name) return null;
      return {
        slug,
        name,
        title: readRichText(p["Current Title"]),
        company: readRichText(p["Current Company"]),
        photo_url: readFirstFileUrl(p["Photo"]),
        linkedin_url: readUrl(p["LinkedIn URL"]),
        bio: readRichText(p["Short Bio"]),
        notion_id: page.id,
      };
    })
    .filter(Boolean) as any[];

  console.log(`Upserting ${contributorRows.length} contributors…`);
  const { data: contribData, error: contribErr } = await sb
    .from("contributors")
    .upsert(contributorRows, { onConflict: "notion_id" })
    .select("id, notion_id");
  if (contribErr) throw contribErr;
  for (const row of contribData ?? []) {
    if (row.notion_id) contributorNotionIdToDbId.set(row.notion_id, row.id);
  }

  // ---- Episodes ----

  const episodeNotionIdToDbId = new Map<string, string>();
  const episodeRows = episodePages
    .map((page) => {
      const p: any = page.properties;
      const podcast =
        readRichText(p["Podcast Name"]) || readSelect(p["Podcast Name"]);
      const title = readTitle(p["Episode Title"]);
      if (!title) return null;
      // Older episode rows referenced guests via flat text; the current model
      // links the guest via the Contributor relation on Skill, not on Episode.
      // Episode.guest_contributor_id is best-effort here — leave null when we
      // can't resolve it. mapRow in lib/skills.ts falls back to Skill.contributor.
      return {
        podcast,
        title,
        url: readEpisodeUrl(p),
        date: readDate(p["Date of Podcast"]),
        guest_contributor_id: null as string | null,
        notion_id: page.id,
      };
    })
    .filter(Boolean) as any[];

  console.log(`Upserting ${episodeRows.length} episodes…`);
  const { data: epData, error: epErr } = await sb
    .from("episodes")
    .upsert(episodeRows, { onConflict: "notion_id" })
    .select("id, notion_id");
  if (epErr) throw epErr;
  for (const row of epData ?? []) {
    if (row.notion_id) episodeNotionIdToDbId.set(row.notion_id, row.id);
  }

  // ---- Skills ----

  const skillRows = skillPages
    .map((page) => {
      const p: any = page.properties;
      const slug = readRichText(p["Skill Slug"]);
      const name = readTitle(p["Skill Name"]);
      if (!slug || !name) return null;

      const contributorIds = readRelationIds(p["Contributor"]);
      const contributor_id =
        contributorIds.length > 0
          ? contributorNotionIdToDbId.get(contributorIds[0]) ?? null
          : null;

      const episodeIds = readRelationIds(p["Source Episode"]);
      const episode_id =
        episodeIds.length > 0
          ? episodeNotionIdToDbId.get(episodeIds[0]) ?? null
          : null;

      return {
        slug,
        name,
        vertical: readSelect(p["HR Vertical"]),
        description: readRichText(p["One-line Description"]),
        what_it_does: readRichText(p["What This Skill Does"]),
        process_steps: parseSteps(readRichText(p["Process Steps (display)"])),
        definition_of_done: readRichText(p["Definition of Done"]),
        common_pitfalls: readRichText(p["Common Pitfalls (display)"]),
        full_description: readRichText(p["Full Description"]),
        skill_file_url: readUrl(p["Skill File URL"]),
        prompt_file_url: readUrl(p["Prompt File URL"]),
        compatible_tools: readMultiSelect(p["Compatible Tools"]),
        tags: readMultiSelect(p["Tags"]),
        contributor_id,
        episode_id,
        status: "published",
        date_published: readCreatedTime(p["Created Date"]) ?? new Date(page.created_time).toISOString(),
        notion_id: page.id,
      };
    })
    .filter(Boolean) as any[];

  console.log(`Upserting ${skillRows.length} skills…`);
  const { error: skErr } = await sb
    .from("skills")
    .upsert(skillRows, { onConflict: "notion_id" });
  if (skErr) throw skErr;

  console.log("Migration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
