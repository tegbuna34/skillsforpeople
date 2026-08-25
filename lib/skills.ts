/**
 * Data-access module for Skills for People.
 *
 * This is the ONLY module in the codebase that talks to Notion. Every page and
 * component consumes the `Skill` / `Episode` types defined here — never Notion's
 * raw shape. When the source of truth migrates from Notion to Supabase (or
 * anything else), this file is the only place that needs to change.
 *
 * Behavior:
 * - USE_MOCK_SKILLS=1  → returns skills from ./skills.mock (local dev only).
 * - NOTION_TOKEN unset → returns [] so the site renders the empty state
 *   rather than crashing the build. Never falls back to mock in prod.
 * - Otherwise          → queries the Notion Skills data source, filters to
 *   Status = Published, and joins Source Episode when present.
 *
 * Fetch timing: build time only. Pages call these functions from RSC bodies
 * or generateStaticParams; there are no per-request Notion calls.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";
import { MOCK_SKILLS } from "./skills.mock";

export interface Contributor {
  name: string;
  title: string;
  company: string;
  slug?: string;
}

export interface Episode {
  podcast: string;
  title: string;
  url: string;
  guest: Contributor;
  date: string | null;
}

export interface Skill {
  notionPageId?: string;
  slug: string;
  name: string;
  vertical: string;
  description: string;
  whatItDoes: string;
  processSteps: string[];
  definitionOfDone: string;
  commonPitfalls: string;
  fullDescription: string;
  skillFileUrl: string | null;
  promptFileUrl: string | null;
  compatibleTools: string[];
  tags: string[];
  datePublished: string | null;
  episode: Episode | null;
}

const USE_MOCK = process.env.USE_MOCK_SKILLS === "1";
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const SKILLS_DS = process.env.NOTION_SKILLS_DATA_SOURCE_ID;
const EPISODES_DS = process.env.NOTION_EPISODES_DATA_SOURCE_ID;

let cachedClient: Client | null = null;
function notion(): Client {
  if (!cachedClient) cachedClient = new Client({ auth: NOTION_TOKEN });
  return cachedClient;
}

// Notion's SDK types are permissive; the property-reader helpers here narrow
// the raw response into our own types. Anything unrecognized becomes empty.
/* eslint-disable @typescript-eslint/no-explicit-any */

function readTitle(prop: any): string {
  if (!prop) return "";
  const arr = prop.title ?? [];
  return arr.map((t: any) => t.plain_text ?? "").join("").trim();
}

