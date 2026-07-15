import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Receipt, Heart, Sparkles, ArrowRight, TrendingUp, ShoppingBag, Bell, ChevronRight, Zap, Target, Star, Gift, ShieldAlert } from "lucide-react";
import { useMyOrders, useWallet, useFavorites, useNotifications, useProfile } from "@/lib/hooks/db";
import { lkr, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Stats calculations
  const totalSpent = orders.reduce((s, o) => s + Number(o.total_lkr), 0);
  const recentOrders = orders.slice(0, 5);
  const completedOrders = orders.filter(o => o.status === "completed" || o.status === "delivered");
  const completedCount = completedOrders.length;

  // Gamified Loyalty calculation
  let currentTier = "Bronze Cadet";
  let nextTier = "Silver Elite";
  let targetOrders = 3;
  let progressPercent = Math.min((completedCount / targetOrders) * 100, 100);
  let tierColor = "text-orange-400";
  let tierBg = "bg-orange-500/10 border-orange-500/20";

  if (completedCount >= 10) {
    currentTier = "Gold Champion";
    nextTier = "Max Tier reached";
    targetOrders = 10;
    progressPercent = 100;
    tierColor = "text-amber-400";
    tierBg = "bg-amber-500/10 border-amber-500/20";
  } else if (completedCount >= 3) {
    currentTier = "Silver Elite";
    nextTier = "Gold Champion";
    targetOrders = 10;
    progressPercent = Math.min(((completedCount - 3) / 7) * 100, 100);
    tierColor = "text-slate-300";
    tierBg = "bg-slate-500/10 border-slate-500/20";
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "completed":
      case "delivered":
        return { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" };
      case "processing":
      case "paid":
        return { text: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", dot: "bg-indigo-400 animate-pulse" };
      case "pending":
        return { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400 animate-pulse" };
      default:
        return { text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", dot: "bg-rose-400" };
    }
  }

  return (
    <div className="space-y-6">
      {/* Premium Welcome Header Banner */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 border-primary/20 bg-gradient-to-r from-card/30 to-primary/5">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.22_260/0.15),transparent_70%)] blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_255/0.05),transparent_75%)] blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider", tierBg, tierColor)}>
                <Zap className="h-3 w-3 fill-current" />
                {currentTier}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Online</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {profile?.display_name || profile?.username || "Gamer"} 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Manage your orders, deposit wallet funds, and claim rewards instantly.</p>
          </div>
          
          <Link to="/games">
            <Button variant="hero" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
              <ShoppingBag className="h-4 w-4" /> Top Up Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Shortcuts Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Quick Top Up", desc: "Select and buy", link: "/games", icon: Zap, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
          { label: "Add Funds", desc: "Wallet deposit", link: "/dashboard/wallet", icon: Wallet, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
          { label: "Track Orders", desc: "Realtime logs", link: "/dashboard/orders", icon: Receipt, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Promo Codes", desc: "Active discounts", link: "/dashboard/promo-codes", icon: Gift, color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20" },
        ].map((act, i) => (
          <Link key={i} to={act.link} className="glass-panel group flex flex-col justify-between p-4 rounded-2xl hover:border-primary/40 transition-all duration-300">
            <div className={cn("grid h-10 w-10 place-items-center rounded-xl border", act.color)}>
              <act.icon className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                {act.label} <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{act.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Wallet Balance" value={lkr(wallet?.balance ?? 0)} color="text-indigo-400" border="hover:border-indigo-500/30" to="/dashboard/wallet" />
        <StatCard icon={Receipt} label="Total Orders" value={orders.length.toString()} color="text-emerald-400" border="hover:border-emerald-500/30" to="/dashboard/orders" />
        <StatCard icon={TrendingUp} label="Total Spent" value={lkr(totalSpent)} color="text-amber-400" border="hover:border-amber-500/30" />
        <StatCard icon={Heart} label="Favorites" value={favs.length.toString()} color="text-rose-400" border="hover:border-rose-500/30" to="/dashboard/favorites" />
      </div>

      {/* Main Core Widgets */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders List */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 lg:col-span-2 border-white/5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground">Recent Transactions</h2>
            </div>
            <Link to="/dashboard/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions yet" body="Top up diamonds or UC to see them here." />
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => {
                const badge = getStatusStyle(o.status);
                return (
                  <Link 
                    key={o.id} 
                    to="/order/$id" 
                    params={{ id: o.order_number }} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/20 hover:bg-muted/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground leading-snug">{o.game_name}</p>
                        <p className="truncate text-[11px] text-muted-foreground leading-normal">{o.package_label} · {o.order_number}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{lkr(o.total_lkr)}</p>
                        <p className="text-[10px] text-muted-foreground">{timeAgo(o.created_at)}</p>
                      </div>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", badge.bg, badge.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                        {o.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Loyalty Rank & Recent Notifications */}
        <div className="space-y-6">
          {/* Gamified Loyalty Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border-primary/20 relative overflow-hidden bg-gradient-to-b from-card/30 to-primary/5">
            <div className="absolute right-0 top-0 -z-10 h-24 w-24 bg-primary/20 blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">Loyalty Rank</h3>
              </div>
              <span className="text-[10px] font-bold text-primary">{completedCount} Completed</span>
            </div>

            <div className="mt-4 text-center">
              <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block", tierBg, tierColor)}>
                {currentTier}
              </span>
              <p className="text-[11px] text-muted-foreground mt-2">
                {completedCount >= 10 
                  ? "Maximum Loyalty Tier achieved! Enjoy absolute benefits." 
                  : `Complete ${targetOrders - completedCount} more orders to unlock ${nextTier}`
                }
              </p>
            </div>

            {/* Linear Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[9px] text-muted-foreground font-bold mb-1">
                <span>Tier Progress</span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/40">
                <div 
                  className="h-full bg-[var(--gradient-primary)] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Tier Benefits */}
            <ul className="mt-5 space-y-2 text-[11px] text-muted-foreground border-t border-border/40 pt-4">
              <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-primary shrink-0" /> Priority Instant Top-up Credit</li>
              <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-primary shrink-0" /> Exclusive Loyalty Promos</li>
              <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-primary shrink-0" /> 24/7 Priority Support Handler</li>
            </ul>
          </div>

          {/* Activity / Notification timeline */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border-white/5">
            <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-primary" />
              Recent Alerts
            </h3>
            
            {notifications.length === 0 ? (
              <EmptyState icon={Bell} title="All caught up" body="Important notifications will slide in here." />
            ) : (
              <div className="relative border-l border-border/60 ml-2.5 pl-4 space-y-4">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-none">{n.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  border, 
  to 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  color: string; 
  border: string; 
  to?: string 
}) {
  const inner = (
    <div className={cn(
      "glass-panel group relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
      to ? cn("hover:-translate-y-1 hover:shadow-lg cursor-pointer", border) : ""
    )}>
      {/* Top right floating decorative glow */}
      <div className="absolute right-[-10px] top-[-10px] h-10 w-10 bg-primary/5 rounded-full blur-lg group-hover:bg-primary/25 transition-all" />
      
      <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-muted/40 border border-border/40 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-foreground tracking-tight">{value}</p>
      
      {/* Glow highlight bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
  if (!to) return inner;
  return <Link to={to}>{inner}</Link>;
}

function EmptyState({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-8 text-center bg-muted/5">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-muted/60 text-muted-foreground"><Icon className="h-5 w-5" /></div>
      <p className="mt-3 text-xs font-bold text-foreground">{title}</p>
      <p className="mt-1 text-[10px] text-muted-foreground px-4">{body}</p>
    </div>
  );
}