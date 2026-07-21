import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gamepad2, Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { useGames, useUpsertGame, useDeleteGame, useToggleGameLive, type Game } from "@/lib/hooks/db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/games")({
  component: GamesPage,
});

type GameForm = Partial<Game> & {
  name: string;
  slug: string;
  card_image_file?: File | null;
  hero_image_file?: File | null;
};

function GamesPage() {
  const { data: games, isLoading } = useGames();
  const upsert = useUpsertGame();
  const del = useDeleteGame();
  const toggle = useToggleGameLive();
  const [editing, setEditing] = useState<GameForm | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Games</h1>
          <p className="mt-1 text-sm text-muted-foreground">{games?.length ?? 0} titles in catalog.</p>
        </div>
        <Button variant="hero" onClick={() => setEditing({ name: "", slug: "", is_live: true, is_featured: false, sort_order: 0, popularity: 0 })}>
          <Plus className="h-4 w-4" /> Add game
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">Loading games…</p>}
        {(games ?? []).map((g) => (
          <div key={g.id} className="group overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition hover:border-primary/30">
            <div className="relative aspect-[16/9] overflow-hidden">
              {g.card_image ? (
                <img src={g.card_image} alt={g.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              ) : (
                <div className="grid h-full place-items-center bg-gradient-to-br from-primary/30 to-fuchsia-500/20">
                  <Gamepad2 className="h-10 w-10 text-primary" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-4">
                <p className="font-display text-lg font-bold text-foreground">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.publisher ?? "—"}</p>
              </div>
              <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${g.is_live ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-muted-foreground"}`}>
                {g.is_live ? "Live" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <span className="truncate text-[10px] text-muted-foreground">/{g.slug}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => toggle.mutate({ id: g.id, is_live: !g.is_live })} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition hover:text-primary" title={g.is_live ? "Hide" : "Show"}>
                  {g.is_live ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => setEditing(g)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition hover:text-primary" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { if (confirm(`Delete ${g.name}? This will remove its packages and unlink orders.`)) del.mutate(g.id); }}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <GameFormDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (v) => {
            if (v.card_image_file || v.hero_image_file) {
              const formData = new FormData();
              if (v.card_image_file) formData.append('card_image', v.card_image_file);
              if (v.hero_image_file) formData.append('hero_image', v.hero_image_file);
              try {
                const token = localStorage.getItem('auth_token');
                const uploadRes = await fetch('http://localhost:3001/admin/games/upload', {
                  method: 'POST',
                  credentials: 'include',
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                  body: formData,
                });
                if (uploadRes.ok) {
                  const uploadData = await uploadRes.json();
                  v = { ...v, ...uploadData };
                } else {
                  console.error('Upload failed:', uploadRes.status, await uploadRes.text());
                }
              } catch (error) {
                console.error('Upload error:', error);
              }
            }
            upsert.mutate(v, { onSuccess: () => setEditing(null) });
          }}
          saving={upsert.isPending}
        />
      )}
    </div>
  );
}

function GameFormDialog({ initial, onClose, onSave, saving }: { initial: GameForm; onClose: () => void; onSave: (v: GameForm) => void; saving: boolean }) {
  const [form, setForm] = useState<GameForm>(initial);
  const isNew = !initial.id;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{isNew ? "Add game" : `Edit ${initial.name}`}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        >
          <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></Field>
          <Field label="Slug (URL)"><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className={inp} placeholder="free-fire" /></Field>
          <Field label="Publisher"><input value={form.publisher ?? ""} onChange={(e) => setForm({ ...form, publisher: e.target.value })} className={inp} /></Field>
          <Field label="Tagline"><input value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inp} /></Field>
          <Field label="Card image"><input type="file" accept="image/*" onChange={(e) => setForm({ ...form, card_image_file: e.target.files?.[0] || null })} className={inp} />{form.card_image && <img src={form.card_image} className="mt-2 h-20 w-auto rounded-lg" />}</Field>
          <Field label="Hero image"><input type="file" accept="image/*" onChange={(e) => setForm({ ...form, hero_image_file: e.target.files?.[0] || null })} className={inp} />{form.hero_image && <img src={form.hero_image} className="mt-2 h-20 w-auto rounded-lg" />}</Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sort order"><input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inp} /></Field>
            <Field label="Popularity"><input type="number" value={form.popularity ?? 0} onChange={(e) => setForm({ ...form, popularity: Number(e.target.value) })} className={inp} /></Field>
          </div>
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={!!form.is_live} onChange={(e) => setForm({ ...form, is_live: e.target.checked })} /> Live</label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving…" : isNew ? "Create" : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inp = "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:border-primary/40 focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}