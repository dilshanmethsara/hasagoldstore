import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ArrowRight, Coffee, Heart, GraduationCap, Plane, Sparkles } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — HASA GOLD STORE" },
      { name: "description", content: "Help us build the best gaming top-up experience in South Asia. Open roles in Colombo & remote." },
    ],
  }),
  component: CareersPage,
});

const ROLES = [
  { team: "Engineering", title: "Senior Frontend Engineer", location: "Colombo · Hybrid", type: "Full-time" },
  { team: "Engineering", title: "Backend Engineer (Payments)", location: "Remote · Sri Lanka", type: "Full-time" },
  { team: "Product", title: "Product Designer", location: "Colombo · On-site", type: "Full-time" },
  { team: "Operations", title: "Customer Support Lead (Sinhala/Tamil)", location: "Colombo", type: "Full-time" },
  { team: "Growth", title: "Performance Marketing Manager", location: "Remote", type: "Contract" },
  { team: "Operations", title: "Finance & Compliance Associate", location: "Colombo", type: "Full-time" },
];

const PERKS = [
  { icon: Heart, t: "Health & Wellness", d: "Full medical cover for you & family." },
  { icon: GraduationCap, t: "Learning Budget", d: "LKR 100K/year for books, courses, conferences." },
  { icon: Plane, t: "Annual Retreat", d: "Team trips — Ella, Mirissa, Trincomalee." },
  { icon: Coffee, t: "Flexible Hours", d: "Hybrid by default, async-friendly." },
];

function CareersPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow="We're hiring"
        title="Build the future of gaming in Sri Lanka."
        description="Help us serve millions of gamers across South Asia. Join a small, ambitious team in Colombo (or remote)."
        crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]}
        actions={<Button variant="hero" size="lg">See open roles <ArrowRight className="h-4 w-4" /></Button>}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Why HASA?</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Perks that actually matter, real ownership, and the chance to ship to half a million users this quarter.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.t} className="glass-card rounded-2xl p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{p.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Open roles</h2>
            <p className="mt-1 text-muted-foreground">{ROLES.length} positions across {new Set(ROLES.map((r) => r.team)).size} teams</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            {["All", "Engineering", "Product", "Growth"].map((t, i) => (
              <button key={t} className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {ROLES.map((r) => (
            <a key={r.title} href="#" className="glass-card group flex flex-col gap-3 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{r.team}</span>
                  <span className="text-[11px] font-medium text-primary">{r.type}</span>
                </div>
                <p className="mt-2 truncate font-semibold text-foreground transition-colors group-hover:text-primary">{r.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {r.location}
                </p>
              </div>
              <Button variant="outline" size="sm">Apply <ArrowRight className="h-4 w-4" /></Button>
            </a>
          ))}
        </div>

        <div className="glass-card mt-10 flex flex-col items-start gap-4 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">Don't see your role?</h3>
            <p className="mt-1 text-sm text-muted-foreground">We're always open to exceptional people. Send us your story.</p>
          </div>
          <Button variant="hero" size="lg"><Briefcase className="h-4 w-4" /> Send open application</Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}