/**
 * Local dev-only fallback. Enabled by `USE_MOCK_SKILLS=1`. Never rendered in prod.
 * Shape must match the `Skill` interface exported from ./skills.
 */

import type { Skill } from "./skills";

const RAW: Array<Omit<Skill, "processSteps" | "definitionOfDone" | "commonPitfalls" | "fullDescription" | "compatibleTools" | "tags" | "datePublished" | "whatItDoes"> & {
  processSteps: string[];
}> = [
  {
    slug: "interviewer-scorecard-builder",
    name: "Interviewer Scorecard Builder",
    vertical: "Talent Acquisition & Sourcing",
    description:
      "Ties interview decisions to real hiring outcomes, then right-sizes your interviewer pool for quality.",
    skillFileUrl: null,
    promptFileUrl: null,
    processSteps: [
      "Pull the last 12 months of interview scorecards and hiring decisions per interviewer.",
      "Join each decision to the candidate's actual 90-day ramp and 12-month outcome.",
      "Calculate an assertiveness score per interviewer from decision-to-outcome alignment.",
      "Rank interviewers by assertiveness score, not by interview volume.",
      "Identify your top-quartile interviewers as your core, trusted interview pool.",
    ],
    episode: {
      podcast: "People First",
      title: "Right-sizing your interviewer pool with Vanessa Paladini",
      url: "https://example.com/episode-1",
      guest: {
        name: "Vanessa Paladini",
        title: "Global Talent Acquisition Leader",
        company: "Nubank",
      },
      date: "2026-06-01",
    },
  },
  {
    slug: "mvq-definition-builder",
    name: "MVQ Definition Builder",
    vertical: "DEI",
    description:
      "Defines the Minimum Viable Quarter for volunteer program leaders, step-by-step.",
    skillFileUrl: null,
    promptFileUrl: null,
    processSteps: [
      "List every activity a program leader could plausibly run in a quarter.",
      "Cut the list to what a brand-new volunteer could actually execute.",
      "Sequence the survivors into a runnable quarter, week by week.",
      "Write each step as a sub-instruction, not a vague checkbox.",
    ],
    episode: {
      podcast: "People First",
      title: "MVQ with Marcus Chen",
      url: "https://example.com/episode-2",
      guest: {
        name: "Marcus Chen",
        title: "Head of DEI Programs",
        company: "Brightline Foods",
      },
      date: "2026-05-01",
    },
  },
  {
    slug: "three-ps-diagnostic-audit",
    name: "Three Ps Diagnostic Audit",
    vertical: "DEI",
    description:
      "Diagnoses whether Purpose, Process, or Programming is the real bottleneck in a struggling program.",
    skillFileUrl: null,
    promptFileUrl: null,
    processSteps: [
      "Score the program's Purpose against a written charter.",
      "Score its Process against documented cadence and ownership.",
      "Score its Programming against actual attendance and outcomes.",
      "Fix the lowest-scoring P first, not the loudest one.",
    ],
    episode: null,
  },
];

export const MOCK_SKILLS: Skill[] = RAW.map((s) => ({
  ...s,
  whatItDoes: s.description,
  definitionOfDone:
    "Output you would trust enough to act on or share with your team, tailored to your org's own data and constraints.",
  commonPitfalls:
    "Do not run this on stale or incomplete data — the output is only as good as what you feed it. Review before rolling out broadly.",
  fullDescription: s.description,
  compatibleTools: ["Claude", "ChatGPT"],
  tags: [],
  datePublished: "2026-08-01",
}));
