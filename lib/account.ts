/**
 * App user record linked to a Supabase Auth user.
 * Reads of the new columns degrade to the columns that already exist so the
 * preview still renders before the owner applies the migration.
 */

import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { supabase, hasSupabaseConfig } from "./supabase";
import { createSupabaseServer, isAuthConfigured } from "./supabase/server";
import {
  entryPoint,
  parseAttribution,
  skillSlugFromPath,
  ATTRIBUTION_STORAGE_KEY,
  type Attribution,
} from "./attribution";
import { isMissingColumn } from "./db-errors";
import { syncKitSubscriber } from "./kit";
import { SIGNUP_COMPLETED_COOKIE, WELCOME_COOKIE } from "./auth-cookies";

export { SIGNUP_COMPLETED_COOKIE, WELCOME_COOKIE };

export interface CurrentUser {
  authUserId: string;
  userId: string | null;
  email: string;
  fullName: string;
  firstName: string;
}

export interface EnsureResult {
  showWelcome: boolean;
  firstSignIn: boolean;
}

function firstNameOf(fullName: string): string {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0];
}

function previewSignupSource(source: string): string {
  return process.env.VERCEL_ENV === "preview" ? "preview" : source;
}

function attributionFromRequest(user: User): Attribution | null {
  const raw = cookies().get(ATTRIBUTION_STORAGE_KEY)?.value;
  const fromCookie = parseAttribution(raw ? safeDecode(raw) : null);
  if (fromCookie) return fromCookie;
  const meta = user.user_metadata ?? {};
  if (typeof meta.signup_source === "string" || typeof meta.entry_point === "string") {
    return {
      source: typeof meta.signup_source === "string" ? meta.signup_source : "Direct",
      medium: null,
      campaign: null,
      content: typeof meta.source_video === "string" ? meta.source_video : null,
      landing: "/",
      referrer: null,
    };
  }
  return null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    if (!isAuthConfigured()) return null;
    const auth = createSupabaseServer();
    const { data, error } = await auth.auth.getUser();
    if (error || !data.user?.email) return null;

    const email = data.user.email.toLowerCase();
    const profile = await loadProfile(email);
    return {
      authUserId: data.user.id,
      userId: profile?.id ?? null,
      email,
      fullName: profile?.full_name ?? "",
      firstName: firstNameOf(profile?.full_name ?? ""),
    };
  } catch {
    return null;
  }
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  auth_user_id?: string | null;
  welcome_completed_at?: string | null;
  signup_source?: string | null;
  entry_point?: string | null;
  first_skill?: string | null;
}

async function loadProfile(email: string): Promise<ProfileRow | null> {
  if (!hasSupabaseConfig()) return null;
  const sb = supabase();
  const full = await sb
    .from("users")
    .select("id, full_name, auth_user_id, welcome_completed_at, signup_source, entry_point, first_skill")
    .eq("email", email)
    .maybeSingle();
  if (!full.error) return (full.data as ProfileRow | null) ?? null;
  if (!isMissingColumn(full.error)) return null;

  const basic = await sb.from("users").select("id, full_name, signup_source").eq("email", email).maybeSingle();
  if (basic.error) return null;
  return (basic.data as ProfileRow | null) ?? null;
}

/**
 * Match public.users by email on the first magic-link sign-in, attach
 * auth_user_id, and write attribution once. Existing rows keep their name.
 */
