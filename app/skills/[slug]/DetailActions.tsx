"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DetailActions({
  slug,
  vertical,
  skillFileUrl,
  promptFileUrl,
  promptMarkdown,
  compatibleTools,
}: {
  slug: string;
  vertical: string;
  skillFileUrl: string | null;
  promptFileUrl: string | null;
  promptMarkdown: string;
  compatibleTools: string[];
}) {
  const [copied, setCopied] = useState(false);

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 1800);
  };

  const onCopy = async () => {
    if (!promptMarkdown) return;
    await navigator.clipboard.writeText(promptMarkdown);
    flash(setCopied);
    track("skill_copy_prompt", { slug, vertical });
  };

  const onDownloadSkill = () => {
    if (skillFileUrl) {
      track("skill_download", { slug, vertical, format: "skill" });
      window.location.href = skillFileUrl;
      return;
    }
    // Fall back to a generated .md-as-.skill so the button never leads nowhere
    // when the file URL isn't populated. This mirrors the mock's behavior.
    if (promptMarkdown) {
      downloadText(`${slug}.skill`, promptMarkdown);
      track("skill_download", { slug, vertical, format: "skill-generated" });
    }
  };

  const onDownloadMd = () => {
    if (promptFileUrl) {
      track("skill_download", { slug, vertical, format: "md" });
      window.location.href = promptFileUrl;
      return;
    }
    if (promptMarkdown) {
      downloadText(`${slug}.md`, promptMarkdown);
      track("skill_download", { slug, vertical, format: "md-generated" });
    }
  };

  const canSkill = Boolean(skillFileUrl || promptMarkdown);
  const canMd = Boolean(promptFileUrl || promptMarkdown);
  const canCopy = Boolean(promptMarkdown);

  const compatText =
    compatibleTools.length > 0 ? compatibleTools.join(", ") : "ChatGPT, Claude, Other";

  return (
    <aside className="min-w-[260px] flex-1 basis-[300px] rounded-2xl border border-navy/10 bg-white p-6 shadow-cardLg">
      <div className="mb-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onDownloadSkill}
          disabled={!canSkill}
          className="cursor-pointer whitespace-nowrap rounded-[9px] border-none bg-navy px-4 py-3 text-center text-[14.5px] font-bold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download skill
        </button>
        <div className="text-center text-[12.5px] text-navy/50">
          Upload the file to your AI of choice as a custom skill/instructions.
        </div>
      </div>

      <div className="flex justify-center gap-4 border-t border-navy/10 pt-3.5">
        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13.5px] font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy prompt"}
        </button>
        <button
          type="button"
          onClick={onDownloadMd}
          disabled={!canMd}
          className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13.5px] font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />
          </svg>
          Download .md
        </button>
      </div>

      <div className="mt-4 flex justify-between border-t border-navy/10 pt-3.5 text-[12.5px] text-navy/50">
        <span>Format</span>
        <span className="font-semibold text-navy">.skill / .md</span>
      </div>
      <div className="mt-1.5 flex justify-between text-[12.5px] text-navy/50">
        <span>Compatible with</span>
        <span className="text-right font-semibold text-navy">{compatText}</span>
      </div>
    </aside>
  );
}
