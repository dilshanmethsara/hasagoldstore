import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Heart, Target, Rocket, Users, Shield, Zap, Award, Globe, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HASA GOLD STORE" },
      { name: "description", content: "Sri Lanka's most trusted game top-up platform. Learn about our story, values and mission." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Zap, t: "Speed Obsessed", d: "Every second counts. We engineer for instant delivery." },
  { icon: Shield, t: "Trust First", d: "Bank-grade security. No card data ever stored on our servers." },
  { icon: Heart, t: "Gamer Made", d: "Built by gamers, for gamers — we use what we ship." },
  { icon: Globe, t: "Local Roots", d: "Proudly headquartered in Colombo, serving all of Sri Lanka." },
];

const STATS = [
  { v: "500K+", l: "Gamers Served" },
  { v: "2M+", l: "Orders Completed" },
  { v: "99.97%", l: "Success Rate" },
  { v: "2019", l: "Year Founded" },
];

const TEAM = [
  { name: "Dinesh Rajapakse", role: "Founder & CEO", initials: "DR" },
  { name: "Hashini Silva", role: "Head of Product", initials: "HS" },
  { name: "Kavindu Fernando", role: "Lead Engineer", initials: "KF" },
  { name: "Tharushi Wijeratne", role: "Customer Experience", initials: "TW" },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow="Our Story"
        title="Top-ups, reimagined for Sri Lanka."
        description="HASA GOLD STORE began in 2019 in a Colombo apartment with one mission — give Sri Lankan gamers the fastest, fairest, most premium top-up experience in South Asia."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl">
          <div className="grid grid-cols-2 divide-y divide-white/5 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {STATS.map((s) => (
              <div key={s.l} className="px-6 py-8 text-center">
                <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="glass-card rounded-3xl p-8">
          <Target className="h-8 w-8 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">Our Mission</h2>
          <p className="mt-3 text-muted-foreground">To make in-game spending effortless and trustworthy for every Sri Lankan gamer — from the casual Free Fire player in Kandy to the PUBG streamer in Galle.</p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          <Rocket className="h-8 w-8 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">Our Vision</h2>
          <p className="mt-3 text-muted-foreground">A South Asia where every gamer has fair, secure access to global gaming content, paid in their own currency at the best possible price.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">What we stand for</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.t} className="glass-card group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/30">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{v.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">The crew</h2>
            <p className="mt-2 text-muted-foreground">Real humans building HASA from Colombo.</p>
          </div>
          <Link to="/careers" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm"><Users className="h-4 w-4" /> Join us</Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="glass-card rounded-2xl p-6 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--gradient-primary)] font-display text-2xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">{m.initials}</div>
              <p className="mt-4 font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[var(--gradient-card)] p-10 text-center sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_260/0.3),transparent_70%)]" />
          <div className="relative">
            <Award className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">Built on trust. Powered by speed.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join 500,000+ Sri Lankan gamers using HASA every week.</p>
            <div className="mt-7 flex justify-center gap-3">
              <Link to="/auth/signup"><Button variant="hero" size="xl">Create your account <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/contact"><Button variant="outline" size="xl">Contact us</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}