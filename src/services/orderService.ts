import { http } from "@/api/httpClient";
import type { Order, OrderStatus, PublicOrder } from "@/types";
import type { CreateOrderInput } from "@/validation";

export const orderService = {
  listMine: (limit?: number) =>
    http.get<Order[]>(`/orders${limit ? `?limit=${limit}` : ""}`),
  get: (id: string) => http.get<Order>(`/orders/${encodeURIComponent(id)}`),
  trackByNumber: (orderNumber: string) =>
    http.get<PublicOrder>(`/orders/track/${encodeURIComponent(orderNumber)}`),
  create: (input: CreateOrderInput) => http.post<Order>("/orders", input),
  updateStatus: (id: string, status: OrderStatus, note?: string) =>
    http.patch<Order>(`/orders/${encodeURIComponent(id)}/status`, {
      status,
      note,
    }),
  uploadReceipt: async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("receipt", file);
    const res = await fetch("/orders/upload-receipt", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  },
};
