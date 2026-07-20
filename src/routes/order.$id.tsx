import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Check, Clock, CreditCard, Package, Truck, Sparkles, Copy, MessageCircle, Receipt, ArrowLeft } from "lucide-react";
import { lkr, formatDateTime } from "@/lib/format";
import { useOrder } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — HASA GOLD STORE` }] }),
  component: OrderTrackingPage,
});

const STAGE_ORDER = ["pending", "paid", "processing", "delivered"] as const;
const STAGE_META: Record<string, { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { title: "Order Placed", desc: "We received your order.", icon: Receipt },
  paid: { title: "Payment Confirmed", desc: "Transaction approved.", icon: CreditCard },
  processing: { title: "Processing Top-Up", desc: "Sending credits to your account.", icon: Package },
  delivered: { title: "Delivered", desc: "Top-up credited in-game.", icon: Truck },
  failed: { title: "Failed", desc: "Please contact support.", icon: Clock },
  refunded: { title: "Refunded", desc: "Amount returned to wallet.", icon: Clock },
};

function OrderTrackingPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <div className="min-h-screen"><SiteHeader /><p className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">Loading order…</p><SiteFooter /></div>;
  if (!order) return <div className="min-h-screen"><SiteHeader />
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-display text-2xl">Order not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">Check the order number and try again.</p>
      <Link to="/tracking" className="mt-6 inline-block text-primary">Search another order →</Link>
    </div><SiteFooter /></div>;

  const art = gameArt(order.game_id ? "" : "");
  const currentStep = Math.max(0, STAGE_ORDER.indexOf(order.status as typeof STAGE_ORDER[number]));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/dashboard/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_260/0.25),transparent_60%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
              <h1 className="mt-1 break-all font-display text-2xl font-bold text-foreground sm:text-4xl">{order.order_number}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <StatusPill status={order.status} />
                <span className="text-muted-foreground">Placed {formatDateTime(order.created_at)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(order.order_number); toast.success("Copied"); }}><Copy className="h-4 w-4" /> Copy ID</Button>
              <Link to="/dashboard/support"><Button variant="hero" size="sm"><MessageCircle className="h-4 w-4" /> Need help?</Button></Link>
            </div>
          </div>

          <div className="relative mt-8 overflow-x-auto">
            <div className="min-w-[440px]">
              <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-white/5" />
              <div className="absolute left-0 top-5 h-1 rounded-full bg-[var(--gradient-primary)] transition-all" style={{ width: `${(currentStep / (STAGE_ORDER.length - 1)) * 100}%` }} />
              <div className="relative grid grid-cols-4 gap-2">
                {STAGE_ORDER.map((k, i) => {
                  const meta = STAGE_META[k];
                  const done = i < currentStep;
                  const active = i === currentStep;
                  const Icon = meta.icon;
                  return (
                    <div key={k} className="flex flex-col items-center text-center">
                      <div className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-all ${done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary bg-background text-primary shadow-[var(--shadow-glow)]" : "border-white/10 bg-background text-muted-foreground"}`}>
                        {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <p className={`mt-2.5 text-xs font-semibold ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{meta.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold text-foreground">Activity</h2>
            <ol className="mt-5 space-y-5">
              {STAGE_ORDER.slice(0, currentStep + 1).map((k, i) => {
                const meta = STAGE_META[k];
                const Icon = meta.icon;
                return (
                  <li key={k} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < currentStep && <div className="mt-1 h-full w-px flex-1 bg-white/5" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-semibold text-foreground">{meta.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{meta.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles className="h-4 w-4 text-primary" /> Delivery confirmation</p>
              <p className="mt-1 text-xs text-muted-foreground">You'll receive an email and in-app notification once your top-up appears in game.</p>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-base font-bold text-foreground">Item</h3>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                <img src={art.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{order.game_name}</p>
                  <p className="text-xs text-muted-foreground">{order.package_label}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2.5 text-sm">
                <Row label="Subtotal" value={lkr(order.subtotal_lkr)} />
                {Number(order.discount_lkr) > 0 && <Row label="Discount" value={`- ${lkr(order.discount_lkr)}`} accent />}
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
                <span className="text-sm text-muted-foreground">Total paid</span>
                <span className="font-display text-2xl font-bold text-gradient">{lkr(order.total_lkr)}</span>
              </div>
              <p className="mt-3 text-xs capitalize text-muted-foreground">Paid via {order.payment_method.replace("_", " ")}</p>
            </div>
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-base font-bold text-foreground">Delivered to</h3>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Player ID" value={order.player_id} />
                <Row label="Region" value="Sri Lanka 🇱🇰" />
              </dl>
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className={accent ? "min-w-0 truncate text-right font-medium text-emerald-400" : "min-w-0 truncate text-right font-medium text-foreground"}>{value}</dd></div>;
}
function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    paid: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    processing: "border-primary/30 bg-primary/10 text-primary",
    delivered: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    failed: "border-red-400/30 bg-red-400/10 text-red-300",
    refunded: "border-white/10 bg-white/5 text-muted-foreground",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${colors[status] ?? colors.pending}`}>{status}</span>;
}