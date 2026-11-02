"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const sharedLinks = [
  { href: "/people-builders", label: "People Builders" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, openLogin, logout } = useAuth();

  const links = user
    ? [{ href: "/skills", label: "Skill Library" }, ...sharedLinks]
    : sharedLinks;

  // Close only after a real navigation. The first pathname update on load
  // (null, then the URL) was clearing the menu and eating the first tap.
  const pathRef = useRef<string | null>(null);
  useEffect(() => {
    if (pathRef.current && pathRef.current !== pathname) {
      setOpen(false);
      setAccountOpen(false);
    }
    pathRef.current = pathname;
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
      <div className="sticky top-0 z-10 flex flex-nowrap items-center justify-between gap-2 border-b border-navy/10 bg-mint/95 px-4 py-2.5 touch-manipulation sm:px-8 sm:py-4 lg:px-16">
        <Link href="/" className="flex min-w-0 items-center" aria-label="Skills for People home">
          <Image
            src="/assets/logo-wordmark.svg"
            alt="Skills for People"
            width={200}
            height={28}
            className="h-6 w-auto max-w-[42vw] nav:h-7 nav:max-w-none"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 nav:flex lg:gap-8">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] ${active ? "font-bold text-blue" : "font-medium text-navy"}`}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="whitespace-nowrap rounded-lg border border-navy/20 bg-white px-4 py-2 text-[14px] font-semibold text-navy"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                {user.firstName || "Account"}
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[160px] rounded-xl border border-navy/10 bg-white p-1.5 shadow-cardLg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      void logout();
                    }}
                    className="w-full rounded-lg px-3.5 py-2.5 text-left text-[14.5px] font-semibold text-navy hover:bg-navy/5"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openLogin("nav")}
              className="whitespace-nowrap rounded-lg bg-navy px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue"
            >
              Log in / Sign up
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 nav:hidden">
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="whitespace-nowrap rounded-lg border border-navy/20 bg-white px-2.5 py-2 text-[13px] font-semibold text-navy"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openLogin("nav")}
              aria-label="Log in or sign up"
              className="whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-[13px] font-semibold text-white"
            >
              Log in
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-11 w-11 touch-manipulation flex-col items-center justify-center gap-[5px] border-none bg-transparent p-0"
          >
            <span className="block h-[2px] w-5 bg-navy" />
            <span className="block h-[2px] w-5 bg-navy" />
            <span className="block h-[2px] w-5 bg-navy" />
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
              className="flex h-11 w-11 items-center justify-center border-none bg-transparent text-[30px] leading-none text-white"
            >
              ×
            </button>
          </div>
          <div className="mt-10 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-t border-white/10 py-4 text-xl font-semibold text-white"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLogin("nav");
                }}
                className="mt-6 block rounded-lg bg-white py-3.5 text-center text-base font-bold text-navy"
              >
                Log in / Sign up
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
