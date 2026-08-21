"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const PROMPT = `Go through my past conversations with you and find moments where I solved a real HR/people-ops problem for myself — built a framework, template, scoring model, checklist, or step-by-step process, even informally.

For each one you find, tell me:
1. What problem it solved and for whom (which HR function/vertical)
2. The actual steps I used, reconstructed in order
3. What inputs it needs to run for someone else's org (team size, tools, constraints, etc.)
4. What a "done" output looks like
5. Whether it's specific and reusable enough to publish as a skill, or too one-off

Then, for anything that qualifies, draft it as a step-by-step skill: a short description, a numbered implementation process, a definition of done, and common pitfalls — so it's ready to submit to Skills for People.`;

export default function ExtractionPromptCard() {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(PROMPT);
    setCopied(true);
    track("contribute_prompt_copy");
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <>
      <div className="relative mb-3.5">
        <div className="max-h-[110px] overflow-hidden whitespace-pre-wrap rounded-[10px] bg-navy px-4 pb-8 pt-4 font-mono text-[12.5px] leading-relaxed text-mint">
          {PROMPT}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-14 items-end justify-center rounded-b-[10px] bg-gradient-to-t from-navy from-[80%] to-transparent pb-2">
          <span className="text-[11px] font-semibold tracking-wide text-mint/60">
            Full prompt copied on click
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="cursor-pointer whitespace-nowrap rounded-[9px] border border-navy/20 bg-white py-3 text-[14.5px] font-bold text-navy"
      >
        {copied ? "Copied!" : "Copy prompt"}
      </button>
    </>
  );
}
