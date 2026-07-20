import { createFileRoute } from "@tanstack/react-router";
import { useAdminStats } from "@/lib/hooks/db";
import { lkr } from "@/lib/format";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/revenue")({
  component: RevenuePage,
});

function RevenuePage() {
  const { data: stats, isLoading } = useAdminStats();
  const chart = stats?.chart ?? [];
  const max = Math.max(1, ...chart.map((c) => c.value));
  const total = chart.reduce((s, c) => s + c.value, 0);
  const avg = chart.length ? total / chart.length : 0;
  const best = chart.reduce((a, b) => (a.value > b.value ? a : b), { date: "—", value: 0 });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Revenue Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track earnings and growth momentum.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "14-day Total", value: lkr(total) },
          { label: "Daily Average", value: lkr(Math.round(avg)) },
          { label: `Best Day (${best.date})`, value: lkr(best.value) },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/5 bg-gradient-to-br from-primary/20 to-transparent p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> {k.label}
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{isLoading ? "…" : k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
        <h2 className="mb-6 font-display text-lg font-bold text-foreground">Daily revenue</h2>
        <div className="flex h-72 items-end gap-2">
          {chart.map((c) => (
            <div key={c.date} className="group flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground opacity-0 transition group-hover:opacity-100">
                {lkr(c.value)}
              </span>
              <div className="relative w-full flex-1 overflow-hidden rounded-t-md bg-white/5">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-md bg-gradient-to-t from-primary via-primary/70 to-fuchsia-400/60 shadow-[0_0_20px_oklch(0.6_0.22_260/0.4)] transition-all"
                  style={{ height: `${(c.value / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}