import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to="/games/$slug"
      params={{ slug: game.slug }}
      className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_var(--primary)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90", game.accent, "from-background via-background/30 to-transparent")} />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">{game.name}</h3>
          <p className="text-sm text-muted-foreground">{game.tagline}</p>
        </div>
        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-primary/90 text-primary-foreground opacity-0 shadow-lg shadow-primary/40 transition-all duration-300 group-hover:opacity-100">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}