import Link from "next/link";
import type { Skill } from "@/lib/skills";
import { addedLabel, inspiredByName, isRecentlyAdded } from "@/lib/format";
import PodcastMicIcon from "@/components/PodcastMicIcon";

export default function SkillCard({
  skill,
  showArrow = false,
  hideGuest = false,
  showDateInfo = false,
}: {
  skill: Skill;
  showArrow?: boolean;
  hideGuest?: boolean;
  showDateInfo?: boolean;
}) {
  const guest = hideGuest ? undefined : skill.episode?.guest;
  const isNew = showDateInfo && isRecentlyAdded(skill.datePublished);
  const dateLabel = showDateInfo && skill.datePublished ? addedLabel(skill.datePublished) : null;
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-6 no-underline transition-shadow hover:border-navy/25 hover:shadow-card"
    >
      {isNew && (
        <span className="absolute -right-3.5 -top-3.5 rounded-[20px] bg-navy px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-white shadow-[0_6px_14px_rgba(36,54,110,0.25)]">
          New
        </span>
      )}
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
          {(showArrow || dateLabel) && (
            <div className="flex-shrink-0 whitespace-nowrap text-right">
              {showArrow && <div className="text-[13.5px] font-bold text-blue">View →</div>}
              {dateLabel && <div className="mt-0.5 text-[11px] text-navy/40">{dateLabel}</div>}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
