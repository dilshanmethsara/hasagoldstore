import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, ArrowRight, RotateCcw } from "lucide-react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

type Search = { email?: string };

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: (s: Record<string, unknown>): Search => ({ email: s.email ? String(s.email) : undefined }),
  head: () => ({ meta: [{ title: "Verify your email — HASA GOLD STORE" }] }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  return (
    <AuthLayout
      title="Check your inbox."
      subtitle={`We sent a 6-digit code to ${email ?? "your email"}.`}
      footer={<>Wrong address? <Link to="/auth/signup" className="font-semibold text-primary hover:underline">Sign up again</Link></>}
    >
      <div className="space-y-6">
        <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{email ?? "you@hasa.lk"}</p>
            <p className="text-xs text-muted-foreground">Code expires in 10 minutes</p>
          </div>
        </div>

        <div>
          <span className="mb-3 block text-xs font-medium text-muted-foreground">Verification code</span>
          <div className="flex justify-between gap-2">
            {code.map((v, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={v}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => {
                  const c = [...code];
                  c[i] = e.target.value.replace(/\D/g, "").slice(0, 1);
                  setCode(c);
                  if (c[i] && i < 5) refs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
                }}
                className="h-14 w-full rounded-xl border border-white/10 bg-white/5 text-center font-display text-2xl font-bold text-foreground focus:border-primary focus:bg-white/[0.08] focus:outline-none"
              />
            ))}
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={() => navigate({ to: "/auth/complete-profile" })}
        >
          Verify email <ArrowRight className="h-4 w-4" />
        </Button>

        <button
          type="button"
          disabled={timer > 0}
          onClick={() => setTimer(45)}
          className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {timer > 0 ? `Resend code in ${timer}s` : "Resend verification code"}
        </button>
      </div>
    </AuthLayout>
  );
}