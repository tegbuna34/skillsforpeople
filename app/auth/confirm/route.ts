import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer, isAuthConfigured } from "@/lib/supabase/server";
import { SIGNUP_COMPLETED_COOKIE, WELCOME_COOKIE, ensureAppUser } from "@/lib/account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  return raw;
}

function withParam(path: string, key: string, value: string): string {
  const url = new URL(path, "http://localhost");
  url.searchParams.set(key, value);
  return `${url.pathname}${url.search}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const expired = NextResponse.redirect(new URL(withParam(next, "login", "expired"), origin));

  if (!isAuthConfigured()) return expired;

  const success = NextResponse.redirect(new URL(next, origin));
  const supabase = createSupabaseServer(success);

  let user = null;
  if (code) {
    const exchanged = await supabase.auth.exchangeCodeForSession(code);
    if (exchanged.error || !exchanged.data.user) return expired;
    user = exchanged.data.user;
  } else if (tokenHash && type) {
    const verified = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (verified.error || !verified.data.user) return expired;
    user = verified.data.user;
  } else {
    return expired;
  }

  const linked = await ensureAppUser(user, next);
  const cookieBase = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  success.cookies.set(SIGNUP_COMPLETED_COOKIE, linked.firstSignIn ? "1" : "0", {
    ...cookieBase,
    maxAge: 60 * 10,
  });
  if (linked.showWelcome) {
    success.cookies.set(WELCOME_COOKIE, "1", {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 14,
    });
  }
  return success;
}
