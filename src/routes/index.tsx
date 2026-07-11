import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ShieldCheck, Clock, Star, ArrowRight, Sparkles, Wallet, Headphones, Check, ChevronDown, Tag } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { GameCard } from "@/components/site/GameCard";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/lib/games";
import heroImg from "@/assets/hero-crystal.jpg";
import ffImg from "@/assets/game-freefire.jpg";
import pubgImg from "@/assets/game-pubg.jpg";
import mlbbImg from "@/assets/game-mlbb.jpg";
import bsImg from "@/assets/game-bloodstrike.jpg";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HASA GOLD STORE — Fast, Secure, Instant Game Top-Ups" },
      { name: "description", content: "Top up Free Fire, PUBG Mobile, Mobile Legends and Blood Strike instantly with the best prices and 24/7 support." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Stats />
      <PopularGames />
      <WhyUs />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-2 lg:gap-6 lg:pb-24 lg:pt-20 lg:px-8">
        <div className="order-2 flex flex-col justify-center animate-fade-up lg:order-1">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary sm:mb-6 sm:px-3.5 sm:py-1.5 sm:text-xs">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            #1 Trusted Top-Up Platform
          </div>
          <h1 className="font-display text-[2.25rem] font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Fast. Secure.<br />
            <span className="text-gradient">Instant Top-Ups.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:mt-5 sm:text-lg">
            Top up your favorite games instantly with the best prices, trusted by{" "}
            <span className="font-semibold text-primary">500,000+</span> gamers worldwide.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link to="/games" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full sm:w-auto"><Zap className="h-4 w-4" /> Top Up Now</Button>
            </Link>
            <a href="#games" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">Explore Games <ArrowRight className="h-4 w-4" /></Button>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3">
            {[
              { icon: Zap, label: "Instant Delivery", sub: "Within Seconds" },
              { icon: ShieldCheck, label: "100% Secure", sub: "Safe Payments" },
              { icon: Tag, label: "Best Prices", sub: "Always Low" },
              { icon: Headphones, label: "24/7 Support", sub: "Always Here" },
            ].map((b) => (
              <div key={b.label} className="glass-card flex items-center gap-2 rounded-xl px-2.5 py-2 sm:rounded-2xl sm:flex-col sm:items-start sm:gap-1 sm:px-3 sm:py-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary sm:h-8 sm:w-8">
                  <b.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-tight text-foreground sm:text-xs">{b.label}</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:gap-4">
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((c, i) => (
                <div key={c} className={cn("grid h-8 w-8 place-items-center rounded-full border-2 border-background text-[11px] font-bold text-primary-foreground sm:h-9 sm:w-9 sm:text-xs", ["bg-primary","bg-fuchsia-500","bg-emerald-500","bg-amber-500"][i])}>{c}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">4.9/5</span>
                <div className="flex">{Array.from({length:5}).map((_,i)=>(<Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />))}</div>
              </div>
              <p className="text-[11px] text-muted-foreground sm:text-xs">from 25,000+ reviews</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setP({ x, y });
    };
    const onLeave = () => setP({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const tf = (depth: number) =>
    `translate3d(${p.x * depth}px, ${p.y * depth}px, 0)`;

  const cards = [
    { img: ffImg, name: "Free Fire", cls: "top-2 left-2 h-28 w-28 sm:h-36 sm:w-36 rotate-[-8deg]", depth: 30, delay: "0s", ring: "ring-orange-400/40" },
    { img: pubgImg, name: "PUBG Mobile", cls: "top-4 right-0 h-32 w-32 sm:h-40 sm:w-40 rotate-[7deg]", depth: 45, delay: "1.2s", ring: "ring-amber-300/40" },
    { img: mlbbImg, name: "Mobile Legends", cls: "bottom-6 left-0 h-32 w-32 sm:h-40 sm:w-40 rotate-[6deg]", depth: 40, delay: "0.6s", ring: "ring-sky-400/40" },
    { img: bsImg, name: "Blood Strike", cls: "bottom-2 right-4 h-28 w-28 sm:h-36 sm:w-36 rotate-[-6deg]", depth: 25, delay: "1.8s", ring: "ring-rose-400/40" },
  ];

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[560px] [perspective:1200px]">
      {/* Ambient glows */}
      <div
        className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_50%,oklch(0.55_0.22_260/0.55),transparent_65%)] blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: tf(-20) }}
      />
      <div
        className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle_at_30%_70%,oklch(0.7_0.2_310/0.35),transparent_60%)] blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: tf(-10) }}
      />

      {/* Rotating conic ring */}
      <div className="absolute inset-8 rounded-full opacity-40 [background:conic-gradient(from_0deg,oklch(0.55_0.22_260/0.6),transparent_40%,oklch(0.7_0.2_310/0.5),transparent_80%)] animate-spin [animation-duration:18s] blur-md" />

      {/* Center crystal */}
      <div
        className="absolute inset-[18%] transition-transform duration-300 ease-out"
        style={{ transform: tf(15) }}
      >
        <div className="absolute inset-0 rounded-[32%] bg-primary/30 blur-2xl animate-pulse" />
        <img
          src={heroImg}
          alt="HASA Gold Store — glowing crystal diamond"
          className="relative h-full w-full animate-float rounded-[32%] object-cover shadow-[0_30px_80px_-20px_oklch(0.55_0.22_260/0.6)] ring-1 ring-white/10"
          width={800}
          height={800}
        />
      </div>

      {/* Floating game cards */}
      {cards.map((c) => (
        <div
          key={c.name}
          className={cn("absolute animate-float will-change-transform transition-transform duration-300 ease-out", c.cls)}
          style={{ animationDelay: c.delay, transform: tf(c.depth) }}
        >
          <div className={cn("group relative h-full w-full overflow-hidden rounded-2xl ring-1 shadow-[0_20px_50px_-15px_oklch(0.2_0.08_260/0.8)] backdrop-blur-md", c.ring)}>
            <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2">
              <p className="text-[10px] font-semibold text-white/90 sm:text-xs">{c.name}</p>
              <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-medium text-primary backdrop-blur">
                <Zap className="h-2.5 w-2.5" /> Live
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Sparkle dots */}
      {[
        { t: "10%", l: "40%", d: "0s" },
        { t: "70%", l: "85%", d: "0.5s" },
        { t: "45%", l: "8%", d: "1s" },
        { t: "85%", l: "50%", d: "1.5s" },
      ].map((s, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_2px_oklch(0.6_0.22_260/0.9)] animate-pulse"
          style={{ top: s.t, left: s.l, animationDelay: s.d }}
        />
      ))}
    </div>
  );
}

