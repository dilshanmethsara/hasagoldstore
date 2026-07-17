import { http } from "@/api/httpClient";
import type { Package } from "@/types";

export const packageService = {
  listForGame: (gameId: string) =>
    http.get<Package[]>(`/games/${encodeURIComponent(gameId)}/packages`, {
      retries: 2,
    }),
};
