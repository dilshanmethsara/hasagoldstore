import { http } from "@/api/httpClient";
import type { Game } from "@/types";

export const gameService = {
  list: () => http.get<Game[]>("/games", { retries: 2 }),
  bySlug: (slug: string) => http.get<Game>(`/games/${encodeURIComponent(slug)}`),
};
