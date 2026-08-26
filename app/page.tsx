import Link from "next/link";
import { getPublishedSkills } from "@/lib/skills";
import SkillCard from "@/components/SkillCard";
import HeroCards from "@/components/HeroCards";

const STEPS = [
  {
    num: "1",
    title: "Browse or search",
    desc: "Filter the library by HR vertical or search for the problem you're trying to solve.",
  },
  {
    num: "2",
    title: "Download the skill",
    desc: "Get it as a Claude .skill file or a plain-prompt .md — works with whatever AI tool you already use.",
  },
  {
    num: "3",
    title: "Run it on your org",
    desc: "The skill asks about your team, budget, and constraints, then produces output tailored to you.",
  },
];

export default async function LandingPage() {
  const skills = await getPublishedSkills();
  const previewSkills = skills.slice(0, 3);
  const rotatingSkills = skills.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:px-16 lg:py-24">
        <div className="min-w-[280px] flex-1 basis-[480px]">
          <div className="mb-5 inline-block rounded-full bg-blue/10 px-3.5 py-1.5 text-[13px] font-semibold uppercase tracking-wider text-blue">
            For HR practitioners
          </div>
          <h1 className="mb-5 text-[clamp(36px,5vw,54px)] font-bold leading-[1.08] tracking-tight text-navy">
            Practical AI skills for HR, built from what actually worked.
          </h1>
          <p className="mb-8 max-w-[520px] text-[19px] text-navy/75">
            We turn real workflows HR leaders share through thought leadership content into
            downloadable AI skills you can run with Claude or ChatGPT this week.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/skills"
              className="whitespace-nowrap rounded-[10px] bg-navy px-7 py-4 text-base font-bold text-white shadow-cta transition-colors hover:bg-blue"
            >
              Browse the skill library
            </Link>
            <Link
              href="#how"
              className="border-b-2 border-navy/25 pb-0.5 text-base font-semibold text-navy no-underline"
            >
              See how it works
            </Link>
          </div>
        </div>
        <HeroCards skills={rotatingSkills} />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
        <div className="mb-12 max-w-[640px]">
          <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
            How it works
          </div>
          <h2 className="text-[clamp(28px,3.4vw,38px)] font-bold tracking-tight">
            Get access to the best workflows in just three steps.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] border-2 border-blue bg-white text-lg font-bold text-blue">
                {s.num}
              </div>
              <div className="mb-2 text-lg font-bold">{s.title}</div>
              <div className="text-[15px] text-navy/70">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIBRARY PREVIEW */}
      <section
        id="library"
        className="border-y border-navy/10 bg-white"
      >
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[600px]">
              <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
                From the library
              </div>
              <h2 className="text-[clamp(28px,3.4vw,38px)] font-bold tracking-tight">
                A growing set of skills, sourced one workflow at a time.
              </h2>
            </div>
            <Link
              href="/skills"
              className="whitespace-nowrap border-b-2 border-navy/25 pb-0.5 text-[15px] font-semibold text-navy no-underline"
            >
              See all skills →
            </Link>
          </div>

          {previewSkills.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewSkills.map((s) => (
                <SkillCard key={s.slug} skill={s} />
              ))}
            </div>
          ) : (
            <EmptyLibrary />
          )}
        </div>
      </section>
    </>
  );
}

function EmptyLibrary() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/25 p-14 text-center">
      <div className="text-lg font-bold text-navy">Coming soon</div>
      <p className="max-w-md text-[15px] text-navy/60">
        The first skills are being finalized. Check back shortly — or subscribe by contributing one
        of your own.
      </p>
      <Link
        href="/contribute"
        className="mt-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-blue"
      >
        Contribute a skill
      </Link>
    </div>
  );
}
