"use client";

import { useEffect, useState } from "react";
import type { Skill } from "@/lib/skills";
import { contributorRoleLine, initials } from "@/lib/format";

export default function HeroCards({ skills }: { skills: Skill[] }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (skills.length < 2) return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % skills.length);
        setFading(false);
      }, 200);
    }, 3200);
    return () => clearInterval(t);
  }, [skills.length]);

  if (skills.length === 0) return null;

  const front = skills[index];
  const back = skills[(index + 1) % skills.length] ?? front;
  const guest = front.episode?.guest;

  return (
    <div className="relative min-w-[280px] flex-1 basis-[380px] px-6 pt-4">
      <div className="relative rotate-[-2.5deg] rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          {back.vertical && (
            <span className="rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
              {back.vertical}
            </span>
          )}
          <span className="text-[13px] text-navy/35">.skill</span>
        </div>
        <div className="text-[16.5px] font-bold leading-tight">{back.name}</div>
      </div>
      <div
        className="relative -mt-4 rotate-[1.2deg] rounded-2xl border border-navy/5 bg-white p-7 shadow-cardLg transition-opacity duration-200"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="mb-3.5 flex items-center justify-between">
          {front.vertical && (
            <span className="rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
              {front.vertical}
            </span>
          )}
          <span className="text-[13px] text-navy/35">.skill</span>
        </div>
        <div className="mb-3 text-lg font-bold leading-tight">{front.name}</div>
        {front.description && (
          <div className="mb-4 text-[14.5px] text-navy/70">{front.description}</div>
        )}
        {guest && (
          <div className="flex items-center gap-3 border-t border-navy/10 pt-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-mint">
              {initials(guest.name)}
            </div>
            <div>
              <div className="text-[13px] font-semibold">{guest.name}</div>
              <div className="text-[12px] text-navy/55">{contributorRoleLine(guest)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
