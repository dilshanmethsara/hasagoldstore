/**
 * Central type exports for the HASA GOLD STORE frontend.
 *
 * These interfaces describe the JSON shapes exchanged with the backend
 * REST API. They are the source of truth for every service in
 * `src/services/*` and every query hook in `src/hooks/queries.ts`.
 *
 * The backend Prisma schema (see `prisma/schema.prisma`) is designed to
 * serialize into these shapes 1:1.
 */

/**
 * REST payload shapes exchanged between the frontend and backend.
 *
 * Field naming intentionally uses snake_case to match the existing UI
 * templates. The Prisma schema uses camelCase model fields with
 * `@map("snake_case")` column names, and the backend serializes rows
 * into these shapes (see `docs/API_SPEC.md`).
 */

export type UUID = string;
export type ISODateString = string;

export type Role = "USER" | "ADMIN" | "MODERATOR";
export type AccountStatus = "active" | "pending" | "suspended" | "banned";

export interface User {
  id: UUID;
  email: string;
  email_verified: boolean;
  phone: string | null;
  phone_verified: boolean;
  roles: Role[];
  status: AccountStatus;
  created_at: ISODateString;
  profile?: Profile;
}

export interface Profile {
  id: UUID;
  user_id: UUID;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string | null;
  status: AccountStatus;
  status_reason: string | null;
  status_updated_at: ISODateString | null;
  created_at: ISODateString;
}

export interface Game {
  id: UUID;
  slug: string;
  name: string;
  tagline: string | null;
  publisher: string | null;
  image_url: string | null;
  card_image: string | null;
  hero_image: string | null;
  popularity: number;
  is_featured: boolean;
  sort_order: number;
  is_live: boolean;
  created_at: ISODateString;
}

export interface Package {
  id: UUID;
  game_id: UUID;
  label: string;
  amount: number;
  bonus: number;
  price_lkr: number;
  currency: string;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "delivered"
  | "completed"
  | "paused"
  | "cancelled"
  | "failed"
  | "refunded";

export type PaymentMethod =
  | "card"
  | "wallet"
  | "ez_cash"
  | "frimi"
  | "bank_transfer";

/** DB-backed payment method (from `payment_methods` table). */
export interface PaymentMethodConfig {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  icon_url: string | null;
  instructions: string | null;
  min_amount: number | null;
  max_amount: number | null;
  fee_percent: number;
  fee_fixed: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderTimelineEntry {
  at: ISODateString;
  label: string;
  status: OrderStatus;
}

export interface Order {
  id: UUID;
  order_number: string;
  user_id: UUID | null;
  game_id: UUID;
  game_name: string;
  package_id: UUID;
  package_label: string;
  player_id: string;
  quantity: number;
  subtotal_lkr: number;
  discount_lkr: number;
  total_lkr: number;
  currency: string;
  payment_method: PaymentMethod;
  status: OrderStatus;
  promo_code: string | null;
  timeline: OrderTimelineEntry[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** Limited public view returned by `GET /orders/track/:number`. */
export type PublicOrder = Pick<
  Order,
  | "id"
  | "order_number"
  | "status"
  | "game_name"
  | "package_label"
  | "player_id"
  | "total_lkr"
  | "created_at"
  | "timeline"
>;

export type WalletTxnType = "credit" | "debit" | "bonus" | "refund";

export interface WalletTransaction {
  id: UUID;
  user_id: UUID;
  type: WalletTxnType;
  amount_lkr: number;
  balance_after: number;
  description: string | null;
  order_id: UUID | null;
  created_at: ISODateString;
}

export interface WalletSummary {
  balance: number;
  transactions: WalletTransaction[];
}

export type NotificationType =
  | "order"
  | "wallet"
  | "promo"
  | "ticket"
  | "system";

export interface AppNotification {
  id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: ISODateString;
}

export type PromoKind = "percent" | "fixed";

export interface PromoCode {
  id: UUID;
  code: string;
  description: string | null;
  kind: PromoKind;
  value: number;
  min_spend_lkr: number;
  is_active: boolean;
  expires_at: ISODateString | null;
  redemptions_count: number;
  created_at: ISODateString;
}

export interface Review {
  id: UUID;
  user_id: UUID;
  game_id: UUID | null;
  order_id: UUID | null;
  rating: number;
  title: string | null;
  body: string;
  is_approved: boolean;
  created_at: ISODateString;
}

export type TicketStatus = "open" | "pending" | "resolved" | "closed";

export interface SupportTicket {
  id: UUID;
  user_id: UUID;
  order_id: UUID | null;
  subject: string;
  category: string;
  status: TicketStatus;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface TicketMessage {
  id: UUID;
  ticket_id: UUID;
  sender_id: UUID;
  body: string;
  created_at: ISODateString;
}

export interface Favorite {
  user_id: UUID;
  game_id: UUID;
  created_at: ISODateString;
  game: Game;
}

export interface Faq {
  id: UUID;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: UUID;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  is_published: boolean;
  published_at: ISODateString | null;
  created_at: ISODateString;
}

export interface Announcement {
  id: UUID;
  title: string;
  body: string | null;
  is_active: boolean;
  created_at: ISODateString;
}

export interface AdminUser {
  id: UUID;
  email: string;
  roles: Role[];
  status: AccountStatus;
  created_at: ISODateString;
  profile?: Profile;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string | null;
  status_reason: string | null;
  status_updated_at: ISODateString | null;
}

export interface AdminStats {
  revenue: number;
  today_rev: number;
  order_count: number;
  user_count: number;
  open_tickets: number;
  chart?: { date: string; value: number }[];
}

export interface SystemSettings {
  maintenance: { enabled: boolean; message: string };
  security_lock: { enabled: boolean; message: string };
}

export interface AuthSession {
  user: User;
  profile: Profile | null;
  expires: ISODateString;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}
