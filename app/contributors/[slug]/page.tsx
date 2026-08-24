import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import SkillCard from "@/components/SkillCard";
import BioExpander from "./BioExpander";
import ContributorActions from "./ContributorActions";
import {
  getAllContributors,
  getContributorBySlug,
  type ContributorProfile,
} from "@/lib/contributors";

// Contributor pages are unlisted and known at build time — do not server-render
// unknown slugs on demand. Matches the build-time-only Notion pattern.
export const dynamicParams = false;

export async function generateStaticParams() {
  const contributors = await getAllContributors();
  return contributors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = await getContributorBySlug(params.slug);
  if (!c) return { title: "Contributor" };
  const roleLine = [c.title, c.company].filter(Boolean).join(", ");
  return {
    title: c.name,
    description: roleLine
      ? `${c.name} — ${roleLine}. Skills contributed to Skills for People.`
      : `${c.name} — skills contributed to Skills for People.`,
    // Unlisted, direct-URL-only per the v1 brief.
    robots: { index: false, follow: false },
  };
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function Avatar({ c }: { c: ContributorProfile }) {
  if (c.photoUrl) {
    return (
      <Image
        src={c.photoUrl}
        alt={c.name}
        width={104}
        height={104}
        className="h-[104px] w-[104px] flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex h-[104px] w-[104px] flex-shrink-0 items-center justify-center rounded-full bg-navy text-[32px] font-bold tracking-wide text-white"
    >
      {initials(c.name)}
    </div>
  );
}

function LinkedInIcon({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`LinkedIn profile for ${name}`}
      className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-navy/15 text-navy transition-colors hover:border-navy"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.36V9h3.4v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    </a>
  );
}

export default async function ContributorPage({
  params,
}: {
  params: { slug: string };
}) {
  const c = await getContributorBySlug(params.slug);
  if (!c) notFound();

  const roleLine = [c.title, c.company].filter(Boolean).join(", ");
  const firstName = c.name.split(/\s+/)[0] ?? c.name;
  const skillCount = c.skills.length;
  const countLabel = `${skillCount} skill${skillCount === 1 ? "" : "s"} contributed`;
  const linkedinHref =
    c.linkedinUrl ??
    `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(c.name)}`;

  return (
    <>
      <div className="mx-auto max-w-[980px] px-5 pb-10 pt-10 sm:px-8 md:pb-14 md:pt-12 lg:px-16">
        <div className="flex flex-wrap items-start gap-7">
          <Avatar c={c} />
          <div className="min-w-[200px]">
            <div className="flex flex-nowrap items-center gap-2.5">
              <h1 className="m-0 min-w-0 text-[clamp(24px,4vw,38px)] font-extrabold tracking-tight">
                {c.name}
              </h1>
              <LinkedInIcon href={linkedinHref} name={c.name} />
            </div>
            {roleLine && (
              <div className="mt-2 text-base font-medium text-navy/70">{roleLine}</div>
            )}
          </div>
        </div>

        <BioExpander bio={c.bio} />

        <ContributorActions firstName={firstName} skillCount={skillCount} slug={c.slug} />
      </div>

      <div
        id="skills"
        className="mx-auto max-w-[980px] border-t border-navy/[0.08] px-5 pb-16 pt-8 sm:px-8 lg:px-16"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 pt-8">
          <h2 className="m-0 text-[22px] font-bold tracking-tight">Skills by {firstName}</h2>
          <div className="text-sm text-navy/55">{countLabel}</div>
        </div>
        {skillCount > 0 ? (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {c.skills.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} showArrow hideGuest />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center text-[14.5px] text-navy/60">
            No published skills yet.
          </div>
        )}
      </div>
    </>
  );
}
