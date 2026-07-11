import { createFileRoute } from "@tanstack/react-router";
import { Tag, Copy, Sparkles } from "lucide-react";
import { usePromoCodes } from "@/lib/hooks/db";
import { lkr, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/promo-codes")({
  head: () => ({ meta: [{ title: "Promo Codes — HASA GOLD STORE" }] }),
  component: PromoCodesPage,
});

function PromoCodesPage() {
  const { data: codes = [], isLoading } = usePromoCodes();
  const active = codes.filter((c) => c.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Promo Codes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Apply these at checkout to unlock savings.</p>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
      ) : active.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5"><Tag className="h-6 w-6 text-muted-foreground" /></div>
          <p className="mt-4 font-display font-semibold text-foreground">No promo codes right now</p>
          <p className="mt-1 text-sm text-muted-foreground">Check back soon — new offers drop weekly.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((c) => (
            <div key={c.id} className="glass-card relative overflow-hidden rounded-2xl">
              <div className="absolute -right-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-background" />
              <div className="absolute -left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-background" />
              <div className="flex items-stretch">
                <div className="grid w-24 place-items-center bg-[var(--gradient-primary)] p-4 text-primary-foreground">
                  <div className="text-center">
                    <Sparkles className="mx-auto h-5 w-5" />
                    <p className="mt-1 font-display text-2xl font-bold leading-none">{c.kind === "percent" ? `${c.value}%` : lkr(c.value)}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-90">OFF</p>
                  </div>
                </div>
                <div className="flex-1 border-l border-dashed border-white/10 p-4">
                  <p className="font-display text-lg font-bold text-foreground">{c.description ?? c.code}</p>
                  <p className="text-xs text-muted-foreground">Min spend {lkr(c.min_spend_lkr)}{c.expires_at && ` • Expires ${formatDate(c.expires_at)}`}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 truncate rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-mono font-bold text-primary">{c.code}</code>
                    <button onClick={() => { navigator.clipboard.writeText(c.code); toast.success("Copied " + c.code); }} className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Copy className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}