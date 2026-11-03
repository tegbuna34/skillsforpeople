import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/skills", label: "Skill Library" },
  { href: "/contribute", label: "Contribute a skill" },
  { href: "/people-builders", label: "People Builders" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-10 px-5 pb-8 pt-14 sm:px-8 lg:px-16">
        <div className="max-w-sm">
          <div className="mb-3.5">
            <Image
              src="/assets/logo-wordmark-reversed.svg"
              alt="Skills for People"
              width={160}
              height={20}
              className="h-5 w-auto"
            />
          </div>
          <p className="text-sm text-mint/70">AI skills for People leaders, from Toby Egbuna.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14.5px] text-mint/75 no-underline hover:underline"
            >
              {link.label}
            </Link>
          ))}
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