export async function ensureAppUser(user: User, nextPath: string): Promise<EnsureResult> {
  const email = (user.email || "").trim().toLowerCase();
  if (!email || !hasSupabaseConfig()) {
    const created = user.created_at ? Date.now() - new Date(user.created_at).getTime() < 10 * 60 * 1000 : false;
    return { showWelcome: created, firstSignIn: created };
  }

  const attribution = attributionFromRequest(user);
  const landing = attribution?.landing || nextPath || "/";
  const point = entryPoint(landing, attribution?.medium ?? null);
  const skill = skillSlugFromPath(nextPath) || skillSlugFromPath(landing);
  const existing = await loadProfile(email);
  const sb = supabase();
  const now = new Date().toISOString();

  if (!existing) {
    const rich = {
      email,
      full_name: "",
      signup_source: previewSignupSource(attribution?.source || "Direct"),
      auth_user_id: user.id,
      entry_point: point,
      first_skill: skill,
      utm_source: attribution?.source ?? null,
      utm_medium: attribution?.medium ?? null,
      utm_campaign: attribution?.campaign ?? null,
      utm_content: attribution?.content ?? null,
      referrer: attribution?.referrer ?? null,
      landing_path: landing,
      last_login_at: now,
    };
    let inserted = await sb.from("users").insert(rich).select("id").maybeSingle();
    if (inserted.error && isMissingColumn(inserted.error)) {
      inserted = await sb
        .from("users")
        .insert({
          email,
          full_name: "",
          signup_source: previewSignupSource(attribution?.source || "Direct"),
          last_login_at: now,
        })
        .select("id")
        .maybeSingle();
    }
    if (inserted.error) {
      console.error("[account] insert user failed:", inserted.error.message);
    }
    await syncKitSubscriber({
      email,
      tags: ["member"],
      fields: {
        entry_point: point,
        signup_source: previewSignupSource(attribution?.source || "Direct"),
      },
    });
    return { showWelcome: true, firstSignIn: true };
  }

  const columnsMissing = !("welcome_completed_at" in existing);
  const alreadyLinked = Boolean(existing.auth_user_id);
  const welcomeDone = Boolean(existing.welcome_completed_at);
  const patch: Record<string, string | null> = { last_login_at: now };
  if (!alreadyLinked) patch.auth_user_id = user.id;
  // Attribution is first-touch: only fill it when this email has never been linked.
  if (!alreadyLinked) {
    if (!existing.signup_source) patch.signup_source = previewSignupSource(attribution?.source || "Direct");
    patch.entry_point = existing.entry_point || point;
    if (!existing.first_skill && skill) patch.first_skill = skill;
    if (attribution) {
      patch.utm_source = attribution.source;
      patch.utm_medium = attribution.medium;
      patch.utm_campaign = attribution.campaign;
      patch.utm_content = attribution.content;
      patch.referrer = attribution.referrer;
      patch.landing_path = landing;
    }
  }

  let updated = await sb.from("users").update(patch).eq("id", existing.id);
  if (updated.error && isMissingColumn(updated.error)) {
    updated = await sb.from("users").update({ last_login_at: now }).eq("id", existing.id);
  }
  if (updated.error) {
    console.error("[account] update user failed:", updated.error.message);
  }

  await syncKitSubscriber({
    email,
    firstName: firstNameOf(existing.full_name || ""),
    tags: ["member"],
    fields: { entry_point: point },
  });

  // Show the welcome modal until the answers are saved or skipped.
  // Before the migration, only a just-created auth user sees it, once.
  const freshAuth =
    Boolean(user.created_at) && Date.now() - new Date(user.created_at as string).getTime() < 10 * 60 * 1000;
  const showWelcome = columnsMissing ? freshAuth : !welcomeDone;
  return { showWelcome, firstSignIn: !alreadyLinked };
}

export async function saveWelcomeAnswers(input: {
  email: string;
  hrFunction: string | null;
  companySize: string | null;
  wantsToBuild: string | null;
  programInterest: boolean;
  skip: boolean;
}): Promise<{ ok: boolean; degraded?: boolean }> {
  if (!hasSupabaseConfig()) return { ok: false, degraded: true };
  const sb = supabase();
  const patch: Record<string, string | boolean | null> = {
    welcome_completed_at: new Date().toISOString(),
  };
  if (!input.skip) {
    patch.hr_function = input.hrFunction;
    patch.company_size = input.companySize;
    patch.wants_to_build = input.wantsToBuild;
    patch.program_interest = input.programInterest;
  }
  const { error } = await sb.from("users").update(patch).eq("email", input.email);
  if (error && isMissingColumn(error)) return { ok: false, degraded: true };
  if (error) {
    console.error("[account] welcome save failed:", error.message);
    return { ok: false };
  }
  if (!input.skip) {
    await syncKitSubscriber({
      email: input.email,
      tags: ["member"],
      fields: {
        hr_function: input.hrFunction || "",
        company_size: input.companySize || "",
        wants_to_build: input.wantsToBuild || "",
        program_interest: input.programInterest ? "true" : "false",
      },
    });
  }
  return { ok: true };
}

export async function isOnProgramWaitlist(email: string): Promise<boolean> {
  if (!hasSupabaseConfig()) return false;
  try {
    const { data, error } = await supabase()
      .from("program_waitlist")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}
