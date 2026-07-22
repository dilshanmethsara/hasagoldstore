import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Lock, Save, Bell, Mail, MessageCircle, Plus, X, Check } from "lucide-react";
import { useSystemSettings, useUpdateSetting } from "@/lib/hooks/db";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

const inp = "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none";

function SettingsPage() {
  const { data, isLoading } = useSystemSettings();
  const update = useUpdateSetting();

  const [maint, setMaint] = useState({ enabled: false, message: "" });
  const [lock, setLock] = useState({ enabled: false, message: "" });
  const [adminEmails, setAdminEmails] = useState("");
  const [adminPhones, setAdminPhones] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (!data) return;
    setMaint(data.maintenance);
    setLock(data.security_lock);
    setAdminEmails(data.admin_notification_emails ?? "");
    // phones stored as newline/comma separated string
    const phones = (data.admin_notification_phones ?? "")
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    setAdminPhones(phones);
  }, [data]);

  const addPhone = () => {
    const trimmed = newPhone.trim();
    if (!trimmed) return;
    if (adminPhones.includes(trimmed)) { toast.error("Number already added"); return; }
    setAdminPhones((prev) => [...prev, trimmed]);
    setNewPhone("");
  };

  const removePhone = (p: string) => setAdminPhones((prev) => prev.filter((x) => x !== p));

  const saveNotifications = () => {
    update.mutate({ key: "adminNotificationEmails", value: adminEmails });
    update.mutate({ key: "adminNotificationPhones", value: adminPhones.join("\n") });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">System Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage storefront toggles and admin notification contacts.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {/* ── Maintenance mode ── */}
      <SettingCard
        title="Maintenance Mode"
        description="Show a full-screen 'Under maintenance' page to all visitors. Admins can still sign in."
        icon={AlertTriangle}
        tone="amber"
        enabled={maint.enabled}
        message={maint.message}
        onToggle={(v) => setMaint({ ...maint, enabled: v })}
        onMessage={(m) => setMaint({ ...maint, message: m })}
        onSave={() => update.mutate({ key: "maintenance", value: maint })}
        saving={update.isPending}
      />

      {/* ── Security lock ── */}
      <SettingCard
        title="Security Lock — Disable New Orders"
        description="Temporarily block all new order submissions. Existing orders continue to be processed."
        icon={Lock}
        tone="red"
        enabled={lock.enabled}
        message={lock.message}
        onToggle={(v) => setLock({ ...lock, enabled: v })}
        onMessage={(m) => setLock({ ...lock, message: m })}
        onSave={() => update.mutate({ key: "securityLock", value: lock })}
        saving={update.isPending}
      />

      {/* ── Admin Notifications ── */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/30 bg-primary/5 text-primary">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Admin Order Notifications</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Every new order will trigger an email and WhatsApp alert to the contacts below.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* ── Emails ── */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> Notification Emails
            </label>
            <textarea
              rows={4}
              value={adminEmails}
              onChange={(e) => setAdminEmails(e.target.value)}
              placeholder={"admin@example.com\nmanager@example.com"}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">One email per line or comma-separated.</p>
          </div>

          {/* ── WhatsApp Numbers ── */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Numbers
            </label>

            <div className="flex gap-2">
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPhone()}
                placeholder="94XXXXXXXXX"
                className={inp}
              />
              <button
                onClick={addPhone}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1.5 text-[11px] text-muted-foreground">
              International format without +. E.g. <code className="rounded bg-white/5 px-1">94771234567</code>
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {adminPhones.length === 0 && (
                <p className="text-xs text-muted-foreground">No numbers added yet.</p>
              )}
              {adminPhones.map((p) => (
                <span key={p} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-foreground">
                  <Check className="h-3 w-3 text-emerald-400" />
                  {p}
                  <button onClick={() => removePhone(p)} className="ml-1 text-muted-foreground hover:text-red-400 transition">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="hero" onClick={saveNotifications} disabled={update.isPending}>
            <Save className="h-4 w-4" /> {update.isPending ? "Saving…" : "Save Notifications"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ title, description, icon: Icon, tone, enabled, message, onToggle, onMessage, onSave, saving }: {
  title: string; description: string; icon: typeof AlertTriangle; tone: "amber" | "red";
  enabled: boolean; message: string; onToggle: (v: boolean) => void; onMessage: (m: string) => void; onSave: () => void; saving: boolean;
}) {
  const toneCls = tone === "amber"
    ? "border-amber-500/30 bg-amber-500/5 text-amber-400"
    : "border-red-500/30 bg-red-500/5 text-red-400";
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <span className={`grid h-11 w-11 place-items-center rounded-xl border ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
          <div className="h-6 w-11 rounded-full bg-white/10 transition after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-primary peer-checked:after:translate-x-5" />
        </label>
      </div>
      <label className="mt-4 block space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Message shown to users</span>
        <textarea rows={2} value={message} onChange={(e) => onMessage(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
      </label>
      <div className="mt-4 flex justify-end">
        <Button variant="hero" onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
