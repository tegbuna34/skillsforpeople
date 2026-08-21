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

export function contributorRoleLine(c: Contributor): string {
  const parts = [c.title, c.company].filter(Boolean);
  return parts.join(", ");
}

export function skillPromptMarkdown(skill: {
  name: string;
  description: string;
  whatItDoes: string;
  processSteps: string[];
  definitionOfDone: string;
  commonPitfalls: string;
  fullDescription: string;
  episode: { guest: Contributor } | null;
}): string {
  const lines: string[] = [];
  lines.push(`# ${skill.name}`, "");
  if (skill.description) lines.push(`**What it does:** ${skill.description}`, "");
  if (skill.episode) {
    const g = skill.episode.guest;
    lines.push(`**Source:** ${g.name}, ${contributorRoleLine(g)}`, "");
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
