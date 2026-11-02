"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function SeeLibraryButton() {
  const { user, openLogin } = useAuth();
  if (user) {
    return (
      <Link
        href="/skills"
        className="mt-8 inline-block rounded-[10px] border border-navy/20 bg-white px-6 py-3.5 text-[15px] font-bold text-navy no-underline hover:bg-mint"
      >
        See the full library
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openLogin("library")}
      className="mt-8 rounded-[10px] border border-navy/20 bg-white px-6 py-3.5 text-[15px] font-bold text-navy hover:bg-mint"
    >
      See the full library
    </button>
  );
}
