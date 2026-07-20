import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";
import { AuthLayout, AuthInput } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — HASA GOLD STORE" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const strength = Math.min(4, (pw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(pw) ? 1 : 0) + (/\d/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 1 : 0));
  return (
    <AuthLayout title="Set a new password" subtitle="Make it strong — at least 8 characters with a number and uppercase letter.">
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/auth/login" }); }}
        className="space-y-5"
      >
        <div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">New password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${strength > i ? (strength <= 1 ? "bg-destructive" : strength === 2 ? "bg-amber-400" : strength === 3 ? "bg-primary" : "bg-emerald-400") : "bg-white/10"}`} />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Strength: <span className="font-medium text-foreground">{["Too weak", "Weak", "Okay", "Strong", "Excellent"][strength]}</span>
          </p>
        </div>

        <AuthInput label="Confirm password" type="password" icon={Lock} placeholder="Re-enter password" />

        <Button type="submit" variant="hero" size="lg" className="w-full">
          Reset password <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-emerald-400" /> You'll be logged out of all other devices.</p>
      </form>
    </AuthLayout>
  );
}