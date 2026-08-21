import Link from "next/link";
import type { Skill } from "@/lib/skills";
import { contributorRoleLine } from "@/lib/format";

export default function SkillCard({ skill, showArrow = false }: { skill: Skill; showArrow?: boolean }) {
  const guest = skill.episode?.guest;
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-6 no-underline transition-shadow hover:border-navy/25 hover:shadow-card"
    >
      {skill.vertical && (
        <span className="self-start rounded-xl bg-blue/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue">
          {skill.vertical}
        </span>
      )}
      <div className="text-[17px] font-bold text-navy">{skill.name}</div>
      {skill.description && (
        <div className="flex-1 text-[14px] text-navy/70">{skill.description}</div>
      )}
      {guest && (
        <div className="flex items-end justify-between gap-3 border-t border-navy/10 pt-3">
          <div>
            <div className="text-[12.5px] font-semibold text-navy">{guest.name}</div>
            <div className="text-[11.5px] text-navy/50">{contributorRoleLine(guest)}</div>
          </div>
          {showArrow && (
            <span className="whitespace-nowrap text-[13.5px] font-bold text-blue">View →</span>
          )}
        </div>
      )}
    </Link>
  );
}
