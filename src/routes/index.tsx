import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Zap, ShieldCheck, Star, ArrowRight, Sparkles, Wallet, Headphones, ChevronDown, Tag, Flame, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/lib/games";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useGames, usePublicStats } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";

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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background radial glow meshes */}
      <div className="absolute top-[-10%] left-[-10%] -z-20 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.22_260/0.12),transparent_70%)] blur-3xl animate-pulse-glow" />
      <div className="absolute top-[20%] right-[-10%] -z-20 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_255/0.08),transparent_75%)] blur-3xl animate-float" />
      <div className="absolute bottom-[10%] left-[5%] -z-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.6_0.22_310/0.06),transparent_80%)] blur-3xl animate-float-delayed" />
      
      <SiteHeader />
      <Hero />
      <LiveTicker />
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
  const { data: games = [] } = useGames();
  const [activeGame, setActiveGame] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const displayGames = (games.filter((g) => g.is_live).slice(0, 4).length > 0
    ? games.filter((g) => g.is_live).slice(0, 4)
    : GAMES.slice(0, 4)) as any[];

  useEffect(() => {
    const t = setInterval(() => setActiveGame((p) => (p + 1) % Math.max(displayGames.length, 1)), 3500);
    return () => clearInterval(t);
  }, [displayGames.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const current = displayGames[activeGame];
  const art = current ? gameArt(current.slug) : gameArt("free-fire");
  const heroImg = current
    ? (current.hero_image || current.card_image || art.image)
    : art.image;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* Cinematic BG */}
      <div className="absolute inset-0 -z-10">
        <img
          key={heroImg}
          src={heroImg}
          alt=""
          className="h-full w-full object-cover object-center opacity-[0.18] scale-105 animate-fade-in"
          style={{ animationDuration: "1.2s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        {/* Parallax orbs */}
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.22 260 / 0.55), transparent 70%)",
            filter: "blur(70px)",
            transform: `translate(${mousePos.x * 18}px,${mousePos.y * 18}px)`,
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          className="absolute top-1/3 right-[-10%] h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 290 / 0.6), transparent 70%)",
            filter: "blur(60px)",
            transform: `translate(${mousePos.x * -12}px,${mousePos.y * -12}px)`,
            transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-float-delayed rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.2 200 / 0.5), transparent 70%)", filter: "blur(70px)" }}
        />
        <div className="bg-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-hero-beam" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-hero-beam" style={{ animationDelay: "2s" }} />
      </div>

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/50"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${8 + i * 7}%`,
              top: `${25 + ((i * 41) % 55)}%`,
              animation: `particle-float ${3 + (i % 3)}s ease-in-out ${i * 0.35}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_480px] lg:gap-16">

          {/* ── LEFT: copy ── */}
          <div className="flex flex-col">
            <div className="animate-fade-up mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live — #1 Instant Gaming Store in Sri Lanka
            </div>

            <h1 className="animate-fade-up font-display text-5xl font-black leading-[1.0] tracking-tighter text-foreground sm:text-6xl lg:text-7xl xl:text-8xl" style={{ animationDelay: "0.2s" }}>
              <span className="block">Level Up</span>
              <span className="block">Your Game.</span>
              <span className="block mt-1 text-gradient">Instant Top-Up.</span>
            </h1>

            <p className="animate-fade-up mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg" style={{ animationDelay: "0.35s" }}>
              Diamonds, UC, Gold — credited in{" "}
              <span className="font-bold text-foreground">under 10 seconds</span>. Trusted by{" "}
              <span className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">500,000+ gamers</span>{" "}
              for the best prices in Sri Lanka.
            </p>

            <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.45s" }}>
              <a href="#games">
                <Button variant="hero" size="xl" className="group relative w-full overflow-hidden sm:w-auto shadow-[0_0_40px_-8px_var(--primary)] hover:shadow-[0_0_60px_-4px_var(--primary)] transition-all duration-500">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <Zap className="h-4 w-4 fill-primary-foreground/20" /> Top Up Now
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/10 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                  How It Works <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up mt-8 flex items-center gap-4 border-t border-white/5 pt-6" style={{ animationDelay: "0.65s" }}>
              <div className="flex -space-x-3">
                {(["bg-primary","bg-fuchsia-500","bg-emerald-500","bg-amber-500","bg-rose-500"] as const).map((bg, i) => (
                  <div key={i} className={cn("grid h-9 w-9 place-items-center rounded-full border-2 border-background text-[11px] font-bold text-white shadow-lg", bg)}>
                    {["A","K","D","S","R"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="ml-1.5 text-sm font-bold text-foreground">4.9/5</span>
                </div>
                <p className="text-[11px] text-muted-foreground">25,000+ verified reviews</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: 3-D showcase ── */}
          <HeroGameShowcase
            games={displayGames}
            activeGame={activeGame}
            setActiveGame={setActiveGame}
            mousePos={mousePos}
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function HeroGameShowcase({
  games, activeGame, setActiveGame, mousePos,
}: {
  games: any[];
  activeGame: number;
  setActiveGame: (i: number) => void;
  mousePos: { x: number; y: number };
}) {
  const navigate = useNavigate();
  const current = games[activeGame];
  if (!current) return null;

  const art = gameArt(current.slug);
  const heroImg = current.hero_image || current.card_image || art.image;
  const packages: any[] = current.packages ?? GAMES.find((g) => g.slug === current.slug)?.packages ?? [];
  const startingPrice = packages[0]?.price_lkr ?? packages[0]?.priceLkr ?? packages[0]?.price ?? 150;

  return (
    <div className="animate-fade-up relative mx-auto w-full max-w-[460px]" style={{ animationDelay: "0.4s", perspective: "1200px" }}>
      {/* Orbit rings */}
      <div className="pointer-events-none absolute inset-[-55px] -z-10">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-primary/10" style={{ borderStyle: "dashed" }} />
        <div className="absolute inset-[18px] animate-spin-reverse rounded-full border border-primary/5" />
        {[
          { dur: "6s", r: "calc(50% + 38px)", color: "var(--primary)", size: 10, shadow: "var(--primary)" },
          { dur: "10s", r: "calc(50% + 52px)", color: "oklch(0.72 0.18 310)", size: 7, shadow: "oklch(0.72 0.18 310)" },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size, height: orb.size,
              top: "50%", left: "50%",
              marginTop: -orb.size / 2, marginLeft: -orb.size / 2,
              background: orb.color,
              boxShadow: `0 0 ${orb.size + 4}px ${Math.floor(orb.size / 2)}px ${orb.shadow}`,
              animation: `orbit ${orb.dur} linear ${i % 2 === 1 ? "reverse" : ""} infinite`,
              ["--orbit-r" as any]: orb.r,
            }}
          />
        ))}
      </div>

      {/* Main 3-D card */}
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-2xl backdrop-blur-2xl animate-card-breathe"
        style={{
          transform: `rotateY(${mousePos.x * 7}deg) rotateX(${mousePos.y * -5}deg)`,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image area */}
        <div className="relative h-56 overflow-hidden sm:h-64">
          <img key={heroImg} src={heroImg} alt={current.name}
            className="absolute inset-0 h-full w-full object-cover animate-fade-in"
            style={{ animationDuration: "0.8s", scale: "1.05" }}
          />
          <div className={cn("absolute inset-0 opacity-50 bg-gradient-to-t to-transparent", art.accent)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="absolute left-4 top-4" style={{ transform: "translateZ(30px)" }}>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Instant Delivery
            </span>
          </div>
          <div className="absolute right-4 top-4" style={{ transform: "translateZ(30px)" }}>
            <div className="rounded-xl bg-primary/90 px-3 py-1.5 text-xs font-black text-primary-foreground shadow-lg shadow-primary/40 backdrop-blur-sm">
              FROM LKR {Number(startingPrice).toLocaleString()}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5" style={{ transform: "translateZ(20px)" }}>
            <h3 className="font-display text-2xl font-black text-white drop-shadow-lg">{current.name}</h3>
            <p className="mt-0.5 text-xs text-white/70">{current.tagline ?? `${art.currency} Top-Up`}</p>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="mb-4 grid grid-cols-3 gap-2">
            {packages.slice(0, 3).map((pkg: any, i: number) => {
              const price = pkg.price_lkr ?? pkg.priceLkr ?? pkg.price ?? 0;
              const label = pkg.label ?? pkg.amount ?? "Pack";
              return (
                <div key={i} className={cn("cursor-pointer rounded-xl border p-2.5 text-center transition-all hover:border-primary/50", i === 1 ? "border-primary/40 bg-primary/10" : "border-white/5 bg-white/[0.03]")}
                  style={{ transform: "translateZ(10px)" }}>
                  <p className="truncate text-[10px] font-semibold text-muted-foreground">{label}</p>
                  <p className={cn("mt-0.5 text-sm font-black", i === 1 ? "text-primary" : "text-foreground")}>{Number(price).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">LKR</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate({ to: "/games/$slug", params: { slug: current.slug } })}
            className="group relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:brightness-110 hover:shadow-primary/50 active:scale-[0.98]"
            style={{ transform: "translateZ(15px)" }}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <Zap className="mr-2 inline h-4 w-4 fill-primary-foreground/20" />
            Top Up {current.name}
          </button>
        </div>
      </div>

      {/* Game thumbnail selectors */}
      <div className="mt-5 flex justify-center gap-2">
        {games.map((g: any, i: number) => {
          const gArt = gameArt(g.slug);
          const img = g.card_image || gArt.image;
          return (
            <button key={i} onClick={() => setActiveGame(i)}
              className={cn("relative h-10 w-10 overflow-hidden rounded-xl border-2 transition-all duration-300",
                i === activeGame
                  ? "scale-110 border-primary shadow-[0_0_16px_-2px_var(--primary)]"
                  : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/20"
              )}
            >
              <img src={img} alt={g.name} className="h-full w-full object-cover" />
              {i === activeGame && <div className="absolute inset-0 bg-primary/20" />}
            </button>
          );
        })}
      </div>

      {/* Auto-progress bar */}
      <div className="mx-auto mt-3 h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
        <div key={activeGame} className="h-full rounded-full bg-primary"
          style={{ animation: "hero-beam 3.5s linear forwards", width: "100%" }} />
      </div>
    </div>
  );
}

function LiveTicker() {
  const { data: stats } = usePublicStats();
  const [items, setItems] = useState<Array<{ id: number; game: string; pkg: string; player: string; price: string; time: string }>>([]);

  useEffect(() => {
    if (!stats?.ticker?.length) return;
    const mapped = stats.ticker.map((t, i) => ({
      id: i,
      game: t.game,
      pkg: t.pkg,
      player: t.player,
      price: t.price,
      time: formatAgo(t.createdAt),
    }));
    setItems(mapped);
  }, [stats]);

  if (!items.length) return null;

  return (
    <div className="relative w-full overflow-hidden border-y border-border/40 bg-muted/20 py-2.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs">
        <span className="flex shrink-0 items-center gap-1.5 font-bold text-primary">
          <Flame className="h-4 w-4 animate-bounce fill-primary/10" />
          LIVE ORDERS:
        </span>
        <div className="no-scrollbar flex items-center gap-6 overflow-x-auto py-0.5">
          {items.map((o) => (
            <div key={o.id} className="flex shrink-0 items-center gap-2 animate-fade-in">
              <span className="font-semibold text-foreground">{o.game}</span>
              <span className="text-muted-foreground">{o.pkg}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">{o.player}</span>
              <span className="font-semibold text-emerald-400">{o.price}</span>
              <span className="text-[10px] text-muted-foreground">({o.time})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Stats() {
  const { data: s } = usePublicStats();

  const stats = [
    { value: s?.userCount != null ? s.userCount.toLocaleString() : "—", label: "Registered Users" },
    { value: s?.orderCount != null ? s.orderCount.toLocaleString() : "—", label: "Orders Completed" },
    { value: "99.9%", label: "Success Rate" },
    { value: "24/7", label: "Live Support" },
  ];
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel overflow-hidden rounded-3xl border-primary/10">
        <div className="grid grid-cols-2 divide-y divide-border/60 sm:grid-cols-4 sm:divide-x sm:divide-border/60 sm:divide-y-0">
          {stats.map((st, idx) => (
            <div key={idx} className="px-3 py-6 text-center transition-colors duration-300 hover:bg-muted/10 sm:px-6 sm:py-8">
              <p className="font-display text-3xl font-extrabold text-gradient sm:text-5xl">{st.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">{st.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularGames() {
  const { data: games = [] } = useGames();
  return (
    <section id="games" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5 fill-primary/10" />
          POPULAR GAMES
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-5xl tracking-tight">Select Game to Top Up</h2>
        <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground sm:text-base leading-relaxed">Choose from our selected top gaming catalogs with official integrations and fast checkout.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {games.filter(g => g.is_live).map((g) => {
          const art = gameArt(g.slug);
          const img = g.card_image ?? art.image;
          return (
            <Link
              key={g.id}
              to="/games/$slug"
              params={{ slug: g.slug }}
              className="group relative block overflow-hidden rounded-3xl border border-border/40 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 [perspective:1000px]"
              style={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
            >
              <div className={cn(
                "absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-xl",
                "bg-gradient-to-tr", art.accent
              )} />
              <div className="relative aspect-[4/5] overflow-hidden transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_rotateY(-4deg)]">
                <img src={img} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t via-background/45 to-transparent from-background/95" />
                <div className="absolute left-4 top-4 flex gap-1.5 [transform:translateZ(20px)]">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-md border border-white/10 shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Instant
                  </span>
                </div>
                <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground opacity-0 shadow-lg shadow-primary/30 transition-all duration-500 scale-75 group-hover:opacity-100 group-hover:scale-100 [transform:translateZ(20px)]">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 [transform:translateZ(30px)]">
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground leading-tight group-hover:text-gradient">
                    {g.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                    {g.tagline ?? "Top Up"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Wallet, title: "Unbeatable Prices", body: "We offer the most competitive top-up deals and bundles with zero hidden processing fees." },
    { icon: Zap, title: "Super-Fast Checkout", body: "Select a package, enter your Game ID, pay, and watch resources land in seconds." },
    { icon: ShieldCheck, title: "Completely Secure", body: "Every transaction uses highly secure bank-level gateway layers and encryption protocols." },
    { icon: Headphones, title: "24/7 Dedicated Support", body: "Our customer service support desk is open around the clock to assist you with order status." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, idx) => (
          <div key={idx} className="glass-panel group rounded-3xl p-5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">{it.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { n: "01", title: "Select Game Catalog", body: "Choose your favorite game (Free Fire, PUBG, etc.) from our list." },
    { n: "02", title: "Input Game account ID", body: "Provide your Player ID (and Server ID if MLBB) so resources land safely." },
    { n: "03", title: "Choose Credit Amount", body: "Pick the package or diamonds bundle that fits your game budget." },
    { n: "04", title: "Pay & Enjoy Gold", body: "Check out instantly. Resources are dispatched to your account immediately." },
  ];
  
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl tracking-tight">How It Works</h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">Top up your game credits in 4 simple interactive steps.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveStep(i)}
            className={cn(
              "glass-panel relative rounded-3xl p-6 transition-all duration-300 cursor-pointer",
              activeStep === i ? "border-primary/50 bg-primary/[0.02] shadow-[0_0_30px_-10px_var(--primary)]" : "border-border/40"
            )}
          >
            <span className={cn(
              "font-display text-4xl font-black transition-colors duration-300",
              activeStep === i ? "text-primary" : "text-muted/60"
            )}>
              {s.n}
            </span>
            <h3 className="mt-3 text-base font-bold text-foreground">{s.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{s.body}</p>
            {i < 3 && <div className={cn(
              "absolute right-3 top-1/2 hidden h-px w-6 lg:block transition-colors duration-300",
              activeStep === i ? "bg-primary" : "bg-border/60"
            )} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Ahsan G.", role: "Free Fire Gamer", body: "Top-up credited in literally 3 seconds. Best pricing for diamonds, support desk is fast.", rating: 5 },
    { name: "Zayn A.", role: "PUBG Mobile Streamer", body: "Been using HASA for months. The best platform. Transactions go through immediately.", rating: 5 },
    { name: "Areeba P.", role: "MLBB Champion", body: "Clean checkout, beautiful interface. It is extremely premium compared to other sites.", rating: 5 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl tracking-tight">Trusted by 500K+ Players</h2>
        <p className="mt-3 text-sm text-muted-foreground">Here is what the gaming community says about HASA GOLD STORE.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {reviews.map((r, idx) => (
          <div key={idx} className="glass-panel rounded-3xl p-6 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex gap-0.5">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90 italic">"{r.body}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{r.name}</p>
                <p className="text-[10px] text-muted-foreground">{r.role}</p>
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
    { q: "How fast will I receive my gaming credits?", a: "Most game top-ups are completed instantly (within 10 seconds). In rare payment-gateway delay cases, it might take up to 2 minutes." },
    { q: "Is HASA GOLD STORE officially integrated?", a: "Yes. All payments and top-ups are handled via certified APIs and secure integrations directly matching the publisher systems." },
    { q: "What if I enter the incorrect Player ID?", a: "Please verify details before purchase. Since resources are sent instantly, we cannot reverse orders once credited." },
    { q: "Do you offer coupon or discount codes?", a: "Yes, you can apply promo codes at checkout. Check our home banner or register to unlock tier-based loyalty discounts." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl tracking-tight">FAQ Help Desk</h2>
        <p className="mt-3 text-sm text-muted-foreground">Find answers to quick questions regarding delivery and top-ups.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div
            key={i}
            className={cn(
              "glass-panel rounded-2xl overflow-hidden transition-all duration-300",
              open === i ? "border-primary/40 bg-primary/[0.01]" : ""
            )}
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 focus:outline-none"
            >
              <span className="text-sm font-bold text-foreground sm:text-base">{f.q}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300", open === i && "rotate-180")} />
            </button>
            
            <div className={cn(
              "px-5 overflow-hidden transition-all duration-300 ease-in-out",
              open === i ? "max-h-40 pb-4" : "max-h-0"
            )}>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[var(--gradient-card)] p-6 text-center sm:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_260/0.15),transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl tracking-tight">Ready to Level Up Your Game?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base leading-relaxed">
            Get instant credits for Free Fire, PUBG Mobile, MLBB and Blood Strike now. Top up with the most trusted store.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#games" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                <Zap className="h-4 w-4" /> Top Up Now
              </Button>
            </a>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto hover:bg-muted/50">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}