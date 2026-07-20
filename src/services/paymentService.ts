import { http } from "@/api/httpClient";
import type { Order, PaymentMethod } from "@/types";

/** Placeholder payment service — routes through the chosen provider server-side. */
export const paymentService = {
  charge: (orderId: string, method: PaymentMethod) =>
    http.post<Order>(`/payments/${encodeURIComponent(orderId)}/charge`, {
      method,
    }),
  status: (orderId: string) =>
    http.get<Order>(`/payments/${encodeURIComponent(orderId)}`),
};
