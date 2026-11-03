import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SLUG_RE = /^[a-z0-9-]+$/;

export function isSkillSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** Server-only skill files. Next.js does not serve `content/`. */
export function skillFilePath(slug: string, ext: "md" | "skill"): string | null {
  if (!isSkillSlug(slug)) return null;
  return path.join(process.cwd(), "content", "skills", slug, `${slug}.${ext}`);
}

export function skillFileExists(slug: string, ext: "md" | "skill"): boolean {
  const filePath = skillFilePath(slug, ext);
  return Boolean(filePath && existsSync(filePath));
}

export async function readSkillText(slug: string, ext: "md" | "skill"): Promise<string | null> {
  const filePath = skillFilePath(slug, ext);
  if (!filePath) return null;
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function readSkillBytes(slug: string, ext: "md" | "skill"): Promise<Buffer | null> {
  const filePath = skillFilePath(slug, ext);
  if (!filePath) return null;
  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}
