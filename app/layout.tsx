import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";
import LoginModal from "@/components/LoginModal";
import { getCurrentUser } from "@/lib/session";

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

// Root layout hits Supabase to hydrate the initial user so the nav renders in
// its logged-in shape on first paint. If the session lookup ever fails we
// treat the visitor as logged out.
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

  return (
    <html lang="en" className={sora.variable}>
      <body>
        <AuthProvider initialUser={initialUser}>
          <Nav />
          {children}
          <Footer />
          <LoginModal />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
