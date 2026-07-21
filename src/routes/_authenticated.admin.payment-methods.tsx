import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/paymentMethodService";
import type { PaymentMethodConfig, ExtraField } from "@/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/payment-methods")({
  component: PaymentMethodsPage,
});

type FormData = Partial<PaymentMethodConfig> & { slug: string; label: string };

function PaymentMethodsPage() {
  const qc = useQueryClient();
  const { data: methods, isLoading } = useQuery({
    queryKey: ["admin", "payment-methods"],
    queryFn: () => paymentMethodService.list(),
  });

  const createMut = useMutation({
    mutationFn: (d: FormData) => paymentMethodService.create(d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "payment-methods"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentMethodConfig> }) =>
      paymentMethodService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "payment-methods"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => paymentMethodService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "payment-methods"] }),
  });
  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      paymentMethodService.toggleActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "payment-methods"] }),
  });

  const [editing, setEditing] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Payment Methods</h1>
          <p className="mt-1 text-sm text-muted-foreground">{methods?.length ?? 0} methods configured.</p>
        </div>
        <Button variant="hero" onClick={() => setEditing({ slug: "", label: "" })}>
          <Plus className="h-4 w-4" /> Add method
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>}
        {(methods ?? []).map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 backdrop-blur-xl transition hover:border-primary/30">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Banknote className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{m.label}</p>
              <p className="truncate text-xs text-muted-foreground">
                /{m.slug} &middot; {m.description ?? "—"} {m.extra_fields?.length ? `· ${m.extra_fields.length} fields` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${m.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-muted-foreground"}`}>
                {m.is_active ? "Active" : "Paused"}
              </span>
              <button onClick={() => toggleMut.mutate({ id: m.id, isActive: !m.is_active })} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition hover:text-primary" title={m.is_active ? "Pause" : "Activate"}>
                {m.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setEditing(m)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground transition hover:text-primary" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setDeleteId(m.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold text-foreground">Delete payment method?</h2>
            <p className="mt-2 text-sm text-muted-foreground">This cannot be undone. Methods with existing orders cannot be deleted.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="hero" className="bg-red-600 hover:bg-red-700" onClick={() => { deleteMut.mutate(deleteId); setDeleteId(null); }} disabled={deleteMut.isPending}>
                {deleteMut.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {editing && <MethodForm initial={editing} onClose={() => setEditing(null)} onSave={async (v) => {
        if (v.id) {
          const { id, ...rest } = v;
          updateMut.mutate({ id, data: rest }, { onSuccess: () => setEditing(null) });
        } else {
          createMut.mutate(v as FormData, { onSuccess: () => setEditing(null) });
        }
      }} saving={createMut.isPending || updateMut.isPending} />}
    </div>
  );
}

function MethodForm({ initial, onClose, onSave, saving }: { initial: FormData; onClose: () => void; onSave: (v: FormData) => void; saving: boolean }) {
  const [form, setForm] = useState<FormData>(initial);
  const isNew = !initial.id;

  const fields: ExtraField[] = (form as any).extra_fields ?? [];
  const setFields = (f: ExtraField[]) => setForm({ ...form, extra_fields: f });

  const addField = () => setFields([...fields, { name: "", label: "", type: "text", required: false }]);
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, patch: Partial<ExtraField>) => {
    setFields(fields.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{isNew ? "Add payment method" : `Edit ${initial.label}`}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug">
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })} className={inp} placeholder="card" />
            </Field>
            <Field label="Label">
              <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inp} placeholder="Credit / Debit Card" />
            </Field>
          </div>
          <Field label="Description">
            <input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} placeholder="Secure card payments" />
          </Field>
          <Field label="Icon URL">
            <input value={form.icon_url ?? ""} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} className={inp} placeholder="https://..." />
          </Field>
          <Field label="Instructions (shown at checkout)">
            <textarea value={form.instructions ?? ""} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className={`${inp} min-h-[80px] resize-y`} placeholder="Bank: 123-456-789&#10;Name: John Doe" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min amount (LKR)">
              <input type="number" value={form.min_amount ?? ""} onChange={(e) => setForm({ ...form, min_amount: e.target.value ? Number(e.target.value) : null })} className={inp} />
            </Field>
            <Field label="Max amount (LKR)">
              <input type="number" value={form.max_amount ?? ""} onChange={(e) => setForm({ ...form, max_amount: e.target.value ? Number(e.target.value) : null })} className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fee %">
              <input type="number" step="0.01" value={form.fee_percent ?? 0} onChange={(e) => setForm({ ...form, fee_percent: Number(e.target.value) })} className={inp} />
            </Field>
            <Field label="Fee fixed (LKR)">
              <input type="number" step="0.01" value={form.fee_fixed ?? 0} onChange={(e) => setForm({ ...form, fee_fixed: Number(e.target.value) })} className={inp} />
            </Field>
          </div>
          <Field label="Sort order">
            <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inp} />
          </Field>
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
            </label>
          </div>

          {/* ── Extra Fields ── */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Extra Fields</h3>
              <button type="button" onClick={addField} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-3 w-3" /> Add field
              </button>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Custom inputs shown at checkout for this method.</p>
            {fields.length === 0 && <p className="mt-2 text-xs text-muted-foreground italic">No custom fields.</p>}
            <div className="mt-3 space-y-2">
              {fields.map((f, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center pt-1 text-muted-foreground">
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                    <input value={f.name} onChange={(e) => updateField(i, { name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })} className={`${inp} h-8 text-xs`} placeholder="field_name" />
                    <input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} className={`${inp} h-8 text-xs`} placeholder="Label" />
                    <select value={f.type} onChange={(e) => updateField(i, { type: e.target.value as ExtraField["type"] })} className={`${inp} h-8 text-xs`}>
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                    </select>
                    <input value={f.placeholder ?? ""} onChange={(e) => updateField(i, { placeholder: e.target.value })} className={`${inp} h-8 text-xs`} placeholder="Placeholder" />
                    <label className="col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" checked={f.required} onChange={(e) => updateField(i, { required: e.target.checked })} /> Required
                    </label>
                  </div>
                  <button type="button" onClick={() => removeField(i)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-400 hover:bg-red-500/20">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
