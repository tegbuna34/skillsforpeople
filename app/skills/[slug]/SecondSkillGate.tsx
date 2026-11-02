"use client";

import { useLayoutEffect } from "react";
import { track } from "@vercel/analytics";
import { useAuth } from "@/components/AuthContext";
import { SECOND_GATE_KEY } from "@/lib/auth-cookies";

const VIEWED_KEY = "sfp_skills_viewed";

function readViewed(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(VIEWED_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/**
 * The first distinct skill a logged-out visitor opens stays quiet.
 * Every later skill opens the sign-up popup, including on a full page load.
 * The decision is stored before paint so a fast navigation cannot skip it.
 */
export default function SecondSkillGate({ slug }: { slug: string }) {
  const { openLogin } = useAuth();

  useLayoutEffect(() => {
    const viewed = readViewed();
    const seenBefore = viewed.includes(slug);
    if (seenBefore) {
      try {
        if (sessionStorage.getItem(SECOND_GATE_KEY) === slug) openLogin("second");
      } catch {
        // ignore
      }
      return;
    }
    const isLaterSkill = viewed.length > 0;
    try {
      localStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed, slug]));
    } catch {
      // ignore
    }
    if (!isLaterSkill) return;

    try {
      sessionStorage.setItem(SECOND_GATE_KEY, slug);
    } catch {
      // ignore
    }
    openLogin("second");
    const trackedKey = `sfp_second_gate_tracked_${slug}`;
    try {
      if (sessionStorage.getItem(trackedKey) === "1") return;
      sessionStorage.setItem(trackedKey, "1");
    } catch {
      // still track below
    }
    track("second_skill_gate_shown", { slug });
  }, [slug, openLogin]);

  return null;
}
