import { http } from "@/api/httpClient";
import type { SystemSettings } from "@/types";

export const settingsService = {
  get: () => http.get<SystemSettings>("/settings"),
  update: (
    key: keyof SystemSettings,
    value: SystemSettings[keyof SystemSettings],
  ) => http.patch<SystemSettings>(`/settings/${key}`, value),
};
