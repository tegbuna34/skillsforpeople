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
          I’m Toby Egbuna. In 2021, I co-founded Chezie, an HR-tech platform for managing internal
          communities.
        </p>
        <p>
          When I started Chezie, I wasn’t technical. Like most non-technical people, I was
          intimidated for a long time by building an app, setting up an automation, or doing
          anything that involved the word “code.”
        </p>
        <p>
          What I was, though, was resourceful. So I built the first version of Chezie by myself in a
          no-code platform. Today, we work with customers like Airbnb and the NBA, and though we’ve
          since brought on an engineering team, I still lead our technical work, using AI to turn
          things that used to be way too technical for me into things I can do.
        </p>
        <p>
          As AI exploded, I mostly used it for the same things most People leaders use it for:
          handling emails, acting as a thought partner for strategic work, maybe to draft a document
          to share externally. I knew it could handle coding for me, but talked myself out of using
          it because I’m not “technical.”
        </p>
        <p>
          Then one day I clicked into Claude Code and asked Claude to teach me how to build an
          internal app for our product roadmap, because a bunch of our customers kept asking for it.
          It took a few hours of back-and-forth, but that night, I got it live.
        </p>
        <hr className="border-0 border-t border-navy/15" />
        <p>
          Having spoken to over 1,000 HR and People leaders since launching Chezie, I’ve seen just
          how under-resourced these teams are.
        </p>
        <p>
          However, now that almost every company is handing out ChatGPT and Claude licenses, things
          are changing. AI is the great equalizer for any team that didn’t have the resources to
          build an automation that saves hours every week, or a custom internal app that answers
          employees’ questions. The resources are finally here. What’s missing is the know-how.
        </p>
        <p>
          Every company should and will have someone on the team who acts as its internal product
          manager and internal builder. That person takes the problems the team has lived with for
          years and solves them with automations, custom apps, reusable skills, and AI. People
          Builders exists to make you that person, for yourself and for your team.
        </p>
        <p>
          I’ve been building HR tech for years. I know the work, and I know how to build for it with
          AI. People Builders teaches you to do the same, so you become the person your team goes to
          when something needs building.
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
        <EmailSignup cta="Get this week’s skill →" placeholder="Your work email" />
        <p className="mt-6 text-[15.5px] text-navy/75">
          Want to be your team’s builder?{" "}
          <Link href="/people-builders" className="font-semibold text-blue no-underline hover:underline">
            See People Builders →
          </Link>
        </p>
      </div>
    </>
  );
}
