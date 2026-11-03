"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function SeeLibraryButton({ className = "" }: { className?: string }) {
  const { user, openLogin } = useAuth();
  const classes =
    className ||
    "mt-8 inline-block rounded-[10px] border border-navy/20 bg-white px-6 py-3.5 text-[15px] font-bold text-navy no-underline hover:bg-mint";
  if (user) {
    return (
      <Link href="/skills" className={classes}>
        See the full library
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => openLogin("library")} className={classes}>
      See the full library
    </button>
  );
}
