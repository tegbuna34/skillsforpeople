"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export default function ContributorActions({
  firstName,
  skillCount,
  slug,
}: {
  firstName: string;
  skillCount: number;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  const getLabel =
    skillCount === 1 ? `Get ${firstName}'s skill` : `Get all of ${firstName}'s skills`;

  const scrollToSkills = () => {
    document.getElementById("skills")?.scrollIntoView({ behavior: "smooth", block: "start" });
    track("contributor_get_all", { slug });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      track("contributor_share", { slug });
    } catch {
      // Clipboard access can fail (insecure context, permissions). Fail silently
      // — the user can still copy the URL from the address bar.
    }
  };

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={scrollToSkills}
        className="cursor-pointer whitespace-nowrap rounded-[9px] border-none bg-navy px-[22px] py-[13px] text-[14.5px] font-bold text-white transition-colors hover:bg-blue"
      >
        {getLabel}
      </button>
      <button
        type="button"
        onClick={share}
        className="cursor-pointer whitespace-nowrap rounded-[9px] border border-navy/20 bg-white px-[22px] py-[13px] text-[14.5px] font-bold text-navy transition-colors hover:border-navy"
      >
        {copied ? "Link copied" : "Share profile"}
      </button>
    </div>
  );
}
