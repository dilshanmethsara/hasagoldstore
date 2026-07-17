import { http } from "@/api/httpClient";
import type {
  AccountStatus,
  AdminStats,
  AdminUser,
  Game,
  Order,
  Package,
  SupportTicket,
} from "@/types";

export const adminService = {
  stats: () => http.get<AdminStats>("/admin/stats"),

  listOrders: () => http.get<Order[]>("/admin/orders"),

  listUsers: () => http.get<AdminUser[]>("/admin/users"),
  userOrders: (userId: string) =>
    http.get<Order[]>(`/admin/users/${encodeURIComponent(userId)}/orders`),
  setUserStatus: (userId: string, status: AccountStatus, reason?: string) =>
    http.patch<AdminUser>(
      `/admin/users/${encodeURIComponent(userId)}/status`,
      { status, reason },
    ),
  deleteUser: (userId: string) =>
    http.delete<void>(`/admin/users/${encodeURIComponent(userId)}`),

  upsertGame: (input: Partial<Game> & { name: string; slug: string }) =>
    http.post<Game>("/admin/games", input),
  deleteGame: (id: string) =>
    http.delete<void>(`/admin/games/${encodeURIComponent(id)}`),
  toggleGameLive: (id: string, isLive: boolean) =>
    http.patch<Game>(`/admin/games/${encodeURIComponent(id)}`, { isLive }),

  listPackages: () =>
    http.get<(Package & { game?: Pick<Game, "id" | "name" | "slug"> })[]>(
      "/admin/packages",
    ),
  upsertPackage: (
    input: Partial<Package> & {
      gameId: string;
      label: string;
      amount: number;
      priceLkr: number;
    },
  ) => http.post<Package>("/admin/packages", input),
  deletePackage: (id: string) =>
    http.delete<void>(`/admin/packages/${encodeURIComponent(id)}`),
  togglePackage: (id: string, isActive: boolean) =>
    http.patch<Package>(`/admin/packages/${encodeURIComponent(id)}`, {
      isActive,
    }),

  listTickets: () => http.get<SupportTicket[]>("/admin/tickets"),
};
