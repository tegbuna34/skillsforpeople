/**
 * Session cookie + Supabase-backed session store.
 *
 * Model: signup/login mints a random 32-byte token, we store its SHA-256 hash
 * plus the lead_id and expiry in `public.sessions`, and set the raw token in
 * a httpOnly cookie. The token itself is unguessable; hashing at rest means a
 * DB dump doesn't hand attackers usable cookies.
 *
 * No password. Login is "email match → new session"; there's no verification
 * email step by design (per the brief). This is a soft gate, not real auth.
 */

import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { supabase } from "./supabase";

export const COOKIE_NAME = "sfp_session";
export const SESSION_DAYS = 90;

export interface CurrentUser {
  leadId: string;
  email: string;
  fullName: string;
  firstName: string;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function firstNameOf(fullName: string): string {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0];
}

export async function createSession(leadId: string): Promise<string> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase()
    .from("sessions")
    .insert({ lead_id: leadId, token_hash: tokenHash, expires_at: expiresAt });
  if (error) throw new Error(`createSession: ${error.message}`);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const jar = cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  jar.delete(COOKIE_NAME);
  if (!token) return;
  const tokenHash = hashToken(token);
  await supabase().from("sessions").delete().eq("token_hash", tokenHash);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const tokenHash = hashToken(token);

  const { data, error } = await supabase()
    .from("sessions")
    .select("lead_id, expires_at, lead:leads!sessions_lead_id_fkey(id, email, full_name)")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !data || !data.lead) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Best-effort last_seen bump — fire and forget.
  supabase()
    .from("sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .then(() => undefined);

  // Supabase joins can come back as array or object depending on the
  // relationship shape; normalize.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lead: any = Array.isArray(data.lead) ? data.lead[0] : data.lead;
  return {
    leadId: lead.id,
    email: lead.email,
    fullName: lead.full_name,
    firstName: firstNameOf(lead.full_name),
  };
}
