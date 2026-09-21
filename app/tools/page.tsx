import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Ready-to-use apps and tools, built for HR. Try any of these live, take the source code and run it yourself, or have us build and customize one for how your team actually works.",
};

export default async function ToolsDirectoryPage() {
  const tools = await getPublishedTools();

  return (
    <>
      <div className="mx-auto max-w-[900px] px-5 pb-2 pt-12 text-center sm:px-8 md:pt-16 lg:px-16">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-blue">
          Tools
        </div>
        <h1 className="mb-4 text-[clamp(30px,4vw,42px)] font-bold tracking-tight">
          Ready-to-use apps and tools, built for HR.
        </h1>
        <p className="mx-auto mb-3 max-w-[600px] text-[17px] text-navy/70">
          Try any of these live right now, take the source code and run it
          yourself, or have us build and customize one for how your team
          actually works.
        </p>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 pb-2 pt-10 sm:px-8 lg:px-16">
        <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(480px,1fr))]">
          {tools.map((tool) => {
            const cardBody = (
              <>
                <div className="relative">
                  {tool.mockupImage && (
                    <Image
                      src={tool.mockupImage}
                      alt={`${tool.name} screenshot`}
                      width={960}
                      height={540}
                      className={`block aspect-video w-full border-b border-navy/10 object-cover ${
                        tool.comingSoon ? "opacity-70" : ""
                      }`}
                    />
                  )}
                  {tool.comingSoon && (
                    <span className="absolute right-4 top-4 rounded-xl bg-navy px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-card">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="flex min-h-[216px] flex-1 flex-col gap-3 p-7">
                  <span className="self-start rounded-xl bg-blue/[0.12] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-blue">
                    {tool.category}
                  </span>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[21px] font-bold">
                    {tool.name}
                  </div>
                  <div className="line-clamp-2 flex-1 text-[15.5px] text-navy/70">
                    {tool.oneLiner}
                  </div>
                  <div className="flex justify-end pt-2">
                    {tool.comingSoon ? (
                      <span className="whitespace-nowrap text-[13.5px] font-bold text-navy/40">
                        Coming soon
                      </span>
                    ) : (
                      <span className="whitespace-nowrap text-[13.5px] font-bold text-blue">
                        View →
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            if (tool.comingSoon) {
              return (
                <div
                  key={tool.slug}
                  className="flex flex-col overflow-hidden rounded-[14px] border border-navy/10 bg-white text-inherit"
                >
                  {cardBody}
                </div>
              );
            }

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex cursor-pointer flex-col overflow-hidden rounded-[14px] border border-navy/10 bg-white text-inherit no-underline transition-shadow hover:border-navy/25 hover:shadow-card"
              >
                {cardBody}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 md:py-20 lg:px-16">
        <h2 className="mb-3 text-[clamp(22px,2.8vw,28px)] font-bold tracking-tight">
          Don&apos;t see a tool for what you need?
        </h2>
        <p className="mb-6 text-[15.5px] text-navy/70">
          We can build a custom version of any of these, or something new,
          scoped to how your team already works.
        </p>
        <Link
          href="/work-with-us"
          className="inline-block rounded-[9px] bg-navy px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-colors hover:bg-blue"
        >
          Work with us
        </Link>
      </div>
    </>
  );
}
