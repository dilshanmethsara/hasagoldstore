import { type ReactNode } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { Wrench, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { useSystemSettings, useIsAdmin } from "@/lib/hooks/db";
import { Logo } from "@/components/brand/Logo";

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data: settings } = useSystemSettings();
  const { data: isAdmin } = useIsAdmin();

  const enabled = !!settings?.maintenance.enabled;
  const message = settings?.maintenance.message ?? "";
  // While maintenance is on, EVERYTHING is blocked for regular users.
  // Only admins bypass — and only /auth/login stays open so admins can sign in.
  const isAuthLogin = pathname === "/auth/login" || pathname.startsWith("/auth/login/");
  const bypass = !enabled || isAdmin || isAuthLogin;

  if (bypass) return <>{children}</>;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex justify-center"><Logo /></div>

        <div className="glass-card rounded-3xl p-8 text-center sm:p-10">
          <div className="relative mx-auto h-20 w-20">
            <span className="absolute inset-0 animate-pulse-glow rounded-3xl bg-amber-500/25 blur-2xl" />
            <div className="relative grid h-full w-full place-items-center rounded-3xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)]">
              <Wrench className="h-9 w-9" strokeWidth={2.2} />
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" /> Maintenance
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
            We'll be right back
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            {message || "HASA GOLD STORE is upgrading systems to serve you better. Please check back in a little while."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> Status
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Improvements in progress</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Orders
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Paused temporarily</p>
            </div>
          </div>

          <Link
            to="/auth/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Admin sign-in
          </Link>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          © HASA GOLD STORE — thanks for your patience.
        </p>
      </div>
    </div>
  );
}