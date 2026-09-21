import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedTools, getToolBySlug } from "@/lib/tools";
import ToolActions from "./ToolActions";

export async function generateStaticParams() {
  const tools = await getPublishedTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.name,
    description: tool.oneLiner,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  return (
    <>
      {/* BREADCRUMB */}
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-2 px-5 pt-5 text-[13.5px] text-navy/55 sm:px-8 lg:px-16">
        <Link href="/tools" className="text-navy/55 no-underline hover:underline">
          Tools
        </Link>
        <span>/</span>
        <span className="font-semibold text-navy">{tool.name}</span>
      </div>

      {/* HERO */}
      <div className="mx-auto max-w-[1180px] px-5 pt-5 sm:px-8 lg:px-16">
        <span className="rounded-xl bg-blue/[0.12] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue">
          {tool.category}
        </span>
        <h1 className="my-4 text-[clamp(30px,4vw,42px)] font-bold tracking-tight">
          {tool.name}
        </h1>
        <p className="mb-8 max-w-[680px] text-[17px] text-navy/75">
          {tool.audience}
        </p>
      </div>

      {/* SCREENSHOT + CTAS */}
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-10 px-5 pb-12 sm:px-8 lg:px-16">
        <div className="min-w-[300px] flex-[2_1_520px]">
          {tool.mockupImage && (
            <Image
              src={tool.mockupImage}
              alt={`${tool.name} — live app screenshot`}
              width={1200}
              height={750}
              className="block aspect-[16/10] w-full rounded-2xl object-cover shadow-cardLg"
            />
          )}
        </div>

        <ToolActions
          liveUrl={tool.liveUrl}
          githubUrl={tool.githubUrl}
          vercelDeployUrl={tool.vercelDeployUrl}
        />
      </div>

      {/* DETAIL SECTIONS */}
      <div className="mx-auto flex max-w-[800px] flex-col gap-11 px-5 pb-6 sm:px-8 lg:px-16">
        <div>
          <h2 className="mb-3 text-[22px] font-bold">What&apos;s included</h2>
          <p className="text-[15.5px] text-navy/80">{tool.whatsIncluded}</p>
        </div>

        <div>
          <h2 className="mb-3 text-[22px] font-bold">What it does</h2>
          <p className="text-[15.5px] text-navy/80">{tool.whatItDoes}</p>
        </div>

        <div>
          <h2 className="mb-3.5 text-[22px] font-bold">What you&apos;ll need</h2>
          <div className="flex flex-col gap-2.5">
            {tool.needList.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[10px] border border-navy/10 bg-white p-4"
              >
                <span className="mt-px flex-shrink-0 text-[15px] font-bold text-blue">
                  ✓
                </span>
                <span className="text-[15px] text-navy/85">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3.5 text-[22px] font-bold">How to set it up</h2>
          <div className="flex flex-col gap-3.5">
            {tool.setupSteps.map((step, i) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[13.5px] font-bold text-white">
                  {i + 1}
                </div>
                <span className="pt-0.5 text-[15px] text-navy/85">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3.5 text-[22px] font-bold">
            How to make it your own
          </h2>
          <div className="flex flex-col gap-2.5">
            {tool.makeYourOwn.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="flex-shrink-0 text-[15px] font-bold text-blue">
                  —
                </span>
                <span className="text-[15px] text-navy/85">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STANDING: STILL TOO MUCH */}
      <div className="mx-auto max-w-[800px] px-5 pb-16 pt-2 sm:px-8 lg:px-16">
        <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center">
          <h2 className="mb-2.5 text-xl font-bold">
            If this still feels like too much
          </h2>
          <p className="mx-auto mb-5 max-w-[520px] text-[15px] text-navy/70">
            That&apos;s completely normal — not everyone has the time or the
            desire to set this up themselves. We can set it up, connect it to
            your existing tools, and customize it for how your team actually
            works.
          </p>
          <Link
            href="/work-with-us"
            className="inline-block rounded-[9px] bg-navy px-7 py-3.5 text-[14.5px] font-bold text-white no-underline transition-colors hover:bg-blue"
          >
            Have us build it for you
          </Link>
        </div>
      </div>
    </>
  );
}
