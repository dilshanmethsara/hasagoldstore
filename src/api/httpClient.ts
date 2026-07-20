/**
 * Reusable HTTP client for the HASA GOLD STORE backend REST API.
 *
 * - Base URL from `VITE_API_BASE_URL`.
 * - Sends `credentials: "include"` on every request so Auth.js
 *   HTTP-only session cookies are attached automatically.
 * - Timeout via `AbortController` (default 15s).
 * - Automatic JSON parsing on 2xx / uniform `ApiError` on non-2xx.
 * - Opt-in retry with exponential backoff for idempotent GETs.
 * - Automatic CSRF token attach on mutating requests using the
 *   Auth.js `/auth/csrf` endpoint (cached in-memory).
 *
 * The client MUST remain the only place in the frontend that talks to
 * `fetch()` for API traffic. Feature code goes through
 * `src/services/*.ts` which wrap `http.*`.
 */

import type { ApiErrorPayload } from "@/types";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  email?: string;
  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.details = payload.details;
    this.email = (payload as any).email;
  }
}

export interface HttpOptions {
  /** Abort in-flight request after this many ms. Default 15000. */
  timeoutMs?: number;
  /** Retry idempotent GETs up to this many times. Default 0. */
  retries?: number;
  /** External abort signal (composed with the timeout signal). */
  signal?: AbortSignal;
  /** Extra headers merged onto defaults. */
  headers?: Record<string, string>;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

let csrfToken: string | null = null;
let csrfPromise: Promise<string | null> | null = null;

async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  if (!BASE_URL) return null;
  if (!csrfPromise) {
    csrfPromise = fetch(`${BASE_URL}/auth/csrf`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? (r.json() as Promise<{ csrfToken?: string }>) : null))
      .then((json) => {
        csrfToken = json?.csrfToken ?? null;
        return csrfToken;
      })
      .catch(() => null)
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

/** Clear the cached CSRF token (call after sign out / login). */
export function resetCsrfToken(): void {
  csrfToken = null;
}

function composeSignal(a?: AbortSignal, b?: AbortSignal): AbortSignal | undefined {
  if (!a) return b;
  if (!b) return a;
  const ctrl = new AbortController();
  const forward = (sig: AbortSignal) => {
    if (sig.aborted) ctrl.abort(sig.reason);
    else sig.addEventListener("abort", () => ctrl.abort(sig.reason), { once: true });
  };
  forward(a);
  forward(b);
  return ctrl.signal;
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  options: HttpOptions = {},
): Promise<T> {
  if (!BASE_URL) {
    // During SSR, VITE_API_BASE_URL is not available — return null silently
    // so components can render loading state; client will re-fetch with real env.
    if (typeof window === "undefined") return null as T;
    throw new ApiError(0, {
      code: "NO_API_BASE_URL",
      message:
        "VITE_API_BASE_URL is not set. Point it at your backend (see README.md).",
    });
  }

  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const isMutation = method !== "GET";
  const maxAttempts = Math.max(1, (isMutation ? 0 : options.retries ?? 0) + 1);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  if (isMutation) {
    const token = await getCsrfToken();
    if (token) headers["x-csrf-token"] = token;
  }

  let attempt = 0;
  let lastError: unknown;
  while (attempt < maxAttempts) {
    attempt += 1;
    const timeoutCtrl = new AbortController();
    const timer = setTimeout(() => timeoutCtrl.abort(new Error("timeout")), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: composeSignal(options.signal, timeoutCtrl.signal),
      });
      clearTimeout(timer);

      if (!res.ok) {
        const payload =
          (await parseJsonSafe<ApiErrorPayload>(res)) ?? {
            code: `HTTP_${res.status}`,
            message: res.statusText || `Request failed with status ${res.status}`,
          };
        // Refresh CSRF on 403 mutations, in case Auth.js rotated it.
        if (res.status === 403 && isMutation) resetCsrfToken();
        // During SSR, auth-protected endpoints fail gracefully — return null
        // so the client can hydrate and retry with real cookies/tokens.
        if (res.status === 401 && typeof window === "undefined") {
          return null as T;
        }
        throw new ApiError(res.status, payload);
      }

      if (res.status === 204) return undefined as T;
      return ((await parseJsonSafe<T>(res)) ?? (undefined as T)) as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      // Do not retry 4xx or explicit aborts from the caller.
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) throw err;
      if (options.signal?.aborted) throw err;
      if (attempt >= maxAttempts) throw err;
      const backoff = 250 * 2 ** (attempt - 1);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Request failed for unknown reasons");
}

export const http = {
  get: <T>(path: string, options?: HttpOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: HttpOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: HttpOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: HttpOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: HttpOptions) =>
    request<T>("DELETE", path, undefined, options),
};
