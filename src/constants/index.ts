import type { OrderStatus, PaymentMethod, Role } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "delivered",
  "completed",
  "paused",
  "cancelled",
  "failed",
  "refunded",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "card",
  "wallet",
  "ez_cash",
  "frimi",
  "bank_transfer",
];

export const ROLES: Role[] = ["USER", "ADMIN", "MODERATOR"];

export const APP_ROUTES = {
  home: "/",
  games: "/games",
  dashboard: "/dashboard",
  admin: "/admin",
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  verifyPhone: "/auth/verify-phone",
  completeProfile: "/auth/complete-profile",
} as const;

export const CURRENCY_LKR = "LKR";
