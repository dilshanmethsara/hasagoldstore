import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { AuthLayout, AuthInput } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — HASA GOLD STORE" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries. Enter your email and we'll send a reset link."
      footer={<Link to="/auth/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Back to log in</Link>}
    >
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/auth/reset-password" }); }}
        className="space-y-5"
      >
        <AuthInput label="Email" type="email" icon={Mail} placeholder="you@hasa.lk" />
        <Button type="submit" variant="hero" size="lg" className="w-full">
          Send reset link <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">Didn't get it? Check spam, or contact <Link to="/help" className="text-primary hover:underline">support</Link>.</p>
      </form>
    </AuthLayout>
  );
}