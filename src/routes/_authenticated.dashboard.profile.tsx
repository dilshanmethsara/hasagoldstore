import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/hooks/db";
import { useAuthContext } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PhoneVerificationDialog } from "@/components/system/PhoneVerificationDialog";
import { ShieldCheck, AlertCircle, Edit2, Smartphone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — HASA GOLD STORE" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, refresh } = useAuthContext();
  const { data: profile, refetch } = useProfile();
  const [form, setForm] = useState({ display_name: "", username: "", country: "Sri Lanka" });
  const [busy, setBusy] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [changeNumberOpen, setChangeNumberOpen] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      display_name: profile.display_name ?? "",
      username: profile.username ?? "",
      country: profile.country ?? "Sri Lanka",
    });
  }, [profile]);

  const save = async () => {
    setBusy(true);
    try {
      await userService.updateProfile({
        displayName: form.display_name,
        username: form.username || null,
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

  const handlePhoneVerified = async () => {
    setPhoneDialogOpen(false);
    await refresh();
    refetch();
    toast.success("WhatsApp number verified");
  };

  const handleChangeNumber = async () => {
    setChangeNumberOpen(false);
    setPhoneDialogOpen(true);
  };

  const phone = user?.phone ?? profile?.phone ?? "";
  const phoneVerified = user?.phone_verified ?? false;

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
          <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          
          {/* Phone Number Section */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${phoneVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {phoneVerified ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Smartphone className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp Number</p>
                  <p className="text-xs text-muted-foreground">
                    {phoneVerified ? "Verified for secure checkout & wallet access" : "Not verified — required for checkout and wallet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {phoneVerified && phone ? (
                  <>
                    <span className="text-sm font-mono text-foreground bg-white/5 px-3 py-1.5 rounded-xl">{phone}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setChangeNumberOpen(true)}>
                          <Edit2 className="h-4 w-4 mr-1.5" />
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Change WhatsApp Number</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground mt-2 mb-4">This will open the verification dialog to update your WhatsApp number.</p>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setChangeNumberOpen(false)}>Cancel</Button>
                          <Button variant="hero" onClick={handleChangeNumber}>Change Number</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <Button variant="hero" size="sm" onClick={() => setPhoneDialogOpen(true)}>
                    {phoneVerified ? "Verify" : "Verify WhatsApp"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="hero" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save Changes"}</Button>
        </div>
      </div>

      {/* Phone Verification Dialog */}
      <PhoneVerificationDialog
        open={phoneDialogOpen}
        onOpenChange={setPhoneDialogOpen}
        onVerified={handlePhoneVerified}
        title={phoneVerified && phone ? "Update WhatsApp Number" : "Verify WhatsApp Number"}
        description={phoneVerified && phone ? "Enter your new WhatsApp number to update it." : "Enter your WhatsApp number to receive a verification code."}
      />
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