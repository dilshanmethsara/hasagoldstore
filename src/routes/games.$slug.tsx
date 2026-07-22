import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  Tag,
  ArrowRight,
  Sparkles,
  Info,
  Heart,
  Loader2,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGame, usePackages, useGames, useFavorites, useToggleFavorite, type Package } from "@/lib/hooks/db";
import { gameArt } from "@/lib/game-art";
import { lkr } from "@/lib/format";
import { useAuth } from "@/lib/use-auth";
import { http } from "@/api/httpClient";

export const Route = createFileRoute("/games/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} Top-Up — HASA GOLD STORE` },
    ],
  }),
  component: GamePage,
});

// ── Player validation types ───────────────────────────────────────────────

type ValidationStatus = "idle" | "loading" | "valid" | "invalid" | "skipped";

interface ValidatedPlayer {
  player_id: string;
  player_name: string;
  region?: string;
  [key: string]: string | undefined;
}

// ── Hook: debounced player validation ─────────────────────────────────────

function usePlayerValidation(
  gameId: string | undefined,
  supportsValidation: boolean,
  playerId: string,
  serverId: string,
  debounceMs = 800,
) {
  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [player, setPlayer] = useState<ValidatedPlayer | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset when inputs clear
    if (!playerId || playerId.trim().length < 3) {
      setStatus("idle");
      setPlayer(null);
      setErrorMsg(null);
      return;
    }

    // If game doesn't support validation, mark as skipped so checkout is allowed
    if (!supportsValidation || !gameId) {
      setStatus("skipped");
      setPlayer(null);
      setErrorMsg(null);
      return;
    }

    // Clear any pending timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setStatus("loading");
    setPlayer(null);
    setErrorMsg(null);

    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const result = await http.post<{ success: boolean; player: ValidatedPlayer }>(
          "/games/validate-player",
          {
            gameId,
            playerId: playerId.trim(),
            ...(serverId ? { serverId } : {}),
          },
          { signal: ctrl.signal, timeoutMs: 12_000 },
        );

        if (result?.success && result.player) {
          setPlayer(result.player);
          setStatus("valid");
        } else {
          setStatus("invalid");
          setErrorMsg("Could not validate player.");
        }
      } catch (err: any) {
        if (err?.name === "AbortError" || ctrl.signal.aborted) return;
        // GAME_NOT_CONFIGURED means this game has no shop2topup ID set yet — skip silently
        if (err?.code === "GAME_NOT_CONFIGURED") {
          setStatus("skipped");
          return;
        }
        setStatus("invalid");
        setErrorMsg(err?.message ?? "Player not found.");
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, supportsValidation, playerId, serverId]);

  return { status, player, errorMsg };
}

// ── Page component ────────────────────────────────────────────────────────

