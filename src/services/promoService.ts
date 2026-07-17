import { http } from "@/api/httpClient";
import type { PromoCode } from "@/types";

export const promoService = {
  listActive: () => http.get<PromoCode[]>("/promo-codes/active"),
  validate: (code: string, subtotalLkr: number) =>
    http.post<{ code: PromoCode; discountLkr: number } | null>(
      "/promo-codes/validate",
      { code, subtotalLkr },
    ),
};
