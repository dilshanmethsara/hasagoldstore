import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, TrendingUp, ShoppingBag, Users, Gamepad2, Package, LifeBuoy, ArrowLeft, Settings } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const items: Item[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/revenue", label: "Revenue", icon: TrendingUp },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/games", label: "Games", icon: Gamepad2 },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/tickets", label: "Support", icon: LifeBuoy },
  { to: "/admin/settings", label: "System", icon: Settings },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="flex h-full min-h-screen w-72 flex-col border-r border-white/5 bg-gradient-to-b from-background via-background to-primary/5 px-4 py-6">
      <div className="flex items-center justify-between px-2">
        <Logo />
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">Admin</span>
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to as string}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-foreground shadow-[0_0_0_1px_oklch(0.55_0.22_260/0.35)_inset]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5", active && "border-primary/40 bg-primary/20 text-primary")}>
                <Icon className="h-4 w-4" />
              </span>
              {it.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_oklch(0.6_0.22_260/0.9)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to user dashboard
        </Link>
      </div>
    </aside>
  );
}