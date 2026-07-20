import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Lock, Smartphone, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/security")({
  head: () => ({ meta: [{ title: "Security — HASA GOLD STORE" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const { user } = useAuth();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const updatePassword = async () => {
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    try {
      await authService.changePassword({ currentPassword: "", newPassword: pw, confirm: pw });
      toast.success("Password updated");
      setPw("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your password, sessions and account safety.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Info icon={ShieldCheck} label="Account status" value="Verified" accent />
        <Info icon={Smartphone} label="2FA" value="Not configured" />
        <Info icon={Key} label="Signed in as" value={user?.email ?? "—"} />
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Lock className="h-5 w-5 text-primary" /> Change Password</h3>
        <p className="mt-1 text-sm text-muted-foreground">Use a strong password you don't use elsewhere.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="h-12 rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          <Button variant="hero" disabled={busy} onClick={updatePassword}>{busy ? "Saving…" : "Update Password"}</Button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Smartphone className="h-5 w-5 text-primary" /> Two-Factor Authentication</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add an extra layer of security using an authenticator app.</p>
        <Button variant="outline" className="mt-4" onClick={() => toast.info("2FA setup coming soon")}>Enable 2FA</Button>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"}`}><Icon className="h-4 w-4" /></div>
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}