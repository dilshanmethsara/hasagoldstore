import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to="/games/$slug"
      params={{ slug: game.slug }}
      className="group relative block overflow-hidden rounded-3xl border border-border/40 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 [perspective:1000px]"
      style={{
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)"
      }}
    >
      {/* Outer border glow on hover */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-xl",
        "bg-gradient-to-tr",
        game.slug === "free-fire" && "from-orange-500/40 to-fuchsia-600/40",
        game.slug === "pubg-mobile" && "from-amber-400/40 to-sky-500/40",
        game.slug === "mobile-legends" && "from-blue-500/40 to-violet-600/40",
        game.slug === "blood-strike" && "from-rose-500/40 to-red-600/40"
      )} />

      <div className="relative aspect-[4/5] overflow-hidden transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_rotateY(-4deg)]">
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Dynamic game-specific overlay gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t via-background/45 to-transparent transition-opacity duration-500",
          "from-background/95"
        )} />

        {/* Live Delivery / Value Badge */}
        <div className="absolute left-4 top-4 flex gap-1.5 [transform:translateZ(20px)]">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Instant
          </span>
          {game.slug === "pubg-mobile" || game.slug === "free-fire" ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2.5 py-1 text-[10px] font-semibold text-primary backdrop-blur-md border border-primary/20 shadow-lg">
              Hot
            </span>
          ) : null}
        </div>

        {/* Arrow Button */}
        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground opacity-0 shadow-lg shadow-primary/30 transition-all duration-500 scale-75 group-hover:opacity-100 group-hover:scale-100 [transform:translateZ(20px)]">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 [transform:translateZ(30px)]">
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground leading-tight group-hover:text-gradient">
            {game.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
            {game.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}