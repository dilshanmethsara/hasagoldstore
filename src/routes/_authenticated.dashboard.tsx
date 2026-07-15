import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Gift, Menu, Search, X } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HASA GOLD STORE" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const displayName = user?.profile?.display_name || user?.profile?.username || "User";
  const initials = displayName.charAt(0).toUpperCase();
  
  return (
    <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] -z-20 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.22_260/0.08),transparent_70%)] blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] -z-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_255/0.06),transparent_75%)] blur-3xl animate-float" />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex border-r border-white/5 bg-card/40 backdrop-blur-md">
        <DashboardSidebar />
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-black/75 transition-opacity duration-300 backdrop-blur-sm", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-y-0 left-0 transition-transform duration-300 ease-out", open ? "translate-x-0" : "-translate-x-full")}>
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/40 bg-background/50 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground lg:hidden hover:text-foreground transition-colors">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search games, top-ups, orders..." className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.08] focus:outline-none transition-all" />
            <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all">
              <Gift className="h-4 w-4" />
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">3</span>
            </button>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-md shadow-primary/20">{initials}</div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-foreground truncate max-w-[120px]">{displayName}</p>
                <p className="text-[10px] leading-tight text-primary font-bold">Verified User</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}