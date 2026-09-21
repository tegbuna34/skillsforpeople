/**
 * Data-access module for the Tools directory.
 *
 * This is the ONLY module in the codebase that talks to the `tools` store.
 * Every page and component consumes the `Tool` type defined here — never the
 * raw storage shape. The store is Supabase (Postgres), same as `lib/skills.ts`.
 *
 * Fetch timing: build time only. Pages call these functions from RSC bodies
 * or generateStaticParams; there are no per-request queries.
 */

import { supabase, hasSupabaseConfig } from "./supabase";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  oneLiner: string;
  audience: string;
  mockupImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  vercelDeployUrl: string | null;
  stack: string;
  license: string;
  whatsIncluded: string;
  whatItDoes: string;
  needList: string[];
  setupSteps: string[];
  makeYourOwn: string[];
  datePublished: string | null;
  comingSoon: boolean;
}

type ToolRow = {
  slug: string;
  name: string;
  category: string;
  one_liner: string;
  audience: string;
  mockup_image: string | null;
  live_url: string | null;
  github_url: string | null;
  vercel_deploy_url: string | null;
  stack: string;
  license: string;
  whats_included: string;
  what_it_does: string;
  need_list: string[];
  setup_steps: string[];
  make_your_own: string[];
  date_published: string | null;
  coming_soon: boolean;
};

function normalizeImagePath(path: string | null): string | null {
  if (!path) return null;
  return path.startsWith("/") ? path : `/${path}`;
}

function mapRow(row: ToolRow): Tool {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category ?? "",
    oneLiner: row.one_liner ?? "",
    audience: row.audience ?? "",
    mockupImage: normalizeImagePath(row.mockup_image),
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    vercelDeployUrl: row.vercel_deploy_url,
    stack: row.stack ?? "",
    license: row.license ?? "",
    whatsIncluded: row.whats_included ?? "",
    whatItDoes: row.what_it_does ?? "",
    needList: row.need_list ?? [],
    setupSteps: row.setup_steps ?? [],
    makeYourOwn: row.make_your_own ?? [],
    datePublished: row.date_published,
    comingSoon: row.coming_soon ?? false,
  };
}

const TOOL_SELECT = `
  slug,
  name,
  category,
  one_liner,
  audience,
  mockup_image,
  live_url,
  github_url,
  vercel_deploy_url,
  stack,
  license,
  whats_included,
  what_it_does,
  need_list,
  setup_steps,
  make_your_own,
  date_published,
  coming_soon
`;

let _cache: Promise<Tool[]> | null = null;

async function loadTools(): Promise<Tool[]> {
  if (!hasSupabaseConfig()) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[tools] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — returning []."
      );
    }
    return [];
  }

  const { data, error } = await supabase()
    .from("tools")
    .select(TOOL_SELECT)
    .eq("status", "published")
    .order("date_published", { ascending: false, nullsFirst: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[tools] Supabase query failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ToolRow[]).map(mapRow);
}

export async function getPublishedTools(): Promise<Tool[]> {
  if (!_cache) _cache = loadTools();
  return _cache;
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const all = await getPublishedTools();
  return all.find((t) => t.slug === slug) ?? null;
}
