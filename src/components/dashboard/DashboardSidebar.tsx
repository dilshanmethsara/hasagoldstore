import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Wallet, Tag, Bell, User, ShieldCheck, LifeBuoy, LogOut, Heart, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/use-auth";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/orders", label: "My Orders", icon: Receipt },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard/promo-codes", label: "Promo Codes", icon: Tag },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { to: "/dashboard/profile", label: "Profile Settings", icon: User },
  { to: "/dashboard/security", label: "Security", icon: ShieldCheck },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const isActive = (to: string, exact?: boolean) => exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/5 bg-[oklch(0.13_0.04_265)]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-white/5 px-5">
        <Link to="/" onClick={onNavigate}><Logo /></Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-white/20 text-primary-foreground" : "bg-primary text-primary-foreground")}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={async () => {
            onNavigate?.();
            await signOut();
            router.navigate({ to: "/", replace: true });
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </nav>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[var(--gradient-card)] p-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <Sparkles className="relative h-5 w-5 text-primary" />
          <h4 className="relative mt-2 font-display text-sm font-bold text-foreground">Invite & Earn</h4>
          <p className="relative mt-1 text-xs text-muted-foreground">Invite friends and earn exclusive rewards!</p>
          <Button variant="hero" size="sm" className="relative mt-3 w-full">Invite Now</Button>
        </div>
      </div>
    </aside>
  );
}