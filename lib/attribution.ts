/**
 * First-touch attribution, ported from Skills for Small Business.
 * The browser stores the first landing (UTMs, referrer, path) and mirrors it
 * into a cookie the auth confirm route can read. Later visits do not overwrite it.
 */

export const ATTRIBUTION_STORAGE_KEY = "sfp_attribution";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 180;

export interface Attribution {
  source: string;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  landing: string;
  referrer: string | null;
}

const SOURCE_RULES: Array<[RegExp, string]> = [
  [/instagram|^ig$/i, "Instagram"],
  [/tiktok/i, "TikTok"],
  [/linkedin|lnkd\.in/i, "LinkedIn"],
  [/google|bing|duckduckgo|yahoo|ecosia/i, "Google"],
];

export function normalizeSource(value: string | null | undefined): string | null {
  if (!value) return null;
  return SOURCE_RULES.find(([re]) => re.test(value))?.[1] ?? "Other";
}

export function entryPoint(pathname: string, medium: string | null): string {
  if (medium === "bio") return "Link in bio";
  if (pathname === "/") return "Homepage";
  if (pathname.startsWith("/skills/")) return "Skill page";
  if (pathname.startsWith("/people-builders")) return "People Builders";
  return "Other";
}

export function skillSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/skills\/([a-z0-9-]+)\/?$/);
  return match?.[1] ?? null;
}

export function parseAttribution(raw: string | null | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Attribution>;
    if (!value || typeof value.source !== "string" || typeof value.landing !== "string") {
      return null;
    }
    return {
      source: value.source,
      medium: value.medium ?? null,
      campaign: value.campaign ?? null,
      content: value.content ?? null,
      landing: value.landing,
      referrer: value.referrer ?? null,
    };
  } catch {
    return null;
  }
}

/** Read the first-touch record. Browser only. */
export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    return parseAttribution(localStorage.getItem(ATTRIBUTION_STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * Record attribution on the first page view and mirror it to a cookie.
 * Safe to call on every page: it no-ops once a record exists.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    let record = readAttribution();
    if (!record) {
      const params = new URLSearchParams(window.location.search);
      let refHost: string | null = null;
      try {
        const host = document.referrer ? new URL(document.referrer).hostname : null;
        refHost = host && host !== window.location.hostname ? host : null;
      } catch {
        refHost = null;
      }
      record = {
        source: normalizeSource(params.get("utm_source")) ?? normalizeSource(refHost) ?? "Direct",
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
        content: params.get("utm_content"),
        landing: window.location.pathname,
        referrer: document.referrer || null,
      };
      localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record));
    }
    document.cookie = `${ATTRIBUTION_STORAGE_KEY}=${encodeURIComponent(
      JSON.stringify(record)
    )}; path=/; max-age=${ATTRIBUTION_MAX_AGE}; samesite=lax`;
  } catch {
    // Storage can be blocked. Signup still works without attribution.
  }
}
