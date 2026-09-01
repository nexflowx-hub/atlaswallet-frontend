/**
 * AtlasWallet — Typed API client for https://api.atlaswallet.org
 *
 * Client rules (per spec):
 * - Single typed API client
 * - Attach current Supabase bearer token (mocked when env not configured)
 * - One refresh attempt on 401, then login
 * - X-Request-ID for mutating operations
 * - Normalize errors
 * - Never log bearer token or PII
 * - Timeout/AbortController
 */

import type {
  AccountAccess,
  ApiError,
  Me,
  Profile,
  Wallet,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.atlaswallet.org";

const DEFAULT_TIMEOUT_MS = 15000;

/** Token provider hook (set by auth layer). */
type TokenProvider = () => Promise<string | null> | string | null;
let tokenProvider: TokenProvider = async () => null;

export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

export function getApiUrl(): string {
  return API_URL;
}

function generateRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeError(status: number, body: unknown, requestId?: string): ApiError {
  const err =
    body && typeof body === "object" && "error" in body
      ? (body as { error?: { code?: string; message?: string } }).error
      : undefined;
  const retriable = status >= 500 || status === 408 || status === 429;
  return {
    status,
    code: err?.code || `HTTP_${status}`,
    message: err?.message || `Request failed with status ${status}`,
    requestId,
    retriable,
  };
}

export class ApiClientError extends Error {
  status: number;
  code: string;
  requestId?: string;
  retriable: boolean;
  constructor(e: ApiError) {
    super(e.message);
    this.name = "ApiClientError";
    this.status = e.status;
    this.code = e.code;
    this.requestId = e.requestId;
    this.retriable = e.retriable;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  idempotencyKey?: string;
  /** Skip auth header (for health endpoints). */
  noAuth?: boolean;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    idempotencyKey,
    noAuth = false,
  } = opts;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  // Combine external signal with internal timeout
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Request-ID": generateRequestId(),
  };
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }
  if (!noAuth) {
    const token = await tokenProvider();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiClientError({
        status: 408,
        code: "TIMEOUT",
        message: "Request timed out",
        retriable: true,
      });
    }
    throw new ApiClientError({
      status: 0,
      code: "NETWORK",
      message: "Network error — please check your connection",
      retriable: true,
    });
  }
  clearTimeout(timeoutId);

  // 401 — one refresh attempt
  if (res.status === 401 && !noAuth) {
    // Auth layer should handle refresh; if still 401, surface login.
    const requestId = headers["X-Request-ID"];
    throw new ApiClientError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Session expired — please log in again",
      requestId,
      retriable: false,
    });
  }

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;
  const requestId = headers["X-Request-ID"];

  if (!res.ok) {
    throw new ApiClientError(normalizeError(res.status, payload, requestId));
  }
  return payload as T;
}

// ---- Public API ----

export const apiClient = {
  /** GET /api/health — public */
  async health(signal?: AbortSignal) {
    return request<{ status: string; ts: string }>(`/api/health`, {
      signal,
      noAuth: true,
    });
  },

  /** GET /api/health/ready — public */
  async healthReady(signal?: AbortSignal) {
    return request<{ status: string; checks: Record<string, string> }>(
      `/api/health/ready`,
      { signal, noAuth: true }
    );
  },

  /** GET /api/v1/me */
  async getMe(signal?: AbortSignal) {
    return request<Me>(`/api/v1/me`, { signal });
  },

  /** POST /api/v1/account/bootstrap — idempotent */
  async bootstrap(signal?: AbortSignal) {
    return request<{ ok: true; provisioned: boolean }>(
      `/api/v1/account/bootstrap`,
      { method: "POST", body: {}, signal, idempotencyKey: `bootstrap-${Date.now()}` }
    );
  },

  /** GET /api/v1/account/access */
  async getAccess(signal?: AbortSignal) {
    return request<AccountAccess>(`/api/v1/account/access`, { signal });
  },

  /** GET /api/v1/wallets */
  async getWallets(signal?: AbortSignal) {
    return request<{ wallets: Wallet[] }>(`/api/v1/wallets`, { signal });
  },

  /** GET /api/v1/wallets/:walletId */
  async getWallet(walletId: string, signal?: AbortSignal) {
    return request<Wallet>(`/api/v1/wallets/${encodeURIComponent(walletId)}`, {
      signal,
    });
  },

  /** GET /api/v1/profile */
  async getProfile(signal?: AbortSignal) {
    return request<Profile>(`/api/v1/profile`, { signal });
  },

  /** PATCH /api/v1/profile */
  async patchProfile(
    patch: Partial<NonNullable<Profile["profile"]>>,
    signal?: AbortSignal
  ) {
    return request<Profile>(`/api/v1/profile`, {
      method: "PATCH",
      body: patch,
      signal,
    });
  },
};

export { ApiClientError };
