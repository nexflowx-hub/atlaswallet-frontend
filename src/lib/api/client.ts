/**
 * AtlasWallet — typed API client for https://api.atlaswallet.org
 *
 * Rules:
 * - financial state comes only from the AtlasWallet backend;
 * - bearer token comes from the auth layer;
 * - one forced token refresh is allowed after HTTP 401;
 * - mutating requests carry request/idempotency metadata where applicable;
 * - bearer tokens and PII are never logged here.
 */

import type {
  AccountAccess,
  ApiError,
  BootstrapResponse,
  Me,
  Profile,
  Wallet,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.atlaswallet.org";

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Auth hook. `forceRefresh=true` asks the auth layer to rotate/refresh the
 * Supabase access token before returning it.
 */
type TokenProvider = (forceRefresh?: boolean) => Promise<string | null> | string | null;
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
  const nested =
    body && typeof body === "object" && "error" in body
      ? (body as { error?: { code?: string; message?: string } }).error
      : undefined;

  const direct =
    body && typeof body === "object"
      ? (body as { code?: string; message?: string })
      : undefined;

  const retriable = status >= 500 || status === 408 || status === 429;

  return {
    status,
    code: nested?.code || direct?.code || `HTTP_${status}`,
    message:
      nested?.message || direct?.message || `Request failed with status ${status}`,
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
  /** Skip auth header (health endpoints). */
  noAuth?: boolean;
  /** Internal guard: never retry authentication more than once. */
  authRetried?: boolean;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    idempotencyKey,
    noAuth = false,
    authRetried = false,
  } = opts;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const requestId = generateRequestId();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Request-ID": requestId,
  };

  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  if (!noAuth) {
    const token = await tokenProvider(false);
    if (token) headers.Authorization = `Bearer ${token}`;
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
        requestId,
        retriable: true,
      });
    }
    throw new ApiClientError({
      status: 0,
      code: "NETWORK",
      message: "Network error — please check your connection",
      requestId,
      retriable: true,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (res.status === 401 && !noAuth && !authRetried) {
    try {
      const refreshedToken = await tokenProvider(true);
      if (refreshedToken) {
        return request<T>(path, { ...opts, authRetried: true });
      }
    } catch {
      // Fall through to the normalized unauthorized response below.
    }
  }

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    if (res.status === 401 && !noAuth) {
      throw new ApiClientError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Session expired — please log in again",
        requestId,
        retriable: false,
      });
    }
    throw new ApiClientError(normalizeError(res.status, payload, requestId));
  }

  return payload as T;
}

export const apiClient = {
  async health(signal?: AbortSignal) {
    return request<{
      status: string;
      service: string;
      version: string;
      timestamp: string;
    }>(`/api/health`, { signal, noAuth: true });
  },

  async healthReady(signal?: AbortSignal) {
    return request<{
      status: string;
      service: string;
      version: string;
      dependencies: Record<string, string>;
      timestamp: string;
    }>(`/api/health/ready`, { signal, noAuth: true });
  },

  async getMe(signal?: AbortSignal) {
    return request<Me>(`/api/v1/me`, { signal });
  },

  async bootstrap(signal?: AbortSignal) {
    return request<BootstrapResponse>(`/api/v1/account/bootstrap`, {
      method: "POST",
      body: {},
      signal,
      idempotencyKey: `bootstrap-${Date.now()}`,
    });
  },

  async getAccess(signal?: AbortSignal) {
    return request<AccountAccess>(`/api/v1/account/access`, { signal });
  },

  async getWallets(signal?: AbortSignal) {
    return request<{ accountId: string; baseCurrency: string; wallets: Wallet[] }>(
      `/api/v1/wallets`,
      { signal }
    );
  },

  async getWallet(walletId: string, signal?: AbortSignal) {
    return request<Wallet>(`/api/v1/wallets/${encodeURIComponent(walletId)}`, {
      signal,
    });
  },

  async getProfile(signal?: AbortSignal) {
    return request<Profile>(`/api/v1/profile`, { signal });
  },

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
