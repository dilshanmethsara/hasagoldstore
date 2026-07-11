import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { AuthLayout, AuthInput } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Sign up — HASA GOLD STORE" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuthContext();
  const rules = [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "One number", ok: /\d/.test(pw) },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rules.every((r) => r.ok)) {
      toast.error("Please meet all password requirements");
      return;
    }
    setLoading(true);
    try {
      await auth.register({
        email,
        password: pw,
        displayName: name,
        acceptTerms: true,
      });
      toast.success("Account created! Check your email to verify.");
      navigate({ to: "/auth/verify-email", search: { email } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Get instant top-ups, wallet rewards and exclusive promos."
      footer={<>Already a member? <Link to="/auth/login" className="font-semibold text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full name"
          icon={User}
          placeholder="Saman Perera"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <AuthInput
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@hasa.lk"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <div>
          <AuthInput
            label="Password"
            type={show ? "text" : "password"}
            icon={Lock}
            placeholder="Create a strong password"
            value={pw}
            onChange={(e) => setPw(e.currentTarget.value)}
            required
            rightAdornment={
              <button type="button" onClick={() => setShow((v) => !v)} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {rules.map((r) => (
              <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.ok ? "text-emerald-400" : "text-muted-foreground"}`}>
                <Check className="h-3.5 w-3.5" /> {r.label}
              </li>
            ))}
          </ul>
        </div>
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <input type="checkbox" defaultChecked className="mt-0.5 size-4 rounded border-white/10 bg-white/5 text-primary" />
          <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> & <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</span>
        </label>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating..." : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </AuthLayout>
  );
}