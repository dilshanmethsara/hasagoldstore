import { http } from "@/api/httpClient";
import type { Order, OrderStatus, PublicOrder } from "@/types";
import type { CreateOrderInput } from "@/validation";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

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
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const res = await fetch(`${BASE_URL}/orders/upload-receipt`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  },
};
