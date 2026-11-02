import Link from "next/link";

export const dynamic = "force-dynamic";
import { getPublishedSkills } from "@/lib/skills";
import { getCurrentUser, isOnProgramWaitlist } from "@/lib/account";
import SkillCard from "@/components/SkillCard";
import EmailSignup from "@/components/EmailSignup";
import SeeLibraryButton from "@/components/SeeLibraryButton";
import DirectoryClient from "@/app/skills/DirectoryClient";

const FAMILIAR = [
  "I asked for a simple tool months ago and it's still in the IT queue.",
  "Our HRIS has the data, but every Monday I export it to a spreadsheet and clean it by hand.",
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
        <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
          <h1 className="mb-3 text-[clamp(36px,5vw,52px)] font-bold leading-[1.08] tracking-tight text-navy">
            {name ? `Welcome back, ${name}.` : "Welcome back."}
          </h1>
          <p className="mb-8 max-w-[560px] text-[18px] text-navy/75">
            {weekly
              ? `This week's skill is ${weekly.name}. A new one lands every Tuesday.`
              : "A new skill lands every Tuesday."}
          </p>
          <div className="flex flex-wrap gap-3">
            {weekly && (
              <Link
                href={`/skills/${weekly.slug}`}
                className="rounded-[10px] bg-navy px-6 py-3.5 text-[15px] font-bold text-white no-underline hover:bg-blue"
              >
                Open this week&apos;s skill
              </Link>
            )}
            <Link
              href="/skills"
              className="rounded-[10px] border border-navy/20 bg-white px-6 py-3.5 text-[15px] font-bold text-navy no-underline hover:bg-mint"
            >
              Browse the library
            </Link>
          </div>
        </section>

        {!onWaitlist && (
          <section className="border-y border-navy/10 bg-white">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-16">
              <p className="text-[16px] text-navy/80">
                Want to build tools like these yourself? The People Builders waitlist is open.
              </p>
              <Link
                href="/people-builders"
                className="whitespace-nowrap font-bold text-blue no-underline hover:underline"
              >
                Join the waitlist →
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-16">
          <DirectoryClient skills={skills} verticals={verticalsOf(skills)} initialVertical="All" />
        </section>
      </>
    );
  }

  const teaser = skills.slice(0, 12);

  return (
    <>
      <section className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-12 px-5 py-16 sm:px-8 lg:gap-16 lg:px-16 lg:py-24">
        <div className="min-w-[280px] flex-1 basis-[440px]">
          <div className="mb-3.5 text-[13px] font-bold uppercase tracking-wider text-blue">
            AI skills for HR and People teams
          </div>
          <h1 className="mb-5 text-[clamp(36px,5vw,52px)] font-bold leading-[1.08] tracking-tight text-navy">
            Get this week&apos;s free AI skill for your HR team.
          </h1>
          <p className="mb-7 max-w-[500px] text-[17.5px] leading-relaxed text-navy/75">
            One ready-to-use skill every week, built from a workflow an HR leader shared, plus one
            technical tip from me. Drop it into Claude or ChatGPT and run it this week.
          </p>
          <div className="max-w-[440px]">
            <EmailSignup
              cta="Get this week's skill →"
              placeholder="Your work email"
              finePrint="Get this skill now, plus a new one in your inbox every Tuesday. Unsubscribe anytime."
            />
          </div>
        </div>
        {weekly && (
          <div className="min-w-[280px] flex-1 basis-[340px] rounded-2xl border border-navy/10 bg-white p-7 shadow-cardLg">
            <div className="mb-4 flex items-center justify-between gap-3">
              {weekly.vertical && (
                <span className="rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
                  {weekly.vertical}
                </span>
              )}
              <span className="text-[12px] font-bold uppercase tracking-wide text-[#b5484d]">
                This week&apos;s skill
              </span>
            </div>
            <div className="mb-2.5 text-[22px] font-bold leading-snug text-navy">{weekly.name}</div>
            {weekly.description && (
              <p className="mb-5 text-[15px] leading-relaxed text-navy/65">{weekly.description}</p>
            )}
            <div className="flex items-center gap-2 border-t border-navy/10 pt-4 text-[13.5px] font-semibold text-navy/55">
              <LockIcon />
              Opens with your free account
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16">
          <h2 className="mb-6 text-[clamp(28px,3.4vw,36px)] font-bold tracking-tight">
            Sound familiar?
          </h2>
          <ul className="flex flex-col gap-4">
            {FAMILIAR.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-navy/10 bg-mint px-5 py-4 text-[16.5px] text-navy/80"
              >
                &ldquo;{line}&rdquo;
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15.5px] text-navy/70">
            Every skill here starts with a problem like these.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
        <h2 className="mb-8 text-[clamp(28px,3.4vw,36px)] font-bold tracking-tight">
          A few of the skills you get free
        </h2>
        {teaser.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teaser.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} showArrow />
            ))}
          </div>
        ) : (
          <p className="text-navy/60">The first skills are on the way.</p>
        )}
        <SeeLibraryButton />
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16">
          <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
            People Builders
          </div>
          <h2 className="mb-3 text-[clamp(28px,3.4vw,36px)] font-bold tracking-tight">
            Want to build your own tools?
          </h2>
          <p className="mb-6 max-w-[640px] text-[16.5px] text-navy/75">
            People Builders is a 4-week live program for HR teams on Claude or ChatGPT, capped at
            10 people. You build two automated workflows and two apps that save your team time.
          </p>
          <Link
            href="/people-builders"
            className="inline-block rounded-[10px] bg-navy px-6 py-3.5 text-[15px] font-bold text-white no-underline hover:bg-blue"
          >
            Join the waitlist →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-5 py-10 sm:px-8 lg:px-16">
        <p className="text-[15.5px] text-navy/75">
          Built by Toby Egbuna, co-founder of Chezie, an HR tech company with $1 million in
          revenue.{" "}
          <Link href="/about" className="font-semibold text-blue no-underline hover:underline">
            Read my story →
          </Link>
        </p>
      </section>
    </>
  );
}

function verticalsOf(skills: { vertical: string }[]): string[] {
  return Array.from(new Set(skills.map((skill) => skill.vertical).filter(Boolean))).sort();
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
