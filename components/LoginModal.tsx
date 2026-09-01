"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal() {
  const { isLoginOpen, closeLogin, setUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [returningEmail, setReturningEmail] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [returningError, setReturningError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoginOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isLoginOpen, closeLogin]);

  useEffect(() => {
    if (isLoginOpen) return;
    // Reset on close.
    setFullName("");
    setSignupEmail("");
    setReturningEmail("");
    setSignupError(null);
    setReturningError(null);
    setBusy(false);
  }, [isLoginOpen]);

  if (!isLoginOpen) return null;

  async function handleSignup() {
    setSignupError(null);
    const name = fullName.trim();
    const email = signupEmail.trim();
    if (!name) return setSignupError("Enter your name.");
    if (!EMAIL_RE.test(email)) return setSignupError("Enter a valid email.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignupError(data.error ?? "Something went wrong.");
      } else {
        setUser(data.user);
        closeLogin();
        router.refresh();
      }
    } catch {
      setSignupError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin() {
    setReturningError(null);
    const email = returningEmail.trim();
    if (!EMAIL_RE.test(email)) return setReturningError("Enter a valid email.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReturningError(data.error ?? "Something went wrong.");
        if (res.status === 404) setSignupEmail(email);
      } else {
        setUser(data.user);
        closeLogin();
        router.refresh();
      }
    } catch {
      setReturningError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={closeLogin}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/50 px-5 py-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-cardLg"
      >
        <button
          type="button"
          onClick={closeLogin}
          aria-label="Close"
          className="absolute right-4 top-3 border-none bg-transparent p-1 text-[26px] leading-none text-navy/50 hover:text-navy"
        >
          ×
        </button>

        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-blue">
          Free access
        </div>
        <h2
          id="login-modal-title"
          className="mb-2 text-2xl font-bold tracking-tight text-navy"
        >
          Unlock the library
        </h2>
        <p className="mb-6 text-[14.5px] text-navy/70">
          Enter your information below to get full access to Skills for People,
          100% free.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSignup();
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={busy}
            className="w-full rounded-lg border border-navy/15 bg-mint px-3.5 py-3 text-[14.5px] text-navy outline-none focus:border-navy/40"
          />
          <input
            type="email"
            placeholder="Work email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            disabled={busy}
            className="w-full rounded-lg border border-navy/15 bg-mint px-3.5 py-3 text-[14.5px] text-navy outline-none focus:border-navy/40"
          />
          {signupError && (
            <div className="text-[13px] text-[#b5484d]">{signupError}</div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-navy px-4 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue disabled:opacity-70"
          >
            {busy ? "Unlocking…" : "Unlock the library"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-navy/10" />
          <span className="text-xs font-semibold text-navy/40">OR</span>
          <div className="h-px flex-1 bg-navy/10" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleLogin();
          }}
        >
          <div className="mb-2.5 text-[13.5px] font-semibold text-navy">
            Already signed up? Just enter your email.
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@company.com"
              value={returningEmail}
              onChange={(e) => setReturningEmail(e.target.value)}
              disabled={busy}
              className="min-w-0 flex-1 rounded-lg border border-navy/15 bg-mint px-3.5 py-3 text-[14px] text-navy outline-none focus:border-navy/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="whitespace-nowrap rounded-lg border border-navy/20 bg-white px-4.5 text-[14px] font-bold text-navy transition-colors hover:bg-mint disabled:opacity-70"
            >
              Log in
            </button>
          </div>
          {returningError && (
            <div className="mt-2 text-[13px] text-[#b5484d]">
              {returningError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
