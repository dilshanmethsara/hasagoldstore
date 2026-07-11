/**
 * Legacy hook shape kept for compatibility with existing components.
 * New code should import `useAuthContext` from `@/contexts/AuthContext`.
 */

import { useAuthContext } from "@/contexts/AuthContext";
import type { AuthSession, User } from "@/types";

export type AuthState = {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const { user, session, loading } = useAuthContext();
  return { user, session, loading };
}

/**
 * Convenience sign-out helper. For proper cache teardown prefer
 * `useAuthContext().logout()` inside components with router access.
 */
export async function signOut(): Promise<void> {
  const { authService } = await import("@/services/authService");
  await authService.logout();
  if (typeof window !== "undefined") {
    window.location.assign("/auth/login");
  }
}