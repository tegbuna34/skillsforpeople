"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { SECOND_GATE_KEY, SIGNUP_COMPLETED_COOKIE } from "@/lib/auth-cookies";

export interface AuthUser {
  email: string;
  firstName: string;
}

export type LoginMode = "nav" | "library" | "second";

interface AuthContextValue {
  user: AuthUser | null;
  isLoginOpen: boolean;
  loginMode: LoginMode;
  loginExpired: boolean;
  openLogin: (mode?: LoginMode) => void;
  closeLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("library");
  const [loginExpired, setLoginExpired] = useState(false);

  const openLogin = useCallback((mode: LoginMode = "library") => {
    setLoginMode(mode);
    setLoginOpen(true);
  }, []);
  const closeLogin = useCallback(() => {
    if (loginMode === "second") {
      try {
        sessionStorage.removeItem(SECOND_GATE_KEY);
      } catch {
        // ignore
      }
    }
    setLoginOpen(false);
    setLoginExpired(false);
  }, [loginMode]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    router.refresh();
  }, [router]);

  useEffect(() => {
    const flag = readCookie(SIGNUP_COMPLETED_COOKIE);
    if (flag) {
      track("signup_completed", { first: flag === "1" ? "1" : "0" });
      clearCookie(SIGNUP_COMPLETED_COOKIE);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "expired") {
      setLoginExpired(true);
      setLoginMode("nav");
      setLoginOpen(true);
      params.delete("login");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
      return;
    }
    // Full page loads of a later skill set this before paint. Re-open if the
    // gate's state update was dropped during hydration.
    try {
      if (sessionStorage.getItem(SECOND_GATE_KEY)) {
        setLoginMode("second");
        setLoginOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoginOpen, loginMode, loginExpired, openLogin, closeLogin, logout }),
    [user, isLoginOpen, loginMode, loginExpired, openLogin, closeLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
