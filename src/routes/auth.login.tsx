import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout, AuthInput } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: s.redirect ? String(s.redirect) : undefined,
  }),
  head: () => ({ meta: [{ title: "Log in — HASA GOLD STORE" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const auth = useAuthContext();
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/dashboard";
  const goNext = () => {
    if (safeRedirect === "/dashboard") {
      navigate({ to: "/dashboard" });
    } else {
      window.location.assign(safeRedirect);
    }
  };

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login({ email, password });
      toast.success("Welcome back!");
      goNext();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    auth.loginWithGoogle(safeRedirect);
  }

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Log in to continue your top-up journey."
      footer={<>New here? <Link to="/auth/signup" className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@hasa.lk"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <AuthInput
          label="Password"
          type={show ? "text" : "password"}
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          rightAdornment={
            <button type="button" onClick={() => setShow((v) => !v)} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="size-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary" />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : <>Log in <ArrowRight className="h-4 w-4" /></>}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
          <div className="relative flex justify-center"><span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">or continue with</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" size="lg" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 11v3.3h5.4c-.2 1.4-1.6 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.8 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c6.9 0 9.2-4.9 9.2-7.3 0-.5 0-.9-.1-1.3H12Z"/></svg>
            Google
          </Button>
          <Button type="button" variant="outline" size="lg" disabled title="Coming soon">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M17.6 12.4c0-2.4 2-3.6 2.1-3.6-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.7 3-.5 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2-.1 1.7-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.9ZM15.2 5.3c.7-.8 1.1-2 1-3.1-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.3-.6 2.9-1.4Z"/></svg>
            Apple
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}