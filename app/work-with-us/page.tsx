import type { Metadata } from "next";
import Faq from "./Faq";

export const metadata: Metadata = {
  title: "Work with us",
  description:
    "Two ways to work with Skills for People: an AI workshop that maps your workflows, or hands-on support to build solutions with the tools you already use.",
};

// Every Book-a-call CTA on this page routes here.
const CALENDAR_LINK =
  "https://calendly.com/tobyegbuna/skills-for-people-discovery-call";

const services = [
  {
    subhead: "For teams getting started with AI",
    title: "AI Workshops",
    desc:
      "A working session with your team to map out where AI actually saves you time, and where it doesn’t.",
    borderColor: "border-blue/35",
    iconBg: "bg-blue/[0.14]",
    iconColor: "text-blue",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 2Z" />
      </svg>
    ),
  },
  {
    subhead: "For teams ready to implement AI department-wide",
    title: "Custom Apps & Workflows",
    desc:
      "We’ll build something specific to how your team already works, using the tools you already have.",
    borderColor: "border-peach/60",
    iconBg: "bg-peach/[0.28]",
    iconColor: "text-navy",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

// The 4-column process visual — Workstreams → Workflows → Tasks → Steps.
// Tasks (index 2) carries the "AI enters here" tag; Tasks + Steps are both
// navy-filled to match the design.
const processSteps: Array<{
  label: string;
  desc: string;
  navy: boolean;
  highlight: boolean;
}> = [
  { label: "Workstreams", desc: "The big areas of the business", navy: false, highlight: false },
  { label: "Workflows", desc: "How work moves through each area", navy: false, highlight: false },
  {
    label: "Tasks",
    desc: "The individual jobs inside a workflow — where AI gets introduced",
    navy: true,
    highlight: true,
  },
  { label: "Steps", desc: "The granular actions AI speeds up or takes over", navy: true, highlight: false },
];

const faqs = [
  {
    q: "How is this different from generic AI training?",
    a: "Most AI training teaches the tool. We start from your actual workflows and work backward to where AI fits — using the same workstream → workflow → task → step process we built running our own HR SaaS company. The output is specific to your team, not a set of prompts everyone in your industry gets.",
  },
  {
    q: "Who should be in the room for the workshop?",
    a: "Whoever actually does the work you want to improve — not just leadership. The session works best with the people closest to the day-to-day, since the mapping only works if it’s grounded in what’s really happening, not what a manager assumes is happening.",
  },
  {
    q: "Do we need any technical background on our team?",
    a: "No. The workshop is built for HR and operations teams, not engineers. If a workflow needs custom automation to actually ship, that’s the custom build engagement — you don’t need to build anything yourself.",
  },
];

export default function WorkWithUsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[820px] px-5 py-16 text-center sm:px-8 md:py-20 lg:px-16 lg:py-24">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-blue">
          Work with us
        </div>
        <h1 className="mb-5 text-[clamp(32px,4.4vw,46px)] font-bold leading-[1.12] tracking-tight">
          We help People teams find where AI <i>actually</i> moves the needle,
          then build it.
        </h1>
        <p className="mx-auto mb-7 max-w-[620px] text-lg text-navy/75">
          We give away real HR AI content because we want HR teams actually
          using AI well, not just talking about it. If you want help going
          deeper, either as a team or with something custom-built for how you
          work, we’re here for that too.
        </p>
        <a
          href={CALENDAR_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-[10px] bg-navy px-8 py-4 text-base font-bold text-white no-underline shadow-cta transition-colors hover:bg-blue"
        >
          Book a call
        </a>
      </section>

      {/* SERVICES */}
      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 md:py-20 lg:px-16">
          <div className="grid items-stretch gap-7 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className={`flex flex-col rounded-[18px] border ${service.borderColor} bg-mint p-8`}
              >
                <div
                  className={`mb-[18px] flex h-12 w-12 items-center justify-center rounded-xl ${service.iconBg} ${service.iconColor}`}
                >
                  {service.icon}
                </div>
                <div className="mb-2 text-[13px] font-bold text-blue">
                  {service.subhead}
                </div>
                <h2 className="mb-3.5 text-[clamp(22px,2.6vw,26px)] font-bold tracking-tight">
                  {service.title}
                </h2>
                <p className="flex-1 text-base leading-[1.55] text-navy/75">
                  {service.desc}
                </p>
                <a
                  href={CALENDAR_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 block rounded-[9px] bg-navy px-4 py-3.5 text-center text-[14.5px] font-bold text-white no-underline transition-colors hover:bg-blue"
                >
                  Book a call
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
            Our process
          </div>
          <h2 className="mb-3.5 text-[clamp(26px,3.2vw,34px)] font-bold tracking-tight">
            The same mapping process we use to run our own HR SaaS company.
          </h2>
          <p className="text-base text-navy/70">
            We go one level at a time until we hit something specific enough to
            actually automate.
          </p>
        </div>
        <div className="mx-auto flex max-w-[980px] flex-col items-stretch gap-3 md:flex-row md:items-stretch md:gap-0">
          {processSteps.map((step, i) => {
            const isLast = i === processSteps.length - 1;
            const cardBase =
              "flex-1 min-w-0 rounded-[14px] p-5 text-center border";
            const cardTone = step.navy
              ? "bg-navy border-navy text-white"
              : "bg-white border-navy/10 text-navy";
            const highlightShadow = step.highlight
              ? step.navy
                ? "shadow-[0_8px_20px_rgba(36,54,110,0.28)]"
                : "shadow-[0_8px_20px_rgba(94,116,158,0.18)]"
              : "";
            return (
              <div
                key={step.label}
                className="flex flex-1 items-stretch"
              >
                <div className={`${cardBase} ${cardTone} ${highlightShadow}`}>
                  {step.highlight && (
                    <div
                      className={`mb-2 text-[11px] font-bold uppercase tracking-wider ${
                        step.navy ? "text-peach" : "text-blue"
                      }`}
                    >
                      AI enters here
                    </div>
                  )}
                  <div
                    className={`mb-1.5 text-base font-bold ${
                      step.navy ? "text-white" : "text-navy"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-[13px] ${
                      step.navy ? "text-mint/75" : "text-navy/60"
                    }`}
                  >
                    {step.desc}
                  </div>
                </div>
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex w-7 flex-shrink-0 items-center justify-center text-lg text-navy/30 max-md:hidden"
                  >
                    →
                  </div>
                )}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex w-full flex-shrink-0 items-center justify-center text-lg text-navy/30 md:hidden"
                  >
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[820px] px-5 py-14 sm:px-8 md:py-20 lg:px-16">
          <h2 className="mb-8 text-center text-[clamp(24px,3vw,30px)] font-bold tracking-tight">
            FAQs
          </h2>
          <Faq items={faqs} />
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 md:py-24 lg:px-16">
        <h2 className="mb-3.5 text-[clamp(26px,3.2vw,32px)] font-bold tracking-tight">
          Ready to see where AI actually fits in your workflows?
        </h2>
        <p className="mb-7 text-base text-navy/70">
          Book a 30-minute discovery call to see how we can partner!
        </p>
        <a
          href={CALENDAR_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-[10px] bg-navy px-8 py-4 text-base font-bold text-white no-underline shadow-cta transition-colors hover:bg-blue"
        >
          Book a call
        </a>
      </section>
    </>
  );
}
