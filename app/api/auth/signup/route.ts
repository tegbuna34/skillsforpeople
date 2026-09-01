import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { fullName?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();

  if (!fullName) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const sb = supabase();

  // A signup with an already-known email is treated as a login (same effect:
  // name + unlock). We keep the original full_name on repeat signups.
  const { data: existing } = await sb
    .from("users")
    .select("id, full_name")
    .eq("email", email)
    .maybeSingle();

  let userId: string;
  if (existing) {
    userId = existing.id;
    await sb
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", userId);
  } else {
    const { data, error } = await sb
      .from("users")
      .insert({ email, full_name: fullName, signup_source: "site" })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }
    userId = data.id;
  }

  await createSession(userId);

  return NextResponse.json({
    ok: true,
    user: { email, firstName: fullName.split(/\s+/)[0] || "" },
  });
}
