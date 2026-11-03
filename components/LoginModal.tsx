"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth, type LoginMode } from "./AuthContext";
import EmailSignup from "./EmailSignup";

const COPY: Record<LoginMode, { heading: string; body: string; cta: string; finePrint?: string }> = {
  nav: {
    heading: "Log in or sign up",
    body: "New or returning, you’ll get the same sign-in link.",
    cta: "Send my sign-in link",
    finePrint: "You’ll also get one new skill every Tuesday. Unsubscribe anytime.",
  },
  library: {
    heading: "Get the full library free",
    body: "Enter your email and I’ll send you a sign-in link. No password.",
    cta: "Send my sign-in link",
    finePrint: "You’ll also get one new skill every Tuesday. Unsubscribe anytime.",
  },
  second: {
    heading: "Want this one too?",
    body: "Make a free account and you can read and download every skill in the library. All it takes is your email.",
    cta: "Send my sign-in link",
  },
};

export default function LoginModal() {
  const { isLoginOpen, closeLogin, loginMode, loginExpired } = useAuth();
  const openedAt = useRef(0);

  useEffect(() => {
    if (!isLoginOpen) return;
    openedAt.current = Date.now();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isLoginOpen, closeLogin]);

  function dismissFromBackdrop() {
    // The tap that opened the popup can land on the backdrop. Ignore it.
    if (Date.now() - openedAt.current < 700) return;
    closeLogin();
  }

  if (!isLoginOpen) return null;

  const copy = COPY[loginMode];

  return (
    <div
      role="presentation"
      onClick={dismissFromBackdrop}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/55 px-4 py-4 sm:items-center sm:px-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-cardLg"
      >
        <div className="flex shrink-0 items-center justify-end px-2 pt-2">
          <button
            type="button"
            onClick={closeLogin}
            aria-label="Close"
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-navy/15 bg-white text-[26px] leading-none text-navy"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-7">
        <h2 id="login-modal-title" className="mb-2 pr-2 text-2xl font-bold tracking-tight text-navy">
          {copy.heading}
        </h2>
        {loginExpired ? (
          <p className="mb-5 text-[14.5px] text-[#b5484d]">
            That link expired. Enter your email and I’ll send a new one.
          </p>
        ) : (
          <p className="mb-5 text-[14.5px] text-navy/70">{copy.body}</p>
        )}
        <EmailSignup
          cta={copy.cta}
          finePrint={copy.finePrint}
          placeholder="you@company.com"
          compact
        />
        {loginMode === "second" && (
          <Link
            href="/skills"
            onClick={closeLogin}
            className="mt-4 block text-center text-[14px] font-semibold text-navy/70 no-underline hover:underline"
          >
            Back to the library
          </Link>
        )}
        </div>
      </div>
    </div>
  );
}
