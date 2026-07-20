import { http, resetCsrfToken } from "@/api/httpClient";
import type { AuthSession, User } from "@/types";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  VerifyEmailInput,
  VerifyPhoneInput,
} from "@/validation";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Auth.js compatible authentication service.
 *
 * The backend is expected to expose Auth.js-style routes at `/auth/*`:
 *   GET  /auth/session            → { user, expires } or empty {}
 *   GET  /auth/csrf               → { csrfToken }
 *   POST /auth/callback/credentials { email, password, csrfToken }
 *   POST /auth/signout            { csrfToken }
 *   GET  /auth/signin/google      (302 redirect)
 */
export const authService = {
  session: async (): Promise<AuthSession | null> => {
    try {
      const raw = await http.get<AuthSession | Record<string, never>>(
        "/auth/session",
      );
      if (!raw || !("user" in raw)) return null;
      return raw as AuthSession;
    } catch {
      return null;
    }
  },

  me: () => http.get<User>("/users/me"),

  login: async (input: LoginInput) => {
    const res = await http.post<{ user: User; token?: string }>("/auth/callback/credentials", input);
    if (res.token) {
      localStorage.setItem("auth_token", res.token);
    }
    return {
      user: res.user,
      profile: res.user.profile ?? null,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    } as AuthSession;
  },

  register: async (input: RegisterInput) => {
    const res = await http.post<{ user: User; token?: string; requiresVerification?: boolean }>("/auth/register", input);
    // Don't set token if registration requires verification (user not verified yet)
    if (res.token) {
      localStorage.setItem("auth_token", res.token);
    }
    return {
      user: res.user,
      profile: res.user.profile ?? null,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      requiresVerification: res.requiresVerification,
    } as AuthSession & { requiresVerification?: boolean };
  },

  logout: async () => {
    try {
      await http.post<void>("/auth/signout");
    } finally {
      localStorage.removeItem("auth_token");
      resetCsrfToken();
    }
  },

  loginWithGoogle: (redirect: string = "/dashboard") => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({ callbackUrl: redirect });
    window.location.href = `${BASE_URL}/auth/signin/google?${params.toString()}`;
  },

  forgotPassword: (input: ForgotPasswordInput) =>
    http.post<{ ok: true }>("/auth/forgot-password", input),

  resetPassword: (input: ResetPasswordInput) =>
    http.post<{ ok: true }>("/auth/reset-password", input),

  changePassword: (input: ChangePasswordInput) =>
    http.post<{ ok: true }>("/auth/change-password", input),

  verifyEmail: (input: VerifyEmailInput) =>
    http.post<{ ok: true }>("/auth/verify-email", input),

  requestPhoneCode: (phone: string, method: "sms" | "whatsapp") =>
    http.post<{ ok: true }>("/auth/verify-phone/start", { phone, method }),

  verifyPhone: (input: VerifyPhoneInput) =>
    http.post<{ ok: true }>("/auth/verify-phone/confirm", input),
};
