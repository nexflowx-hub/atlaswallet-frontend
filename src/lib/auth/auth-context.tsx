"use client";

/**
 * AtlasWallet authentication boundary.
 *
 * Supabase is used for identity/session only. All financial state continues to
 * live behind https://api.atlaswallet.org.
 *
 * Demo auth is intentionally opt-in. A missing production auth configuration
 * must never silently turn "any password works" into a production behaviour.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { IdentityLevel, KycStatus, Me, PricingPlanCode } from "@/lib/api/types";
import { apiClient, setTokenProvider } from "@/lib/api/client";
import { institutionalConfig } from "@/config/institutional-config";

export interface AuthSession {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  isDemo: boolean;
}

export type AuthMode = "supabase" | "demo" | "unavailable";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  authMode: AuthMode;
  login: (email: string, password: string) => Promise<AuthSession>;
  /** null means Supabase accepted signup but email confirmation is required. */
  register: (email: string, password: string) => Promise<AuthSession | null>;
  logout: () => Promise<void>;
}

export type { AuthContextValue };

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "atlaswallet.auth.session.v1";
const LEGACY_DEMO_STORAGE_KEY = "atlaswallet.demo.session";
const REFRESH_SKEW_MS = 60_000;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const DEMO_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH?.trim().toLowerCase() === "true";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
);

export const configuredAuthMode: AuthMode = isSupabaseConfigured
  ? "supabase"
  : DEMO_AUTH_ENABLED
    ? "demo"
    : "unavailable";

interface SupabaseUser {
  id: string;
  email?: string | null;
}

interface SupabaseSessionPayload {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: SupabaseUser | null;
  error?: string;
  error_code?: string;
  error_description?: string;
  msg?: string;
  message?: string;
}

