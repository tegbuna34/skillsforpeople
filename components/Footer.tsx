import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-10 px-5 pb-8 pt-14 sm:px-8 lg:px-16">
        <div className="max-w-xs">
          <div className="mb-3.5">
            <Image
              src="/assets/logo-wordmark-reversed.svg"
              alt="Skills for People"
              width={160}
              height={20}
              className="h-5 w-auto"
            />
          </div>
          <a
            href="https://www.skillsforpeople.com"
            className="text-sm text-mint/55 no-underline hover:underline"
          >
            skillsforpeople.com
          </a>
        </div>
        <div className="flex flex-wrap gap-14">
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-wider text-mint/40">
              Library
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/skills" className="text-[14.5px] text-mint/75 no-underline hover:underline">
                Browse skills
              </Link>
              <Link href="/contribute" className="text-[14.5px] text-mint/75 no-underline hover:underline">
                Contribute
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-wider text-mint/40">
              Company
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-[14.5px] text-mint/75 no-underline hover:underline">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-mint/10 px-5 py-5 sm:px-8 lg:px-16">
        <span className="text-[13px] text-mint/40">
          © {new Date().getFullYear()} Skills for People. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
