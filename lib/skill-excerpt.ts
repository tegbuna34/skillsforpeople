import { readSkillText } from "./skill-files";

export interface SkillExcerpt {
  name: string;
  filename: string;
  what: string;
  steps: string[];
}

const FALLBACK_WHAT =
  "A ready-to-use workflow an HR leader shared, written so you can run it in Claude or ChatGPT.";

function sectionAfter(markdown: string, heading: string): string {
  const pattern = new RegExp(`^##\\s+${heading}\\s*$`, "im");
  const match = pattern.exec(markdown);
  if (!match) return "";
  const rest = markdown.slice(match.index + match[0].length);
  const next = rest.search(/^##\s+/m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function clip(text: string, max = 220): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return (stop > 80 ? cut.slice(0, stop + 1) : cut).trim();
}

function clean(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .replace(/\s+[—–]\s+/g, ", ")
    .trim();
}

function instructionLine(markdown: string): string {
  const match = markdown.match(/\*\*Instructions for the AI:\*\*\s*([^]*?)(?:\n\n|\*\*Do not)/i);
  return match ? clean(match[1]) : "";
}

function firstParagraph(text: string): string {
  const para = text
    .split(/\n\s*\n/)
    .map((part) => clean(part))
    .find((part) => part.length > 40 && !part.startsWith("#"));
  return para ?? "";
}

function stepTitles(markdown: string): string[] {
  const titles: string[] = [];
  const pattern = /\*\*Step\s+\d+\s*[—–:-]\s*([^*]+)\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(markdown))) {
    const title = clean(match[1]).replace(/\.$/, "");
    if (title) titles.push(title);
    if (titles.length === 4) break;
  }
  if (titles.length > 0) return titles;

  const numbered = /^\d+\.\s+\*\*([^*]+)\*\*/gm;
  while ((match = numbered.exec(markdown))) {
    const title = clean(match[1]).replace(/\.$/, "");
    if (title) titles.push(title);
    if (titles.length === 4) break;
  }
  return titles;
}

export async function excerptForSkill(skill: {
  slug: string;
  name: string;
  description: string;
  whatItDoes?: string;
  processSteps?: string[];
}): Promise<SkillExcerpt> {
  const markdown = await readSkillText(skill.slug, "md");
  const fromFile = markdown ? firstParagraph(sectionAfter(markdown, "What I want you to help me build")) : "";
  const instructions = markdown ? instructionLine(markdown) : "";
  const what = clip(fromFile || instructions || skill.whatItDoes || skill.description || FALLBACK_WHAT);
  const fromSteps = markdown ? stepTitles(markdown) : [];
  const steps =
    fromSteps.length > 0
      ? fromSteps
      : (skill.processSteps ?? [])
          .slice(0, 4)
          .map((step) =>
            clean(step).replace(/^Step\s+\d+\s*[—–:-]\s*/i, "").replace(/\.$/, "")
          )
          .filter(Boolean);

  const name = skill.name.replace(/\s+[—–-]\s+Prompt Version$/i, "");
  return {
    name,
    filename: `${skill.slug}.md`,
    what,
    steps,
  };
}