function readRichText(prop: any): string {
  if (!prop) return "";
  const arr = prop.rich_text ?? [];
  return arr.map((t: any) => t.plain_text ?? "").join("").trim();
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

function readRelationIds(prop: any): string[] {
  return (prop?.relation ?? []).map((r: any) => r.id).filter(Boolean);
}

// Prefer the on-disk file at /public/skills/<slug>/<slug>.<ext> over Notion's
// URL field: the file's existence on disk is the ground truth for whether the
// download button should be enabled, and this removes an entire class of
// "Notion property renamed and my read returns null" failures. Notion's field
// is still honored when it points at an external URL (someone hosts a version
// off-site).
function resolveDownloadUrl(
  slug: string,
  ext: "skill" | "md",
  notionUrl: string | null
): string | null {
  const conventionalRel = `/skills/${slug}/${slug}.${ext}`;
  const diskPath = path.join(process.cwd(), "public", conventionalRel);
  if (existsSync(diskPath)) return conventionalRel;
  if (notionUrl && !notionUrl.startsWith("/skills/")) return notionUrl;
  return null;
}

// Notion property names for the episode URL have drifted before ("userDefined:URL"
// vs "URL" vs "Episode URL"). Try a small set of the most likely names.
function readEpisodeUrl(p: any): string {
  const candidates = ["userDefined:URL", "URL", "Episode URL", "Link", "url"];
  for (const name of candidates) {
    const v = readUrl(p[name]);
    if (v) return v;
  }
  return "";
}

// Split a text block into an ordered list of steps. Accepts:
//   "1. Do X\n2. Do Y"  or  "- Do X\n- Do Y"  or  plain newline-separated lines.
function parseSteps(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
}

async function fetchEpisodesByIds(ids: string[]): Promise<Map<string, Episode>> {
  const map = new Map<string, Episode>();
  if (ids.length === 0) return map;
  const unique = Array.from(new Set(ids));
  const results = await Promise.all(
    unique.map((id) => notion().pages.retrieve({ page_id: id }).catch(() => null))
  );
  for (const page of results) {
    if (!page || !("properties" in page)) continue;
    const p: any = page.properties;
    map.set(page.id, {
      podcast: readRichText(p["Podcast Name"]) || readSelect(p["Podcast Name"]),
      title: readTitle(p["Episode Title"]),
      url: readEpisodeUrl(p),
      guest: {
        name: readRichText(p["Guest Name"]) || readTitle(p["Guest Name"]),
        // NB: Notion property is literally "Guest TItle" — do not "fix" the typo,
        // it must match the field name in the database exactly.
        title: readRichText(p["Guest TItle"]) || readRichText(p["Guest Title"]),
        company: readRichText(p["Guest Company"]),
      },
      date: readDate(p["Date of Podcast"]),
    });
  }
  return map;
}

// Skills used to carry the guest's name/title/company as flat text on the
// Episode (Guest Name / Guest Title / Guest Company). Those fields were
// renamed to "... (legacy - use Contributor relation)" when the Contributors
// database was introduced, so they now read back empty. The Skill's new
// "Contributor" relation is the current source of truth for who to display;
// this reads it directly rather than depending on lib/contributors.ts, to
// avoid a circular import between the two data modules.
async function fetchContributorsByIds(ids: string[]): Promise<Map<string, Contributor>> {
  const map = new Map<string, Contributor>();
  if (ids.length === 0) return map;
  const unique = Array.from(new Set(ids));
  const results = await Promise.all(
    unique.map((id) => notion().pages.retrieve({ page_id: id }).catch(() => null))
  );
  for (const page of results) {
    if (!page || !("properties" in page)) continue;
    const p: any = page.properties;
    map.set(page.id, {
      name: readTitle(p["Contributor Name"]),
      title: readRichText(p["Current Title"]),
      company: readRichText(p["Current Company"]),
      slug: readRichText(p["Contributor Slug"]) || undefined,
    });
  }
  return map;
}

async function queryAllPublishedSkillPages(): Promise<any[]> {
  if (!SKILLS_DS) return [];
  const pages: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    // The Notion SDK's `databases.query` still targets the containing database;
    // for the new data-source-scoped API we pass data_source_id when present,
    // but fall back to database_id since older SDKs alias them. The Skills and
    // Episodes IDs given by the user are data-source IDs, which the current
    // SDK accepts as database IDs on legacy sources.
    const res: any = await notion().databases.query({
      database_id: SKILLS_DS,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      // Sort intentionally omitted — the property name "Date Published" from
      // the schema doc did not match Notion's actual property. If a specific
      // order matters later, confirm the exact property name and re-add.
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

function mapSkillPage(
  page: any,
  episodeMap: Map<string, Episode>,
  contributorMap: Map<string, Contributor>
): Skill | null {
  const p: any = page.properties;
  const slug = readRichText(p["Skill Slug"]);
  const name = readTitle(p["Skill Name"]);
  if (!slug || !name) return null;

  const episodeIds = readRelationIds(p["Source Episode"]);
  const rawEpisode = episodeIds.length > 0 ? episodeMap.get(episodeIds[0]) ?? null : null;

  // Prefer the Skill's own Contributor relation over the Episode's legacy flat
  // guest fields (see fetchContributorsByIds above).
  const contributorIds = readRelationIds(p["Contributor"]);
  const contributor =
    contributorIds.length > 0 ? contributorMap.get(contributorIds[0]) ?? null : null;
  const episode =
    rawEpisode && contributor ? { ...rawEpisode, guest: contributor } : rawEpisode;

  return {
    notionPageId: page.id,
    slug,
    name,
    vertical: readSelect(p["HR Vertical"]),
    description: readRichText(p["One-line Description"]),
    whatItDoes: readRichText(p["What This Skill Does"]),
    processSteps: parseSteps(readRichText(p["Process Steps (display)"])),
    definitionOfDone: readRichText(p["Definition of Done"]),
    commonPitfalls: readRichText(p["Common Pitfalls (display)"]),
    fullDescription: readRichText(p["Full Description"]),
    skillFileUrl: resolveDownloadUrl(slug, "skill", readUrl(p["Skill File URL"])),
    promptFileUrl: resolveDownloadUrl(slug, "md", readUrl(p["Prompt File URL"])),
    compatibleTools: readMultiSelect(p["Compatible Tools"]),
    tags: readMultiSelect(p["Tags"]),
    datePublished: readDate(p["Date Published"]),
    episode,
  };
}

let _cache: Promise<Skill[]> | null = null;

function filterAndWarn(all: Skill[]): Skill[] {
  const kept: Skill[] = [];
  const sourceless: string[] = [];
  for (const s of all) {
    if (!s.episode) {
      sourceless.push(`${s.slug} (${s.name})`);
      continue;
    }
    kept.push(s);
  }
  if (sourceless.length > 0) {
    // Next spawns parallel static-generation workers, so this warning may
    // appear once per worker in build logs — that is fine; the point is it
    // shows up in the build.
    // eslint-disable-next-line no-console
    console.warn(
      `[skills] Excluded ${sourceless.length} Published skill(s) with no Source Episode:\n  - ${sourceless.join("\n  - ")}\nLink an Episode in Notion or move the skill back to Draft.`
    );
  }
  return kept;
}

async function loadSkills(): Promise<Skill[]> {
  if (USE_MOCK) return filterAndWarn(MOCK_SKILLS);
  if (!NOTION_TOKEN || !SKILLS_DS) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[skills] NOTION_TOKEN or NOTION_SKILLS_DATA_SOURCE_ID missing — returning []. Set USE_MOCK_SKILLS=1 for local dev with mock data."
      );
    }
    return [];
  }

  const pages = await queryAllPublishedSkillPages();
  const episodeIds = pages.flatMap((p) => readRelationIds(p.properties["Source Episode"]));
  const episodeMap = EPISODES_DS ? await fetchEpisodesByIds(episodeIds) : new Map();
  const contributorIds = pages.flatMap((p) => readRelationIds(p.properties["Contributor"]));
  const contributorMap = await fetchContributorsByIds(contributorIds);

  // Attribution to a named source is the site's core credibility premise —
  // a Published skill with no Source Episode does not render (see
  // filterAndWarn). The byline-hiding fallback in components is defensive
  // only, not intended behavior. Source is podcast-only today; a broader
  // source model (newsletters, talks, user submissions) is deferred to the
  // Supabase migration and should not be added here.
  const mapped: Skill[] = [];
  const seenSlugs = new Set<string>();
  for (const page of pages) {
    const skill = mapSkillPage(page, episodeMap, contributorMap);
    if (!skill) continue;
    if (seenSlugs.has(skill.slug)) continue;
    seenSlugs.add(skill.slug);
    mapped.push(skill);
  }
  return filterAndWarn(mapped);
}

export async function getPublishedSkills(): Promise<Skill[]> {
  if (!_cache) _cache = loadSkills();
  return _cache;
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const all = await getPublishedSkills();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getSkillsByNotionIds(ids: string[]): Promise<Skill[]> {
  if (ids.length === 0) return [];
  const wanted = new Set(ids);
  const all = await getPublishedSkills();
  return all.filter((s) => s.notionPageId && wanted.has(s.notionPageId));
}

export async function getVerticals(): Promise<string[]> {
  const all = await getPublishedSkills();
  const set = new Set<string>();
  for (const s of all) if (s.vertical) set.add(s.vertical);
  return Array.from(set).sort();
}