function GamePage() {
  const { slug } = Route.useParams();
  const { data: game, isLoading } = useGame(slug);
  const { data: packages = [] } = usePackages(game?.id);
  const { data: allGames = [] } = useGames();
  const { user } = useAuth();
  const { data: favorites = [] } = useFavorites();
  const toggleFav = useToggleFavorite();
  const art = gameArt(slug);
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [packageId, setPackageId] = useState<string>("");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);

  const supportsValidation = !!(game?.shop2topupProductId ?? (game as any)?.shop2topup_product_id);

  const { status: validationStatus, player: validatedPlayer, errorMsg: validationError } =
    usePlayerValidation(game?.id, supportsValidation, playerId, art.needsServerId ? serverId : "");

  // Use database images with fallback to mock art
  const heroImage = game?.hero_image ?? art.image;
  const cardImage = game?.card_image ?? art.image;

  useEffect(() => {
    if (packages.length && !packageId) {
      setPackageId(packages.find((p) => p.badge === "POPULAR")?.id ?? packages[0].id);
    }
  }, [packages, packageId]);

  const selected = useMemo(() => packages.find((p) => p.id === packageId), [packages, packageId]);
  const subtotal = selected ? Number(selected.price_lkr) : 0;
  const discount = promoApplied ? Math.round(subtotal * promoApplied.discount) : 0;
  const total = Math.max(0, subtotal - discount);

  // Checkout is allowed when:
  // - package selected
  // - player ID entered (length >= 3)
  // - server ID entered if required
  // - validation passed OR game doesn't support validation (skipped)
  const playerIdReady = playerId.trim().length >= 3 && (!art.needsServerId || serverId.length >= 1);
  const validationOk =
    validationStatus === "valid" ||
    validationStatus === "skipped" ||
    (validationStatus === "idle" && !supportsValidation);
  const canCheckout = !!selected && playerIdReady && validationOk;
  const isFav = !!game && favorites.some((f) => f.game_id === game.id);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading…</div>
        <SiteFooter />
      </div>
    );
  }
  if (!game) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="grid min-h-[60vh] place-items-center text-center">
          <div>
            <h1 className="font-display text-3xl">Game not found</h1>
            <Link to="/games" className="mt-4 inline-block text-primary">Browse all games</Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:py-20">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-primary/30 sm:h-36 sm:w-36">
            <img src={cardImage} alt={game.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Instant Delivery</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">Official Partner</span>
              {game.publisher && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">{game.publisher}</span>}
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">{game.name}</h1>
            <p className="mt-2 text-muted-foreground">{game.tagline ?? `Top up ${art.currency}`} · Best LKR prices</p>
          </div>
          {user && (
            <Button variant="outline" size="sm" onClick={() => toggleFav.mutate({ gameId: game.id, isFav })}>
              <Heart className={cn("h-4 w-4", isFav && "fill-primary text-primary")} /> {isFav ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        <div className="space-y-6">
          {/* Account info */}
          <Card>
            <CardTitle n="1" title="Account Info" />
            <div className={cn("grid gap-4", art.needsServerId ? "sm:grid-cols-2" : "")}>
              <PlayerIdField
                value={playerId}
                onChange={setPlayerId}
                validationStatus={validationStatus}
                validatedPlayer={validatedPlayer}
                validationError={validationError}
                supportsValidation={supportsValidation}
              />
              {art.needsServerId && (
                <FieldInput
                  label="Server ID"
                  value={serverId}
                  onChange={setServerId}
                  placeholder="e.g. 2001"
                />
              )}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" /> Make sure your Player ID is correct — orders can't be reversed.
            </p>
          </Card>

          {/* Packages */}
          <Card>
            <CardTitle n="2" title="Select Package" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {packages.map((p: Package) => {
                const active = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPackageId(p.id)}
                    className={cn(
                      "relative rounded-2xl border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 shadow-[0_0_30px_-10px_var(--primary)]"
                        : "border-white/5 bg-white/[0.03] hover:border-primary/30",
                    )}
                  >
                    {p.badge && (
                      <span className="absolute -top-2 right-3 rounded-full bg-[var(--gradient-primary)] px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {p.badge}
                      </span>
                    )}
                    <p className="font-display text-base font-bold text-foreground">{p.label}</p>
                    {p.bonus > 0 && <p className="mt-0.5 text-[11px] font-medium text-emerald-400">+{p.bonus} bonus</p>}
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-lg font-bold text-gradient">{lkr(p.price_lkr)}</span>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
              {!packages.length && <p className="col-span-full text-sm text-muted-foreground">No packages available.</p>}
            </div>
          </Card>

          {/* Promo */}
          <Card>
            <CardTitle n="3" title="Promo Code" />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="h-12 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                />
              </div>
              <Button
                variant={promoApplied ? "outline" : "default"}
                onClick={async () => {
                  if (promoApplied) { setPromoApplied(null); return; }
                  try {
                    const { promoService } = await import("@/services/promoService");
                    const validated = await promoService.validate(promo, subtotal);
                    if (validated) {
                      setPromoApplied({
                        code: validated.code.code,
                        discount: validated.discountLkr / Math.max(subtotal, 1),
                      });
                    }
                  } catch { /* invalid promo — swallow */ }
                }}
                size="lg"
              >
                {promoApplied ? "Remove" : "Apply"}
              </Button>
            </div>
            {promoApplied && <p className="mt-2 text-xs text-emerald-400">Code <strong>{promoApplied.code}</strong> applied.</p>}
            {!promoApplied && <p className="mt-2 text-xs text-muted-foreground">Try <code className="rounded bg-white/5 px-1.5 py-0.5">WELCOME10</code> or <code className="rounded bg-white/5 px-1.5 py-0.5">HASA200</code></p>}
          </Card>
        </div>

        {/* Sticky order summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-display text-lg font-bold text-foreground">Order Summary</h3>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <img src={art.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{game.name}</p>
                <p className="truncate text-xs text-muted-foreground">{selected?.label ?? "Select a package"}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <Row
                label="Player"
                value={
                  validatedPlayer?.player_name
                    ? `${validatedPlayer.player_name} (${playerId})`
                    : playerId || "—"
                }
              />
              {art.needsServerId && <Row label="Server" value={serverId || "—"} />}
              <Row label="Package" value={selected?.label ?? "—"} />
              <Row label="Subtotal" value={lkr(subtotal)} />
              {promoApplied && <Row label={`Promo (${promoApplied.code})`} value={`- ${lkr(discount)}`} accent />}
            </dl>

            <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-3xl font-bold text-gradient">{lkr(total)}</span>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="mt-5 w-full"
              disabled={!canCheckout}
              onClick={() => navigate({
                to: "/checkout",
                search: { game: game.slug, pkg: selected!.id, pid: playerId.trim(), sid: serverId, promo: promoApplied?.code ?? "", pname: validatedPlayer?.player_name ?? "" },
              })}
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Checkout hint */}
            {supportsValidation && validationStatus === "invalid" && playerIdReady && (
              <p className="mt-3 flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Player ID could not be verified. Please double-check before continuing.
              </p>
            )}
            {supportsValidation && validationStatus === "loading" && (
              <p className="mt-3 text-center text-xs text-muted-foreground">Verifying player…</p>
            )}

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> 100% secure encrypted checkout</li>
              <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-primary" /> Instant delivery to your account</li>
              <li className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary" /> Rewards on every purchase</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Other games */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h3 className="mb-5 font-display text-2xl font-bold text-foreground">Other Games</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {allGames.filter(g => g.slug !== game.slug).map(g => {
            const gArt = gameArt(g.slug);
            const imageUrl = g.card_image ?? gArt.image;
            return (
              <Link key={g.slug} to="/games/$slug" params={{ slug: g.slug }} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-all hover:border-primary/30">
                <img src={imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{g.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{g.tagline}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// ── Player ID field with validation badge ─────────────────────────────────

function PlayerIdField({
  value,
  onChange,
  validationStatus,
  validatedPlayer,
  validationError,
  supportsValidation,
}: {
  value: string;
  onChange: (v: string) => void;
  validationStatus: ValidationStatus;
  validatedPlayer: ValidatedPlayer | null;
  validationError: string | null;
  supportsValidation: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Player ID</span>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 123456789"
          inputMode="numeric"
          pattern="[0-9]*"
          className={cn(
            "h-12 w-full rounded-xl border bg-white/5 px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none",
            validationStatus === "valid"
              ? "border-emerald-500/50 focus:border-emerald-500/70"
              : validationStatus === "invalid"
              ? "border-red-500/50 focus:border-red-500/70"
              : "border-white/5 focus:border-primary/40",
          )}
        />
        {/* Status icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {validationStatus === "loading" && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {validationStatus === "valid" && (
            <UserCheck className="h-4 w-4 text-emerald-400" />
          )}
          {validationStatus === "invalid" && (
            <UserX className="h-4 w-4 text-red-400" />
          )}
        </span>
      </div>

      {/* Validation feedback */}
      {validationStatus === "valid" && validatedPlayer && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-emerald-300">{validatedPlayer.player_name}</p>
            {validatedPlayer.region && (
              <p className="text-[11px] text-emerald-400/70">{validatedPlayer.region}</p>
            )}
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400">Verified</span>
        </div>
      )}
      {validationStatus === "invalid" && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <UserX className="h-3.5 w-3.5 shrink-0" />
          {validationError ?? "Player ID not found. Please check and try again."}
        </p>
      )}
      {supportsValidation && validationStatus === "idle" && value.length > 0 && value.length < 3 && (
        <p className="mt-1.5 text-xs text-muted-foreground">Enter at least 3 characters to validate.</p>
      )}
    </label>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass-card rounded-3xl p-6">{children}</div>;
}
function CardTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-sm font-bold text-primary">{n}</span>
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}
function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
      />
    </label>
  );
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("min-w-0 truncate text-right font-medium", accent ? "text-emerald-400" : "text-foreground")}>{value}</dd>
    </div>
  );
}
