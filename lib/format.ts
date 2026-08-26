import type { Contributor } from "./skills";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Skills on this site are built by the Skills for People team from a guest's
// public podcast remarks — the guest did not write, review, or approve the
// skill. This framing must read as "inspired by," never as a byline
// ("by [Name]"), anywhere a guest is named. See attribution wording brief,
// 2026-08-25, and the Skill Detail design update, 2026-08-25.
export function inspiredByName(guest: Contributor): string {
  return `Inspired by ${guest.name}`;
}

function roleAtCompany(guest: Contributor): string {
  return guest.title && guest.company
    ? `${guest.title} at ${guest.company}`
    : guest.title || guest.company || "";
}

export function inspiredByLine(guest: Contributor): string {
  const role = roleAtCompany(guest);
  return role ? `Inspired by ${guest.name}, ${role}` : `Inspired by ${guest.name}`;
}

export function inspiredBySourceText(guest: Contributor, podcast?: string): string {
  const base = inspiredByLine(guest);
  return podcast ? `${base} — heard on ${podcast}` : base;
}

const DAY_MS = 86400000;

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / DAY_MS);
}

export function isRecentlyAdded(dateStr: string | null): boolean {
  return dateStr !== null && daysSince(dateStr) < 7;
}

// "today" / "yesterday" / "{n}d ago" for the first week, then a plain date.
export function addedLabel(dateStr: string): string {
  const n = daysSince(dateStr);
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  if (n < 7) return `${n}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function skillPromptMarkdown(skill: {
  name: string;
  description: string;
  whatItDoes: string;
  processSteps: string[];
  definitionOfDone: string;
  commonPitfalls: string;
  fullDescription: string;
  episode: { guest: Contributor; podcast: string } | null;
}): string {
  const lines: string[] = [];
  lines.push(`# ${skill.name}`, "");
  if (skill.description) lines.push(`**What it does:** ${skill.description}`, "");
  if (skill.episode) {
    lines.push(`**${inspiredBySourceText(skill.episode.guest, skill.episode.podcast)}**`, "");
  }
  if (skill.whatItDoes && skill.whatItDoes !== skill.description) {
    lines.push("## What this skill does", skill.whatItDoes, "");
  }
  if (skill.processSteps.length > 0) {
    lines.push("## Process");
    skill.processSteps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
    lines.push("");
  }
  if (skill.definitionOfDone) {
    lines.push("## Definition of done", skill.definitionOfDone, "");
  }
  if (skill.commonPitfalls) {
    lines.push("## Common pitfalls", skill.commonPitfalls, "");
  }
  if (skill.fullDescription && skill.fullDescription !== skill.whatItDoes) {
    lines.push("## Full description", skill.fullDescription, "");
  }
  return lines.join("\n");
}
