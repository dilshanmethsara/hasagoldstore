import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Smartphone, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verify-phone")({
  head: () => ({ meta: [{ title: "Verify phone — HASA GOLD STORE" }] }),
  component: VerifyPhonePage,
});

function VerifyPhonePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (phase !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timer]);

  return (
    <AuthLayout title="Secure your account." subtitle="Step 3 of 3 · Verify your Sri Lankan mobile number.">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
      </div>

      {phase === "input" ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setPhase("otp"); setTimer(30); }}
          className="space-y-5"
        >
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Mobile number</span>
            <div className="flex gap-2">
              <div className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-foreground">
                <span className="text-base">🇱🇰</span> +94
              </div>
              <input
                inputMode="tel"
                placeholder="77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Dialog, Mobitel, Hutch & Airtel supported.</p>
          </div>
          <div className="glass-card flex items-start gap-3 rounded-2xl p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">We'll send a one-time SMS code to verify ownership. Standard SMS rates may apply.</p>
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full">
            Send OTP <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">+94 {phone || "77 123 4567"}</p>
              <p className="text-xs text-muted-foreground">Enter the 4-digit OTP we just sent.</p>
            </div>
            <button onClick={() => setPhase("input")} className="text-xs font-medium text-primary hover:underline">Change</button>
          </div>

          <div className="flex justify-center gap-3">
            {code.map((v, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={v}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => {
                  const c = [...code]; c[i] = e.target.value.replace(/\D/g, "").slice(0, 1); setCode(c);
                  if (c[i] && i < 3) refs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); }}
                className="h-16 w-14 rounded-2xl border border-white/10 bg-white/5 text-center font-display text-3xl font-bold text-foreground focus:border-primary focus:outline-none"
              />
            ))}
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={() => navigate({ to: "/auth/verified" })}>
            Verify & finish <ArrowRight className="h-4 w-4" />
          </Button>

          <button
            type="button"
            disabled={timer > 0}
            onClick={() => setTimer(30)}
            className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      )}
    </AuthLayout>
  );
}