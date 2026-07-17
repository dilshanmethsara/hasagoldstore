import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, CreditCard, ShieldCheck, Wallet, Gamepad2, RefreshCcw, ChevronRight, MessageCircle, Mail, Phone, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — HASA GOLD STORE" },
      { name: "description", content: "Get answers fast. Top-up guides, payment help, account questions and 24/7 support." },
    ],
  }),
  component: HelpPage,
});

const CATEGORIES = [
  { icon: ShoppingCart, t: "Orders & Delivery", d: "Track, modify or troubleshoot your orders.", n: 14 },
  { icon: CreditCard, t: "Payments", d: "Cards, mobile wallets, crypto & LKR billing.", n: 22 },
  { icon: Wallet, t: "HASA Wallet", d: "Top-up, withdraw, transfer between accounts.", n: 9 },
  { icon: Gamepad2, t: "Games & Top-Ups", d: "Game-specific guides for Free Fire, PUBG, ML.", n: 31 },
  { icon: ShieldCheck, t: "Account & Security", d: "Login, 2FA, password & verification.", n: 18 },
  { icon: RefreshCcw, t: "Refunds & Disputes", d: "How refunds work and how to request one.", n: 7 },
];

const POPULAR = [
  "My top-up hasn't arrived in 5 minutes — what now?",
  "How do I find my Free Fire Player ID?",
  "Can I pay using Dialog eZ Cash or FriMi?",
  "How long do refunds take in LKR?",
  "I entered the wrong Player ID — can it be fixed?",
];

const FAQ = [
  { q: "How fast will my top-up be delivered?", a: "Most orders complete in under 10 seconds. Mobile payments may take up to 2 minutes." },
  { q: "What payment methods work in Sri Lanka?", a: "Visa, Mastercard, Amex, Dialog eZ Cash, Mobitel mCash, FriMi, Sampath Vishwa, BTC, USDT and HASA Wallet." },
  { q: "Is HASA GOLD STORE legal in Sri Lanka?", a: "Yes. HASA GOLD STORE Pvt Ltd is registered with the Registrar of Companies and complies with CBSL e-commerce regulations." },
  { q: "Are prices in LKR?", a: "Yes — all checkout totals are billed in Sri Lankan Rupees with no hidden FX fees." },
  { q: "Do you offer customer support in Sinhala or Tamil?", a: "Absolutely. Our Colombo team supports Sinhala, Tamil and English 24/7." },
];

function HelpPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.45_0.2_260/0.35),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Help Center · Sri Lanka 🇱🇰
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-6xl">How can we help?</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Search 100+ articles or get instant help from our 24/7 support team.</p>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search articles, e.g. ‘top-up failed’" className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-32 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.07] focus:outline-none" />
              <Button variant="hero" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">Search</Button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>Popular:</span>
              {["Refund", "Failed order", "Player ID", "Promo code"].map((t) => (
                <a key={t} href="#" className="rounded-full border border-white/5 bg-white/5 px-3 py-1 hover:border-primary/40 hover:text-foreground">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Browse by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <a key={c.t} href="#" className="glass-card group flex items-start gap-4 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{c.t}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.d}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-primary">{c.n} articles</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Popular articles + FAQ */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-foreground">Most read articles</h3>
          <ul className="mt-5 divide-y divide-white/5">
            {POPULAR.map((p, i) => (
              <li key={p}>
                <a href="#" className="group flex items-start gap-3 py-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground transition-colors group-hover:text-primary">{p}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"><FileText className="h-3 w-3" /> 3 min read</p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-foreground">Frequently asked</h3>
          <div className="mt-5 space-y-2">
            {FAQ.map((f, i) => (
              <button key={f.q} onClick={() => setOpen(open === i ? -1 : i)} className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition-colors hover:border-primary/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-foreground">{f.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-180")} />
                </div>
                {open === i && <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact support */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[var(--gradient-card)] p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.22_260/0.3),transparent_60%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Still need help?</h3>
              <p className="mt-3 text-muted-foreground">Our Colombo support team is online right now — average reply time under 2 minutes.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" size="lg"><MessageCircle className="h-4 w-4" /> Live chat</Button>
                <Link to="/contact"><Button variant="outline" size="lg"><Mail className="h-4 w-4" /> Contact us</Button></Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Channel icon={MessageCircle} t="WhatsApp" v="+94 77 123 4567" />
              <Channel icon={Mail} t="Email" v="hello@hasa.lk" />
              <Channel icon={Phone} t="Phone" v="+94 11 234 5678" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Channel({ icon: Icon, t, v }: { icon: React.ComponentType<{ className?: string }>; t: string; v: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{t}</p>
        <p className="truncate text-sm font-semibold text-foreground">{v}</p>
      </div>
    </div>
  );
}