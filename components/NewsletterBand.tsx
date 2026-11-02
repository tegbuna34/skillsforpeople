import { newsletterUrl } from "@/lib/newsletter";

export default function NewsletterBand({ compact = false }: { compact?: boolean }) {
  const href = newsletterUrl();

  if (compact) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-mint/70">One skill every Tuesday.</span>
        <a
          href={href}
          className="inline-flex h-10 items-center rounded-lg bg-white/10 px-3 text-sm font-semibold text-white no-underline hover:bg-white/20"
        >
          Newsletter
        </a>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 lg:px-16">
      <h2 className="mb-2 text-[clamp(24px,3vw,32px)] font-bold tracking-tight">The Tuesday note</h2>
      <p className="mb-5 max-w-md text-[16px] text-navy/75">
        One skill and one tip from me. That&apos;s the email.
      </p>
      <a
        href={href}
        className="inline-flex h-12 items-center rounded-[10px] bg-navy px-5 text-[15px] font-bold text-white no-underline hover:bg-blue"
      >
        Open the newsletter
      </a>
    </section>
  );
}
