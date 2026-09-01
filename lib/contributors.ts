/**
 * Data-access module for Contributors.
 *
 * Parallel to lib/skills.ts. This is the ONLY module in the codebase that
 * talks to the contributors store. Everything else consumes the
 * `ContributorProfile` type here.
 *
 * Fetch timing: build time only.
 */

import { supabase, hasSupabaseConfig } from "./supabase";
import { getPublishedSkills, type Skill } from "./skills";

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

type ContributorRow = {
  id: string;
  slug: string;
  name: string;
  title: string;
  company: string;
  photo_url: string | null;
  linkedin_url: string | null;
  bio: string;
};

let _cache: Promise<ContributorProfile[]> | null = null;

async function loadContributors(): Promise<ContributorProfile[]> {
  if (!hasSupabaseConfig()) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[contributors] SUPABASE_URL/SERVICE_ROLE_KEY missing — returning []."
      );
    }
    return [];
  }

  // Warm the skills cache once so per-contributor cross-referencing is a
  // pure in-memory filter, not one query per contributor.
  const allSkills = await getPublishedSkills();

  const { data, error } = await supabase()
    .from("contributors")
    .select("id, slug, name, title, company, photo_url, linkedin_url, bio");

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[contributors] Supabase query failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as ContributorRow[];
  const mapped: ContributorProfile[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.slug || !row.name) continue;
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    const skillsForContributor = allSkills.filter(
      (s) => s.episode?.guest?.slug === row.slug
    );
    mapped.push({
      slug: row.slug,
      name: row.name,
      title: row.title ?? "",
      company: row.company ?? "",
      photoUrl: row.photo_url,
      linkedinUrl: row.linkedin_url,
      bio: row.bio ?? "",
      skills: skillsForContributor,
    });
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
