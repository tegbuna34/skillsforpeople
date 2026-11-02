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
      <div className="h-24 sm:h-20" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 text-[14.5px] font-semibold text-navy">
            One free AI skill for HR, every Tuesday.
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <EmailSignup cta="Send it to me" placeholder="Work email" inline />
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="border-none bg-transparent px-2 text-xl leading-none text-navy/45"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
