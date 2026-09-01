"use client";

import { useState } from "react";

interface Item {
  q: string;
  a: string;
}

export default function Faq({ items }: { items: Item[] }) {
  const [openIdx, setOpenIdx] = useState<number>(0);
  return (
    <div className="flex flex-col">
      {items.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className="border-t border-navy/10 last:border-b">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 border-none bg-transparent py-5 text-left font-inherit"
            >
              <span className="text-[15.5px] font-bold text-navy">{f.q}</span>
              <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-navy/30 text-navy text-sm">
                {open ? "−" : "+"}
              </span>
            </button>
            {open && (
              <p className="mb-6 max-w-[680px] text-[14.5px] text-navy/75">{f.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