function Stats() {
  const stats = [
    { value: "500K+", label: "Happy Users" },
    { value: "2M+", label: "Orders Completed" },
    { value: "99.9%", label: "Success Rate" },
    { value: "24/7", label: "Live Support" },
  ];
  return (
    <section className="mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-5 text-center sm:px-6 sm:py-7">
              <p className="font-display text-2xl font-bold text-gradient sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularGames() {
  return (
    <section id="games" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-6 text-center sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> TOP GAMES
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:mt-4 sm:text-5xl">Top Up Your Favorite Games</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">We support all popular games with the best prices and fastest delivery.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {GAMES.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Wallet, title: "Best Prices", body: "Get the most value for your money every time." },
    { icon: Zap, title: "Instant Delivery", body: "Top-ups delivered to your account in seconds." },
    { icon: ShieldCheck, title: "Secure & Safe", body: "Your transactions are protected with top-level security." },
    { icon: Headphones, title: "24/7 Support", body: "Our support team is always here to help you." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="glass-card group rounded-2xl p-4 transition-all hover:-translate-y-1 hover:border-primary/30 sm:p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
              <it.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground sm:mt-4 sm:text-base">{it.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Choose Your Game", body: "Pick from Free Fire, PUBG, Mobile Legends or Blood Strike." },
    { n: "02", title: "Enter Player ID", body: "Provide your in-game ID so we deliver to the right account." },
    { n: "03", title: "Select Package", body: "Choose the top-up package and apply any promo code." },
    { n: "04", title: "Pay & Receive", body: "Pay securely and receive your top-up instantly." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-6 text-center sm:mb-10">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-5xl">How It Works</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">Top up in 4 simple steps — no account needed.</p>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="glass-card relative rounded-2xl p-4 sm:p-6">
            <span className="font-display text-3xl font-bold text-gradient opacity-90 sm:text-5xl">{s.n}</span>
            <h3 className="mt-2 text-sm font-semibold text-foreground sm:mt-3 sm:text-base">{s.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.body}</p>
            {i < 3 && <div className="absolute right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-primary to-transparent lg:block" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Ahsan G.", role: "Free Fire Pro", body: "Top-up landed in literally 3 seconds. Cheapest UC I've found anywhere.", rating: 5 },
    { name: "Zayn A.", role: "PUBG Streamer", body: "Been using HASA for months. Never had an issue. Support actually responds.", rating: 5 },
    { name: "Areeba P.", role: "ML Diamond", body: "Smooth checkout, beautiful interface. Feels like a premium product.", rating: 5 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-6 text-center sm:mb-10">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-5xl">Loved by Gamers Worldwide</h2>
      </div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="glass-card rounded-2xl p-4 sm:p-6">
            <div className="flex gap-0.5">{Array.from({length:r.rating}).map((_,i)=><Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
            <p className="mt-3 text-sm text-foreground/90">"{r.body}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground">{r.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How fast will I receive my top-up?", a: "Most orders are delivered within 10 seconds. Some payment methods may take up to 2 minutes." },
    { q: "Is HASA GOLD STORE safe to use?", a: "Yes. All payments are encrypted and processed through certified providers. Your data is never shared." },
    { q: "What if I entered the wrong Player ID?", a: "Contact our 24/7 support immediately. If the top-up hasn't been processed we can update it." },
    { q: "Do you offer refunds?", a: "Yes — for any failed delivery or duplicate charge. See our Refund Policy for full details." },
    { q: "How can I get a discount?", a: "Use promo codes at checkout, or unlock exclusive discounts by reaching higher account levels." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-6 text-center sm:mb-10">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-5xl">Frequently Asked</h2>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {faqs.map((f, i) => (
          <button
            key={f.q}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="glass-card w-full rounded-2xl p-4 text-left sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground sm:text-base">{f.q}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-180")} />
            </div>
            {open === i && <p className="mt-2.5 text-xs text-muted-foreground sm:text-sm">{f.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[var(--gradient-card)] p-6 text-center sm:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_260/0.35),transparent_70%)]" />
        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-5xl">Ready to level up?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Join 500,000+ gamers already topping up the smart way.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
            <Link to="/games" className="w-full sm:w-auto"><Button variant="hero" size="xl" className="w-full sm:w-auto"><Zap className="h-4 w-4" /> Top Up Now</Button></Link>
            <Link to="/dashboard" className="w-full sm:w-auto"><Button variant="outline" size="xl" className="w-full sm:w-auto">View Dashboard</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
