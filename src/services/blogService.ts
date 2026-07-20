import { http } from "@/api/httpClient";
import type { BlogPost } from "@/types";

export const blogService = {
  list: () => http.get<BlogPost[]>("/blog"),
  get: (slug: string) => http.get<BlogPost>(`/blog/${encodeURIComponent(slug)}`),
};
