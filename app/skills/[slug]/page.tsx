import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getPublishedSkills, getSkillBySlug } from "@/lib/skills";
import { contributorRoleLine, initials, skillPromptMarkdown } from "@/lib/format";
import DetailActions from "./DetailActions";

// If the Notion Prompt File URL points into /public/skills/, read the real
// .md file at build time and hand its contents to the Copy-prompt button.
// The .md is authored to be a self-contained pasteable prompt with its own
// framing, so falling back to a synthesized version silently would drop
// that framing. Only used as fallback when the real file isn't there.
async function readPublicPromptFile(promptFileUrl: string | null): Promise<string | null> {
  if (!promptFileUrl || !promptFileUrl.startsWith("/skills/")) return null;
  const filePath = path.join(process.cwd(), "public", promptFileUrl);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const skills = await getPublishedSkills();
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug);
  if (!skill) return { title: "Skill not found" };
  return {
    title: skill.name,
    description: skill.description || skill.whatItDoes,
  };
}

const INCLUDED_ITEMS = [
  {
    title: "Customization intake",
    desc: "A short set of questions about your process and data access.",
  },
  {
    title: "Step-by-step implementation process",
    desc: "The exact steps to build this from your own data.",
  },
  {
    title: "Definition of done",
    desc: "How to know the output is producing a usable, defensible signal.",
  },
  {
    title: "Common pitfalls",
    desc: "Where teams usually get this wrong, and how to avoid it.",
  },
];

export default async function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = await getSkillBySlug(params.slug);
  if (!skill) notFound();

  const realPromptFileContent = await readPublicPromptFile(skill.promptFileUrl);
  const promptText = realPromptFileContent ?? skillPromptMarkdown(skill);
  const promptTextIsGenerated = realPromptFileContent === null;
  const guest = skill.episode?.guest;
  const linkedinUrl = guest
    ? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
        `${guest.name} ${guest.company}`
      )}`
    : null;

  return (
    <>
      {/* BREADCRUMB */}
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-2 px-5 pt-5 text-[13.5px] text-navy/55 sm:px-8 lg:px-16">
        <Link href="/skills" className="text-navy/55 no-underline hover:underline">
          Browse skills
        </Link>
        <span>/</span>
        {skill.vertical ? (
          <>
            <Link
              href={`/skills?vertical=${encodeURIComponent(skill.vertical)}`}
              className="text-navy/55 no-underline hover:underline"
            >
              {skill.vertical}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="font-semibold text-navy">{skill.name}</span>
      </div>

      {/* HEADER */}
      <section className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-12 px-5 pb-10 pt-6 sm:px-8 lg:px-16">
        <div className="min-w-[280px] flex-[2] basis-[520px]">
          {skill.vertical && (
            <span className="rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
              {skill.vertical}
            </span>
          )}
          <h1 className="mb-3.5 mt-4 text-[clamp(30px,4vw,42px)] font-bold tracking-tight">
            {skill.name}
          </h1>
          {skill.description && (
            <p className="mb-5 max-w-[620px] text-lg text-navy/75">{skill.description}</p>
          )}
          {guest && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-mint">
                {initials(guest.name)}
              </div>
              <div>
                <div className="text-[14.5px] font-semibold">{guest.name}</div>
                <div className="text-[13px] text-navy/55">{contributorRoleLine(guest)}</div>
              </div>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-md border border-navy/15 bg-white"
                >
                  <svg width="14" height="14" viewBox="0 0 76.624 65.326" aria-hidden="true">
                    <path
                      d="M958.98,112.559h-9.6V97.525c0-3.585-.064-8.2-4.993-8.2-5,0-5.765,3.906-5.765,7.939v15.294h-9.6V81.642h9.216v4.225h.129a10.1,10.1,0,0,1,9.093-4.994c9.73,0,11.524,6.4,11.524,14.726ZM918.19,77.416a5.571,5.571,0,1,1,5.57-5.572,5.571,5.571,0,0,1-5.57,5.572m4.8,35.143h-9.61V81.642h9.61Zm40.776-55.2h-55.21a4.728,4.728,0,0,0-4.781,4.67v55.439a4.731,4.731,0,0,0,4.781,4.675h55.21a4.741,4.741,0,0,0,4.8-4.675V62.025a4.738,4.738,0,0,0-4.8-4.67"
                      transform="translate(-903.776 -57.355)"
                      fill="#0A66C2"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        <DetailActions
          slug={skill.slug}
          vertical={skill.vertical}
          skillFileUrl={skill.skillFileUrl}
          promptFileUrl={skill.promptFileUrl}
          promptText={promptText}
          promptTextIsGenerated={promptTextIsGenerated}
          compatibleTools={skill.compatibleTools}
        />
      </section>

      {/* BODY */}
      <section className="mx-auto flex max-w-[1180px] flex-wrap gap-12 px-5 pb-16 sm:px-8 lg:px-16">
        <div className="min-w-[280px] flex-[2] basis-[520px]">
          {(skill.whatItDoes || skill.description) && (
            <>
              <h2 className="mb-3.5 text-[22px] font-bold">What this skill does</h2>
              <p className="mb-9 whitespace-pre-line text-[15.5px] text-navy/80">
                {skill.whatItDoes || skill.description}
              </p>
            </>
          )}

          <h2 className="mb-4 text-[22px] font-bold">What&apos;s included</h2>
          <div className="mb-9 flex flex-col gap-3">
            {INCLUDED_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-[10px] border border-navy/10 bg-white p-4"
              >
                <div className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-blue/15 text-[12px] font-bold text-blue">
                  ✓
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold">{item.title}</div>
                  <div className="text-[13.5px] text-navy/60">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {skill.processSteps.length > 0 && (
            <>
              <h2 className="mb-4 text-[22px] font-bold">The process</h2>
              <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-6">
                {skill.processSteps.map((step, i) => (
                  <div key={i}>
                    <strong>Step {i + 1} —</strong> {step}
                  </div>
                ))}
                {(skill.definitionOfDone || skill.commonPitfalls) && (
                  <div className="border-t border-navy/10 pt-3 text-[13.5px] text-navy/55">
                    The download also includes the full definition of done and common pitfalls.
                  </div>
                )}
              </div>
            </>
          )}

          {skill.episode && (
            <>
              <h2 className="mb-3 mt-8 text-[22px] font-bold">Source</h2>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white p-5">
                <div>
                  <span className="rounded-xl bg-blue/10 px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-wide text-blue">
                    Podcast
                  </span>
                  <div className="mt-2 text-[15px] font-bold">{skill.episode.podcast}</div>
                  <div className="mt-0.5 text-[13.5px] text-navy/60">{skill.episode.title}</div>
                </div>
                {skill.episode.url && (
                  <a
                    href={skill.episode.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-shrink-0 items-center gap-1 whitespace-nowrap text-[13.5px] font-bold text-blue no-underline"
                  >
                    View →
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
