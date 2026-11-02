"use client";

import { useState } from "react";

const NOTE = `Hi [manager], I'd like to join People Builders, a 4-week live program that teaches HR teams to build with the Claude or ChatGPT licenses we already have. It costs $2,500. I'd spend about 2 hours a week in sessions and come out with two automated workflows and two apps for our team, starting with [workflow], which takes us about [hours] a week today. Can we use L&D budget for this? Details: skillsforpeople.com/people-builders`;

export default function CopyNote() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(NOTE);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-2xl border border-navy/10 bg-mint p-5">
      <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-navy/80">{NOTE}</p>
      <button
        type="button"
        onClick={() => void copy()}
        className="mt-4 rounded-lg bg-navy px-4 py-2.5 text-[14px] font-bold text-white hover:bg-blue"
      >
        {copied ? "Copied" : "Copy note"}
      </button>
    </div>
  );
}
