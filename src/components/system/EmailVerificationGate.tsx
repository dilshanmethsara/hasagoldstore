import { type ReactNode } from "react";
import { useRouterState, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mail, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export function EmailVerificationGate({ children }: { children: ReactNode }) {
  const { user, status } = useAuthContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  // Allow access to auth pages, public pages, and API routes
  const isAuthPage = pathname.startsWith("/auth/");
  const isPublicPage = pathname === "/" || pathname.startsWith("/api/");
  const isAllowedPath = isAuthPage || isPublicPage;

  // Still loading session
  if (status === "loading") {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="mb-8 flex justify-center"><Logo /></div>
          <div className="glass-card rounded-3xl p-8 text-center sm:p-10">
            <div className="relative mx-auto h-16 w-16">
              <Loader2 className="h-9 w-9 animate-spin text-primary" strokeWidth={2.5} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Verifying your account
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              Please wait while we check your verification status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - allow access to public/auth pages
  if (!user) {
    return <>{children}</>;
  }

  // Email verified - allow access
  if (user.email_verified) {
    return <>{children}</>;
  }

  // Email NOT verified and trying to access protected page
  if (!isAllowedPath) {
    // Redirect to verify-email page
    useEffect(() => {
      navigate({ to: "/auth/verify-email", search: { email: user.email }, replace: true });
    }, [user, navigate]);

    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="mb-8 flex justify-center"><Logo /></div>
          <div className="glass-card rounded-3xl p-8 text-center sm:p-10">
            <div className="relative mx-auto h-20 w-20">
              <span className="absolute inset-0 animate-pulse-glow rounded-3xl bg-primary/25 blur-2xl" />
              <div className="relative grid h-full w-full place-items-center rounded-3xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_60px_-10px_hsl(var(--primary)/0.6)]">
                <Shield className="h-10 w-10" strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              Email Not Verified
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Verify your email to continue
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              You need to verify your email address before accessing the dashboard. We've sent a 6-digit code to{" "}
              <strong className="text-foreground">{user.email}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/auth/verify-email"
                search={{ email: user.email }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Go to Verification Page
              </Link>
              <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/auth/verify-email", search: { email: user.email } })}>
                <ArrowRight className="h-4 w-4 mr-2" /> Resend Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Allow access to auth pages even if unverified
  return <>{children}</>;
}
