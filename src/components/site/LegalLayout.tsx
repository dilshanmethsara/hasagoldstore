import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { FileText, Shield, RefreshCcw } from "lucide-react";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

const RELATED = [
  { to: "/privacy", label: "Privacy Policy", icon: Shield },
  { to: "/terms", label: "Terms of Service", icon: FileText },
  { to: "/refund", label: "Refund Policy", icon: RefreshCcw },
] as const;

export function LegalLayout({
  title,
  eyebrow,
  updated,
  sections,
  current,
}: {
  title: string;
  eyebrow: string;
  updated: string;
  sections: LegalSection[];
  current: "/privacy" | "/terms" | "/refund";
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={`Last updated: ${updated} · Effective in Sri Lanka and worldwide.`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Legal", to: "/terms" }, { label: title }]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-card rounded-2xl p-4">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
          <div className="glass-card mt-4 rounded-2xl p-4">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related</p>
            <div className="space-y-0.5">
              {RELATED.filter((r) => r.to !== current).map((r) => (
                <Link key={r.to} to={r.to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
                  <r.icon className="h-3.5 w-3.5" /> {r.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <article className="glass-card rounded-3xl p-6 sm:p-10">
          <div className="prose-invert max-w-none space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-foreground">{s.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{s.body}</div>
              </section>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
            Questions about this policy? Email <a href="mailto:legal@hasa.lk" className="font-medium text-primary hover:underline">legal@hasa.lk</a> or visit our <Link to="/contact" className="font-medium text-primary hover:underline">contact page</Link>.
          </div>
        </article>
      </section>
      <SiteFooter />
    </div>
  );
}