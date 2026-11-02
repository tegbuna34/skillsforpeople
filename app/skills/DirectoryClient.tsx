"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Skill } from "@/lib/skills";
import SkillCard from "@/components/SkillCard";

export default function DirectoryClient({
  skills,
  verticals,
  initialVertical,
  showContribute = true,
}: {
  skills: Skill[];
  verticals: string[];
  initialVertical: string;
  showContribute?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [vertical, setVertical] = useState(initialVertical);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = skills.filter((skill) => {
      if (vertical !== "All" && skill.vertical !== vertical) return false;
      if (!q) return true;
      const haystack = [
        skill.name,
        skill.description,
        skill.whatItDoes,
        skill.fullDescription,
        skill.tags.join(" "),
        skill.episode?.guest.name ?? "",
        skill.episode?.guest.company ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return [...filtered].sort((a, b) => {
      const at = a.datePublished ? new Date(a.datePublished).getTime() : 0;
      const bt = b.datePublished ? new Date(b.datePublished).getTime() : 0;
      return bt - at;
    });
  }, [skills, query, vertical]);

  if (skills.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search skills, e.g. onboarding"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mb-5 block w-full max-w-md rounded-[9px] border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-blue"
      />

      <div className="mb-5 flex flex-wrap gap-2.5">
        <VerticalPill label="All" active={vertical === "All"} onClick={() => setVertical("All")} />
        {verticals.map((item) => (
          <VerticalPill
            key={item}
            label={item}
            active={vertical === item}
            onClick={() => setVertical(item)}
          />
        ))}
      </div>

      <div className="mb-5 text-[14px] text-navy/55">
        {visible.length === 0
          ? "No results"
          : `${visible.length} skill${visible.length === 1 ? "" : "s"}`}
        {showContribute && visible.length > 0 && (
          <>
            {" "}
            · Want to add one?{" "}
            <Link href="/contribute" className="font-semibold text-blue no-underline hover:underline">
              Contribute a skill →
            </Link>
          </>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-6 pt-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} showArrow showDateInfo />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-[15px] text-navy/50">No skills match that search.</div>
      )}
    </>
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
        active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40"
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
        The first skills are being finalized. Check back shortly, or contribute one of your own.
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
