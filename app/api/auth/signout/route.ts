import { NextResponse } from "next/server";
import { createSupabaseServer, isAuthConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  if (!isAuthConfigured()) return response;
  const supabase = createSupabaseServer(response);
  await supabase.auth.signOut();
  return response;
}
