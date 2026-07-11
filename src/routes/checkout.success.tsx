import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Sparkles, Truck, Home } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { lkr } from "@/lib/format";
import { useOrder } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { toast } from "sonner";

type Search = { order?: string };

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({ order: s.order ? String(s.order) : undefined }),
  head: () => ({ meta: [{ title: "Order Confirmed — HASA GOLD STORE" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order: id } = Route.useSearch();
  const { data: order, isLoading } = useOrder(id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card animate-fade-up relative overflow-hidden rounded-3xl p-6 text-center sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.2_155/0.25),transparent_60%)]" />
          <div className="relative">
            <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
              <span className="absolute inset-0 animate-pulse-glow rounded-full bg-emerald-500/20 blur-xl" />
              <div className="relative grid h-full w-full place-items-center rounded-3xl bg-emerald-500/15 text-emerald-400 shadow-[0_0_60px_-5px_oklch(0.72_0.17_155/0.7)]">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-foreground sm:text-4xl">Order Confirmed!</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Your top-up is delivered — thanks for choosing HASA GOLD STORE.</p>

            {isLoading ? (
              <p className="mt-8 text-sm text-muted-foreground">Loading order…</p>
            ) : !order ? (
              <p className="mt-8 text-sm text-muted-foreground">Order not found.</p>
            ) : (
              <>
                <div className="mx-auto mt-7 flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-left min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Order ID</p>
                    <p className="truncate font-mono text-lg font-bold text-foreground">{order.order_number}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(order.order_number); toast.success("Copied"); }} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
                  <Stat label="Game" value={order.game_name} />
                  <Stat label="Package" value={order.package_label} />
                  <Stat label="Paid" value={lkr(order.total_lkr)} />
                  <Stat label="Status" value={order.status} accent />
                </div>
                <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Truck className="h-4 w-4 text-primary" /> Delivered to player <span className="font-mono">{order.player_id}</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">A confirmation email is on its way. You can also view this order any time from your dashboard.</p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/order/$id" params={{ id: order.order_number }}>
                    <Button variant="hero" size="lg"><Truck className="h-4 w-4" /> Track Order</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg"><Home className="h-4 w-4" /> Back to Home</Button>
                  </Link>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" /> You earned <strong>+{Math.floor(Number(order.total_lkr) / 10)} XP</strong>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Need help? <Link to="/help" className="text-primary hover:underline">Visit the Help Center</Link> or chat with us 24/7.</p>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-left sm:p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">{label}</p>
      <p className={"mt-1 truncate text-sm font-semibold capitalize sm:text-base " + (accent ? "text-emerald-400" : "text-foreground")}>{value}</p>
    </div>
  );
}