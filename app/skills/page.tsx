import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedSkills, getVerticals } from "@/lib/skills";
import DirectoryClient from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Browse every skill",
  description:
    "Search or filter the Skills for People library by HR vertical. Each skill is downloadable as a Claude .skill file or a plain prompt.",
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
    <>
      <div className="mx-auto max-w-[1180px] px-5 pb-6 pt-12 sm:px-8 md:pt-16 lg:px-16">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-blue">
          The library
        </div>
        <h1 className="mb-3 text-[clamp(30px,4vw,42px)] font-bold tracking-tight">
          Browse every skill
        </h1>
        <p className="mb-4 max-w-xl text-[17px] text-navy/70">
          Search or filter by HR vertical. Each skill is downloadable as a Claude .skill file or a
          plain prompt.
        </p>
        <p className="mb-8 text-[14.5px] text-navy/60">
          Have a skill worth sharing?{" "}
          <Link
            href="/contribute"
            className="font-semibold text-blue underline-offset-2 hover:underline"
          >
            Contribute it →
          </Link>
        </p>

        <DirectoryClient
          skills={skills}
          verticals={verticals}
          initialVertical={initialVertical}
        />
      </div>
    </>
  );
}
