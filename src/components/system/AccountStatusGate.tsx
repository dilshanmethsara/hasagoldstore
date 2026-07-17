import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Ban, PauseCircle, LogOut } from "lucide-react";
import { useProfile } from "@/lib/hooks/db";
import { useAuth, signOut } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export function AccountStatusGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  // Never block auth pages so the user can always sign out / switch account.
  if (!user || loading || pathname.startsWith("/auth")) return <>{children}</>;

  const status = (profile as { status?: string } | null)?.status;
  const reason = (profile as { status_reason?: string } | null)?.status_reason;
  if (status !== "banned" && status !== "suspended") return <>{children}</>;

  const banned = status === "banned";
  const Icon = banned ? Ban : PauseCircle;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-destructive/20 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="glass-card rounded-3xl p-8 text-center sm:p-10">
          <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-destructive/30 bg-destructive/10 text-destructive shadow-[0_0_60px_-10px_hsl(var(--destructive)/0.6)]">
            <Icon className="h-9 w-9" strokeWidth={2.2} />
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-destructive">
            {banned ? "Account Banned" : "Account Suspended"}
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
            {banned ? "Access to your account has been blocked" : "Your account is temporarily suspended"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {reason || (banned
              ? "Our team has banned this account for a policy violation. Contact support if you believe this is an error."
              : "Your account has been paused. Contact support to resolve the issue and restore access.")}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <a href="mailto:support@hasagoldstore.com">
              <Button variant="outline" className="w-full">Contact Support</Button>
            </a>
            <Button variant="ghost" className="w-full" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
