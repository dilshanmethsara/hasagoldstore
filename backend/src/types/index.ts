import { Role, AccountStatus, OrderStatus, PaymentMethod, WalletTxnType, NotificationType, PromoKind, TicketStatus } from '@prisma/client';

export type {
  Role,
  AccountStatus,
  OrderStatus,
  PaymentMethod,
  WalletTxnType,
  NotificationType,
  PromoKind,
  TicketStatus,
};

export class ApiError extends Error {
  code: string;
  details?: unknown;
  email?: string;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.email = (details as any)?.email;
  }
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    email_verified: boolean;
    phone?: string;
    phone_verified: boolean;
    roles: Role[];
    status: AccountStatus;
    created_at: Date;
  };
  profile?: {
    id: string;
    user_id: string;
    display_name?: string;
    username?: string;
    avatar_url?: string;
    phone?: string;
    country?: string;
    status: AccountStatus;
    status_reason?: string;
    status_updated_at?: Date;
    created_at: Date;
  };
  expires: string;
}

export interface CreateOrderInput {
  gameId: string;
  packageId: string;
  playerId: string;
  paymentMethod: PaymentMethod;
  quantity?: number;
  promoCode?: string;
  useWallet?: boolean;
}
