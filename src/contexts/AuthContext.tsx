/**
 * Cookie-based auth context.
 *
 * Backed by Auth.js on the server. There is deliberately NO token in
 * `localStorage` or `sessionStorage` — session lives in an HTTP-only
 * cookie set by the backend.
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
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type { AuthSession, User, Role } from "@/types";
import type { LoginInput, RegisterInput } from "@/validation";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  session: AuthSession | null;
  /** Kept for compatibility with legacy hook shape. */
  loading: boolean;
  hasRole: (role: Role) => boolean;
  refresh: () => Promise<void>;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => Promise<void>;
  loginWithGoogle: (redirect?: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const queryClient = useQueryClient();

  const applySession = useCallback((next: AuthSession | null) => {
    setSession(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  const refresh = useCallback(async () => {
    const next = await authService.session();
    applySession(next);
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await authService.session();
      if (!cancelled) applySession(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const next = await authService.login(input);
      applySession(next);
      queryClient.invalidateQueries();
      return next;
    },
    [applySession, queryClient],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const next = await authService.register(input);
      applySession(next);
      queryClient.invalidateQueries();
      return next;
    },
    [applySession, queryClient],
  );

  const logout = useCallback(async () => {
    await queryClient.cancelQueries();
    try {
      await authService.logout();
    } finally {
      queryClient.clear();
      applySession(null);
    }
  }, [applySession, queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    return {
      status,
      user,
      session,
      loading: status === "loading",
      hasRole: (role) => !!user?.roles?.includes(role),
      refresh,
      login,
      register,
      logout,
      loginWithGoogle: authService.loginWithGoogle,
    };
  }, [status, session, refresh, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
