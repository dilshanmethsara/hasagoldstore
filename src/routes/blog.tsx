import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Search, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — HASA GOLD STORE" },
      { name: "description", content: "Top-up guides, game strategies, payment tips and the latest gaming news for Sri Lankan players." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  { title: "How to top up Free Fire Diamonds in Sri Lanka — 2026 guide", excerpt: "Step-by-step using LKR via Dialog, Mobitel, FriMi & cards. Cheapest packs ranked.", category: "Free Fire", date: "Jun 14, 2026", read: "6 min", featured: true, gradient: "from-fuchsia-500/40 to-purple-600/40" },
  { title: "PUBG Mobile UC: Royale Pass M22 breakdown", excerpt: "Is the RP worth it this month? Rewards, mythics and UC math.", category: "PUBG", date: "Jun 10, 2026", read: "4 min", gradient: "from-sky-500/40 to-blue-600/40" },
  { title: "Mobile Legends: Best heroes for the 2026 meta", excerpt: "From Beatrix to Novaria — who to climb with this season.", category: "ML", date: "Jun 7, 2026", read: "8 min", gradient: "from-blue-500/40 to-violet-600/40" },
  { title: "Blood Strike Gold packs — full price comparison", excerpt: "We benchmarked HASA vs official store. Spoiler: 18% cheaper.", category: "Blood Strike", date: "Jun 3, 2026", read: "5 min", gradient: "from-rose-500/40 to-red-600/40" },
  { title: "Safe gaming payments: avoiding top-up scams in Sri Lanka", excerpt: "Red flags, FAQs and how HASA protects every transaction.", category: "Security", date: "May 28, 2026", read: "7 min", gradient: "from-emerald-500/40 to-teal-600/40" },
  { title: "Behind the scenes: how we deliver top-ups in 8 seconds", excerpt: "A peek inside our payment infra and game-publisher integrations.", category: "Inside HASA", date: "May 22, 2026", read: "5 min", gradient: "from-amber-500/40 to-orange-600/40" },
];

const CATS = ["All", "Free Fire", "PUBG", "ML", "Blood Strike", "Security", "Inside HASA"];

function BlogPage() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow="HASA Journal"
        title="Guides, news & gaming insights."
        description="The HASA Journal is where Sri Lanka's gaming community goes for tips, deep dives and what's new."
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
        actions={
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search posts..." className="h-11 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {CATS.map((c, i) => (
            <button key={c} className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-white/5 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>{c}</button>
          ))}
        </div>

        {/* Featured */}
        <a href="#" className="glass-card group grid overflow-hidden rounded-3xl lg:grid-cols-2">
          <div className={`relative aspect-[16/9] bg-gradient-to-br ${featured.gradient} lg:aspect-auto`}>
            <div className="bg-grid absolute inset-0 opacity-30" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3 w-3" /> Featured
            </div>
          </div>
          <div className="p-6 sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{featured.category}</span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">{featured.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {featured.date}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {featured.read}</span>
            </div>
            <Button variant="hero" size="lg" className="mt-6">Read article <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </a>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <a key={p.title} href="#" className="glass-card group overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.gradient}`}>
                <div className="bg-grid absolute inset-0 opacity-30" />
                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">{p.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="glass-card mt-14 rounded-3xl p-8 text-center sm:p-12">
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Get HASA Weekly in your inbox</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">One email a week with the best top-up deals and gaming guides. No spam.</p>
          <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@hasa.lk" className="h-12 flex-1 rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
            <Button variant="hero" size="lg">Subscribe</Button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}