import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/account";
import { isSkillSlug, readSkillBytes, readSkillText } from "@/lib/skill-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Format = "skill" | "md" | "copy";

function loginRequired() {
  return NextResponse.json({ error: "login_required" }, { status: 401 });
}

async function serve(slug: string, format: Format) {
  const user = await getCurrentUser();
  if (!user) return loginRequired();
  if (!isSkillSlug(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (format === "copy") {
    const text = await readSkillText(slug, "md");
    if (text == null) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ text });
  }

  const ext = format === "md" ? "md" : "skill";
  const bytes = await readSkillBytes(slug, ext);
  if (!bytes) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": ext === "md" ? "text/markdown; charset=utf-8" : "application/octet-stream",
      "Content-Disposition": `attachment; filename="${slug}.${ext}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function parseFormat(value: unknown): Format {
  if (value === "md" || value === "copy" || value === "skill") return value;
  return "skill";
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const format = parseFormat(new URL(request.url).searchParams.get("format"));
  return serve(params.slug, format);
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  let format: Format = "skill";
  try {
    const body = (await request.json()) as { format?: unknown };
    format = parseFormat(body.format);
  } catch {
    format = "skill";
  }
  return serve(params.slug, format);
}
