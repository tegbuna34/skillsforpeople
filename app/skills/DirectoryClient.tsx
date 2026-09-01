"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Skill } from "@/lib/skills";
import SkillCard from "@/components/SkillCard";
import { useAuth } from "@/components/AuthContext";

// Free/locked split for logged-out visitors.
// First 6 matched results render as normal skill cards.
// The next up to 3 render as blurred teaser cards that open the login modal.
// Everything after 9 is hidden entirely; a live-count banner is shown below
// the grid with a Login CTA.
const OPEN_COUNT = 6;
const TEASER_COUNT = 3;

export default function DirectoryClient({
  skills,
  verticals,
  initialVertical,
}: {
  skills: Skill[];
  verticals: string[];
  initialVertical: string;
}) {
  const { user, openLogin } = useAuth();
  const isLoggedIn = Boolean(user);
  const [query, setQuery] = useState("");
  const [vertical, setVertical] = useState(initialVertical);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = skills.filter((s) => {
      if (vertical !== "All" && s.vertical !== vertical) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.description,
        s.whatItDoes,
        s.fullDescription,
        s.tags.join(" "),
        s.episode?.guest.name ?? "",
        s.episode?.guest.company ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    // Newest-sourced skill first — skills without a date sort to the end.
    return [...filtered].sort((a, b) => {
      const at = a.datePublished ? new Date(a.datePublished).getTime() : 0;
      const bt = b.datePublished ? new Date(b.datePublished).getTime() : 0;
      return bt - at;
    });
  }, [skills, query, vertical]);

  if (skills.length === 0) {
    return <EmptyState />;
  }

  const openSkills = isLoggedIn ? visible : visible.slice(0, OPEN_COUNT);
  const teaserSkills = isLoggedIn
    ? []
    : visible.slice(OPEN_COUNT, OPEN_COUNT + TEASER_COUNT);
  const lockedCount = isLoggedIn
    ? 0
    : Math.max(0, visible.length - OPEN_COUNT - teaserSkills.length);
  const hasHiddenBeyondTeasers = lockedCount > 0;

  return (
    <>
      <input
        type="text"
        placeholder="Search skills, e.g. onboarding"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-5 block w-full max-w-md rounded-[9px] border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-blue"
      />

      <div className="mb-5 flex flex-wrap gap-2.5">
        <VerticalPill label="All" active={vertical === "All"} onClick={() => setVertical("All")} />
        {verticals.map((v) => (
          <VerticalPill
            key={v}
            label={v}
            active={vertical === v}
            onClick={() => setVertical(v)}
          />
        ))}
      </div>

      <div className="mb-5 text-[14px] text-navy/55">
        {visible.length === 0
          ? "No results"
          : `Showing ${visible.length} skill${visible.length === 1 ? "" : "s"}`}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-6 pt-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {openSkills.map((s) => (
            <SkillCard key={s.slug} skill={s} showArrow showDateInfo />
          ))}
          {teaserSkills.map((s) => (
            <TeaserSkillCard key={s.slug} skill={s} onClick={openLogin} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-[15px] text-navy/50">
          No skills match that search.
        </div>
      )}

      {hasHiddenBeyondTeasers && (
        <button
          type="button"
          onClick={openLogin}
          className="mt-10 flex w-full flex-col items-center gap-2 rounded-2xl border border-navy/15 bg-white px-6 py-8 text-center transition-shadow hover:shadow-card"
        >
          <div className="text-[13px] font-bold uppercase tracking-wider text-blue">
            🔒 Free to unlock
          </div>
          <div className="text-[20px] font-bold text-navy">
            Login to see the rest of the library
          </div>
          <div className="text-[14.5px] text-navy/60">
            {lockedCount} more skill{lockedCount === 1 ? "" : "s"} match your
            current view. It&apos;s free — name + email and you&apos;re in.
          </div>
          <span className="mt-3 inline-block rounded-lg bg-navy px-5 py-3 text-[14px] font-semibold text-white">
            Unlock the library
          </span>
        </button>
      )}
    </>
  );
}

function TeaserSkillCard({
  skill,
  onClick,
}: {
  skill: Skill;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-6 text-left transition-shadow hover:border-navy/25 hover:shadow-card"
    >
      <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-navy/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" />
        </svg>
        Locked
      </span>
      {skill.vertical && (
        <span className="self-start rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
          {skill.vertical}
        </span>
      )}
      <div className="text-[17px] font-bold text-navy">{skill.name}</div>
      {skill.description && (
        <div
          className="flex-1 select-none text-[14px] text-navy/70"
          style={{ filter: "blur(4px)" }}
          aria-hidden="true"
        >
          {skill.description}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
        <div className="text-[12px] font-semibold text-navy/60">
          Login to view
        </div>
        <div className="text-[13.5px] font-bold text-blue">Unlock →</div>
      </div>
    </button>
  );
}

function VerticalPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
        active
          ? "border-navy bg-navy text-white"
          : "border-navy/15 bg-white text-navy hover:border-navy/40"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/25 p-14 text-center">
      <div className="text-lg font-bold text-navy">Coming soon</div>
      <p className="max-w-md text-[15px] text-navy/60">
        The first skills are being finalized. Check back shortly — or contribute one of your own.
      </p>
      <Link
        href="/contribute"
        className="mt-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-blue"
      >
        Contribute a skill
      </Link>
    </div>
  );
}
