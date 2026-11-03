"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useAuth } from "@/components/AuthContext";
import EmailSignup from "@/components/EmailSignup";

export default function DetailActions({
  slug,
  vertical,
  hasSkillFile,
  hasPromptFile,
  promptText,
  compatibleTools,
}: {
  slug: string;
  vertical: string;
  hasSkillFile: boolean;
  hasPromptFile: boolean;
  promptText: string;
  compatibleTools: string[];
}) {
  const { user, openLogin } = useAuth();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compatText =
    compatibleTools.length > 0 ? compatibleTools.join(", ") : "ChatGPT, Claude, Other";

  async function download(format: "skill" | "md" | "copy") {
    setError(null);
    setBusy(format);
    try {
      const res = await fetch(`/api/skills/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });
      if (res.status === 401) {
        openLogin("library");
        return;
      }
      if (!res.ok) throw new Error("download failed");

      if (format === "copy") {
        const data = (await res.json()) as { text?: string };
        const text = data.text || promptText;
        if (!text) throw new Error("empty");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        track("skill_copy_prompt", { slug, vertical, source: "file" });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slug}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      track("skill_download", { slug, vertical, format });
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(null);
    }
  }

  if (!user) {
    return (
      <aside className="min-w-[260px] flex-1 basis-[300px] rounded-2xl border border-navy/10 bg-white p-6 shadow-cardLg">
        <div className="mb-1 flex items-center justify-center gap-2 text-[15px] font-bold text-navy">
          <LockIcon />
          Get this skill free
        </div>
        <p className="mb-4 text-center text-[13.5px] text-navy/65">
          Enter your email and I’ll send you a sign-in link. Click it and you’ll come
          back to this page with the download ready.
        </p>
        <EmailSignup
          cta="Send my link"
          placeholder="you@company.com"
          finePrint="You’ll also get one new skill every Tuesday. Unsubscribe anytime."
          compact
        />
      </aside>
    );
  }

  return (
    <aside className="min-w-[260px] flex-1 basis-[300px] rounded-2xl border border-navy/10 bg-white p-6 shadow-cardLg">
      <div className="mb-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => void download("skill")}
          disabled={!hasSkillFile || busy !== null}
          className="cursor-pointer whitespace-nowrap rounded-[9px] border-none bg-navy px-4 py-3 text-center text-[14.5px] font-bold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "skill" ? "Preparing…" : "Download skill"}
        </button>
        <div className="text-center text-[12.5px] text-navy/50">
          Upload the file to your AI of choice as a custom skill or instructions.
        </div>
        {error && <div className="text-center text-[13px] text-[#b5484d]">{error}</div>}
      </div>

      <div className="flex justify-center gap-4 border-t border-navy/10 pt-3.5">
        <button
          type="button"
          onClick={() => void download("copy")}
          disabled={(!hasPromptFile && !promptText) || busy !== null}
          className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13.5px] font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? "Copied!" : "Copy prompt"}
        </button>
        <button
          type="button"
          onClick={() => void download("md")}
          disabled={!hasPromptFile || busy !== null}
          className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13.5px] font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
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
      <div className="mt-4 border-t border-navy/10 pt-3.5 text-[13px] text-navy/70">
        Want to build tools like this yourself?{" "}
        <Link href="/people-builders" className="font-semibold text-blue no-underline hover:underline">
          See People Builders →
        </Link>
      </div>
    </aside>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
