import Link from "next/link";

export const dynamic = "force-dynamic";
import { getPublishedSkills, type Skill } from "@/lib/skills";
import { getCurrentUser, isOnProgramWaitlist } from "@/lib/account";
import SkillCard from "@/components/SkillCard";
import EmailSignup from "@/components/EmailSignup";
import SeeLibraryButton from "@/components/SeeLibraryButton";
import DirectoryClient from "@/app/skills/DirectoryClient";
import SkillRunPreview from "@/components/mockups/SkillRunPreview";
import HowItWorks from "@/components/mockups/HowItWorks";
import CohortPreview from "@/components/mockups/CohortPreview";
import NewsletterBand from "@/components/NewsletterBand";

const FAMILIAR = [
  "I asked for a simple tool months ago and it's still in the IT queue.",
  "Our HRIS has the data, but every Monday I export it and clean it by hand.",
  "Leadership wants an AI plan for HR and I don't know where to start.",
];

export default async function LandingPage() {
  const [skills, current] = await Promise.all([
    getPublishedSkills(),
    getCurrentUser().catch(() => null),
  ]);
  const weekly = skills[0] ?? null;

  if (current) {
    const onWaitlist = await isOnProgramWaitlist(current.email);
    const name = current.firstName;
    return (
      <>
        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
          <h1 className="mb-3 text-[clamp(32px,5vw,48px)] font-bold leading-[1.08] tracking-tight text-navy">
            {name ? `Welcome back, ${name}.` : "Welcome back."}
          </h1>
          <p className="mb-6 max-w-[520px] text-[17px] text-navy/75">
            {weekly ? `${weekly.name} is this week's skill.` : "A new skill lands every Tuesday."}
          </p>
          <div className="flex flex-wrap gap-3">
            {weekly && (
              <Link
                href={`/skills/${weekly.slug}`}
                className="rounded-[10px] bg-navy px-5 py-3 text-[15px] font-bold text-white no-underline hover:bg-blue"
              >
                Open this week&apos;s skill
              </Link>
            )}
            <Link
              href="/skills"
              className="rounded-[10px] border border-navy/20 bg-white px-5 py-3 text-[15px] font-bold text-navy no-underline hover:bg-mint"
            >
              Browse the library
            </Link>
          </div>
        </section>

        {!onWaitlist && (
          <section className="border-y border-navy/10 bg-white">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-16">
              <p className="text-[15.5px] text-navy/80">People Builders waitlist is open.</p>
              <Link href="/people-builders" className="font-bold text-blue no-underline hover:underline">
                Join the waitlist →
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-16">
          <DirectoryClient skills={skills} verticals={verticalsOf(skills)} initialVertical="All" />
        </section>
        <NewsletterBand />
      </>
    );
  }

  const teaser = skills.slice(0, 12);

  return (
    <>
      <section className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-10 px-5 py-12 sm:px-8 lg:gap-14 lg:px-16 lg:py-16">
        <div className="min-w-[260px] flex-1 basis-[420px]">
          <h1 className="mb-4 text-[clamp(34px,5vw,52px)] font-bold leading-[1.08] tracking-tight text-navy">
            Get this week&apos;s free AI skill for your HR team.
          </h1>
          <p className="mb-6 max-w-[460px] text-[17px] leading-snug text-navy/75">
            One skill a week, from a workflow an HR leader shared, plus a tip from me. Run it in
            Claude or ChatGPT.
          </p>
          <div className="max-w-[440px]">
            <EmailSignup
              cta="Get this week's skill →"
              placeholder="Your work email"
              finePrint="This skill now. A new one every Tuesday."
            />
          </div>
        </div>
        <div className="min-w-[260px] flex-1 basis-[340px]">
          <SkillRunPreview
            name={weekly?.name ?? "This week's skill"}
            problem={weekly?.description}
          />
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 lg:px-16">
        <h2 className="mb-4 text-[clamp(26px,3.2vw,34px)] font-bold tracking-tight">Sound familiar?</h2>
        <ul className="grid gap-3">
          {FAMILIAR.map((line) => (
            <li key={line} className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-[15.5px] text-navy/80">
              &ldquo;{line}&rdquo;
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-16">
        <h2 className="mb-6 text-[clamp(26px,3.2vw,34px)] font-bold tracking-tight">
          A few of the skills you get free
        </h2>
        {teaser.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teaser.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} showArrow compact />
            ))}
          </div>
        ) : (
          <p className="text-navy/60">The first skills are on the way.</p>
        )}
        <SeeLibraryButton />
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-16">
          <div>
            <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-blue">
              People Builders
            </div>
            <h2 className="mb-3 text-[clamp(26px,3.2vw,34px)] font-bold tracking-tight">
              Want to build your own tools?
            </h2>
            <p className="mb-5 max-w-[460px] text-[16px] text-navy/75">
              4 weeks, live, 10 people max. $2,500. Two workflows and two apps for your team.
            </p>
            <Link
              href="/people-builders"
              className="inline-block rounded-[10px] bg-navy px-5 py-3 text-[15px] font-bold text-white no-underline hover:bg-blue"
            >
              Join the waitlist →
            </Link>
          </div>
          <CohortPreview />
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-5 py-8 sm:px-8 lg:px-16">
        <p className="text-[15.5px] text-navy/75">
          Built by Toby Egbuna, co-founder of Chezie, an HR tech company with $1 million in revenue.{" "}
          <Link href="/about" className="font-semibold text-blue no-underline hover:underline">
            Read my story →
          </Link>
        </p>
      </section>

      <NewsletterBand />
    </>
  );
}

function verticalsOf(skills: Skill[]): string[] {
  return Array.from(new Set(skills.map((skill) => skill.vertical).filter(Boolean))).sort();
}
