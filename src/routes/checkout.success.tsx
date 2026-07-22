import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Sparkles, ArrowRight, Home, Clock, Shield, Zap, Bell } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { lkr } from "@/lib/format";
import { useOrder } from "@/lib/hooks/db";
import { toast } from "sonner";

type Search = { order?: string };

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({ order: s.order ? String(s.order) : undefined }),
  head: () => ({ meta: [{ title: "Order Placed — HASA GOLD STORE" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order: id } = Route.useSearch();
  const { data: order, isLoading } = useOrder(id);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">

        {/* ── Hero card ── */}
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          {/* background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.2_155/0.2),transparent_65%)]" />

          <div className="relative">
            {/* Icon */}
            <div className="relative mx-auto mb-6 h-24 w-24">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" style={{ animationDuration: "2s" }} />
              <span className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
              <div className="relative grid h-full w-full place-items-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30 shadow-[0_0_50px_-5px_oklch(0.72_0.17_155/0.6)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" strokeWidth={2} />
              </div>
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Order Placed!</h1>
            <p className="mt-2 text-muted-foreground">
              We've received your order and it's being reviewed. <br className="hidden sm:block" />
              You'll get notified once it's processed.
            </p>

            {isLoading ? (
              <div className="mt-10 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : !order ? (
              <p className="mt-8 text-sm text-muted-foreground">Order not found.</p>
            ) : (
              <>
                {/* Order number pill */}
                <div className="mx-auto mt-8 flex max-w-xs items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order ID</p>
                    <p className="truncate font-mono text-base font-bold text-foreground">{order.order_number}</p>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(order.order_number); toast.success("Copied to clipboard"); }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                    title="Copy order ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                {/* Order details grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                  <StatCard label="Game" value={order.game_name ?? "—"} />
                  <StatCard label="Package" value={order.package_label ?? "—"} />
                  <StatCard label="Total Paid" value={lkr(order.total_lkr)} highlight />
                  <StatCard
                    label="Status"
                    value={order.status === "pending" ? "Under Review" : order.status}
                    accent
                  />
                </div>

                {/* Player info card */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Info</p>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-lg">🎮</span>
                    </div>
                    <div className="min-w-0">
                      {(order as any).player_name ? (
                        <>
                          <p className="truncate font-semibold text-foreground">{(order as any).player_name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{order.player_id}</p>
                        </>
                      ) : (
                        <p className="font-mono text-sm font-semibold text-foreground">{order.player_id}</p>
                      )}
                    </div>
                    <span className="ml-auto shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                      <Clock className="mb-0.5 mr-1 inline h-3 w-3" />Pending
                    </span>
                  </div>
                </div>

                {/* What happens next */}
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">What happens next</p>
                  <ul className="space-y-2.5">
                    {[
                      { icon: Shield, text: "Our team reviews your payment" },
                      { icon: Zap,    text: "Top-up is sent to your account" },
                      { icon: Bell,   text: "You'll receive an email & WhatsApp update" },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* XP badge */}
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  You earned <strong>+{Math.floor(Number(order.total_lkr) / 10)} XP</strong> on this order
                </div>

                {/* CTAs */}
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link to="/order/$id" params={{ id: order.order_number }}>
                    <Button variant="hero" size="lg">
                      Track Order <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      <Home className="h-4 w-4" /> Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help?{" "}
          <Link to="/dashboard/support" className="text-primary hover:underline">Contact support</Link>
          {" "}or{" "}
          <Link to="/dashboard/orders" className="text-primary hover:underline">view all orders</Link>.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value, accent, highlight }: { label: string; value: string; accent?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 text-left sm:p-4 ${highlight ? "border-primary/20 bg-primary/5" : "border-white/5 bg-white/[0.03]"}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold capitalize sm:text-base ${accent ? "text-amber-400" : highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