function getSupabaseHeaders(accessToken?: string): Record<string, string> {
  if (!SUPABASE_PUBLISHABLE_KEY) return {};
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

function authErrorMessage(payload: SupabaseSessionPayload | null, status: number): string {
  const message =
    payload?.msg ||
    payload?.message ||
    payload?.error_description ||
    payload?.error;

  if (message) return message;
  if (status === 400) return "Invalid email or password";
  if (status === 401) return "Invalid or expired session";
  if (status === 429) return "Too many authentication attempts. Try again shortly.";
  return `Authentication service returned HTTP ${status}`;
}

async function supabaseAuthRequest(
  path: string,
  init: RequestInit
): Promise<{ response: Response; payload: SupabaseSessionPayload | null }> {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("AtlasWallet authentication is not configured");
  }

  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}${path}`, {
      ...init,
      headers: {
        ...getSupabaseHeaders(),
        ...(init.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Authentication service is temporarily unreachable");
  }

  const payload = (await response.json().catch(() => null)) as SupabaseSessionPayload | null;
  return { response, payload };
}

function toRealSession(payload: SupabaseSessionPayload): AuthSession {
  if (!payload.access_token || !payload.refresh_token || !payload.user?.id) {
    throw new Error("Supabase did not return a complete authenticated session");
  }

  const email = payload.user.email?.trim();
  if (!email) throw new Error("Authenticated Supabase user has no email address");

  const expiresAt = payload.expires_at
    ? payload.expires_at * 1000
    : Date.now() + Math.max(payload.expires_in ?? 3600, 60) * 1000;

  return {
    user: { id: payload.user.id, email },
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt,
    isDemo: false,
  };
}

function makeDemoToken(email: string): string {
  return `demo.${btoa(email).slice(0, 24)}.${Date.now().toString(36)}`;
}

function makeDemoSession(email: string): AuthSession {
  return {
    user: { id: `demo_${btoa(email).slice(0, 12)}`, email },
    accessToken: makeDemoToken(email),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    isDemo: true,
  };
}

function loadStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user?.id || !parsed.accessToken || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStoredSession(value: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_DEMO_STORAGE_KEY);
}

async function refreshSupabaseSession(current: AuthSession): Promise<AuthSession> {
  if (current.isDemo || !current.refreshToken) {
    throw new Error("No refreshable Supabase session is available");
  }

  const { response, payload } = await supabaseAuthRequest(
    "/auth/v1/token?grant_type=refresh_token",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: current.refreshToken }),
    }
  );

  if (!response.ok || !payload) {
    throw new Error(authErrorMessage(payload, response.status));
  }

  return toRealSession(payload);
}

async function validateSupabaseSession(current: AuthSession): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || current.isDemo) return false;

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "GET",
      headers: getSupabaseHeaders(current.accessToken),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    // A transient network failure is not equivalent to a revoked session.
    return current.expiresAt > Date.now();
  }
}

async function ensureBackendAccount() {
  const me = await apiClient.getMe();
  if (!me.provisioned) {
    await apiClient.bootstrap();
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef<AuthSession | null>(null);

  const commitSession = useCallback((next: AuthSession | null) => {
    sessionRef.current = next;
    setSession(next);
    if (next) saveStoredSession(next);
    else clearStoredSession();
  }, []);

  const refreshCurrentSession = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.isDemo) return null;

    try {
      const refreshed = await refreshSupabaseSession(current);
      commitSession(refreshed);
      return refreshed;
    } catch (error) {
      commitSession(null);
      throw error;
    }
  }, [commitSession]);

  // Wire the API client to the live auth state. The API can force one refresh on 401.
  useEffect(() => {
    setTokenProvider(async (forceRefresh = false) => {
      const current = sessionRef.current;
      if (!current || current.isDemo) return null;

      if (forceRefresh || current.expiresAt - Date.now() <= REFRESH_SKEW_MS) {
        const refreshed = await refreshCurrentSession();
        return refreshed?.accessToken ?? null;
      }

      return current.accessToken;
    });

    return () => setTokenProvider(async () => null);
  }, [refreshCurrentSession]);

  // Restore and validate an existing Supabase session on startup.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        clearStoredSessionIfModeChanged();
        const stored = loadStoredSession();
        if (!stored) return;

        if (configuredAuthMode === "demo" && stored.isDemo) {
          if (!cancelled) commitSession(stored);
          return;
        }

        if (configuredAuthMode !== "supabase" || stored.isDemo) {
          clearStoredSession();
          return;
        }

        let candidate = stored;
        if (candidate.expiresAt - Date.now() <= REFRESH_SKEW_MS) {
          candidate = await refreshSupabaseSession(candidate);
        }

        const valid = await validateSupabaseSession(candidate);
        if (!valid) {
          clearStoredSession();
          return;
        }

        if (!cancelled) commitSession(candidate);
      } catch {
        if (!cancelled) commitSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, [commitSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (configuredAuthMode === "demo") {
        const demo = makeDemoSession(email);
        commitSession(demo);
        return demo;
      }

      if (configuredAuthMode !== "supabase") {
        throw new Error(
          "AtlasWallet login is not configured. Production Supabase variables are required."
        );
      }

      const { response, payload } = await supabaseAuthRequest(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok || !payload) {
        throw new Error(authErrorMessage(payload, response.status));
      }

      const authenticated = toRealSession(payload);
      commitSession(authenticated);
      await ensureBackendAccount();
      return authenticated;
    },
    [commitSession]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      if (configuredAuthMode === "demo") {
        const demo = makeDemoSession(email);
        commitSession(demo);
        return demo;
      }

      if (configuredAuthMode !== "supabase") {
        throw new Error(
          "AtlasWallet registration is not configured. Production Supabase variables are required."
        );
      }

      const { response, payload } = await supabaseAuthRequest("/auth/v1/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok || !payload) {
        throw new Error(authErrorMessage(payload, response.status));
      }

      // With email confirmation enabled, signup legitimately returns a user but no session.
      if (!payload.access_token) {
        commitSession(null);
        return null;
      }

      const authenticated = toRealSession(payload);
      commitSession(authenticated);
      await ensureBackendAccount();
      return authenticated;
    },
    [commitSession]
  );

  const logout = useCallback(async () => {
    const current = sessionRef.current;

    if (
      current &&
      !current.isDemo &&
      SUPABASE_URL &&
      SUPABASE_PUBLISHABLE_KEY
    ) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: getSupabaseHeaders(current.accessToken),
          cache: "no-store",
        });
      } catch {
        // Local logout must still complete if the auth service is unreachable.
      }
    }

    commitSession(null);
  }, [commitSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      authMode: configuredAuthMode,
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function clearStoredSessionIfModeChanged() {
  const stored = loadStoredSession();
  if (!stored) return;
  if (configuredAuthMode === "supabase" && stored.isDemo) clearStoredSession();
  if (configuredAuthMode !== "supabase" && !stored.isDemo) clearStoredSession();
  if (configuredAuthMode === "unavailable") clearStoredSession();
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/** Illustrative state used only while explicit demo auth is enabled. */
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
      // Deliberately omitted until BLACK_30 pricing semantics are finalized server-side.
    },
    policyProfile: {
      code: institutionalConfig.defaultEntry.policyProfile,
      label: "Black Entry (Open)",
      operationalMode: "OPEN",
    },
  },
};
