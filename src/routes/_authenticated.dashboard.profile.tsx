import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/hooks/db";
import { useAuth } from "@/lib/use-auth";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — HASA GOLD STORE" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, refetch } = useProfile();
  const [form, setForm] = useState({ display_name: "", username: "", phone: "", country: "Sri Lanka" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      display_name: profile.display_name ?? "",
      username: profile.username ?? "",
      phone: profile.phone ?? "",
      country: profile.country ?? "Sri Lanka",
    });
  }, [profile]);

  const save = async () => {
    setBusy(true);
    try {
      await userService.updateProfile({
        displayName: form.display_name,
        username: form.username || null,
        phone: form.phone || null,
        country: form.country || null,
      });
      toast.success("Profile saved");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };
  void user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your personal information and preferences.</p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[var(--gradient-primary)] text-2xl font-bold text-primary-foreground">
            {(form.display_name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-bold text-foreground">{form.display_name || user?.email}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Display Name" value={form.display_name} onChange={(v) => setForm({ ...form, display_name: v })} />
          <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="hero" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save Changes"}</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
    </label>
  );
}