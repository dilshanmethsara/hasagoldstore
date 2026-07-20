import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Award, Users, TrendingUp, Quote } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — HASA GOLD STORE" },
      { name: "description", content: "Read 25,000+ verified reviews from Sri Lankan gamers. Rated 4.9/5 across Free Fire, PUBG, ML and Blood Strike top-ups." },
    ],
  }),
  component: ReviewsPage,
});

const FILTERS = ["All games", "Free Fire", "PUBG", "Mobile Legends", "Blood Strike"];

const REVIEWS = [
  { name: "Saman P.", city: "Colombo", role: "Free Fire", rating: 5, body: "Diamonds landed in 4 seconds. Cheaper than the official store and paid in LKR with eZ Cash. This is the only place I top up now.", date: "2 days ago", game: "Free Fire" },
  { name: "Tharushi W.", city: "Kandy", role: "ML player", rating: 5, body: "First time topping up online — was nervous. The Sinhala WhatsApp support walked me through it. Smooth, safe, super fast.", date: "5 days ago", game: "Mobile Legends" },
  { name: "Kavindu F.", city: "Galle", role: "PUBG streamer", rating: 5, body: "Been with HASA for 8 months across maybe 60 UC orders. Zero issues. Royale Pass landed in <10s every single time.", date: "1 week ago", game: "PUBG" },
  { name: "Niluka R.", city: "Jaffna", role: "Casual gamer", rating: 4, body: "Great prices and the dashboard looks gorgeous. Took ~3 min once during a Dialog outage but support refunded the difference.", date: "1 week ago", game: "Blood Strike" },
  { name: "Dinithi S.", city: "Negombo", role: "ML Mythic", rating: 5, body: "Promo codes actually work, wallet credits stack nicely. Customer service in Tamil was a lifesaver.", date: "2 weeks ago", game: "Mobile Legends" },
  { name: "Hashan M.", city: "Matara", role: "Free Fire pro", rating: 5, body: "I run a gaming café and we use HASA for top-ups for all our walk-in customers. Reseller dashboard is gold.", date: "2 weeks ago", game: "Free Fire" },
  { name: "Ishara K.", city: "Anuradhapura", role: "PUBG casual", rating: 5, body: "FriMi integration made it so easy. No card needed.", date: "3 weeks ago", game: "PUBG" },
  { name: "Ruwan A.", city: "Kurunegala", role: "Blood Strike", rating: 5, body: "Gold delivered instantly, prices beat every competitor I checked.", date: "3 weeks ago", game: "Blood Strike" },
];

const DIST = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0.5 },
  { stars: 1, pct: 0.5 },
];

function ReviewsPage() {
  const [filter, setFilter] = useState(0);
  const filtered = filter === 0 ? REVIEWS : REVIEWS.filter((r) => r.game === FILTERS[filter]);
  const featured = filtered[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow="Loved by Sri Lankan gamers"
        title="25,000+ five-star reviews."
        description="From Colombo to Jaffna, here's what real HASA GOLD STORE customers are saying."
        crumbs={[{ label: "Home", to: "/" }, { label: "Reviews" }]}
      />

      {/* Overview */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="font-display text-6xl font-bold text-gradient">4.9</p>
          <div className="mt-2 flex justify-center gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}</div>
          <p className="mt-2 text-sm text-muted-foreground">Based on 25,418 verified reviews</p>
          <div className="mt-6 space-y-2 text-left">
            {DIST.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-muted-foreground">{d.stars} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[var(--gradient-primary)]" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {[
            { icon: ShieldCheck, t: "Verified reviews", d: "Each review tied to a real paid order." },
            { icon: Users, t: "500K+ gamers", d: "Active customers across Sri Lanka." },
            { icon: Award, t: "Trustpilot Excellent", d: "Top 1% gaming category in SA." },
            { icon: TrendingUp, t: "99.97% success", d: "Tracked across last 100K orders." },
          ].map((s) => (
            <div key={s.t} className="glass-card rounded-2xl p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><s.icon className="h-5 w-5" /></div>
              <p className="mt-3 font-semibold text-foreground">{s.t}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured review */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[var(--gradient-card)] p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_260/0.3),transparent_60%)]" />
            <div className="relative">
              <Quote className="h-10 w-10 text-primary/60" />
              <p className="mt-4 font-display text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">"{featured.body}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gradient-primary)] font-display text-base font-bold text-primary-foreground">{featured.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{featured.name} · {featured.city} 🇱🇰</p>
                  <p className="text-xs text-muted-foreground">{featured.role} · verified buyer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter + grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {FILTERS.map((f, i) => (
            <button key={f} onClick={() => setFilter(i)} className={cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", i === filter ? "border-primary bg-primary/10 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground")}>{f}</button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div key={r.name + r.date} className="glass-card flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">{Array.from({length:r.rating}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{r.game}</span>
              </div>
              <p className="mt-3 flex-1 text-sm text-foreground/90">"{r.body}"</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-xs font-bold text-primary-foreground">{r.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.city} · {r.date}</p>
                  </div>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-label="Verified" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg">Load more reviews</Button>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-10 text-center sm:p-14">
          <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Join the HASA family.</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">500,000+ Sri Lankan gamers can't be wrong. Try your first top-up in under 60 seconds.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/auth/signup"><Button variant="hero" size="xl">Create free account</Button></Link>
            <Link to="/"><Button variant="outline" size="xl">Browse games</Button></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}