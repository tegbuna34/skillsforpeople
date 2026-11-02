/**
 * Isolated cohort preview. Swap this file when design sends new art.
 * Seats are marks, not people.
 */

const WEEKS = ["Map", "Automate", "App", "Demo"];

export default function CohortPreview() {
  return (
    <div className="w-full min-w-0 rounded-2xl border border-navy/10 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[12px] font-bold uppercase tracking-wider text-blue">4 weeks, live</div>
        <div className="text-[13px] font-bold text-navy">$2,500</div>
      </div>
      <ol className="grid grid-cols-4 gap-2">
        {WEEKS.map((label, index) => (
          <li key={label} className="rounded-xl bg-mint px-1.5 py-3 text-center">
            <div className="text-[11px] font-bold text-navy/45">{index + 1}</div>
            <div className="text-[12.5px] font-bold text-navy sm:text-[14px]">{label}</div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} className="h-3 w-3 rounded-full border border-navy/30 bg-white" />
          ))}
        </div>
        <div className="whitespace-nowrap text-[13px] font-semibold text-navy/70">10 seats</div>
      </div>
    </div>
  );
}
