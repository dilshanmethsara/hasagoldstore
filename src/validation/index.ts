/**
 * Reusable Zod validation schemas for HASA GOLD STORE.
 *
 * These schemas have ZERO framework coupling — they run in the browser
 * (forms via react-hook-form + `zodResolver`) and can be copy-pasted or
 * published to the backend to guarantee both sides validate identically.
 */

import { z } from "zod";

// ── Shared primitives ─────────────────────────────────────────────────

export const uuid = z.string().uuid({ message: "Invalid identifier" });

export const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email")
  .max(255);

/** Sri Lankan phone: +94XXXXXXXXX or 0XXXXXXXXX (9 digits after leading). */
export const phoneLK = z
  .string()
  .trim()
  .regex(/^(?:\+94|0)\d{9}$/, "Enter a valid Sri Lankan phone number");

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/\d/, "Must contain a number");

export const positiveMoney = z
  .number({ invalid_type_error: "Enter a valid amount" })
  .positive("Amount must be greater than zero")
  .max(10_000_000, "Amount is too large");

// ── Auth ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "Enter your name").max(80),
    email,
    password,
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
    confirm: z.string(),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const verifyPhoneSchema = z.object({
  phone: phoneLK,
  code: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, "Enter the 6-digit code"),
});
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;

// ── Profile ───────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(80).nullable().optional(),
  username: z
    .string()
    .trim()
    .regex(/^[a-z0-9_]{3,24}$/i, "3–24 letters, numbers or underscores")
    .nullable()
    .optional(),
  phone: phoneLK.nullable().optional(),
  country: z.string().trim().max(80).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const completeProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  phone: phoneLK,
  country: z.string().trim().min(2).max(80).default("Sri Lanka"),
});
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// ── Orders ────────────────────────────────────────────────────────────

export const paymentMethodSchema = z.enum([
  "card",
  "wallet",
  "ez_cash",
  "frimi",
  "bank_transfer",
]);

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "delivered",
  "completed",
  "paused",
  "cancelled",
  "failed",
  "refunded",
]);

export const createOrderSchema = z.object({
  gameId: uuid,
  packageId: uuid,
  playerId: z
    .string()
    .trim()
    .min(3, "Player ID is required")
    .max(40, "Player ID is too long"),
  serverId: z.string().trim().max(40).optional(),
  quantity: z.number().int().min(1).max(100).default(1),
  paymentMethod: paymentMethodSchema,
  promoCode: z.string().trim().min(1).max(40).optional(),
  useWallet: z.boolean().optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  note: z.string().trim().max(500).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ── Reviews ───────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  gameId: uuid.optional(),
  orderId: uuid.optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10 characters)")
    .max(2000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// ── Support tickets ───────────────────────────────────────────────────

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3, "Subject is required").max(120),
  category: z.string().trim().min(1).max(60),
  orderId: uuid.optional(),
  body: z.string().trim().min(10, "Describe the issue").max(4000),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const ticketMessageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;

// ── Wallet ────────────────────────────────────────────────────────────

export const walletTopUpSchema = z.object({
  amountLkr: positiveMoney,
  paymentMethod: paymentMethodSchema.exclude(["wallet"]),
});
export type WalletTopUpInput = z.infer<typeof walletTopUpSchema>;
