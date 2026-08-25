import Link from "next/link";
import type { Skill } from "@/lib/skills";
import { inspiredByName } from "@/lib/format";
import PodcastMicIcon from "@/components/PodcastMicIcon";

export default function SkillCard({
  skill,
  showArrow = false,
  hideGuest = false,
}: {
  skill: Skill;
  showArrow?: boolean;
  hideGuest?: boolean;
}) {
  const guest = hideGuest ? undefined : skill.episode?.guest;
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
      {(guest || showArrow) && (
        <div className="flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
          {guest ? (
            <div className="flex items-center gap-1.5 text-[12px] text-navy/60">
              <PodcastMicIcon className="flex-shrink-0 text-navy/40" />
              <span>{inspiredByName(guest)}</span>
            </div>
          ) : (
            <div />
          )}
          {showArrow && (
            <span className="whitespace-nowrap text-[13.5px] font-bold text-blue">View →</span>
          )}
        </div>
      )}
    </Link>
  );
}
