import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Lock, Save } from "lucide-react";
import { useSystemSettings, useUpdateSetting } from "@/lib/hooks/db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isLoading } = useSystemSettings();
  const update = useUpdateSetting();
  const [maint, setMaint] = useState({ enabled: false, message: "" });
  const [lock, setLock] = useState({ enabled: false, message: "" });

  useEffect(() => {
    if (data) {
      setMaint(data.maintenance);
      setLock(data.security_lock);
    }
  }, [data]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">System control</h1>
        <p className="mt-1 text-sm text-muted-foreground">Emergency toggles that affect the entire storefront.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <SettingCard
        title="Maintenance mode"
        description="Show a full-screen 'Under maintenance' page to all visitors. Admins can still sign in and access the admin panel."
        icon={AlertTriangle}
        tone="amber"
        enabled={maint.enabled}
        message={maint.message}
        onToggle={(v) => setMaint({ ...maint, enabled: v })}
        onMessage={(m) => setMaint({ ...maint, message: m })}
        onSave={() => update.mutate({ key: "maintenance", value: maint })}
        saving={update.isPending}
      />

      <SettingCard
        title="Security lock — disable new orders"
        description="Temporarily block all new order submissions. Existing orders continue to be processed."
        icon={Lock}
        tone="red"
        enabled={lock.enabled}
        message={lock.message}
        onToggle={(v) => setLock({ ...lock, enabled: v })}
        onMessage={(m) => setLock({ ...lock, message: m })}
        onSave={() => update.mutate({ key: "security_lock", value: lock })}
        saving={update.isPending}
      />
    </div>
  );
}

function SettingCard({ title, description, icon: Icon, tone, enabled, message, onToggle, onMessage, onSave, saving }: {
  title: string; description: string; icon: typeof AlertTriangle; tone: "amber" | "red";
  enabled: boolean; message: string; onToggle: (v: boolean) => void; onMessage: (m: string) => void; onSave: () => void; saving: boolean;
}) {
  const toneCls = tone === "amber" ? "border-amber-500/30 bg-amber-500/5 text-amber-400" : "border-red-500/30 bg-red-500/5 text-red-400";
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <span className={`grid h-11 w-11 place-items-center rounded-xl border ${toneCls}`}><Icon className="h-5 w-5" /></span>
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
        <textarea rows={2} value={message} onChange={(e) => onMessage(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
      </label>
      <div className="mt-4 flex justify-end">
        <Button variant="hero" onClick={onSave} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
}