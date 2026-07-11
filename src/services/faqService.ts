import { http } from "@/api/httpClient";
import type { Faq } from "@/types";

export const faqService = {
  list: (category?: string) =>
    http.get<Faq[]>(
      `/faqs${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    ),
};
