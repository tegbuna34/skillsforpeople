/**
 * Isolated 3-step strip. Swap this file when design sends new art.
 */

const STEPS = [
  {
    title: "Get the file",
    body: "One skill, free.",
    icon: DownloadIcon,
  },
  {
    title: "Add it",
    body: "Claude or ChatGPT.",
    icon: ChatIcon,
  },
  {
    title: "Run it",
    body: "On your team's work.",
    icon: PlayIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-navy/10 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-16">
        <h2 className="mb-6 text-[13px] font-bold uppercase tracking-wider text-blue">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-mint p-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-navy">
                <step.icon />
              </span>
              <span>
                <span className="block text-[12px] font-bold text-blue">{index + 1}</span>
                <span className="block text-[16px] font-bold text-navy">{step.title}</span>
                <span className="block text-[14px] text-navy/70">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 6h14v9H8l-3 3V6z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M10 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
