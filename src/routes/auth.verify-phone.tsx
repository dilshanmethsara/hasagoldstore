import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Smartphone, ArrowRight, RotateCcw, ShieldCheck, MessageSquareText, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/auth/verify-phone")({
  head: () => ({ meta: [{ title: "Verify WhatsApp — HASA GOLD STORE" }] }),
  component: VerifyPhonePage,
});

function VerifyPhonePage() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [phase, setPhase] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const nextPhone = user.phone ?? user.profile?.phone ?? "";
    setPhone(nextPhone.replace(/^0/, "").replace(/\D/g, "").slice(0, 9));
  }, [user]);

  useEffect(() => {
    if (phase !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timer]);

  const displayPhone = useMemo(() => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("94")) return `+${cleaned}`;
    if (cleaned.startsWith("0")) return `+94${cleaned.slice(1)}`;
    return `+94${cleaned}`;
  }, [phone]);

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 9) {
      setError("Enter a valid Sri Lankan phone number (e.g., 771234567).");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const formattedPhone = cleaned.startsWith("94") ? `+${cleaned}` : `+94${cleaned}`;
      await authService.requestPhoneCode(formattedPhone, "whatsapp");
      setPhase("otp");
      setTimer(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the verification code.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    const otp = code.join("").trim();
    if (otp.length < 4) {
      setError("Enter the full code.");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const cleaned = phone.replace(/\D/g, "");
      const formattedPhone = cleaned.startsWith("94") ? `+${cleaned}` : `+94${cleaned}`;
      await authService.verifyPhone({ phone: formattedPhone, code: otp });
      await refresh();
      setMessage("WhatsApp verified successfully.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The verification code was invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Secure your account with WhatsApp." subtitle="Step 3 of 3 · Verify your WhatsApp number for secure access.">
      <div className="mb-6 flex items-center gap-2" role="progressbar" aria-valuenow={3} aria-valuemin={1} aria-valuemax={3}>
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
      </div>

      {phase === "input" ? (
        <form onSubmit={requestCode} className="space-y-5">
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">WhatsApp Number (without leading 0)</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">+94</span>
              <input
                inputMode="tel"
                placeholder="771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                className="h-12 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                autoComplete="tel"
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Example: 771234567 (not 0771234567). Dialog, Mobitel, Hutch & Airtel supported.</p>
          </div>

          <div className="glass-card flex items-start gap-3 rounded-2xl p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-500/10 text-green-500 flex-shrink-0">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">We'll send a 6-digit code to your WhatsApp. No SMS charges apply.</p>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-400" role="alert">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending…" : <>Send Code via WhatsApp <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{displayPhone || "771234567"}</p>
              <p className="text-xs text-muted-foreground">Enter the 6-digit code we just sent to your WhatsApp.</p>
            </div>
            <button onClick={() => setPhase("input")} className="text-xs font-medium text-primary hover:underline">Change</button>
          </div>

          <div className="flex justify-center gap-3" role="group" aria-label="6-digit verification code">
            {code.map((v, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={v}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => {
                  const c = [...code]; c[i] = e.target.value.replace(/\D/g, "").slice(0, 1); setCode(c);
                  if (c[i] && i < 5) refs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); }}
                className="h-16 w-14 rounded-2xl border border-white/10 bg-white/5 text-center font-display text-3xl font-bold text-foreground focus:border-primary focus:outline-none"
                autoComplete="one-time-code"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {error ? <p className="text-sm text-rose-400" role="alert">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          <Button variant="hero" size="lg" className="w-full" onClick={confirmCode} disabled={loading}>
            {loading ? "Verifying…" : <>Verify & continue <ArrowRight className="h-4 w-4" /></>}
          </Button>

          <button
            type="button"
            disabled={timer > 0}
            onClick={() => setTimer(30)}
            className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
          </button>
        </div>
      )}
    </AuthLayout>
  );
}