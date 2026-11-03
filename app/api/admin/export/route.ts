import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/account";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { isMissingColumn, isMissingTable } from "@/lib/db-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only CSV export.
 * Set ADMIN_EMAILS to a comma-separated allowlist. The request must be a
 * signed-in Supabase Auth session whose email is on that list.
 *
 *   GET /api/admin/export?table=users
 *   GET /api/admin/export?table=waitlist
 */

function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  return lines.join("\n") + "\n";
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });
  const allowed = allowlist();
  if (!allowed.includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "database_unconfigured" }, { status: 503 });
  }

  const table = new URL(request.url).searchParams.get("table");
  if (table !== "users" && table !== "waitlist") {
    return NextResponse.json({ error: "Use table=users or table=waitlist." }, { status: 400 });
  }

  const sb = supabase();
  if (table === "users") {
    const full = await sb.from("users").select("*").order("email", { ascending: true });
    if (full.error && isMissingColumn(full.error)) {
      return NextResponse.json({ error: full.error.message }, { status: 500 });
    }
    if (full.error) {
      return NextResponse.json({ error: full.error.message }, { status: 500 });
    }
    const rows = (full.data ?? []) as Record<string, unknown>[];
    return csvResponse("skills-for-people-users.csv", rows);
  }

  const waitlist = await sb.from("program_waitlist").select("*").order("created_at", { ascending: true });
  if (waitlist.error && (isMissingTable(waitlist.error) || isMissingColumn(waitlist.error))) {
    return NextResponse.json(
      { error: "program_waitlist is not available yet. Apply the migration first." },
      { status: 503 }
    );
  }
  if (waitlist.error) {
    return NextResponse.json({ error: waitlist.error.message }, { status: 500 });
  }
  return csvResponse("skills-for-people-waitlist.csv", (waitlist.data ?? []) as Record<string, unknown>[]);
}

function csvResponse(filename: string, rows: Record<string, unknown>[]) {
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
