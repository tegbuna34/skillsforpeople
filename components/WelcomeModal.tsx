"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { COMPANY_SIZES, HR_FUNCTIONS } from "@/lib/program";
import { WELCOME_COOKIE } from "@/lib/auth-cookies";

const DONE_KEY = "sfp_welcome_done";

export default function WelcomeModal({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [hrFunction, setHrFunction] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [wantsToBuild, setWantsToBuild] = useState("");
  const [programInterest, setProgramInterest] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DONE_KEY) === "1") setOpen(false);
    } catch {
      // ignore
    }
  }, []);

  if (!open) return null;

  function finish() {
    try {
      localStorage.setItem(DONE_KEY, "1");
    } catch {
      // ignore
    }
    document.cookie = `${WELCOME_COOKIE}=; path=/; max-age=0`;
    setOpen(false);
  }

  async function save(skip: boolean) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          skip
            ? { skip: true }
            : { hrFunction, companySize, wantsToBuild, programInterest }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError("Something went wrong. You can skip for now.");
        setBusy(false);
        return;
      }
      if (!skip && data.ok) track("welcome_answers_saved");
      if (!skip && data.degraded) {
        setError("I couldn’t store those answers yet. You can skip for now.");
        setBusy(false);
        return;
      }
      finish();
    } catch {
      setError("Network error. You can skip for now.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy/55 px-5 py-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white px-7 pb-6 pt-8 shadow-cardLg"
      >
        <h2 id="welcome-title" className="mb-2 text-2xl font-bold tracking-tight text-navy">
          You’re in. Your skill is ready.
        </h2>
        <p className="mb-5 text-[14.5px] text-navy/70">
          Three quick questions so I send you skills that fit your job. All optional.
        </p>

        <div className="mb-4">
          <div className="mb-2 text-[13.5px] font-semibold text-navy">What’s your HR function?</div>
          <div className="flex flex-wrap gap-2">
            {HR_FUNCTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHrFunction(option === hrFunction ? "" : option)}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${
                  hrFunction === option
                    ? "border-navy bg-navy text-white"
                    : "border-navy/15 bg-white text-navy"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[13.5px] font-semibold text-navy">How big is your company?</div>
          <div className="flex flex-wrap gap-2">
            {COMPANY_SIZES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCompanySize(option === companySize ? "" : option)}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${
                  companySize === option
                    ? "border-navy bg-navy text-white"
                    : "border-navy/15 bg-white text-navy"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-[13.5px] font-semibold text-navy">
            If you could build one tool for your team, what would it do?
          </span>
          <textarea
            value={wantsToBuild}
            onChange={(event) => setWantsToBuild(event.target.value)}
            placeholder="e.g. turn interview notes into scorecards"
            rows={3}
            className="w-full rounded-lg border border-navy/15 bg-mint px-3.5 py-3 text-[14.5px] text-navy outline-none focus:border-navy/40"
          />
        </label>

        <label className="mb-5 flex items-start gap-2.5 text-[14px] text-navy">
          <input
            type="checkbox"
            checked={programInterest}
            onChange={(event) => setProgramInterest(event.target.checked)}
            className="mt-1"
          />
          <span>Tell me when People Builders opens</span>
        </label>

        {error && <div className="mb-3 text-[13px] text-[#b5484d]">{error}</div>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => void save(false)}
            className="flex-1 rounded-[10px] bg-navy px-4 py-3 text-[15px] font-bold text-white hover:bg-blue disabled:opacity-70"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void save(true)}
            className="rounded-[10px] border border-navy/20 bg-white px-4 py-3 text-[15px] font-semibold text-navy hover:bg-mint disabled:opacity-70"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
