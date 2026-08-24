/**
 * Data-access module for Contributors.
 *
 * Parallel to lib/skills.ts. This is the ONLY module in the codebase that
 * talks to the Contributors data source in Notion. Everything else consumes
 * the `ContributorProfile` type here.
 *
 * Behavior mirrors lib/skills.ts:
 * - NOTION_TOKEN or NOTION_CONTRIBUTORS_DATA_SOURCE_ID missing → returns null / []
 *   so the site does not crash the build.
 * - Otherwise queries the Contributors data source and cross-references
 *   published skills via lib/skills.ts (skills.ts stays the single source of
 *   truth for what a Skill is).
 *
 * Fetch timing: build time only. Pages call these functions from RSC bodies
 * or generateStaticParams.
 */

import { Client } from "@notionhq/client";
import { getPublishedSkills, getSkillsByNotionIds, type Skill } from "./skills";

export interface ContributorProfile {
  slug: string;
  name: string;
  title: string;
  company: string;
  photoUrl: string | null;
  linkedinUrl: string | null;
  bio: string;
  skills: Skill[];
}

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const CONTRIBUTORS_DS = process.env.NOTION_CONTRIBUTORS_DATA_SOURCE_ID;

let cachedClient: Client | null = null;
function notion(): Client {
  if (!cachedClient) cachedClient = new Client({ auth: NOTION_TOKEN });
  return cachedClient;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function readTitle(prop: any): string {
  const arr = prop?.title ?? [];
  return arr.map((t: any) => t.plain_text ?? "").join("").trim();
}

function readRichText(prop: any): string {
  const arr = prop?.rich_text ?? [];
  return arr.map((t: any) => t.plain_text ?? "").join("").trim();
}

function readUrl(prop: any): string | null {
  const v = prop?.url;
  return typeof v === "string" && v.length > 0 ? v : null;
}

function readFirstFileUrl(prop: any): string | null {
  const files = prop?.files ?? [];
  for (const f of files) {
    const url = f?.file?.url ?? f?.external?.url;
    if (typeof url === "string" && url.length > 0) return url;
  }
  return null;
}

function readRelationIds(prop: any): string[] {
  return (prop?.relation ?? []).map((r: any) => r.id).filter(Boolean);
}

async function queryAllContributorPages(): Promise<any[]> {
  if (!CONTRIBUTORS_DS) return [];
  const pages: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res: any = await notion().databases.query({
      database_id: CONTRIBUTORS_DS,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function mapContributorPage(page: any): Promise<ContributorProfile | null> {
  const p: any = page.properties;
  const slug = readRichText(p["Contributor Slug"]);
  const name = readTitle(p["Contributor Name"]);
  if (!slug || !name) return null;

  const skillIds = readRelationIds(p["Skills"]);
  const skills = await getSkillsByNotionIds(skillIds);

  return {
    slug,
    name,
    title: readRichText(p["Current Title"]),
    company: readRichText(p["Current Company"]),
    photoUrl: readFirstFileUrl(p["Photo"]),
    linkedinUrl: readUrl(p["LinkedIn URL"]),
    bio: readRichText(p["Short Bio"]),
    skills,
  };
}

let _cache: Promise<ContributorProfile[]> | null = null;

async function loadContributors(): Promise<ContributorProfile[]> {
  if (!NOTION_TOKEN || !CONTRIBUTORS_DS) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[contributors] NOTION_TOKEN or NOTION_CONTRIBUTORS_DATA_SOURCE_ID missing — returning []."
      );
    }
    return [];
  }
  // Warm the skills cache so per-contributor cross-referencing does one Notion
  // roundtrip total, not one per contributor.
  await getPublishedSkills();
  const pages = await queryAllContributorPages();
  const mapped: ContributorProfile[] = [];
  const seen = new Set<string>();
  for (const page of pages) {
    const c = await mapContributorPage(page);
    if (!c) continue;
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    mapped.push(c);
  }
  return mapped;
}

export async function getAllContributors(): Promise<ContributorProfile[]> {
  if (!_cache) _cache = loadContributors();
  return _cache;
}

export async function getContributorBySlug(
  slug: string
): Promise<ContributorProfile | null> {
  const all = await getAllContributors();
  return all.find((c) => c.slug === slug) ?? null;
}
