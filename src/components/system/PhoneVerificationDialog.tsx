import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ShieldCheck, ArrowRight, Loader2, MessageSquareText, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

interface PhoneVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
  title?: string;
  description?: string;
}

export function PhoneVerificationDialog({
  open,
  onOpenChange,
  onVerified,
  title = "Verify your WhatsApp number",
  description = "Enter your WhatsApp number to receive a verification code.",
}: PhoneVerificationDialogProps) {
  const { user, refresh } = useAuthContext();
  const [phase, setPhase] = useState<"request" | "confirm">("request");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const nextPhone = user?.phone ?? user?.profile?.phone ?? "";
    // Store without leading 0 for WhatsApp format
    setPhone(nextPhone.replace(/^0/, ""));
    setCode("");
    setError(null);
    setMessage(null);
    setPhase("request");
  }, [open, user?.phone, user?.profile?.phone]);

  // Display format: add +94 prefix for display
  const displayPhone = useMemo(() => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("94")) return `+${cleaned}`;
    if (cleaned.startsWith("0")) return `+94${cleaned.slice(1)}`;
    return `+94${cleaned}`;
  }, [phone]);

  const requestCode = async (e?: FormEvent) => {
    e?.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 9) {
      setError("Enter a valid Sri Lankan phone number (e.g., 771234567).");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Send with country code format for backend
      const formattedPhone = cleaned.startsWith("94") ? `+${cleaned}` : `+94${cleaned}`;
      await authService.requestPhoneCode(formattedPhone, "whatsapp");
      setPhase("confirm");
      setMessage("A verification code has been sent to your WhatsApp.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the verification code.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!code.trim()) {
      setError("Enter the code you received.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const cleaned = phone.replace(/\D/g, "");
      const formattedPhone = cleaned.startsWith("94") ? `+${cleaned}` : `+94${cleaned}`;
      await authService.verifyPhone({ phone: formattedPhone, code: code.trim() });
      await refresh();
      onVerified?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The verification code was invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto">
        <DialogHeader className="flex flex-col items-center text-center pb-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">{description}</DialogDescription>
        </DialogHeader>

        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-foreground text-sm sm:text-base">
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="flex-1">Verifies your WhatsApp for secure checkout & wallet access.</span>
          </div>
        </div>

        {phase === "request" ? (
          <form onSubmit={requestCode} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">WhatsApp Number (without leading 0)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+94</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  inputMode="tel"
                  placeholder="771234567"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                  autoComplete="tel"
                  autoFocus
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Example: 771234567 (not 0771234567)</p>
            </label>
            {error && <p className="text-sm text-rose-400" role="alert">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            <Button type="submit" variant="hero" className="w-full h-12 text-base" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
              )}
              Send Code via WhatsApp
            </Button>
          </form>
        ) : (
          <form onSubmit={confirmCode} className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to <span className="font-semibold text-foreground">{displayPhone}</span> on WhatsApp.
              </p>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Verification Code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="123456"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-center text-lg tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                autoComplete="one-time-code"
                autoFocus
              />
            </label>
            {error && <p className="text-sm text-rose-400" role="alert">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setPhase("request")}>
                Back
              </Button>
              <Button type="submit" variant="hero" className="flex-1 h-12" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                Verify
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
