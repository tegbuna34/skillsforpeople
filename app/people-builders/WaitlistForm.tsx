"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import {
  AI_TOOLS,
  COMPANY_SIZES,
  HR_FUNCTIONS,
  WAITLIST_INTERESTS,
  WHO_PAYS,
} from "@/lib/program";

const inputClass =
  "w-full rounded-lg border border-navy/15 bg-white px-3.5 py-3 text-[14.5px] text-navy outline-none focus:border-navy/40";

export default function WaitlistForm({ founding = false }: { founding?: boolean }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hrFunction, setHrFunction] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [aiTools, setAiTools] = useState("");
  const [buildFirst, setBuildFirst] = useState("");
  const [whoPays, setWhoPays] = useState("");
  const [interest, setInterest] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          jobTitle,
          hrFunction,
          companySize,
          aiTools,
          buildFirst,
          whoPays,
          interest,
          founding,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setBusy(false);
        return;
      }
      if (!data.already) {
        track("waitlist_joined", { founding: founding ? "1" : "0", interest });
      }
      setMessage(data.message);
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  if (message) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white p-6 text-[16px] text-navy">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
      <Field label="First name" required>
        <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </Field>
      <Field label="Work email" required>
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field label="Job title">
        <input className={inputClass} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </Field>
      <Field label="HR function" required>
        <select className={inputClass} value={hrFunction} onChange={(e) => setHrFunction(e.target.value)} required>
          <option value="">Choose one</option>
          {HR_FUNCTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Company size">
        <select className={inputClass} value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
          <option value="">Choose one</option>
          {COMPANY_SIZES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Which does your team use?">
        <select className={inputClass} value={aiTools} onChange={(e) => setAiTools(e.target.value)}>
          <option value="">Choose one</option>
          {AI_TOOLS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field label="What would you build first?">
        <textarea
          className={inputClass}
          rows={4}
          value={buildFirst}
          onChange={(e) => setBuildFirst(e.target.value)}
        />
      </Field>
      <Field label="Who would pay?">
        <select className={inputClass} value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
          <option value="">Choose one</option>
          {WHO_PAYS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <fieldset>
        <legend className="mb-2 text-[13.5px] font-semibold text-navy">
          I’m interested in <span className="text-[#b5484d]">*</span>
        </legend>
        <div className="flex flex-col gap-2">
          {WAITLIST_INTERESTS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-[14.5px] text-navy">
              <input
                type="radio"
                name="interest"
                value={option}
                checked={interest === option}
                onChange={() => setInterest(option)}
                required
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <div className="text-[13.5px] text-[#b5484d]">{error}</div>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-[10px] bg-navy px-5 py-3.5 text-[15.5px] font-bold text-white hover:bg-blue disabled:opacity-70"
      >
        {busy ? "Joining…" : founding ? "Confirm my spot" : "Join the waitlist"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-semibold text-navy">
        {label}
        {required && <span className="text-[#b5484d]"> *</span>}
      </span>
      {children}
    </label>
  );
}
