import type { Metadata } from "next";
import WaitlistForm from "../WaitlistForm";

export const metadata: Metadata = {
  title: "People Builders founding cohort",
  robots: { index: false, follow: false },
};

export default function FoundingCohortPage() {
  return (
    <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 lg:px-16">
      <h1 className="mb-4 text-[clamp(32px,4vw,44px)] font-bold leading-tight tracking-tight">
        People Builders: founding cohort
      </h1>
      <p className="mb-4 text-[17px] text-navy/80">
        You’re invited to the first cohort, free. In return, you build a real project, track a
        baseline number, and let me publish a case study once you and your employer approve it.
      </p>
      <p className="mb-8 text-[15.5px] text-navy/70">
        Mondays Nov 16, Nov 23, Nov 30 and Dec 7, 2026. One live session and one office hour each
        week.
      </p>
      <WaitlistForm founding />
    </section>
  );
}
