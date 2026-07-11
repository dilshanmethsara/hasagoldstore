import { http } from "@/api/httpClient";
import type { Announcement } from "@/types";

export const announcementService = {
  listActive: () => http.get<Announcement[]>("/announcements?active=1"),
};
