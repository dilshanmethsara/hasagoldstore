import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Receipt, ArrowRight, Filter } from "lucide-react";
import { useMyOrders } from "@/lib/hooks/db";
import { lkr, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/orders")({
  head: () => ({ meta: [{ title: "My Orders — HASA GOLD STORE" }] }),
  component: MyOrders,
});

const FILTERS = ["all", "delivered", "processing", "pending", "failed", "refunded"] as const;

function MyOrders() {
  const { data: orders = [], isLoading } = useMyOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("all");

  const filtered = useMemo(() => orders.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (q && !(`${o.order_number} ${o.game_name} ${o.package_label}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [orders, q, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track and manage all your top-ups in one place.</p>
      </div>

      <div className="glass-card rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders, games, IDs..." className="h-11 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto"><Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setStatus(f)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all ${status === f ? "bg-[var(--gradient-primary)] text-primary-foreground" : "border border-white/5 bg-white/5 text-muted-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5"><Receipt className="h-6 w-6 text-muted-foreground" /></div>
          <p className="mt-4 font-display font-semibold text-foreground">No orders found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter or place your first order.</p>
          <Link to="/games" className="mt-4 inline-block text-sm text-primary hover:underline">Browse games →</Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/5 md:block">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Game</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{o.game_name}</p>
                      <p className="text-xs text-muted-foreground">{o.package_label}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(o.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{lkr(o.total_lkr)}</td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/order/$id" params={{ id: o.order_number }} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Track <ArrowRight className="h-3 w-3" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="grid gap-3 md:hidden">
            {filtered.map((o) => (
              <li key={o.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="truncate font-mono text-xs text-muted-foreground">{o.order_number}</p>
                  <StatusPill status={o.status} />
                </div>
                <p className="mt-2 font-semibold text-foreground">{o.game_name}</p>
                <p className="text-xs text-muted-foreground">{o.package_label}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-gradient">{lkr(o.total_lkr)}</span>
                  <Link to="/order/$id" params={{ id: o.order_number }} className="text-xs font-medium text-primary">Track →</Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    paid: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    processing: "border-primary/30 bg-primary/10 text-primary",
    delivered: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    failed: "border-red-400/30 bg-red-400/10 text-red-300",
    refunded: "border-white/10 bg-white/5 text-muted-foreground",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${colors[status] ?? colors.pending}`}>{status}</span>;
}