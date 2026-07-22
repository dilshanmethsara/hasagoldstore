import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/lib/hooks/db";
import { lkr, formatDate } from "@/lib/format";
import { Search, Image, X } from "lucide-react";
import type { OrderStatus } from "@/types";
const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "delivered", "completed", "paused", "cancelled", "failed", "refunded"];

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const update = useUpdateOrderStatus();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const filtered = (orders ?? []).filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (q) {
      const search = q.toLowerCase();
      const haystack = `${o.order_number} ${o.player_id} ${(o as any).game_name} ${(o as any).package_label}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage and update customer order statuses.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order #, game, player ID…"
            className="h-11 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === s ? "border-primary/40 bg-primary/20 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Game / Package</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Payment Details</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">Loading orders…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No orders match.</td></tr>}
              {filtered.map((o) => {
                const details = o.payment_details as Record<string, string> | null;
                const hasDetails = details && Object.keys(details).length > 0;
                return (
                  <tr key={o.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">#{o.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{(o as any).game_name ?? "—"}</p>
                      <p className="text-[11px] text-muted-foreground">{(o as any).package_label ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p className="font-mono text-xs">{o.player_id ?? "—"}</p>
                      {(o as any).player_name && (
                        <p className="mt-0.5 text-[11px] font-semibold text-emerald-400">{(o as any).player_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{lkr(Number(o.total_lkr))}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                        {o.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {o.receipt_url ? (
                        <button onClick={() => setReceiptUrl(o.receipt_url!)} className="group relative grid h-9 w-9 place-items-center rounded-lg border border-white/5 bg-white/5 transition hover:border-primary/40">
                          <Image className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      {hasDetails ? (
                        <div className="space-y-0.5">
                          {Object.entries(details).map(([k, v]) => (
                            <p key={k} className="truncate text-xs">
                              <span className="font-medium text-muted-foreground">{k}:</span>{" "}
                              <span className="text-foreground">{v}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => update.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                        className="rounded-lg border border-white/10 bg-background/60 px-2 py-1 text-xs font-semibold capitalize text-foreground focus:border-primary/40 focus:outline-none"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Receipt Lightbox ── */}
      {receiptUrl && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-xl" onClick={() => setReceiptUrl(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] max-w-[90vw]">
            <img src={receiptUrl} alt="Payment receipt" className="max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button onClick={() => setReceiptUrl(null)} className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white shadow-xl transition hover:bg-red-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}