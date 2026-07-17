import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Zap, ShieldCheck, Star, ArrowRight, Sparkles, Wallet, Headphones, Check, ChevronDown, Tag, Flame, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { GameCard } from "@/components/site/GameCard";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/lib/games";
import heroCharImg from "@/assets/hero-characters.png";
import { useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState("free-fire");
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedPkgId, setSelectedPkgId] = useState("");

  const currentGame = GAMES.find(g => g.slug === selectedGame) || GAMES[0];
  const packages = currentGame.packages;

  // Reset package selection when game changes
  useEffect(() => {
    if (packages.length > 0) {
      // Auto-select the popular package or the first one
      const popular = packages.find(p => p.popular);
      setSelectedPkgId(popular ? popular.id : packages[0].id);
    } else {
      setSelectedPkgId("");
    }
  }, [selectedGame]);

  const selectedPkg = packages.find(p => p.id === selectedPkgId);

  const canCheckout = playerId.trim().length > 2 && 
    (selectedGame !== "mobile-legends" || serverId.trim().length > 1) && 
    !!selectedPkgId;

  const handleCheckout = () => {
    if (!canCheckout) return;
    navigate({
      to: "/checkout",
      search: {
        game: selectedGame,
        pkg: selectedPkgId,
        pid: playerId,
        sid: selectedGame === "mobile-legends" ? serverId : "",
        promo: "",
      }
    });
  };

  return (
    <section className="relative pt-4 pb-12 sm:pb-16 lg:pb-24 lg:pt-12">
      {/* Decorative dot grid background */}
      <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 items-center">
        {/* Left Column: Heading and info */}
        <div className="flex flex-col animate-fade-up relative z-10">
          {/* Trust Badge */}
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary sm:mb-6 sm:px-4 sm:py-1.5 sm:text-xs">
            <Zap className="h-3.5 w-3.5 fill-primary/20 animate-pulse" />
            #1 Rated Instant Gaming Store
          </div>

          <h1 className="font-display text-[2.5rem] font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Level Up Your Game.<br />
            <span className="text-gradient">Instant Top-Up.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm text-muted-foreground sm:text-lg leading-relaxed">
            Get your diamonds, UC, or gold top-up credited in seconds. Trusted by{" "}
            <span className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">500,000+</span> gamers for the best prices and 24/7 delivery.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#games">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all">
                <Zap className="h-4 w-4" /> Top Up Now
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="xl" className="w-full sm:w-auto hover:bg-muted/50">
                How It Works <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Core Trust Indicators */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Zap, title: "10-Sec Delivery", desc: "Instant Credit" },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted Payments" },
              { icon: Tag, title: "Cheapest Prices", desc: "Always Best Deals" },
              { icon: Headphones, title: "24/7 Live Support", desc: "Instant Help" },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel flex items-center gap-2.5 rounded-2xl p-3 hover:border-primary/20 transition-colors duration-300">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground leading-tight">{item.title}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Score */}
          <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-6">
            <div className="flex -space-x-2.5">
              {["bg-primary", "bg-fuchsia-500", "bg-emerald-500", "bg-amber-500"].map((bg, idx) => (
                <div key={idx} className={cn("grid h-9 w-9 place-items-center rounded-full border-2 border-background text-[11px] font-bold text-white shadow-md", bg)}>
                  {["A", "K", "D", "S"][idx]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">4.9/5 Rating</span>
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />))}</div>
              </div>
              <p className="text-[11px] text-muted-foreground">based on 25,000+ verified customer reviews</p>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Top-Up Widget & Character Art Overlay */}
        <div className="relative flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          {/* Animated Background Character Artwork */}
          <div className="absolute right-[-10%] top-[-10%] -z-10 w-[110%] aspect-square opacity-20 lg:opacity-30 pointer-events-none scale-105 select-none animate-float">
            <img 
              src={heroCharImg} 
              alt="Game Characters Artwork" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]" 
            />
          </div>

          {/* Quick Top-Up Calculator Widget */}
          <div className="glass-panel w-full max-w-[420px] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden border-primary/20">
            {/* Top Glow bar depending on selected game */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1 transition-colors duration-500",
              selectedGame === "free-fire" && "bg-orange-500",
              selectedGame === "pubg-mobile" && "bg-amber-400",
              selectedGame === "mobile-legends" && "bg-indigo-500",
              selectedGame === "blood-strike" && "bg-rose-500"
            )} />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Top-Up</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Stock
              </span>
            </div>

            {/* Game Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/50 mb-4">
              {GAMES.map((game) => (
                <button
                  key={game.slug}
                  onClick={() => setSelectedGame(game.slug)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 text-center gap-1",
                    selectedGame === game.slug 
                      ? "bg-card text-primary shadow-md border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <img src={game.image} className="w-6 h-6 rounded-md object-cover" alt="" />
                  <span className="text-[9px] font-bold tracking-tight truncate max-w-full">{game.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Player ID</label>
                <input
                  type="text"
                  placeholder="Enter Player ID"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full h-11 px-3 bg-muted/40 border border-border/60 rounded-xl text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:bg-muted/70 focus:outline-none transition-colors"
                />
              </div>

              {selectedGame === "mobile-legends" && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Server ID</label>
                  <input
                    type="text"
                    placeholder="Enter Server ID"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    className="w-full h-11 px-3 bg-muted/40 border border-border/60 rounded-xl text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:bg-muted/70 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Packages Grid */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Amount</label>
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={cn(
                      "flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all relative overflow-hidden",
                      selectedPkgId === pkg.id 
                        ? "border-primary bg-primary/5 shadow-inner" 
                        : "border-border/50 bg-muted/20 hover:border-primary/30"
                    )}
                  >
                    {pkg.popular && (
                      <span className="absolute top-0 right-0 rounded-bl-lg bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                        BEST
                      </span>
                    )}
                    <span className="text-[11px] font-bold truncate text-foreground">{pkg.amount}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-primary">${pkg.price.toFixed(2)}</span>
                      {selectedPkgId === pkg.id && <Check className="h-3 w-3 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price calculation and checkout */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-muted-foreground">Total Price</span>
                  <p className="text-lg font-bold text-foreground">
                    {selectedPkg ? `$${selectedPkg.price.toFixed(2)}` : "$0.00"}
                  </p>
                </div>
                {selectedPkg?.bonus && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {selectedPkg.bonus}
                  </span>
                )}
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={handleCheckout}
                disabled={!canCheckout}
                className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold rounded-xl"
              >
                Proceed to Checkout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveTicker() {
  const [orders, setOrders] = useState([
    { id: 1, game: "Free Fire", amount: "520 Diamonds", player: "382****51", price: "$4.99", time: "2s ago" },
    { id: 2, game: "PUBG Mobile", amount: "325 UC", player: "951****02", price: "$4.99", time: "5s ago" },
    { id: 3, game: "Mobile Legends", amount: "257 Diamonds", player: "740****(2001)", price: "$4.49", time: "9s ago" },
    { id: 4, game: "Blood Strike", amount: "680 Gold", player: "105****44", price: "$5.99", time: "14s ago" },
  ]);

  // Append new simulated top-up orders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
      const randomPkg = randomGame.packages[Math.floor(Math.random() * randomGame.packages.length)];
      const playerNum = Math.floor(100000 + Math.random() * 900000);
      const serverNum = Math.floor(2000 + Math.random() * 8000);
      
      const newOrder = {
        id: Date.now(),
        game: randomGame.name,
        amount: randomPkg.amount,
        player: randomGame.slug === "mobile-legends" ? `${playerNum}****(${serverNum})` : `${playerNum}****`,
        price: `$${randomPkg.price.toFixed(2)}`,
        time: "Just now"
      };

      setOrders(prev => [newOrder, ...prev.slice(0, 3)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-y border-border/40 bg-muted/20 py-2.5 backdrop-blur-md overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-center flex-wrap gap-x-8 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-primary shrink-0">
          <Flame className="h-4 w-4 fill-primary/10 animate-bounce" />
          LIVE DISPATCH:
        </span>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-2 shrink-0 animate-fade-in">
              <span className="font-semibold text-foreground">{order.game}</span>
              <span className="text-muted-foreground">{order.amount}</span>
              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">{order.player}</span>
              <span className="text-emerald-400 font-semibold">{order.price}</span>
              <span className="text-[10px] text-muted-foreground">({order.time})</span>
            </div>
          ))}
        </div>
      </div>
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
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-3xl overflow-hidden border-primary/10">
        <div className="grid grid-cols-2 divide-y divide-border/60 sm:grid-cols-4 sm:divide-x sm:divide-border/60 sm:divide-y-0">
          {stats.map((s, idx) => (
            <div key={idx} className="px-3 py-6 text-center sm:px-6 sm:py-8 hover:bg-muted/10 transition-colors duration-300">
              <p className="font-display text-3xl font-extrabold text-gradient sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularGames() {
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
        {GAMES.map((g) => <GameCard key={g.slug} game={g} />)}
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
