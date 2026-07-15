import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Sparkles, CreditCard, Layers, HelpCircle } from "lucide-react";
import { useWallet, useTopUpWallet } from "@/lib/hooks/db";
import { lkr, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      {/* Title Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">My Wallet</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Load funds securely, view transaction logs, and manage your virtual gaming balance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* VIP Virtual Card */}
        <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 border-primary/20 bg-gradient-to-br from-card/40 via-primary/5 to-fuchsia-500/5 flex flex-col justify-between min-h-[220px] shadow-2xl">
          <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.22_260/0.15),transparent_70%)] blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-10px] left-10 -z-10 h-36 w-36 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_255/0.05),transparent_75%)] blur-2xl pointer-events-none" />
          
          {/* Card Top */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">H</div>
                <span className="text-xs font-bold tracking-widest text-foreground uppercase">HASA GOLD STORE</span>
              </div>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">VIP WALLET HOLDER</p>
            </div>
            {/* Holographic Chip */}
            <div className="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-300/40 via-amber-500/20 to-yellow-600/30 border border-yellow-500/20 relative">
              <div className="absolute inset-x-2 inset-y-1 border-r border-b border-yellow-500/10" />
            </div>
          </div>

          {/* Card Middle (Balance) */}
          <div className="my-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <WalletIcon className="h-3 w-3 text-primary" /> Current Balance
            </span>
            <p className="mt-1 font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              {lkr(data?.balance ?? 0)}
            </p>
          </div>

          {/* Card Bottom */}
          <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold tracking-wider uppercase border-t border-border/40 pt-4">
            <div>
              <p className="text-[8px] text-muted-foreground/60">WALLET STATUS</p>
              <p className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE VIP
              </p>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground/60 text-right">SECURE ACCOUNT</p>
              <p className="text-foreground">LKR CURRENCY</p>
            </div>
          </div>
        </div>

        {/* Deposit/Top Up Widget */}
        <div className="glass-panel rounded-3xl p-6 border-white/5 bg-card/25 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-primary" /> Top Up Wallet
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Select a preset amount or input a custom sum to deposit instantly.</p>
            
            {/* Presets Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {AMOUNTS.map((a) => (
                <button 
                  key={a} 
                  type="button"
                  onClick={() => setAmount(a)} 
                  className={cn(
                    "rounded-xl border py-2.5 text-xs font-bold tracking-tight transition-all duration-300",
                    amount === a 
                      ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10" 
                      : "border-border bg-muted/20 text-foreground hover:border-primary/30 hover:bg-muted/40"
                  )}
                >
                  {lkr(a)}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="mt-4">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Custom Amount (LKR)</span>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} 
                  className="h-11 w-full rounded-xl border border-border bg-muted/10 px-4 pr-12 text-sm font-bold text-foreground focus:border-primary/40 focus:bg-muted/30 focus:outline-none transition-all"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">LKR</span>
              </div>
            </div>

            {bonus > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                <Sparkles className="h-3.5 w-3.5 fill-emerald-400 shrink-0" />
                <span>You will receive an extra {lkr(bonus)} (5% Loyalty Bonus)!</span>
              </div>
            )}
          </div>

          <Button 
            variant="hero" 
            className="mt-5 w-full shadow-lg shadow-primary/15" 
            disabled={topup.isPending || amount <= 0} 
            onClick={() => topup.mutate(amount)}
          >
            <Plus className="h-4 w-4" /> Deposit {lkr(amount)}
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground">Transaction Logs</h3>
          </div>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
            <HelpCircle className="h-3 w-3" /> Automatic Instant Sync
          </span>
        </div>

        {!data?.transactions.length ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center bg-muted/5">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-muted/60 text-muted-foreground"><WalletIcon className="h-5 w-5" /></div>
            <p className="mt-3 text-xs font-bold text-foreground">No transactions logged</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Your financial deposits and purchasing logs will display here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.transactions.map((t) => {
              const credit = t.type !== "debit";
              return (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "grid h-10 w-10 place-items-center rounded-xl border shrink-0",
                      credit 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    )}>
                      {credit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground leading-snug">{t.description || "Wallet Transaction"}</p>
                      <p className="text-[10px] text-muted-foreground leading-normal">{formatDateTime(t.created_at)}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-bold", credit ? "text-emerald-400" : "text-rose-400")}>
                      {credit ? "+" : "-"} {lkr(t.amount_lkr)}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground mt-0.5">Bal: {lkr(t.balance_after)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}