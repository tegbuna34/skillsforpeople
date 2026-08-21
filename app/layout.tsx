import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skillsforpeople.com"),
  title: {
    default: "Skills for People — Practical AI skills for HR",
    template: "%s · Skills for People",
  },
  description:
    "A library of practical AI skills for HR professionals, built from workflows real practitioners have already run.",
  icons: {
    icon: "/assets/favicon.svg",
  },
  openGraph: {
    title: "Skills for People",
    description:
      "A library of practical AI skills for HR professionals, built from workflows real practitioners have already run.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body>
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
