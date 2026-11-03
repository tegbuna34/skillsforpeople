import type { Metadata } from "next";
import { getPublishedSkills, getVerticals } from "@/lib/skills";
import DirectoryClient from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Every skill, free",
  description:
    "AI skills for People leaders, sorted by function. Browse all of it free. You need a free account to download.",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams?: { vertical?: string };
}) {
  const [skills, verticals] = await Promise.all([getPublishedSkills(), getVerticals()]);
  const initialVertical =
    searchParams?.vertical && verticals.includes(searchParams.vertical)
      ? searchParams.vertical
      : "All";

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-12 sm:px-8 md:pt-16 lg:px-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
        Skill Library
      </div>
      <h1 className="mb-3 text-[clamp(30px,4vw,42px)] font-bold tracking-tight">Every skill, free</h1>
      <p className="mb-8 max-w-xl text-[17px] text-navy/70">
        AI skills for People leaders, sorted by function. Browse all of it free. You need a free
        account to download. Every skill credits the practitioner whose work it’s built from.
      </p>
      <DirectoryClient skills={skills} verticals={verticals} initialVertical={initialVertical} />
    </div>
  );
}
