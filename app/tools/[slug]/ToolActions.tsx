"use client";

import { useAuth } from "@/components/AuthContext";

export default function ToolActions({
  liveUrl,
  githubUrl,
  vercelDeployUrl,
}: {
  liveUrl: string | null;
  githubUrl: string | null;
  vercelDeployUrl: string | null;
}) {
  const { user, openLogin } = useAuth();
  const isLoggedIn = Boolean(user);

  const onTryLive = () => {
    if (isLoggedIn) {
      if (liveUrl) window.open(liveUrl, "_blank", "noopener,noreferrer");
    } else {
      openLogin();
    }
  };

  return (
    <div className="flex flex-1 basis-[280px] flex-col gap-3">
      <button
        type="button"
        onClick={onTryLive}
        className="cursor-pointer whitespace-nowrap rounded-[10px] border-none bg-navy px-4 py-4 text-center text-[15.5px] font-bold text-white shadow-cta transition-colors hover:bg-blue"
      >
        Try it live →
      </button>
      {!isLoggedIn && (
        <div className="-mt-1 text-center text-[12px] text-navy/50">
          Free login required — no password, just name and email.
        </div>
      )}

      <div className="mt-2 flex gap-2.5">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-[9px] border border-navy/25 bg-white px-4 py-3.5 text-[14px] font-bold text-navy no-underline transition-colors hover:border-navy"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.93.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.6.69.5A10.01 10.01 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
            </svg>
            Get the code
          </a>
        )}
      </div>
      {vercelDeployUrl && (
        <a
          href={vercelDeployUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-[9px] bg-black px-4 py-3 text-[13.5px] font-bold text-white no-underline transition-colors hover:bg-black/80"
        >
          <svg width="13" height="13" viewBox="0 0 76 65" fill="currentColor" aria-hidden="true">
            <path d="M37.5 0 75 65H0Z" />
          </svg>
          Deploy to Vercel
        </a>
      )}

      <a
        href="/work-with-us"
        className="mt-2.5 text-center text-[13.5px] font-semibold text-navy/60 no-underline hover:text-navy hover:underline"
      >
        Or have us build it for you →
      </a>
    </div>
  );
}
