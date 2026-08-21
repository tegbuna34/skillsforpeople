import Link from "next/link";

export default function SkillNotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center sm:px-8 lg:px-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
        Skill not found
      </div>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        We couldn&apos;t find that skill.
      </h1>
      <p className="mb-6 text-navy/70">
        It may have been unpublished or the link may be out of date.
      </p>
      <Link
        href="/skills"
        className="inline-block rounded-[9px] bg-navy px-6 py-3 font-bold text-white no-underline transition-colors hover:bg-blue"
      >
        Browse every skill
      </Link>
    </div>
  );
}
