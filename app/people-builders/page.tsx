import type { Metadata } from "next";
import Faq from "@/app/work-with-us/Faq";
import WaitlistForm from "./WaitlistForm";
import CopyNote from "./CopyNote";

export const metadata: Metadata = {
  title: "People Builders",
  description:
    "A 4-week live program for People leaders on Claude or ChatGPT. Think like a founder. Build your own tools.",
};

const FOR = [
  "You lead or work in Talent Acquisition, People Ops, L&D, People Analytics, or Total Rewards.",
  "Your company already pays for Claude or ChatGPT, and you mostly use it for emails and writing.",
  "Your team has problems it has lived with for years, and nobody has had the time or the know-how to fix them.",
  "It’s the wrong program if you want HR policy or compliance training. I’m not an HR expert and I don’t teach HR.",
];

const OUTCOMES = [
  "Two automated workflows that save your team time.",
  "Two apps your team can use.",
  "A map of your team’s work that shows what to build next.",
  "A demo of what you built, ready to show your manager.",
];

const WEEKS = [
  {
    title: "Week 1: Opportunity mapping",
    detail:
      "Break your team’s work into workstreams, then workflows, then tasks, and find the ones worth automating or building for.",
  },
  {
    title: "Week 2: Automations",
    detail: "Build automated workflows for the repetitive tasks you mapped in week 1.",
  },
  {
    title: "Week 3: An application",
    detail: "Turn a process your team runs by hand into an app they can use.",
  },
  {
    title: "Week 4: Think like a founder, and demo day",
    detail:
      "Decide what to build next the way a founder decides what to ship, then demo what you built to the group.",
  },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You’ll learn the technical pieces you need, in HR terms, as you build.",
  },
  {
    q: "What do I need to have?",
    a: "A Claude or ChatGPT account. People Builders is built for teams on either one.",
  },
  {
    q: "How much time does it take?",
    a: "About 2 hours a week live, plus the time you spend building.",
  },
  {
    q: "Can I use my company’s data?",
    a: "[Your data guidance, e.g. build with sample or anonymized data in sessions, and follow your company’s AI policy.]",
  },
  {
    q: "When is the next cohort?",
    a: "People on the waitlist hear the dates first.",
  },
  {
    q: "Can my team do it together?",
    a: "Yes. Pick “A private cohort for my team” on the waitlist form and I’ll follow up.",
  },
  {
    q: "Questions?",
    a: "Email me at toby@tobyegbuna.com.",
  },
];

export default function PeopleBuildersPage() {
  return (
    <>
      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-blue">
          People Builders · 4 weeks · live · 10 people max
        </div>
        <h1 className="mb-4 text-[clamp(34px,4.6vw,50px)] font-bold leading-[1.1] tracking-tight">
          Think like a founder. Build your own HR tools.
        </h1>
        <p className="mb-7 max-w-[640px] text-[18px] text-navy/75">
          A 4-week live program for People leaders on Claude or ChatGPT. You walk out with two
          automated workflows and two apps that save your team time, and you learn to be the person
          on your team who builds.
        </p>
        <a
          href="#waitlist"
          className="inline-block rounded-[10px] bg-navy px-7 py-3.5 text-[15.5px] font-bold text-white no-underline hover:bg-blue"
        >
          Join the waitlist
        </a>
        <p className="mt-4 text-[13.5px] text-navy/55">
          The next cohort is $2,500 a seat. People on the waitlist hear first.
        </p>
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-16">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Who it’s for</h2>
            <ul className="flex flex-col gap-3 text-[15.5px] text-navy/80">
              {FOR.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">What you’ll walk out with</h2>
            <ul className="flex flex-col gap-3 text-[15.5px] text-navy/80">
              {OUTCOMES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16">
        <h2 className="mb-6 text-[clamp(26px,3vw,34px)] font-bold">The 4 weeks</h2>
        <ol className="flex flex-col gap-5">
          {WEEKS.map((week, index) => (
            <li key={week.title} className="rounded-2xl border border-navy/10 bg-white p-5">
              <div className="mb-1 text-[12px] font-bold uppercase tracking-wider text-blue">
                {index + 1}
              </div>
              <div className="mb-1 text-[17px] font-bold">{week.title}</div>
              <p className="text-[15px] text-navy/75">{week.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto grid max-w-[820px] gap-4 px-5 py-16 text-[15.5px] sm:px-8 lg:px-16">
          <h2 className="text-[clamp(26px,3vw,34px)] font-bold">Format and price</h2>
          <p>
            <strong>Length.</strong> 4 weeks.
          </p>
          <p>
            <strong>Each week.</strong> One live session and one office hour. About 2 hours live,
            plus your build time.
          </p>
          <p>
            <strong>Group size.</strong> 10 people max.
          </p>
          <p>
            <strong>Price.</strong> $2,500 a seat.
          </p>
          <p>
            <strong>Built for.</strong> Teams on Claude or ChatGPT.
          </p>
          <p>
            <strong>Teams.</strong> Want to bring your team? Pick “A private cohort for my
            team” on the form and I’ll follow up.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-[820px] flex-col gap-5 px-5 py-16 text-[16.5px] text-navy/80 sm:px-8 lg:px-16">
        <h2 className="text-[clamp(26px,3vw,34px)] font-bold text-navy">Why I teach this</h2>
        <p>
          I’m Toby Egbuna. In 2021 I co-founded Chezie, an HR-tech platform for managing internal
          communities, and built the first version myself in a no-code tool. Today we work with
          customers like Airbnb and the NBA, and I still lead our technical work, mostly by using
          AI to build things that used to be too technical for me.
        </p>
        <p>
          For a long time I was intimidated by anything that involved the word “code.”
          Now I use AI to build things that used to be way too technical for me. People Builders
          teaches you to do the same for your team. You bring the HR expertise. I bring the
          building.
        </p>
      </section>

      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16">
          <h2 className="mb-3 text-[clamp(26px,3vw,34px)] font-bold">Getting your company to pay</h2>
          <p className="mb-5 text-[16px] text-navy/75">
            Most companies have an L&D or training budget that covers a program like this.
            Here’s a note you can send your manager.
          </p>
          <CopyNote />
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-16">
        <h2 className="mb-6 text-center text-[clamp(24px,3vw,30px)] font-bold">FAQ</h2>
        <Faq items={FAQS} />
      </section>

      <section id="waitlist" className="border-t border-navy/10 bg-white">
        <div className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 lg:px-16">
          <h2 className="mb-6 text-[clamp(26px,3vw,34px)] font-bold">Join the waitlist</h2>
          <WaitlistForm />
          <p className="mt-6 text-[14px] text-navy/55">
            Questions?{" "}
            <a href="mailto:toby@tobyegbuna.com" className="font-semibold text-blue no-underline hover:underline">
              toby@tobyegbuna.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
