import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
import { getPublishedSkills, type Skill } from "@/lib/skills";
import { getCurrentUser, isOnProgramWaitlist } from "@/lib/account";
import { HOME_TEASER_COUNT } from "@/lib/home";
import { excerptForSkill } from "@/lib/skill-excerpt";
import { newsletterUrl } from "@/lib/newsletter";
import SkillCard from "@/components/SkillCard";
import EmailSignup from "@/components/EmailSignup";
import SeeLibraryButton from "@/components/SeeLibraryButton";
import DirectoryClient from "@/app/skills/DirectoryClient";
import SkillDocument from "@/components/mockups/SkillDocument";
import HowItWorks from "@/components/mockups/HowItWorks";
import CohortPreview from "@/components/mockups/CohortPreview";
import IssuePreview from "@/components/mockups/IssuePreview";
import NewsletterBand from "@/components/NewsletterBand";
import "@/components/mockups/visuals.css";

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

  const teaser = skills.slice(0, HOME_TEASER_COUNT);
  const excerpt = weekly
    ? await excerptForSkill(weekly)
    : {
        name: "This week's skill",
        filename: "skill.md",
        what: "A ready-to-use workflow an HR leader shared, written so you can run it in Claude or ChatGPT.",
        steps: [],
      };
  const issueLine = (weekly?.description || excerpt.what).split(/(?<=\.)\s/)[0];

  return (
    <div className="sfp-mock">
      <section className="band band--mint hero">
        <div className="container split">
          <div className="hero__copy">
            <p className="eyebrow">AI skills for HR and People teams</p>
            <h1 className="h1">Get this week&apos;s free AI skill for your HR team.</h1>
            <p className="lead">
              One ready-to-use skill every Tuesday, built from a workflow an HR leader shared. Drop
              it into Claude or ChatGPT and run it this week.
            </p>
            <EmailSignup
              designed
              cta="Get this week's skill →"
              placeholder="Your work email"
              finePrint="Get this skill now, plus a new one every Tuesday. Unsubscribe anytime."
            />
          </div>
          <SkillDocument excerpt={excerpt} />
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From your inbox to Claude or ChatGPT</h2>
          </div>
          <HowItWorks skillName={excerpt.name} />
        </div>
      </section>

      <section className="band band--mint familiar">
        <div className="container split">
          <div className="notes" aria-label="Three problems HR teams run into">
            {FAMILIAR.map((line) => (
              <p key={line} className="note">
                &ldquo;{line}&rdquo;
              </p>
            ))}
          </div>
          <div className="familiar__copy">
            <h2 className="h2">Sound familiar?</h2>
            <p className="lead">Every skill here starts with a problem like these.</p>
            <a className="link" href="#library">
              Browse the skills ↓
            </a>
          </div>
        </div>
      </section>

      <section className="band band--white" id="library">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">A few of the skills you get free</h2>
          </div>
          {teaser.length > 0 ? (
            <div className="grid">
              {teaser.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} showArrow compact className="skill" />
              ))}
            </div>
          ) : (
            <p className="lead">The first skills are on the way.</p>
          )}
          <div className="library__more">
            <SeeLibraryButton className="btn btn--ghost" />
          </div>
        </div>
      </section>

      <section className="band band--mint">
        <div className="container">
          <div className="program__head">
            <div>
              <p className="eyebrow">People Builders</p>
              <h2 className="h2">Want to build your own tools?</h2>
              <p className="lead">
                A 4-week live program for HR teams on Claude or ChatGPT, capped at 10 people. You
                build two automated workflows and two apps.
              </p>
            </div>
            <Link className="btn" href="/people-builders">
              Join the waitlist →
            </Link>
          </div>
          <CohortPreview />
        </div>
      </section>

      <section className="band band--white founder">
        <div className="container">
          <p className="eyebrow">Who&apos;s behind this</p>
          <div className="founder__row">
            <Image
              src="/assets/toby-headshot.jpg"
              alt="Toby Egbuna"
              width={320}
              height={320}
              className="founder__photo"
            />
            <div>
              <div className="founder__story">
                <p>
                  I&apos;m Toby Egbuna. I co-founded Chezie, an HR tech company, and I&apos;ve spent
                  the last 6 years building it.
                </p>
                <p>
                  Chezie has one product manager, and it&apos;s me. We&apos;ve grown to $1 million
                  in revenue.
                </p>
              </div>
              <p className="founder__line">
                <Link href="/about">Read my full story →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--mint" data-email-capture="">
        <div className="container split">
          <div className="newsletter__copy">
            <p className="eyebrow">Skills for People Weekly</p>
            <h2 className="h2">One skill and one tip, every Tuesday</h2>
            <p className="lead">
              Each issue has a new skill built from an HR leader&apos;s workflow, plus one technical
              tip from me.
            </p>
            <a className="btn" href={newsletterUrl()}>
              Send it to me
            </a>
            <p className="fine" style={{ marginTop: 12 }}>
              Unsubscribe anytime.
            </p>
          </div>
          <IssuePreview skillName={excerpt.name} skillLine={issueLine} />
        </div>
      </section>
    </div>
  );
}

function verticalsOf(skills: Skill[]): string[] {
  return Array.from(new Set(skills.map((skill) => skill.vertical).filter(Boolean))).sort();
}
