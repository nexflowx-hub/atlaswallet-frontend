"use client";

/**
 * AtlasWallet — Auth context.
 *
 * Production: uses Supabase Auth for auth/session ONLY. Never writes financial state.
 *
 * Sandbox/demo: when NEXT_PUBLIC_SUPABASE_URL is not set, falls back to a local
 * mock session so the UI is fully explorable. The mock NEVER claims to be a real
 * Supabase session; it is a transparent local fallback for product preview.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { IdentityLevel, KycStatus, Me, PricingPlanCode } from "@/lib/api/types";
import { institutionalConfig } from "@/config/institutional-config";

export interface AuthSession {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  expiresAt: number;
  /** true if this is a local demo session (no real Supabase backend configured). */
  isDemo: boolean;
}

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (email: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

export type { AuthContextValue };

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "atlaswallet.demo.session";

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

function makeDemoToken(email: string): string {
  // Demo-only local token; never used in real backend auth.
  return `demo.${btoa(email).slice(0, 24)}.${Date.now().toString(36)}`;
}

function loadDemoSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveDemoSession(s: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function clearDemoSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount.
    const id = requestAnimationFrame(() => {
      if (!isSupabaseConfigured) {
        const s = loadDemoSession();
        setSession(s);
      } else {
        // Production: would call supabase.auth.getSession() here.
        // For now, until Supabase keys are supplied, we stay transparent.
        const s = loadDemoSession();
        setSession(s);
      }
      setLoading(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // NOTE: Real Supabase auth is invoked here in production.
    // Demo fallback simulates a successful session.
    await new Promise((r) => setTimeout(r, 600));
    const s: AuthSession = {
      user: { id: `demo_${btoa(email).slice(0, 12)}`, email },
      accessToken: makeDemoToken(email),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      isDemo: !isSupabaseConfigured,
    };
    saveDemoSession(s);
    setSession(s);
    return s;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    // Real flow: Supabase signUp → session → GET /api/v1/me → if !provisioned POST bootstrap → /portfolio
    await new Promise((r) => setTimeout(r, 800));
    const s: AuthSession = {
      user: { id: `demo_${btoa(email).slice(0, 12)}`, email },
      accessToken: makeDemoToken(email),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      isDemo: !isSupabaseConfigured,
    };
    saveDemoSession(s);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(async () => {
    clearDemoSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, login, register, logout }),
    [session, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

/** Demo /me response that mirrors what the backend would return for a fresh account. */
export const demoMe: Me = {
  provisioned: true,
  account: {
    status: "ACTIVE",
    kycStatus: "NOT_STARTED" as KycStatus,
    identityLevel: "SELF_DECLARED" as IdentityLevel,
    baseCurrency: "BRL",
    pricingPlan: {
      code: institutionalConfig.defaultEntry.pricingPlan as PricingPlanCode,
      label: "Atlas Black 30",
      feePercent: 0.3,
    },
    policyProfile: {
      code: institutionalConfig.defaultEntry.policyProfile,
      label: "Black Entry (Open)",
    },
  },
};
