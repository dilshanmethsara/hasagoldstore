import { http } from "@/api/httpClient";
import type { Favorite } from "@/types";

export const favoriteService = {
  list: () => http.get<Favorite[]>("/favorites"),
  add: (gameId: string) => http.post<Favorite>("/favorites", { gameId }),
  remove: (gameId: string) =>
    http.delete<void>(`/favorites/${encodeURIComponent(gameId)}`),
};
