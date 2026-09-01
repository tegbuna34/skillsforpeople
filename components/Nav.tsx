"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Final nav on every page: logo · About · Work with us · Browse the library · Login/account.
// "Contribute" moved to an inline link on /skills. Pricing has no nav link.
const links = [
  { href: "/about", label: "About" },
  { href: "/work-with-us", label: "Work with us" },
  { href: "/skills", label: "Browse the library" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, openLogin, logout } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 bg-mint/90 px-5 py-5 backdrop-blur sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center" aria-label="Skills for People — home">
          <Image
            src="/assets/logo-wordmark.svg"
            alt="Skills for People"
            width={200}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 nav:flex lg:gap-8">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[15px] ${active ? "font-bold text-blue" : "font-medium text-navy"}`}
              >
                {l.label}
              </Link>
            );
          })}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-medium text-navy">
                Hi, {user.firstName || "there"}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="whitespace-nowrap rounded-lg border border-navy/20 bg-white px-4 py-2 text-[14px] font-semibold text-navy transition-colors hover:bg-mint"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="whitespace-nowrap rounded-lg bg-navy px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue"
            >
              Login
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 nav:hidden">
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="whitespace-nowrap rounded-lg border border-navy/20 bg-white px-3 py-2 text-[13px] font-semibold text-navy"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-[14px] font-semibold text-white"
            >
              Login
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-stretch justify-center gap-[5px] border-none bg-transparent p-0"
          >
            <span className="block h-[2px] w-full bg-navy" />
            <span className="block h-[2px] w-full bg-navy" />
            <span className="block h-[2px] w-full bg-navy" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <Image
              src="/assets/logo-wordmark-reversed.svg"
              alt="Skills for People"
              width={200}
              height={28}
              className="h-7 w-auto"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="border-none bg-transparent p-0 text-[30px] leading-none text-white"
            >
              ×
            </button>
          </div>
          <div className="mt-10 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-t border-white/10 py-4 text-xl font-semibold text-white"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-white">
                <span className="text-lg font-semibold">
                  Hi, {user.firstName || "there"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void logout();
                  }}
                  className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLogin();
                }}
                className="mt-6 block rounded-lg bg-white py-3.5 text-center text-base font-bold text-navy"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
