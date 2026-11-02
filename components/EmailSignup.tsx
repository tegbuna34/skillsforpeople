"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { isAuthConfigured, supabaseBrowser } from "@/lib/supabase/browser";
import { entryPoint, readAttribution } from "@/lib/attribution";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function EmailSignup({
  cta,
  finePrint,
  placeholder = "Your work email",
  compact = false,
  inline = false,
}: {
  cta: string;
  finePrint?: string;
  placeholder?: string;
  compact?: boolean;
  inline?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    setError(null);
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isAuthConfigured()) {
      setError("Accounts open soon. Check back in a few days.");
      return;
    }

    setBusy(true);
    const next = window.location.pathname + window.location.search;
    const attribution = readAttribution();
    const { error: otpError } = await supabaseBrowser().auth.signInWithOtp({
      email: value,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        data: {
          signup_source: attribution?.source ?? null,
          entry_point: entryPoint(window.location.pathname, attribution?.medium ?? null),
          source_video: attribution?.content ?? null,
        },
      },
    });
    setBusy(false);

    if (otpError) {
      const message = otpError.message || "";
      setError(
        /rate|too many|security purposes/i.test(message)
          ? "Too many attempts. Wait a minute and try again."
          : "Something went wrong. Try again."
      );
      return;
    }

    track("signup_link_sent", { path: window.location.pathname });
    setSentTo(value);
  }

  if (sentTo) {
    return (
      <div className="rounded-xl border border-navy/10 bg-white px-4 py-3.5 text-[14.5px] text-navy/80">
        <div className="mb-1 font-bold text-navy">Check your email</div>
        <p>
          I sent a sign-in link to <span className="font-semibold text-navy">{sentTo}</span> from
          toby@tobyegbuna.com. Open it on this device and you&apos;ll land back where you were.
        </p>
        <p className="mt-2 text-[13px] text-navy/60">
          Didn&apos;t get it? Check spam, or{" "}
          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy}
            className="font-semibold text-blue underline-offset-2 hover:underline disabled:opacity-60"
          >
            {busy ? "sending it again…" : "send it again"}
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      noValidate
      className={inline ? "flex flex-col gap-2 sm:flex-row sm:items-center" : "flex flex-col gap-2.5"}
    >
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={placeholder}
        aria-label={placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={`rounded-lg border border-navy/15 bg-white px-3.5 py-3 text-[14.5px] text-navy outline-none focus:border-navy/40 ${
          inline ? "w-full sm:min-w-[220px]" : "w-full"
        }`}
      />
      {error && !inline && <div className="text-[13px] text-[#b5484d]">{error}</div>}
      <button
        type="submit"
        disabled={busy}
        className={`rounded-[10px] bg-navy font-bold text-white transition-colors hover:bg-blue disabled:opacity-70 ${
          inline ? "whitespace-nowrap px-4 py-3 text-[14.5px]" : compact ? "w-full px-4 py-3 text-[14.5px]" : "w-full px-4 py-3.5 text-[15.5px]"
        }`}
      >
        {busy ? "Sending…" : cta}
      </button>
      {error && inline && <div className="text-[13px] text-[#b5484d] sm:basis-full">{error}</div>}
      {finePrint && (
        <div className="text-center text-[12.5px] leading-snug text-navy/55 sm:basis-full">{finePrint}</div>
      )}
    </form>
  );
}
