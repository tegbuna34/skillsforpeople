"use client";

import { useState } from "react";

const PREVIEW_LEN = 280;

export default function BioExpander({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!bio) return null;

  const shouldTruncate = bio.length > PREVIEW_LEN;
  let preview = bio.slice(0, PREVIEW_LEN);
  const lastSpace = preview.lastIndexOf(" ");
  if (lastSpace > 0) preview = preview.slice(0, lastSpace);
  const shown = !shouldTruncate || expanded ? bio : preview.trim() + "…";

  return (
    <div className="mt-6 max-w-[680px] text-[15.5px] text-navy/80">
      <p className="m-0 whitespace-pre-line">{shown}</p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 cursor-pointer border-none bg-transparent p-0 text-[14.5px] font-bold text-blue"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
