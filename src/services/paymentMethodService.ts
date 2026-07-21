import { http } from "@/api/httpClient";
import type { PaymentMethodConfig } from "@/types";

export const paymentMethodService = {
  list: () => http.get<PaymentMethodConfig[]>("/admin/payment-methods"),
  listActive: () => http.get<PaymentMethodConfig[]>("/payment-methods"),
  create: (data: Partial<PaymentMethodConfig> & { slug: string; label: string }) =>
    http.post<PaymentMethodConfig>("/admin/payment-methods", data),
  update: (id: string, data: Partial<PaymentMethodConfig>) =>
    http.patch<PaymentMethodConfig>(`/admin/payment-methods/${encodeURIComponent(id)}`, data),
  remove: (id: string) =>
    http.delete<void>(`/admin/payment-methods/${encodeURIComponent(id)}`),
  toggleActive: (id: string, isActive: boolean) =>
    http.patch<PaymentMethodConfig>(`/admin/payment-methods/${encodeURIComponent(id)}/toggle`, { isActive }),
};
