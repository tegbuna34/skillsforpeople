import type { Metadata } from "next";
import ExtractionPromptCard from "./ExtractionPromptCard";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Submit a workflow you've already built as a Skills for People skill, or use the extraction prompt to find one in your chat history.",
};

const TALLY_URL = "https://tally.so/r/9qAx2K";

const LOOKING_FOR = [
  {
    title: "A specific workflow",
    desc: "Not “improve onboarding” — the exact steps you followed to build something, in order.",
  },
  {
    title: "Something you actually ran",
    desc: "Tested in a real org, not a theory. It should produce output you’d trust.",
  },
  {
    title: "Reusable by others",
    desc: "Should work for another HR team with different inputs, not just yours.",
  },
  {
    title: "Structured as a skill",
    desc: "A Claude .skill file or a clear, step-by-step prompt — not a one-off question.",
  },
];

export default function ContributePage() {
  return (
    <>
      <div className="mx-auto max-w-[820px] px-5 pb-10 pt-16 sm:px-8 md:pt-24 lg:px-16">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
          Contribute
        </div>
        <h1 className="mb-5 text-[clamp(32px,4.4vw,46px)] font-bold leading-[1.12] tracking-tight">
          You&apos;ve probably already built a skill. Share it.
        </h1>
        <p className="text-lg text-navy/75">
          Skills for People doesn&apos;t write skills for you — it&apos;s a place to publish the
          ones HR leaders have already built and quietly kept to themselves. If you&apos;ve
          formalized a workflow, submit it directly. If you haven&apos;t yet, there&apos;s
          probably one sitting in your chat history.
        </p>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 sm:px-8 lg:px-16">
        <h2 className="mb-6 text-xl font-bold">What we&apos;re looking for</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {LOOKING_FOR.map((c) => (
            <div key={c.title} className="rounded-2xl border border-navy/10 bg-white p-6">
              <div className="mb-2 text-[15.5px] font-bold">{c.title}</div>
              <div className="text-sm text-navy/70">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-navy/10 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20 lg:px-16">
          <h2 className="mb-2 text-xl font-bold">Two ways to contribute</h2>
          <p className="mb-8 max-w-2xl text-[15px] text-navy/70">
            Already have something built? Submit it below. Don&apos;t have one yet? You probably
            have raw material for one sitting in your AI chat history — here&apos;s how to find
            it.
          </p>

          <div className="grid gap-6 md:grid-cols-[minmax(260px,1fr)_minmax(320px,3fr)]">
            <div className="flex flex-col rounded-2xl border border-navy/10 p-7">
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-sm font-bold text-blue">
                1
              </div>
              <div className="mb-2 text-lg font-bold">Already built one? Import it.</div>
              <p className="mb-5 flex-1 text-[14.5px] text-navy/70">
                Export your existing Claude .skill file or prompt and submit it directly — upload
                the file or paste it as markdown. We&apos;ll review it against the criteria above
                and follow up before it goes live.
              </p>
              <a
                href={TALLY_URL}
                target="_blank"
                rel="noreferrer"
                className="block whitespace-nowrap rounded-[9px] bg-navy py-3 text-center text-[14.5px] font-bold text-white no-underline transition-colors hover:bg-blue"
              >
                Submit a built skill
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-navy/10 p-7">
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-sm font-bold text-blue">
                2
              </div>
              <div className="mb-2 text-lg font-bold">Don&apos;t have one? You probably do.</div>
              <p className="mb-5 flex-1 text-[14.5px] text-navy/70">
                Run this prompt in Claude or ChatGPT. It scans your own chat history for workflows
                you&apos;ve already solved for yourself, formalized enough to become a skill —
                you just haven&apos;t packaged them yet.
              </p>
              <ExtractionPromptCard />
            </div>
          </div>
        </div>
      </div>

      <div id="submit" className="mx-auto max-w-[640px] px-5 py-20 text-center sm:px-8 lg:px-16">
        <h2 className="mb-2 text-[22px] font-bold">Submit a built skill</h2>
        <p className="mb-7 text-[15px] text-navy/70">
          Upload your .skill file, or paste it as a markdown document. We don&apos;t build skills
          from scratch — this is for workflows you&apos;ve already formalized.
        </p>
        <a
          href={TALLY_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block whitespace-nowrap rounded-[9px] bg-navy px-8 py-4 text-[15px] font-bold text-white no-underline transition-colors hover:bg-blue"
        >
          Open submission form →
        </a>
      </div>
    </>
  );
}
