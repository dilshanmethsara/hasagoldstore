import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { lkr } from "@/lib/format";
import { useAdminPackages, useUpsertPackage, useDeletePackage, useTogglePackage, useGames, type Package } from "@/lib/hooks/db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/packages")({
  component: PackagesPage,
});

type PkgForm = Partial<Package> & { game_id: string; label: string; amount: number; price_lkr: number };

function PackagesPage() {
  const { data, isLoading } = useAdminPackages();
  const { data: games } = useGames();
  const upsert = useUpsertPackage();
  const del = useDeletePackage();
  const toggle = useTogglePackage();

  const [gameFilter, setGameFilter] = useState<string>("all");
  const [editing, setEditing] = useState<PkgForm | null>(null);

  const gamesList = (games ?? []).map((g) => ({ id: g.id, name: g.name, slug: g.slug }));
  const filtered = (data ?? []).filter((p) => gameFilter === "all" || p.game?.slug === gameFilter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.length ?? 0} top-up packages across all games.</p>
        </div>
        <Button
          variant="hero"
          disabled={!gamesList.length}
          onClick={() => setEditing({ game_id: gamesList[0]?.id ?? "", label: "", amount: 0, price_lkr: 0, bonus: 0, is_active: true, sort_order: 0 })}
        >
          <Plus className="h-4 w-4" /> Add package
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setGameFilter("all")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${gameFilter === "all" ? "border-primary/40 bg-primary/20 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:text-foreground"}`}>All games</button>
        {gamesList.map((g) => (
          <button key={g.slug} onClick={() => setGameFilter(g.slug)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${gameFilter === g.slug ? "border-primary/40 bg-primary/20 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:text-foreground"}`}>{g.name}</button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Loading packages…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No packages.</td></tr>}
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.game?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{p.label} {p.bonus ? <span className="ml-1 text-[10px] text-emerald-400">+{p.bonus}</span> : null}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.amount}</td>
                  <td className="px-4 py-3 font-bold text-foreground">{lkr(Number(p.price_lkr))}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => toggle.mutate({ id: p.id, is_active: !p.is_active })} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground hover:text-primary">
                        {p.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => setEditing({ ...p, price_lkr: Number(p.price_lkr) })} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground hover:text-primary">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Delete ${p.label}?`)) del.mutate(p.id); }} className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <PackageFormDialog
          initial={editing}
          games={gamesList}
          onClose={() => setEditing(null)}
          onSave={(v) => upsert.mutate(v, { onSuccess: () => setEditing(null) })}
          saving={upsert.isPending}
        />
      )}
    </div>
  );
}

const inp = "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:border-primary/40 focus:outline-none";

function PackageFormDialog({ initial, games, onClose, onSave, saving }: { initial: PkgForm; games: { id: string; name: string }[]; onClose: () => void; onSave: (v: PkgForm) => void; saving: boolean }) {
  const [form, setForm] = useState<PkgForm>(initial);
  const isNew = !initial.id;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-white/10 bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{isNew ? "Add package" : `Edit ${initial.label}`}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Game</span>
            <select required value={form.game_id} onChange={(e) => setForm({ ...form, game_id: e.target.value })} className={inp}>
              <option value="">Select…</option>
              {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Label</span>
            <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inp} placeholder="100 Diamonds" />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">Amount</span>
              <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className={inp} /></label>
            <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">Bonus</span>
              <input type="number" value={form.bonus ?? 0} onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })} className={inp} /></label>
            <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">Price (LKR)</span>
              <input required type="number" step="0.01" value={form.price_lkr} onChange={(e) => setForm({ ...form, price_lkr: Number(e.target.value) })} className={inp} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">Badge (optional)</span>
              <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inp} placeholder="Best Value" /></label>
            <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">Sort order</span>
              <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inp} /></label>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active (visible on storefront)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving…" : isNew ? "Create" : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}