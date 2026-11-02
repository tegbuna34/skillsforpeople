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
  const [visible, setVisible] = useState(() => !user && !hiddenPath(pathname));

  useEffect(() => {
    if (user || hiddenPath(pathname)) {
      setVisible(false);
      return;
    }
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw && Date.now() - Number(raw) < THIRTY_DAYS) {
        setVisible(false);
        return;
      }
    } catch {
      // show the bar if storage is blocked
    }
    setVisible(true);
  }, [user, pathname]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="h-[72px]" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 h-[72px] border-t border-navy/10 bg-white px-3">
        <div className="mx-auto flex h-full max-w-[1180px] items-center gap-2">
          <p className="hidden min-w-0 flex-1 truncate text-[14px] font-semibold text-navy sm:block">
            One free AI skill for HR, every Tuesday.
          </p>
          <div className="flex min-w-0 flex-1 items-center sm:max-w-md sm:flex-none">
            <EmailSignup bar cta="Send" placeholder="Work email" />
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-11 w-11 shrink-0 items-center justify-center border-none bg-transparent text-2xl leading-none text-navy/55"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
