import { http } from "@/api/httpClient";
import type { SystemSettings } from "@/types";

export const settingsService = {
  get: () => http.get<SystemSettings>("/admin/settings"),
  update: (key: string, value: unknown) =>
    http.patch<SystemSettings>("/admin/settings", { key, value }),
};
