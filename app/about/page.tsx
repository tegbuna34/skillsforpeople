import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "About",
  description:
    "Toby Egbuna on why every HR team needs a builder, and why Skills for People exists.",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-[820px] px-5 pb-6 pt-16 sm:px-8 md:pt-24 lg:px-16">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">About</div>
        <h1 className="text-[clamp(32px,4.4vw,46px)] font-bold leading-[1.12] tracking-tight">
          Every HR team needs a builder. I want it to be you.
        </h1>
      </div>

      <div className="mx-auto flex max-w-[820px] flex-col gap-6 px-5 pb-10 text-[16.5px] text-navy/80 sm:px-8 lg:px-16">
        <p>
          I&apos;m Toby Egbuna. I co-founded Chezie, an HR tech company, and I&apos;ve spent the last
          6 years building it.
        </p>
        <p>
          I was in consulting when I built the first version of our product, and I built it with
          no-code tools. Like a lot of non-technical people, I was intimidated for a long time by
          building an app, setting up an automation, or doing anything that involved the word
          &quot;code.&quot;
        </p>
        <p>
          Even as AI took off, I used ChatGPT and Claude for the same things most HR people use
          them for: emails, a thought partner, some writing. Then one day I clicked into Claude
          Code and asked Claude to teach me how to build an internal app for our product roadmap,
          because a bunch of our customers kept asking for it. It walked me through it, and I
          launched it. The whole thing took about an hour. My reaction was, &quot;This is
          incredible.&quot;
        </p>
        <p>
          Six years of building Chezie showed me how under-resourced HR teams are. They&apos;re
          short-staffed, under-budgeted, and underfunded. Now that almost every company is handing
          out ChatGPT and Claude licenses, AI is the great equalizer for those teams. The resources
          are there. What&apos;s missing is the know-how.
        </p>
        <p>
          I think every company should have someone on the team who acts as its internal product
          manager and internal builder. That person takes the problems the team has lived with for
          years and solves them with automations, custom apps, reusable skills, and AI. People
          Builders exists to make you that person, for yourself and for your team.
        </p>
        <p>
          Chezie has one product manager, and it&apos;s me. That&apos;s enough. With me as head of
          product and primary builder, we&apos;ve grown to $1 million in revenue and work with
          customers like Airbnb, the NBA, and ServiceNow. A lot of that, especially in the last
          couple of years, comes from using AI to turn things that used to be way too technical for
          me into things I can do.
        </p>
        <p>
          I&apos;m not an HR expert, and I won&apos;t teach you HR. You already know your job. Every
          skill in the library starts with something an HR leader shared publicly, in a talk, a
          post, or a podcast. I turn it into a skill you can run, and I credit them on the page.
        </p>
      </div>

      <div className="border-y border-navy/10 bg-white">
        <div className="mx-auto flex max-w-[820px] items-center gap-7 px-5 py-12 sm:px-8 lg:px-16">
          <Image
            src="/assets/toby-headshot.jpg"
            alt="Toby Egbuna"
            width={200}
            height={200}
            className="aspect-square w-24 flex-shrink-0 rounded-full object-cover sm:w-32"
          />
          <div>
            <div className="text-[17px] font-bold">Toby Egbuna, Founder, Skills for People</div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14.5px] font-semibold">
              <a
                href="https://www.linkedin.com/in/tobyegbuna"
                className="text-blue no-underline hover:underline"
              >
                LinkedIn
              </a>
              <a href="https://chezie.co" className="text-blue no-underline hover:underline">
                Chezie
              </a>
              <a
                href="mailto:toby@tobyegbuna.com"
                className="text-blue no-underline hover:underline"
              >
                toby@tobyegbuna.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[560px] px-5 py-16 sm:px-8 lg:px-16">
        <h2 className="mb-4 text-[clamp(24px,2.8vw,30px)] font-bold tracking-tight">
          Get one free skill every week.
        </h2>
        <EmailSignup cta="Get this week's skill →" placeholder="Your work email" />
        <p className="mt-6 text-[15.5px] text-navy/75">
          Want to be your team&apos;s builder?{" "}
          <Link href="/people-builders" className="font-semibold text-blue no-underline hover:underline">
            See People Builders →
          </Link>
        </p>
      </div>
    </>
  );
}
