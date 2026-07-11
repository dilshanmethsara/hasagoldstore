import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Sparkles } from "lucide-react";
import { useWallet, useTopUpWallet } from "@/lib/hooks/db";
import { lkr, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/wallet")({
  head: () => ({ meta: [{ title: "Wallet — HASA GOLD STORE" }] }),
  component: WalletPage,
});

const AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

function WalletPage() {
  const { data } = useWallet();
  const [amount, setAmount] = useState<number>(1000);
  const topup = useTopUpWallet();
  const bonus = amount >= 5000 ? Math.round(amount * 0.05) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Load funds, view transactions and manage your balance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_260/0.4),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary"><WalletIcon className="h-3.5 w-3.5" /> Current Balance</div>
            <p className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">{lkr(data?.balance ?? 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Available for instant purchases</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-foreground">Top-up Wallet</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {AMOUNTS.map((a) => (
              <button key={a} onClick={() => setAmount(a)} className={`rounded-xl border px-2 py-3 text-sm font-semibold transition-all ${amount === a ? "border-primary bg-primary/10 text-primary" : "border-white/5 bg-white/5 text-foreground hover:border-primary/30"}`}>{lkr(a)}</button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Custom amount (LKR)</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          </label>
          {bonus > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400"><Sparkles className="h-3 w-3" /> You'll get an extra {lkr(bonus)} bonus!</p>}
          <Button variant="hero" className="mt-4 w-full" disabled={topup.isPending || amount <= 0} onClick={() => topup.mutate(amount)}><Plus className="h-4 w-4" /> Add {lkr(amount)}</Button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Transactions</h3>
        {!data?.transactions.length ? (
          <p className="mt-6 py-8 text-center text-sm text-muted-foreground">No wallet activity yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {data.transactions.map((t) => {
              const credit = t.type !== "debit";
              return (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${credit ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {credit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(t.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${credit ? "text-emerald-400" : "text-red-400"}`}>{credit ? "+" : "-"} {lkr(t.amount_lkr)}</p>
                    <p className="text-[11px] text-muted-foreground">Bal {lkr(t.balance_after)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}