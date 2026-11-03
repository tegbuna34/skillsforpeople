"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import EmailSignup from "./EmailSignup";

const DISMISS_KEY = "sfp_signup_bar_dismissed_at";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function hiddenPath(pathname: string): boolean {
  return pathname === "/people-builders" || pathname.startsWith("/people-builders/");
}

export default function SignupBar() {
  const { user } = useAuth();
  const pathname = usePathname() || "/";
  const [dismissed, setDismissed] = useState(false);
  const [formOnScreen, setFormOnScreen] = useState(pathname === "/");

  useEffect(() => {
    if (user || hiddenPath(pathname)) return;
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw && Date.now() - Number(raw) < THIRTY_DAYS) setDismissed(true);
    } catch {
      // show the bar if storage is blocked
    }
  }, [user, pathname]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-email-capture]"));
    if (nodes.length === 0) {
      setFormOnScreen(false);
      return;
    }
    const hits = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) hits.add(entry.target);
          else hits.delete(entry.target);
        }
        setFormOnScreen(hits.size > 0);
      },
      { threshold: 0.35 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  if (user || hiddenPath(pathname) || dismissed || formOnScreen) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 h-14 border-t border-navy/10 bg-white px-3">
        <div className="mx-auto flex h-full max-w-[1120px] items-center gap-2">
          <p className="hidden min-w-0 flex-1 truncate text-[14px] font-semibold text-navy sm:block">
            One free AI skill for People leaders, every Tuesday.
          </p>
          <div className="flex min-w-0 flex-1 items-center sm:max-w-md sm:flex-none">
            <EmailSignup bar cta="Send it to me" placeholder="Work email" />
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-10 w-10 shrink-0 items-center justify-center border-none bg-transparent text-2xl leading-none text-navy/70"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}