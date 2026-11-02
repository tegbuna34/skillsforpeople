export const HR_FUNCTIONS = [
  "Talent Acquisition",
  "People Ops / HR Ops",
  "L&D",
  "People Analytics",
  "Total Rewards",
  "Employee Relations",
  "HRBP / Generalist",
  "Other",
] as const;

export const COMPANY_SIZES = ["1-50", "51-200", "201-1,000", "1,001-5,000", "5,000+"] as const;

export const AI_TOOLS = ["Claude", "ChatGPT", "Both", "Neither yet"] as const;

export const WHO_PAYS = ["My company", "Me", "Not sure yet"] as const;

export const WAITLIST_INTERESTS = ["The next cohort", "A private cohort for my team"] as const;

export type HrFunction = (typeof HR_FUNCTIONS)[number];
export type CompanySize = (typeof COMPANY_SIZES)[number];
export type AiTool = (typeof AI_TOOLS)[number];
export type WhoPays = (typeof WHO_PAYS)[number];
export type WaitlistInterest = (typeof WAITLIST_INTERESTS)[number];

export function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return (options as readonly string[]).includes(value);
}
