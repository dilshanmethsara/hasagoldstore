/**
 * Query/mutation hooks — thin wrappers around the REST service layer.
 *
 * Kept at the legacy path so components don't need to change imports.
 * The real implementation lives in `src/services/*` and is called via
 * the shared HTTP client (`src/api/httpClient.ts`).
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import {
  adminService,
  announcementService,
  blogService,
  faqService,
  favoriteService,
  gameService,
  notificationService,
  orderService,
  packageService,
  promoService,
  reviewService,
  settingsService,
  supportService,
  userService,
  walletService,
} from "@/services";
import type {
  AccountStatus,
  AdminUser,
  Announcement,
  AppNotification as Notification,
  BlogPost,
  Favorite,
  Faq,
  Game,
  Order,
  OrderStatus,
  Package,
  PaymentMethod,
  Profile,
  PromoCode,
  Review,
  SupportTicket,
  SystemSettings,
  TicketMessage,
  WalletTransaction as WalletTx,
} from "@/types";

export type {
  Game,
  Package,
  Order,
  WalletTx,
  Notification,
  PromoCode,
  SupportTicket,
  TicketMessage,
  Review,
  BlogPost,
  Faq,
  Announcement,
  Favorite,
  Profile,
  AccountStatus,
  SystemSettings,
};

function toastError(e: unknown) {
  toast.error(e instanceof Error ? e.message : "Something went wrong");
}

/* ===================== READS (public) ===================== */

export function useGames(onlyLive = true) {
  return useQuery({ queryKey: ["games"], queryFn: () => gameService.list() });
}

export function useAdminGames() {
  return useQuery({ queryKey: ["admin", "games"], queryFn: () => adminService.listGames() });
}

export function useGame(slug: string | undefined) {
  return useQuery({
    queryKey: ["game", slug],
    enabled: !!slug,
    queryFn: () => gameService.bySlug(slug!),
  });
}

export function usePackages(gameId: string | undefined) {
  return useQuery({
    queryKey: ["packages", gameId],
    enabled: !!gameId,
    queryFn: () => packageService.listForGame(gameId!),
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => announcementService.listActive(),
  });
}

export function useFaqs(category?: string) {
  return useQuery({
    queryKey: ["faqs", category ?? "all"],
    queryFn: () => faqService.list(category),
  });
}

export function useBlogPosts(_opts?: { adminAll?: boolean }) {
  return useQuery({
    queryKey: ["blog", _opts?.adminAll ? "all" : "published"],
    queryFn: () => blogService.list(),
  });
}

export function useApprovedReviews() {
  return useQuery({
    queryKey: ["reviews", "approved"],
    queryFn: () => reviewService.listApproved(),
  });
}

/* ===================== USER SCOPED ===================== */

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: () => userService.profile(),
  });
}

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["role", user?.id, "admin"],
    enabled: !!user,
    queryFn: () => Promise.resolve(!!user?.roles?.includes("ADMIN")),
  });
}

export function useMyOrders(limit?: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orders", "mine", user?.id, limit],
    enabled: !!user,
    queryFn: () => orderService.listMine(limit),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id!,
        );
      try {
        return await orderService.get(id!);
      } catch {
        if (!isUuid) return (await orderService.trackByNumber(id!)) as Order;
        return null;
      }
    },
  });
}

export function useWallet() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wallet", user?.id],
    enabled: !!user,
    queryFn: () => walletService.summary(),
  });
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: () => notificationService.list(),
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return (data ?? []).filter((n) => !n.is_read).length;
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useFavorites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: () => favoriteService.list(),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ gameId, isFav }: { gameId: string; isFav: boolean }) => {
      if (isFav) await favoriteService.remove(gameId);
      else await favoriteService.add(gameId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    onError: toastError,
  });
}

export function usePromoCodes() {
  return useQuery({
    queryKey: ["promo_codes"],
    queryFn: () => promoService.listActive(),
  });
}

export function useMyTickets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tickets", "mine", user?.id],
    enabled: !!user,
    queryFn: () => supportService.listMine(),
  });
}

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ["ticket", id],
    enabled: !!id,
    queryFn: () => supportService.get(id!),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      subject: string;
      category: string;
      body: string;
      orderId?: string;
    }) =>
      supportService.create({
        subject: input.subject,
        category: input.category,
        body: input.body,
        orderId: input.orderId,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket submitted — we'll reply soon.");
    },
    onError: toastError,
  });
}

export function useReplyToTicket(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => supportService.reply(ticketId, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket", ticketId] }),
    onError: toastError,
  });
}

/* ===================== ORDER CREATION ===================== */

