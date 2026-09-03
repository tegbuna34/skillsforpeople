/**
 * Data-access module for Skills for People.
 *
 * This is the ONLY module in the codebase that talks to the skills store.
 * Every page and component consumes the `Skill` / `Episode` types defined
 * here — never the raw storage shape. The store is Supabase (Postgres);
 * `USE_MOCK_SKILLS=1` keeps the local mock path for offline dev.
 *
 * Fetch timing: build time only. Pages call these functions from RSC bodies
 * or generateStaticParams; there are no per-request queries.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { supabase, hasSupabaseConfig } from "./supabase";
import { MOCK_SKILLS } from "./skills.mock";

export interface Contributor {
  name: string;
  title: string;
  company: string;
  slug?: string;
  linkedinUrl?: string | null;
}

export interface Episode {
  podcast: string;
  title: string;
  url: string;
  guest: Contributor;
  date: string | null;
}

export interface Skill {
  /** Stable per-row id (Supabase uuid). Kept as `notionPageId` for wire
   * compatibility with existing callers that look this up by name. */
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

// Prefer the on-disk file at /public/skills/<slug>/<slug>.<ext> over the DB's
// URL field: the file's existence on disk is the ground truth for whether the
// download button should be enabled. The DB field is still honored when it
// points at an external URL.
function resolveDownloadUrl(
  slug: string,
  ext: "skill" | "md",
  dbUrl: string | null
): string | null {
  const conventionalRel = `/skills/${slug}/${slug}.${ext}`;
  const diskPath = path.join(process.cwd(), "public", conventionalRel);
  if (existsSync(diskPath)) return conventionalRel;
  if (dbUrl && !dbUrl.startsWith("/skills/")) return dbUrl;
  return null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

type SkillRow = {
  id: string;
  slug: string;
  name: string;
  vertical: string;
  description: string;
  what_it_does: string;
  process_steps: string[];
  definition_of_done: string;
  common_pitfalls: string;
  full_description: string;
  skill_file_url: string | null;
  prompt_file_url: string | null;
  compatible_tools: string[];
  tags: string[];
  date_published: string | null;
  contributor_id: string | null;
  episode_id: string | null;
  contributor: {
    slug: string;
    name: string;
    title: string;
    company: string;
    linkedin_url: string | null;
  } | null;
  episode: {
    id: string;
    podcast: string;
    title: string;
    url: string;
    date: string | null;
    guest: {
      slug: string;
      name: string;
      title: string;
      company: string;
      linkedin_url: string | null;
    } | null;
  } | null;
};

function mapRow(row: SkillRow): Skill | null {
  if (!row.slug || !row.name) return null;

  // Prefer Skill's own contributor relation over episode.guest — matches the
  // prior Notion behavior where Skill.Contributor is the source of truth and
  // the episode's guest fields were the legacy fallback.
  const contributor: Contributor | null = row.contributor
    ? {
        name: row.contributor.name ?? "",
        title: row.contributor.title ?? "",
        company: row.contributor.company ?? "",
        slug: row.contributor.slug || undefined,
        linkedinUrl: row.contributor.linkedin_url ?? null,
      }
    : row.episode?.guest
    ? {
        name: row.episode.guest.name ?? "",
        title: row.episode.guest.title ?? "",
        company: row.episode.guest.company ?? "",
        slug: row.episode.guest.slug || undefined,
        linkedinUrl: row.episode.guest.linkedin_url ?? null,
      }
    : null;

  const episode: Episode | null = row.episode
    ? {
        podcast: row.episode.podcast ?? "",
        title: row.episode.title ?? "",
        url: row.episode.url ?? "",
        guest: contributor ?? {
          name: "",
          title: "",
          company: "",
        },
        date: row.episode.date,
      }
    : null;

  return {
    notionPageId: row.id,
    slug: row.slug,
    name: row.name,
    vertical: row.vertical ?? "",
    description: row.description ?? "",
    whatItDoes: row.what_it_does ?? "",
    processSteps: row.process_steps ?? [],
    definitionOfDone: row.definition_of_done ?? "",
    commonPitfalls: row.common_pitfalls ?? "",
    fullDescription: row.full_description ?? "",
    skillFileUrl: resolveDownloadUrl(row.slug, "skill", row.skill_file_url),
    promptFileUrl: resolveDownloadUrl(row.slug, "md", row.prompt_file_url),
    compatibleTools: row.compatible_tools ?? [],
    tags: row.tags ?? [],
    datePublished: row.date_published,
    episode,
  };
}

const SKILL_SELECT = `
  id,
  slug,
  name,
  vertical,
  description,
  what_it_does,
  process_steps,
  definition_of_done,
  common_pitfalls,
  full_description,
  skill_file_url,
  prompt_file_url,
  compatible_tools,
  tags,
  date_published,
  contributor_id,
  episode_id,
  contributor:contributors!skills_contributor_id_fkey (
    slug, name, title, company, linkedin_url
  ),
  episode:episodes!skills_episode_id_fkey (
    id, podcast, title, url, date,
    guest:contributors!episodes_guest_contributor_id_fkey (
      slug, name, title, company, linkedin_url
    )
  )
`;

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
    // eslint-disable-next-line no-console
    console.warn(
      `[skills] Excluded ${sourceless.length} Published skill(s) with no Source Episode:\n  - ${sourceless.join("\n  - ")}\nLink an Episode in the DB or move the skill back to Draft.`
    );
  }
  return kept;
}

async function loadSkills(): Promise<Skill[]> {
  if (USE_MOCK) return filterAndWarn(MOCK_SKILLS);
  if (!hasSupabaseConfig()) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[skills] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — returning []. Set USE_MOCK_SKILLS=1 for local dev with mock data."
      );
    }
    return [];
  }

  const { data, error } = await supabase()
    .from("skills")
    .select(SKILL_SELECT)
    .eq("status", "published")
    .order("date_published", { ascending: false, nullsFirst: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[skills] Supabase query failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as SkillRow[];
  const mapped: Skill[] = [];
  const seenSlugs = new Set<string>();
  for (const row of rows) {
    const skill = mapRow(row);
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

/**
 * The set of skill slugs whose detail pages + library cards are ungated for
 * logged-out visitors. Currently: the six most recently published.
 * Kept in sync with the library gate: `DirectoryClient` shows the same first
 * six matched results ungated. This helper is the canonical source for the
 * skill-detail body gate, since ordering there needs to be independent of the
 * user's current library filter.
 */
export const FREE_SKILL_COUNT = 6;

export async function getFreeSkillSlugs(): Promise<Set<string>> {
  const all = await getPublishedSkills();
  const sorted = [...all].sort((a, b) => {
    const at = a.datePublished ? new Date(a.datePublished).getTime() : 0;
    const bt = b.datePublished ? new Date(b.datePublished).getTime() : 0;
    return bt - at;
  });
  return new Set(sorted.slice(0, FREE_SKILL_COUNT).map((s) => s.slug));
}

export async function getVerticals(): Promise<string[]> {
  const all = await getPublishedSkills();
  const set = new Set<string>();
  for (const s of all) if (s.vertical) set.add(s.vertical);
  return Array.from(set).sort();
}
