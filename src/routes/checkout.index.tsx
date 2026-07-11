import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CreditCard, Wallet, Smartphone, ShieldCheck, ArrowLeft, Lock, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { lkr } from "@/lib/format";
import { useGame, usePackages, useCreateOrder, useWallet } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { useAuth } from "@/lib/use-auth";

type Search = { game?: string; pkg?: string; pid?: string; sid?: string; promo?: string };

export const Route = createFileRoute("/checkout/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    game: s.game ? String(s.game) : undefined,
    pkg: s.pkg ? String(s.pkg) : undefined,
    pid: s.pid ? String(s.pid) : undefined,
    sid: s.sid ? String(s.sid) : undefined,
    promo: s.promo ? String(s.promo) : undefined,
  }),
  head: () => ({ meta: [{ title: "Checkout — HASA GOLD STORE" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: game, isLoading: gameLoading } = useGame(search.game);
  const { data: packages = [], isLoading: pkgsLoading } = usePackages(game?.id);
  const { data: wallet } = useWallet();
  const create = useCreateOrder();

  const pkg = useMemo(() => packages.find((p) => p.id === search.pkg) ?? packages[0], [packages, search.pkg]);
  const loading = gameLoading || (!!game && pkgsLoading);
  const art = gameArt(search.game ?? "");
  const [method, setMethod] = useState<"card" | "wallet" | "ez_cash" | "frimi" | "bank_transfer">("card");
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    (async () => {
      if (!search.promo || !pkg) { setPromoDiscount(0); return; }
      try {
        const { promoService } = await import("@/services/promoService");
        const sub = Number(pkg.price_lkr);
        const validated = await promoService.validate(search.promo, sub);
        setPromoDiscount(validated?.discountLkr ?? 0);
      } catch {
        setPromoDiscount(0);
      }
    })();
  }, [search.promo, pkg?.id]);

  if (loading) {
    return (
      <div className="min-h-screen"><SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Preparing checkout…</div>
      <SiteFooter /></div>
    );
  }

  if (!search.game) {
    return <Navigate to="/games" replace />;
  }

  if (!game || !pkg) {
    return (
      <div className="min-h-screen"><SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl">This package isn't available</h1>
          <p className="mt-2 text-sm text-muted-foreground">The game or package you selected couldn't be loaded.</p>
          <Link to="/games" className="mt-6 inline-block text-primary">Browse games →</Link>
        </div><SiteFooter /></div>
    );
  }

  const subtotal = Number(pkg.price_lkr);
  const total = Math.max(0, subtotal - promoDiscount);

  const METHODS = [
    { id: "card" as const, label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
    { id: "wallet" as const, label: "HASA Wallet", desc: `Balance: ${lkr(wallet?.balance ?? 0)}`, icon: Wallet, disabled: (wallet?.balance ?? 0) < total },
    { id: "ez_cash" as const, label: "eZ Cash / mCash", desc: "Dialog / Mobitel mobile wallets", icon: Smartphone },
    { id: "frimi" as const, label: "FriMi", desc: "Instant bank transfer", icon: Building2 },
  ];

  const placeOrder = async () => {
    if (!user) { navigate({ to: "/auth/login", search: { redirect: window.location.pathname + window.location.search } as never }); return; }
    try {
      const order = await create.mutateAsync({
        game, pkg, playerId: search.pid ?? "",
        paymentMethod: method, promoCode: search.promo || undefined,
      });
      navigate({ to: "/checkout/success", search: { order: order.order_number } });
    } catch {
      /* toast is shown by useCreateOrder.onError */
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/games/$slug" params={{ slug: game.slug }} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to {game.name}
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Checkout</h1>
        <p className="mt-1.5 text-muted-foreground">Review your order and complete payment in LKR.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Order Review</h2>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <img src={art.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{game.name}</p>
                  <p className="text-sm text-muted-foreground">{pkg.label}</p>
                </div>
                <span className="font-display text-lg font-bold text-gradient">{lkr(subtotal)}</span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Field label="Player ID" value={search.pid || "—"} />
                {gameArt(game.slug).needsServerId && <Field label="Server" value={search.sid || "—"} />}
                <Field label="Promo" value={search.promo || "None"} />
              </dl>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Payment Method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {METHODS.map((m) => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id} disabled={m.disabled}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:opacity-40",
                        active
                          ? "border-primary bg-primary/10 shadow-[0_0_30px_-10px_var(--primary)]"
                          : "border-white/5 bg-white/[0.03] hover:border-primary/30",
                      )}
                    >
                      <div className={cn("grid h-11 w-11 place-items-center rounded-xl", active ? "bg-[var(--gradient-primary)] text-primary-foreground" : "bg-white/5 text-muted-foreground")}>
                        <m.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {method === "card" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><FieldInput label="Card Number" placeholder="1234 5678 9012 3456" /></div>
                  <FieldInput label="Expiry" placeholder="MM / YY" />
                  <FieldInput label="CVC" placeholder="•••" />
                </div>
              )}
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Your payment information is encrypted and processed in Sri Lanka.
            </p>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground">Summary</h3>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Subtotal" value={lkr(subtotal)} />
                {promoDiscount > 0 && <Row label="Discount" value={`- ${lkr(promoDiscount)}`} accent />}
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-3xl font-bold text-gradient">{lkr(total)}</span>
              </div>
              <Button variant="hero" size="lg" className="mt-5 w-full" disabled={create.isPending} onClick={placeOrder}>
                {create.isPending ? "Processing…" : <>Pay {lkr(total)} <ShieldCheck className="h-4 w-4" /></>}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">By paying you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> & <Link to="/refund" className="text-primary hover:underline">Refund Policy</Link>.</p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
function FieldInput({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input placeholder={placeholder} className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
    </label>
  );
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-medium", accent ? "text-emerald-400" : "text-foreground")}>{value}</dd>
    </div>
  );
}