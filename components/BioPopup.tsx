"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import EmailSignup from "./EmailSignup";

const SEEN_KEY = "sfp_bio_popup_seen";

export default function BioPopup() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) return;
    const medium = new URLSearchParams(window.location.search).get("utm_medium");
    if (medium !== "bio") return;
    try {
      if (localStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, [user]);

  if (!open || user) return null;

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }

  return (
    <div
      role="presentation"
      onClick={close}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/55 px-5 py-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bio-popup-title"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[440px] rounded-2xl bg-white px-8 pb-7 pt-9 shadow-cardLg"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 h-11 w-11 border-none bg-transparent text-[26px] leading-none text-navy/50"
        >
          ×
        </button>
        <h2 id="bio-popup-title" className="mb-2 text-2xl font-bold tracking-tight text-navy">
          Came from LinkedIn?
        </h2>
        <p className="mb-5 text-[14.5px] text-navy/70">
          Get the skill I posted about, plus one new skill every Tuesday.
        </p>
        <EmailSignup cta="Send it to me" placeholder="Your work email" compact />
      </div>
    </div>
  );
}
