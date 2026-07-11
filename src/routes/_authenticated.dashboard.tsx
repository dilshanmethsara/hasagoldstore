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
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-y-0 left-0 transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/5 text-muted-foreground lg:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search games, top-ups, orders..." className="h-10 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
            <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/5 text-muted-foreground hover:text-foreground">
              <Gift className="h-4 w-4" />
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/5 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">3</span>
            </button>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 px-2.5 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground">{initials}</div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-foreground">{displayName}</p>
                <p className="text-[10px] leading-tight text-primary">Verified User</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}