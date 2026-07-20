/**
 * Generic error reporting for HASA GOLD STORE.
 *
 * This replaces the Lovable Cloud error reporting with a simple
 * console-based fallback. In production, this can be connected to
 * any error monitoring service (Sentry, LogRocket, etc.).
 */

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  
  console.error("[HASA Error]", {
    error,
    context: {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
  });
}
