import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useGames } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";

export const Route = createFileRoute("/games/")({
  head: () => ({ meta: [{ title: "All Games — HASA GOLD STORE" }] }),
  component: GamesIndex,
});

function GamesIndex() {
  const { data: games = [], isLoading } = useGames();
  const [q, setQ] = useState("");
  const filtered = games.filter((g) => g.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">All Games</h1>
            <p className="mt-2 text-muted-foreground">Instant top-ups for every popular title — pay in LKR.</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search games…" className="h-11 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {filtered.map((g) => {
              const art = gameArt(g.slug);
              const image = g.card_image ?? art.image;
              return (
                <Link key={g.id} to="/games/$slug" params={{ slug: g.slug }} className="group relative block overflow-hidden rounded-3xl border border-white/5 bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_var(--primary)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={image} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">{g.name}</h3>
                      <p className="text-xs text-muted-foreground">{art.currency} top-up</p>
                    </div>
                    <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-primary/90 text-primary-foreground opacity-0 shadow-lg shadow-primary/40 transition-all group-hover:opacity-100"><ArrowRight className="h-4 w-4" /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}