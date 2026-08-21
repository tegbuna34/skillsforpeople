import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Skills for People publishes AI skills sourced from real HR practitioners describing workflows they've already built.",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-[820px] px-5 pb-14 pt-16 sm:px-8 md:pt-24 lg:px-16">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">About</div>
        <h1 className="mb-5 text-[clamp(32px,4.4vw,46px)] font-bold leading-[1.12] tracking-tight">
          A library of HR skills, built from what actually worked.
        </h1>
        <p className="text-lg text-navy/75">
          Most AI prompts for HR are generic guesses. Skills for People only publishes workflows
          that came from a named practitioner describing something they actually built — then turns
          that into a tool you can run yourself.
        </p>
      </div>

      <div className="mx-auto flex max-w-[820px] flex-col gap-7 px-5 pb-16 sm:px-8 lg:px-16">
        <p className="text-[16.5px] text-navy/75">
          It started as a side project: pulling real HR workflows out of podcast interviews — the
          specific steps a Talent Acquisition leader or a DEI program manager actually used to
          solve a problem — and turning each one into a downloadable skill that works with Claude
          or ChatGPT.
        </p>
        <p className="text-[16.5px] text-navy/75">
          Every skill in the library is attributed to the person who described it, with a link back
          to where it came from. Nothing here is a generic prompt written to sound impressive —
          it&apos;s a codified version of a workflow that already worked in a real HR org.
        </p>
      </div>

      <div className="border-y border-navy/10 bg-white">
        <div className="mx-auto flex max-w-[820px] items-center gap-7 px-5 py-16 sm:px-8 md:py-20 lg:px-16">
          <Image
            src="/assets/toby-headshot.jpg"
            alt="Toby Egbuna"
            width={200}
            height={200}
            className="aspect-square w-1/4 flex-shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="mb-0.5 text-[17px] font-bold">Toby Egbuna</div>
            <div className="mb-3.5 text-sm text-navy/55">Co-founder</div>
            <p className="text-[15.5px] text-navy/75">
              Toby also co-founded{" "}
              <a
                href="https://www.chezie.co"
                className="font-semibold text-blue no-underline hover:underline"
              >
                Chezie
              </a>
              , the platform powering ERGs and employee communities at companies like Moodys,
              Airbnb, and ServiceNow.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-5 py-20 text-center sm:px-8 lg:px-16">
        <h2 className="mb-3 text-[clamp(24px,2.8vw,30px)] font-bold tracking-tight">
          Have a workflow worth sharing?
        </h2>
        <p className="mb-6 text-base text-navy/70">
          If you&apos;ve built something in your own HR org that solved a real problem, we&apos;d
          like to turn it into a skill.
        </p>
        <Link
          href="/contribute"
          className="inline-block whitespace-nowrap rounded-[9px] bg-navy px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-colors hover:bg-blue"
        >
          Contribute a skill
        </Link>
      </div>
    </>
  );
}
