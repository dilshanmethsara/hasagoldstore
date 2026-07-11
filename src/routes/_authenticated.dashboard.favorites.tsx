import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/favorites")({
  head: () => ({ meta: [{ title: "Favorites — HASA GOLD STORE" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { data: favs = [], isLoading } = useFavorites();
  const toggle = useToggleFavorite();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quick access to games you love.</p>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
      ) : favs.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5"><Heart className="h-6 w-6 text-muted-foreground" /></div>
          <p className="mt-4 font-display font-semibold text-foreground">No favorites yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any game to save it here.</p>
          <Link to="/games"><Button variant="hero" className="mt-4">Browse games</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favs.map((f) => {
            const art = gameArt(f.game.slug);
            return (
              <div key={f.game_id} className="glass-card group relative overflow-hidden rounded-2xl p-4">
                <div className="flex gap-4">
                  <img src={art.image} alt="" className="h-24 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-foreground">{f.game.name}</p>
                    <p className="text-xs text-muted-foreground">{art.currency} top-ups</p>
                    <div className="mt-3 flex gap-2">
                      <Link to="/games/$slug" params={{ slug: f.game.slug }}><Button size="sm" variant="hero">Top up <ArrowRight className="h-3 w-3" /></Button></Link>
                      <Button size="sm" variant="outline" onClick={() => toggle.mutate({ gameId: f.game.id, isFav: true })}><Heart className="h-3 w-3 fill-current" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}