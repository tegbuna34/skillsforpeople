"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do you gather the skills?",
    a: "Every skill comes from a real HR practitioner, most surfaced through interviews on HR podcasts. We take an actual workflow someone built and turn it into something you can use, not a generic AI prompt.",
  },
  {
    q: "How often do skills get added?",
    a: "New skills go up every week!",
  },
  {
    q: "Do you offer discounts?",
    a: "Teams of 5 or more get 20% off the individual price automatically.",
  },
  {
    q: "Do I need a specific AI tool to use these?",
    a: "Nope! If you're on Claude, download the skill file directly. If you're using ChatGPT or another tool, grab the plain-prompt version instead — just copy it in and go.",
  },
  {
    q: "How is this different from just asking ChatGPT or Claude myself?",
    a: "You could absolutely use ChatGPT or Claude to work through HR challenges on your own. The difference with Skills for People is that you're not starting from zero. Every skill here is pre-vetted, already validated inside a real HR department at a real company. You get to take what's already working and tailor it to your team instead of building it from scratch.",
  },
];

export default function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q} className="border-t border-navy/10 last:border-b">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent py-5 text-left"
            >
              <span className="text-[15.5px] font-bold text-navy">{faq.q}</span>
              <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-navy/30 text-[15px] leading-none text-navy">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="mb-6 max-w-[680px] text-[14.5px] text-navy/75">{faq.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
