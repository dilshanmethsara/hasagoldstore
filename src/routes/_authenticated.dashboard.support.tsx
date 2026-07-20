import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, MessageCircle, Send, Plus } from "lucide-react";
import { useMyTickets, useCreateTicket } from "@/lib/hooks/db";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/format";
import { useAuth } from "@/lib/use-auth";
import { PhoneVerificationDialog } from "@/components/system/PhoneVerificationDialog";

export const Route = createFileRoute("/_authenticated/dashboard/support")({
  head: () => ({ meta: [{ title: "Support — HASA GOLD STORE" }] }),
  component: SupportPage,
});

const CATEGORIES = ["order", "payment", "account", "technical", "other"];

function SupportPage() {
  const { data: tickets = [], isLoading } = useMyTickets();
  const { user } = useAuth();
  const create = useCreateTicket();
  const [open, setOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "order", body: "" });

  const submit = async () => {
    if (!form.subject || !form.body) return;
    if (!user?.phone_verified) {
      setOpen(false);
      setVerifyOpen(true);
      return;
    }
    await create.mutateAsync(form);
    setForm({ subject: "", category: "order", body: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get help fast — our team responds within 15 minutes.</p>
        </div>
        <Button variant="hero" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Ticket</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/help" className="glass-card rounded-2xl p-5 hover:border-primary/30">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><LifeBuoy className="h-4 w-4" /></div>
          <p className="mt-3 font-semibold text-foreground">Help Center</p>
          <p className="text-xs text-muted-foreground">Browse guides & FAQs</p>
        </Link>
        <Link to="/contact" className="glass-card rounded-2xl p-5 hover:border-primary/30">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-4 w-4" /></div>
          <p className="mt-3 font-semibold text-foreground">Contact Us</p>
          <p className="text-xs text-muted-foreground">Reach the team directly</p>
        </Link>
        <a href="mailto:support@hasagoldstore.lk" className="glass-card rounded-2xl p-5 hover:border-primary/30">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Send className="h-4 w-4" /></div>
          <p className="mt-3 font-semibold text-foreground">Email Us</p>
          <p className="text-xs text-muted-foreground">support@hasagoldstore.lk</p>
        </a>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground">My Tickets</h3>
        {isLoading ? (
          <p className="mt-6 py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : tickets.length === 0 ? (
          <p className="mt-6 py-8 text-center text-sm text-muted-foreground">No tickets yet. Open one anytime.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{t.subject}</p>
                  <p className="text-xs capitalize text-muted-foreground">{t.category} • {timeAgo(t.created_at)}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                  t.status === "open" ? "border-primary/30 bg-primary/10 text-primary" :
                  t.status === "resolved" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" :
                  "border-white/10 bg-white/5 text-muted-foreground"
                }`}>{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass-card w-full max-w-lg rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-foreground">New Support Ticket</h3>
            <div className="mt-4 space-y-3">
              <Field label="Subject"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-11 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground focus:border-primary/40 focus:outline-none" /></Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-11 w-full rounded-xl border border-white/5 bg-white/5 px-3 text-sm text-foreground capitalize focus:border-primary/40 focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="How can we help?"><textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-foreground focus:border-primary/40 focus:outline-none" /></Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="hero" disabled={create.isPending} onClick={submit}>{create.isPending ? "Sending…" : "Submit Ticket"}</Button>
            </div>
          </div>
        </div>
      )}

      <PhoneVerificationDialog open={verifyOpen} onOpenChange={setVerifyOpen} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}