export type CreateOrderInput = {
  game: Game;
  pkg: Package;
  playerId: string;
  paymentMethod: PaymentMethod;
  quantity?: number;
  promoCode?: string;
  useWallet?: boolean;
};

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      orderService.create({
        gameId: input.game.id,
        packageId: input.pkg.id,
        playerId: input.playerId,
        paymentMethod: input.paymentMethod,
        quantity: input.quantity ?? 1,
        promoCode: input.promoCode,
        useWallet: input.useWallet,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: toastError,
  });
}

export function useTopUpWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) =>
      walletService.topUp({ amountLkr: amount, paymentMethod: "card" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Wallet topped up");
    },
    onError: toastError,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      gameId?: string;
      orderId?: string;
      rating: number;
      title?: string;
      body: string;
    }) =>
      reviewService.create({
        gameId: input.gameId,
        orderId: input.orderId,
        rating: input.rating,
        title: input.title,
        body: input.body,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Thanks for your review — awaiting moderation.");
    },
    onError: toastError,
  });
}

/* ===================== ADMIN ===================== */

export function useAdminStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: () => adminService.stats() });
}

export function useAdminOrders() {
  return useQuery({ 
    queryKey: ["admin", "orders"], 
    queryFn: async () => {
      const result = await adminService.listOrders();
      return result.orders;
    }
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
    onError: toastError,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const result = await adminService.listUsers();
      // Backend returns User[] with nested profile. Merge profile into user for AdminUser type.
      return result.users.map((u: any) => ({
        ...u,
        display_name: u.profile?.display_name ?? null,
        username: u.profile?.username ?? null,
        avatar_url: u.profile?.avatar_url ?? null,
        phone: u.profile?.phone ?? u.phone ?? null,
        country: u.profile?.country ?? null,
        status: u.profile?.status ?? u.status,
        status_reason: u.profile?.status_reason ?? null,
        status_updated_at: u.profile?.status_updated_at ?? null,
        created_at: u.profile?.created_at ?? u.created_at,
      }));
    }
  });
}

export function useAdminTickets() {
  return useQuery({ 
    queryKey: ["admin", "tickets"], 
    queryFn: async () => {
      const result = await adminService.listTickets();
      return result.tickets;
    }
  });
}

/* ===================== GENERIC CRUD ===================== */

export function useSimpleQuery<T>(
  key: readonly unknown[],
  fn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) {
  return useQuery({ queryKey: key, queryFn: fn, ...options });
}

/* ===================== ADMIN CRUD ===================== */

export function useUpsertGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Game> & { name: string; slug: string }) =>
      adminService.upsertGame(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Game saved");
    },
    onError: toastError,
  });
}

export function useDeleteGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteGame(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game removed");
    },
    onError: toastError,
  });
}

export function useToggleGameLive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_live }: { id: string; is_live: boolean }) =>
      adminService.toggleGameLive(id, is_live),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["games"] }),
    onError: toastError,
  });
}

export function useAdminPackages() {
  return useQuery({
    queryKey: ["admin", "packages"],
    queryFn: () => adminService.listPackages(),
  });
}

export function useUpsertPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      input: Partial<Package> & {
        game_id: string;
        label: string;
        amount: number;
        price_lkr: number;
      },
    ) =>
      adminService.upsertPackage({
        ...input,
        gameId: input.game_id,
        priceLkr: input.price_lkr,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package saved");
    },
    onError: toastError,
  });
}

export function useDeletePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deletePackage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "packages"] });
      toast.success("Package removed");
    },
    onError: toastError,
  });
}

export function useTogglePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminService.togglePackage(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "packages"] }),
    onError: toastError,
  });
}

export function useSetUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
      reason,
    }: {
      userId: string;
      status: AccountStatus;
      reason?: string;
    }) => adminService.setUserStatus(userId, status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Account status updated");
    },
    onError: toastError,
  });
}

export function useUserOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "user-orders", userId],
    enabled: !!userId,
    queryFn: () => adminService.userOrders(userId!),
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ["system_settings"],
    queryFn: () => {
      // Skip during SSR — no auth context, no cookies, return safe defaults
      if (typeof window === "undefined") return Promise.resolve(null);
      return settingsService.get();
    },
    staleTime: 30_000,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      key,
      value,
    }: {
      key: keyof SystemSettings;
      value: { enabled: boolean; message: string };
    }) => settingsService.update(key, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["system_settings"] });
      toast.success("Settings updated");
    },
    onError: toastError,
  });
}

/**
 * Placeholder: real user deletion happens through `/admin/users/:id`.
 * Provided so admin UI keeps compiling; wire to `adminService.deleteUser`.
 */
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("User deleted");
    },
    onError: toastError,
  });
};