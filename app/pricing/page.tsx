import type { Metadata } from "next";
import PricingFaq from "./PricingFaq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Plans for one-person People departments, enterprise orgs, and everything in between.",
};

const tiers = [
  {
    name: "Free",
    eyebrow: "Get a feel for the library",
    price: "$0",
    cadence: "",
    subnote: "1 skill per month",
    desc: "Download one new skill each month at no cost — enough to try the library before committing to it.",
  },
  {
    name: "Individual",
    eyebrow: "For a single practitioner",
    price: "$300",
    cadence: "/ person / year",
    subnote: "Full library access",
    desc: "Unlimited access to every skill in the library, for one person, for a year.",
  },
  {
    name: "Team",
    eyebrow: "5+ seats",
    price: "$250",
    cadence: "/ person / year",
    subnote: "Buy for your team and save",
    desc: "Full library access for your whole team, at a discount for 5 or more seats.",
  },
];

export default function PricingPage() {
  return (
    <>
      <div className="mx-auto max-w-[820px] px-5 pb-10 pt-16 text-center sm:px-8 md:pt-24 lg:px-16">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
          Pricing
        </div>
        <h1 className="mb-5 text-[clamp(32px,4.4vw,46px)] font-bold leading-[1.12] tracking-tight">
          Unlimited access to all skills
        </h1>
        <p className="mx-auto max-w-[560px] text-[17px] text-navy/75">
          Plans for one-person People departments, enterprise orgs, and everything in between.
        </p>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 md:pb-20 lg:px-16">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl border border-navy/10 bg-white p-8 transition-shadow hover:shadow-[0_10px_26px_rgba(36,54,110,0.08)]"
            >
              <div className="mb-1.5 text-[15px] font-bold">{tier.name}</div>
              <div className="mb-6 text-[13.5px] text-navy/65">{tier.eyebrow}</div>
              <div className="mb-1.5 flex items-baseline gap-1.5">
                <span className="text-[40px] font-extrabold tracking-tight">{tier.price}</span>
                <span className="text-[14.5px] text-navy/55">{tier.cadence}</span>
              </div>
              <div className="mb-6 min-h-[18px] text-[13px] text-navy/50">{tier.subnote}</div>
              <p className="mb-7 flex-1 text-[14.5px] text-navy/75">{tier.desc}</p>
              <div className="rounded-[9px] bg-blue/10 py-3 text-center text-[13.5px] font-bold uppercase tracking-wider text-blue">
                Coming soon
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-5 pb-20 pt-6 sm:px-8 md:pb-24 lg:px-16">
        <div className="mb-10 text-center">
          <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
            FAQs
          </div>
          <h2 className="text-[clamp(28px,3.4vw,36px)] font-bold leading-[1.15] tracking-tight">
            Frequently-asked questions
          </h2>
        </div>
        <PricingFaq />
      </div>
    </>
  );
}
