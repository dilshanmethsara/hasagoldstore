import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { ShieldCheck, Zap, Users, Sparkles } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[1fr_minmax(440px,520px)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-border/60 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.45_0.2_260/0.5),transparent_60%)]" />
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="relative max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" /> Trusted in Sri Lanka
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight text-foreground">
            Top up at the <span className="text-gradient">speed of light.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join 500,000+ gamers from Colombo to Jaffna using HASA GOLD STORE for instant, secure top-ups in LKR.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Zap, t: "Instant Delivery", d: "Most orders complete in under 10 seconds." },
              { icon: ShieldCheck, t: "Bank-Grade Security", d: "Encrypted payments, no card data stored." },
              { icon: Users, t: "24/7 Sinhala / Tamil Support", d: "Real humans, ready when you are." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t}</p>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} HASA GOLD STORE · Sri Lanka</p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen flex-col px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="lg:hidden">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

type AuthInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  rightAdornment?: React.ReactNode;
};

export function AuthInput({
  label,
  hint,
  icon: Icon,
  rightAdornment,
  type = "text",
  ...inputProps
}: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
        <input
          type={type}
          {...inputProps}
          className={`h-12 w-full rounded-xl border border-border/60 bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/40 focus:bg-muted/50 focus:outline-none ${Icon ? "pl-10" : "pl-4"} ${rightAdornment ? "pr-12" : "pr-4"}`}
        />
        {rightAdornment && <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightAdornment}</div>}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </label>
  );
}