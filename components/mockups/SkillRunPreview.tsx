/**
 * Isolated product mock. Swap this file when design sends a real preview.
 * It shows the shape of a skill running in a chat window. No photos, no fake results.
 */

export default function SkillRunPreview({
  name,
  problem,
}: {
  name: string;
  problem?: string;
}) {
  const line = problem?.trim() || "A workflow an HR leader already shared.";
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-cardLg">
      <div className="flex items-center gap-2 border-b border-navy/10 bg-mint px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-peach" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-blue/40" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy/20" aria-hidden="true" />
        <span className="ml-2 text-[12px] font-semibold text-navy/60">Claude</span>
      </div>
      <div className="space-y-3 p-4">
        <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-navy px-3.5 py-2.5 text-[13.5px] text-white">
          Run {name}
        </div>
        <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-navy/10 bg-mint px-3.5 py-3 text-[13px] leading-relaxed text-navy">
          <div className="mb-1 font-semibold">{name}.skill</div>
          <p className="text-navy/70">{line}</p>
          <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-navy/80">
            <li>Ask about your process</li>
            <li>Draft the output</li>
            <li>Hand it back for you to edit</li>
          </ol>
        </div>
        <div className="flex items-center gap-2 border-t border-navy/10 pt-3 text-[12.5px] font-semibold text-navy/55">
          <LockIcon />
          Opens with your free account
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
