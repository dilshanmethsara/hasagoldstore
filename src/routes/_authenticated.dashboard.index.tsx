import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Receipt, Heart, Sparkles, ArrowRight, TrendingUp, ShoppingBag, Bell } from "lucide-react";
import { useMyOrders, useWallet, useFavorites, useNotifications, useProfile } from "@/lib/hooks/db";
import { lkr, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — HASA GOLD STORE" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const { data: profile } = useProfile();
  const { data: orders = [] } = useMyOrders();
  const { data: wallet } = useWallet();
  const { data: favs = [] } = useFavorites();
  const { data: notifications = [] } = useNotifications();

  const totalSpent = orders.reduce((s, o) => s + Number(o.total_lkr), 0);
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_260/0.3),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-primary">Welcome back</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">{profile?.display_name || profile?.username || "Gamer"} 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your account today.</p>
          </div>
          <Link to="/games"><Button variant="hero"><ShoppingBag className="h-4 w-4" /> Top Up Now</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Wallet Balance" value={lkr(wallet?.balance ?? 0)} accent to="/dashboard/wallet" />
        <StatCard icon={Receipt} label="Total Orders" value={orders.length.toString()} to="/dashboard/orders" />
        <StatCard icon={TrendingUp} label="Total Spent" value={lkr(totalSpent)} />
        <StatCard icon={Heart} label="Favorites" value={favs.length.toString()} to="/dashboard/favorites" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={Receipt} title="No orders yet" body="Your first top-up is one tap away." />
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link to="/order/$id" params={{ id: o.order_number }} className="flex items-center gap-3 py-3 -mx-2 px-2 rounded-xl hover:bg-white/5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Receipt className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{o.game_name} — {o.package_label}</p>
                      <p className="truncate text-xs text-muted-foreground">{timeAgo(o.created_at)} • {o.order_number}</p>
                    </div>
                    <span className="hidden text-sm font-semibold text-foreground sm:block">{lkr(o.total_lkr)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Activity</h2>
            <Link to="/dashboard/notifications" className="text-xs text-primary hover:underline">All</Link>
          </div>
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="You're all caught up" body="Notifications will appear here." />
          ) : (
            <ul className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <li key={n.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4 text-primary" /> Level up</p>
            <p className="mt-1 text-xs text-muted-foreground">Complete more orders to unlock exclusive rewards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, to }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean; to?: string }) {
  const inner = (
    <div className={`glass-card group relative overflow-hidden rounded-2xl p-5 transition-all ${to ? "hover:-translate-y-0.5 hover:border-primary/30" : ""}`}>
      <div className={"grid h-11 w-11 place-items-center rounded-xl " + (accent ? "bg-[var(--gradient-primary)] text-primary-foreground" : "bg-primary/10 text-primary")}><Icon className="h-5 w-5" /></div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
  if (!to) return inner;
  return <Link to={to}>{inner}</Link>;
}

function EmptyState({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground"><Icon className="h-5 w-5" /></div>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}