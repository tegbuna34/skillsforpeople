"use client";

import { useAuth } from "@/components/AuthContext";

// Centered "Login to see the rest of this skill" panel that overlays the
// blurred body content. Rendered inside a `relative` wrapper by the parent
// page so it positions over the (aria-hidden) body.
export default function BodyLockOverlay() {
  const { openLogin } = useAuth();
  return (
    <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-16">
      <div className="pointer-events-auto max-w-md rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-cardLg">
        <div className="mb-2 flex items-center justify-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-blue">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" />
          </svg>
          Free to unlock
        </div>
        <h3 className="mb-3 text-2xl font-bold tracking-tight text-navy">
          Login to see the rest of this skill
        </h3>
        <p className="mb-5 text-[14.5px] text-navy/70">
          Name + email and the whole skill unlocks — including the process
          steps, definition of done, and download. No password.
        </p>
        <button
          type="button"
          onClick={openLogin}
          className="rounded-lg bg-navy px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-blue"
        >
          Unlock the library
        </button>
      </div>
    </div>
  );
}
