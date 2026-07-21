import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, Wallet, Smartphone, ShieldCheck, ArrowLeft, Lock, Building2, Banknote, Upload, Image, X } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { lkr } from "@/lib/format";
import { useGame, usePackages, useCreateOrder, useWallet } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { useAuth } from "@/lib/use-auth";
import { useQuery } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/paymentMethodService";
import { orderService } from "@/services/orderService";
import type { PaymentMethodConfig, ExtraField } from "@/types";

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

/* ───── hack: extraFields are passed via useCreateOrder hook which sends input.paymentMethod only.
 *        We need to patch the hook result to also send receiptUrl & paymentDetails.
 *        The hook calls orderService.create(input) — we intercept with a wrapper. ───── */

function CheckoutPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: game, isLoading: gameLoading } = useGame(search.game);
  const { data: packages = [], isLoading: pkgsLoading } = usePackages(game?.id);
  const { data: wallet } = useWallet();
  const createMut = useCreateOrder();

  const pkg = useMemo(() => packages.find((p) => p.id === search.pkg) ?? packages[0], [packages, search.pkg]);
  const loading = gameLoading || (!!game && pkgsLoading);
  const art = gameArt(search.game ?? "");
  const [method, setMethod] = useState("card");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const ICON_MAP: Record<string, typeof Banknote> = { card: CreditCard, wallet: Wallet, ez_cash: Smartphone, frimi: Building2, bank_transfer: Banknote };

  const { data: methods = [] } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentMethodService.listActive(),
  });

  useEffect(() => {
    if (methods.length > 0 && methods.some(m => m.slug === method)) return;
    if (methods.length > 0) setMethod(methods[0].slug);
  }, [methods]);

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

  const currentMethod = methods.find((m) => m.slug === method);
  const fields = currentMethod?.extra_fields ?? [];
  const needsReceipt = ["ez_cash", "bank_transfer", "frimi"].includes(method);

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

  const placeOrder = async () => {
    if (!user) { navigate({ to: "/auth/login", search: { redirect: window.location.pathname + window.location.search } as never }); return; }
    if (!user.phone_verified) {
      navigate({ to: "/auth/verify-phone" });
      return;
    }

    let receiptUrl: string | undefined;
    if (receiptFile) {
      setUploading(true);
      receiptUrl = await orderService.uploadReceipt(receiptFile);
      setUploading(false);
    }

    try {
      const order = await createMut.mutateAsync({
        game, pkg, playerId: search.pid ?? "",
        paymentMethod: method, promoCode: search.promo || undefined,
        receiptUrl, paymentDetails: Object.keys(extraValues).length ? extraValues : undefined,
      } as any);
      navigate({ to: "/checkout/success", search: { order: order.order_number } });
    } catch {
      /* toast */
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

            {/* ── Payment Method Selection ── */}
            <div className="glass-card rounded-3xl p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Payment Method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {methods.map((m) => {
                  const active = method === m.slug;
                  const Icon = ICON_MAP[m.slug] ?? Banknote;
                  const disabled = m.slug === "wallet" && (wallet?.balance ?? 0) < total;
                  return (
                    <button
                      key={m.id} disabled={disabled}
                      onClick={() => { setMethod(m.slug); setExtraValues({}); setReceiptFile(null); setReceiptPreview(null); }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:opacity-40",
                        active
                          ? "border-primary bg-primary/10 shadow-[0_0_30px_-10px_var(--primary)]"
                          : "border-white/5 bg-white/[0.03] hover:border-primary/30",
                      )}
                    >
                      <div className={cn("grid h-11 w-11 place-items-center rounded-xl", active ? "bg-[var(--gradient-primary)] text-primary-foreground" : "bg-white/5 text-muted-foreground")}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.description ?? m.slug}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Dynamic Fields ── */}
              {fields.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{currentMethod?.label} Details</h3>
                  {fields.map((f) => (
                    <DynamicField key={f.name} field={f} value={extraValues[f.name] ?? ""} onChange={(v) => setExtraValues({ ...extraValues, [f.name]: v })} />
                  ))}
                </div>
              )}

              {/* ── Instructions ── */}
              {currentMethod?.instructions && (
                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                  {currentMethod.instructions}
                </div>
              )}

              {/* ── Receipt Upload ── */}
              {needsReceipt && (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Receipt</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">Upload a screenshot or photo of your payment confirmation.</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setReceiptFile(f); setReceiptPreview(URL.createObjectURL(f)); }
                  }} />
                  {receiptPreview ? (
                    <div className="mt-3 relative inline-block">
                      <img src={receiptPreview} alt="Receipt preview" className="max-h-40 rounded-xl object-contain border border-white/10" />
                      <button onClick={() => { setReceiptFile(null); setReceiptPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                        className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white shadow-lg">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
                      <Upload className="h-4 w-4" /> Upload receipt
                    </button>
                  )}
                </div>
              )}

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
              <Button variant="hero" size="lg" className="mt-5 w-full" disabled={createMut.isPending || uploading} onClick={placeOrder}>
                {createMut.isPending || uploading ? "Processing…" : <>Pay {lkr(total)} <ShieldCheck className="h-4 w-4" /></>}
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

function DynamicField({ field, value, onChange }: { field: ExtraField; value: string; onChange: (v: string) => void }) {
  const cls = "h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none";
  if (field.type === "textarea") {
    return (
      <label className="block space-y-1">
        <span className="text-xs font-medium text-muted-foreground">{field.label}{field.required ? " *" : ""}</span>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} min-h-[80px] resize-y py-3`} placeholder={field.placeholder} required={field.required} />
      </label>
    );
  }
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{field.label}{field.required ? " *" : ""}</span>
      <input type={field.type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={field.placeholder} required={field.required} />
    </label>
  );
}

const inp = "h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none";

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
      <input placeholder={placeholder} className={inp} />
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