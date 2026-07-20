import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Sparkles, Gift } from "lucide-react";
import { useEffect } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verified")({
  head: () => ({ meta: [{ title: "You're verified — HASA GOLD STORE" }] }),
  component: VerifiedPage,
});

function VerifiedPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const id = setTimeout(() => navigate({ to: "/dashboard" }), 6000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <AuthLayout
      title="You're all set!"
      subtitle="Welcome to HASA GOLD STORE, Sri Lanka's premium top-up platform."
      footer={<>Auto-redirecting to your dashboard…</>}
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent p-8 text-center">
        <div className="absolute -inset-10 bg-[radial-gradient(circle,oklch(0.72_0.17_155/0.35),transparent_60%)]" />
        <div className="relative">
          <div className="mx-auto grid h-24 w-24 animate-pulse-glow place-items-center rounded-full bg-emerald-500/15 text-emerald-400 shadow-[0_0_60px_-5px_oklch(0.72_0.17_155/0.7)]">
            <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Account verified</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your email, profile and phone number have been confirmed.</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Gift className="h-4 w-4" /> LKR 250 welcome credit added to your wallet
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Link to="/dashboard"><Button variant="hero" size="lg" className="w-full">Go to dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
        <Link to="/"><Button variant="outline" size="lg" className="w-full"><Sparkles className="h-4 w-4" /> Browse games</Button></Link>
      </div>
    </AuthLayout>
  );
}