import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, ShoppingBag, Users, LifeBuoy, ArrowUpRight } from "lucide-react";
import { useAdminStats, useAdminOrders } from "@/lib/hooks/db";
import { lkr, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  ssr: false,
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: orders } = useAdminOrders();
  const recent = (orders ?? []).slice(0, 6);

  const kpis = [
    { label: "Total Revenue", value: stats ? lkr(stats.revenue) : "—", icon: TrendingUp, tint: "from-primary/30 to-primary/5", accent: "text-primary" },
    { label: "Today", value: stats ? lkr(stats.todayRev) : "—", icon: TrendingUp, tint: "from-emerald-500/30 to-emerald-500/5", accent: "text-emerald-400" },
    { label: "Orders", value: stats?.orderCount?.toLocaleString() ?? "—", icon: ShoppingBag, tint: "from-sky-500/30 to-sky-500/5", accent: "text-sky-400" },
    { label: "Users", value: stats?.userCount?.toLocaleString() ?? "—", icon: Users, tint: "from-fuchsia-500/30 to-fuchsia-500/5", accent: "text-fuchsia-400" },
    { label: "Open Tickets", value: stats?.openTickets?.toLocaleString() ?? "—", icon: LifeBuoy, tint: "from-amber-500/30 to-amber-500/5", accent: "text-amber-400" },
  ];

  const chart = stats?.chart ?? [];
  const max = Math.max(1, ...chart.map((c) => c.value));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Command Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time snapshot of your storefront performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${k.tint} p-4 backdrop-blur-xl`}>
            <div className="flex items-center justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-background/40 ${k.accent}`}>
                <k.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground sm:text-2xl">{isLoading ? "…" : k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Revenue — last 14 days</h2>
              <p className="text-xs text-muted-foreground">Daily gross bookings</p>
            </div>
            <Link to="/admin/revenue" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Details <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex h-56 items-end gap-1.5">
            {chart.map((c) => (
              <div key={c.date} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1 overflow-hidden rounded-t-md bg-white/5">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-md bg-gradient-to-t from-primary to-primary/40 shadow-[0_0_20px_oklch(0.6_0.22_260/0.5)] transition-all duration-500"
                    style={{ height: `${(c.value / max) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] font-medium text-muted-foreground">{c.date}</span>
              </div>
            ))}
            {chart.length === 0 && <p className="w-full text-center text-sm text-muted-foreground">No revenue data yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-white/5">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">#{o.order_number}</p>
                  <p className="text-[11px] text-muted-foreground">{formatDate(o.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{lkr(Number(o.total_lkr))}</p>
                  <p className="text-[10px] uppercase tracking-wide text-primary">{o.status}</p>
                </div>
              </li>
            ))}
            {recent.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No orders yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}