import { http } from "@/api/httpClient";
import type { AppNotification } from "@/types";

export const notificationService = {
  list: () => http.get<AppNotification[]>("/notifications"),
  markRead: (id: string) =>
    http.patch<void>(`/notifications/${encodeURIComponent(id)}/read`),
  markAllRead: () => http.patch<void>("/notifications/read-all"),
};
