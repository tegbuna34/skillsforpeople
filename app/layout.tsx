import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";
import LoginModal from "@/components/LoginModal";
import WelcomeModal from "@/components/WelcomeModal";
import BioPopup from "@/components/BioPopup";
import SignupBar from "@/components/SignupBar";
import AttributionCapture from "@/components/AttributionCapture";
import { getCurrentUser } from "@/lib/account";
import { WELCOME_COOKIE } from "@/lib/auth-cookies";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skillsforpeople.com"),
  title: {
    default: "Skills for People — Practical AI skills for People Leaders",
    template: "%s · Skills for People",
  },
  description:
    "A library of practical AI skills for People leaders, built from workflows real practitioners have already run.",
  icons: {
    icon: "/assets/favicon.svg",
  },
  openGraph: {
    title: "Skills for People",
    description:
      "A library of practical AI skills for People leaders, built from workflows real practitioners have already run.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 2000,
        height: 1050,
        alt: "Skills for People. Practical AI skills for People Leaders, built from what worked.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills for People",
    description:
      "A library of practical AI skills for People leaders, built from workflows real practitioners have already run.",
    images: ["/og-image.png"],
  },
};

async function safeGetCurrentUser() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await safeGetCurrentUser();
  const initialUser = current
    ? { email: current.email, firstName: current.firstName }
    : null;
  const showWelcome = cookies().get(WELCOME_COOKIE)?.value === "1";

  return (
    <html lang="en" className={sora.variable}>
      <body>
        <AuthProvider initialUser={initialUser}>
          <AttributionCapture />
          <Nav />
          {children}
          <SignupBar />
          <Footer />
          <LoginModal />
          <WelcomeModal initialOpen={showWelcome && Boolean(initialUser)} />
          <BioPopup />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
