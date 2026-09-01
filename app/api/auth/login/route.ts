import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const { data: lead } = await supabase()
    .from("leads")
    .select("id, full_name, email")
    .eq("email", email)
    .maybeSingle();

  if (!lead) {
    return NextResponse.json(
      { error: "We couldn't find that email — sign up above." },
      { status: 404 }
    );
  }

  await supabase()
    .from("leads")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", lead.id);

  await createSession(lead.id);

  return NextResponse.json({
    ok: true,
    user: {
      email: lead.email,
      firstName: (lead.full_name || "").split(/\s+/)[0] || "",
    },
  });
}
