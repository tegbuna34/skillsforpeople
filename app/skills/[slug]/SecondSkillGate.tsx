"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { useAuth } from "@/components/AuthContext";

const VIEWED_KEY = "sfp_skills_viewed";
const PENDING_KEY = "sfp_second_gate_pending";

function readViewed(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(VIEWED_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Logged-out visitors can read the first skill. The next distinct skill opens
 * the sign-up popup. The page body is always in the HTML, so crawlers get it.
 * sessionStorage keeps the popup open across React strict-mode remounts in dev.
 */
export default function SecondSkillGate({ slug }: { slug: string }) {
  const { openLogin } = useAuth();

  useEffect(() => {
    const viewed = readViewed();
    const already = viewed.includes(slug);
    if (!already && viewed.length > 0) {
      try {
        sessionStorage.setItem(PENDING_KEY, slug);
      } catch {
        // ignore
      }
    }
    if (!already) {
      try {
        localStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed, slug]));
      } catch {
        // ignore
      }
    }
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_KEY);
    } catch {
      pending = null;
    }
    if (pending === slug) {
      openLogin("second");
      const trackedKey = `sfp_second_gate_tracked_${slug}`;
      try {
        if (sessionStorage.getItem(trackedKey) !== "1") {
          sessionStorage.setItem(trackedKey, "1");
          track("second_skill_gate_shown", { slug });
        }
      } catch {
        track("second_skill_gate_shown", { slug });
      }
    }
  }, [slug, openLogin]);

  return null;
}
