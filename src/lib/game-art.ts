import freeFireImg from "@/assets/game-freefire.jpg";
import pubgImg from "@/assets/game-pubg.jpg";
import mlbbImg from "@/assets/game-mlbb.jpg";
import bloodStrikeImg from "@/assets/game-bloodstrike.jpg";

export const GAME_ART: Record<string, { image: string; accent: string; needsServerId?: boolean; currency: string }> = {
  "free-fire":     { image: freeFireImg,   accent: "from-fuchsia-500/30 to-purple-600/30", currency: "Diamonds" },
  "pubg-mobile":   { image: pubgImg,       accent: "from-sky-500/30 to-blue-600/30",       currency: "UC" },
  "mobile-legends":{ image: mlbbImg,       accent: "from-blue-500/30 to-violet-600/30",    currency: "Diamonds", needsServerId: true },
  "blood-strike":  { image: bloodStrikeImg,accent: "from-rose-500/30 to-red-600/30",       currency: "Gold" },
};

export function gameArt(slug: string) {
  return GAME_ART[slug] ?? { image: freeFireImg, accent: "from-primary/30 to-primary/10", currency: "Credits" };
}