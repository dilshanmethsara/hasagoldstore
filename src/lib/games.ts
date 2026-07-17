import freeFireImg from "@/assets/game-freefire.jpg";
import pubgImg from "@/assets/game-pubg.jpg";
import mlbbImg from "@/assets/game-mlbb.jpg";
import bloodStrikeImg from "@/assets/game-bloodstrike.jpg";

export type Package = {
  id: string;
  amount: string;
  price: number;
  bonus?: string;
  popular?: boolean;
};

export type Game = {
  slug: string;
  name: string;
  tagline: string;
  currency: string;
  image: string;
  accent: string; // tailwind gradient classes for game-themed glow
  needsServerId?: boolean;
  packages: Package[];
};

export const GAMES: Game[] = [
  {
    slug: "free-fire",
    name: "Free Fire",
    tagline: "Diamond Top-Up",
    currency: "Diamonds",
    image: freeFireImg,
    accent: "from-fuchsia-500/30 to-purple-600/30",
    packages: [
      { id: "ff-100", amount: "100 Diamonds", price: 0.99 },
      { id: "ff-310", amount: "310 Diamonds", price: 2.99, bonus: "+10 Bonus" },
      { id: "ff-520", amount: "520 Diamonds", price: 4.99, popular: true, bonus: "+20 Bonus" },
      { id: "ff-1060", amount: "1,060 Diamonds", price: 9.99, bonus: "+60 Bonus" },
      { id: "ff-2180", amount: "2,180 Diamonds", price: 19.99, bonus: "+180 Bonus" },
      { id: "ff-5600", amount: "5,600 Diamonds", price: 49.99, bonus: "+600 Bonus" },
    ],
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    tagline: "UC Top-Up",
    currency: "UC",
    image: pubgImg,
    accent: "from-sky-500/30 to-blue-600/30",
    packages: [
      { id: "pubg-60", amount: "60 UC", price: 0.99 },
      { id: "pubg-325", amount: "325 UC", price: 4.99, bonus: "+25 Bonus" },
      { id: "pubg-660", amount: "660 UC", price: 9.99, popular: true, bonus: "+60 Bonus" },
      { id: "pubg-1800", amount: "1,800 UC", price: 24.99, bonus: "+300 Bonus" },
      { id: "pubg-3850", amount: "3,850 UC", price: 49.99, bonus: "+850 Bonus" },
      { id: "pubg-8100", amount: "8,100 UC", price: 99.99, bonus: "+2,100 Bonus" },
    ],
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    tagline: "Diamond Top-Up",
    currency: "Diamonds",
    image: mlbbImg,
    accent: "from-blue-500/30 to-violet-600/30",
    needsServerId: true,
    packages: [
      { id: "ml-86", amount: "86 Diamonds", price: 1.49 },
      { id: "ml-172", amount: "172 Diamonds", price: 2.99, bonus: "+5%" },
      { id: "ml-257", amount: "257 Diamonds", price: 4.49, popular: true },
      { id: "ml-706", amount: "706 Diamonds", price: 11.99, bonus: "+10%" },
      { id: "ml-1412", amount: "1,412 Diamonds", price: 22.99, bonus: "+15%" },
      { id: "ml-2195", amount: "2,195 Diamonds", price: 34.99, bonus: "+20%" },
    ],
  },
  {
    slug: "blood-strike",
    name: "Blood Strike",
    tagline: "Gold Top-Up",
    currency: "Gold",
    image: bloodStrikeImg,
    accent: "from-rose-500/30 to-red-600/30",
    packages: [
      { id: "bs-100", amount: "100 Gold", price: 0.99 },
      { id: "bs-300", amount: "300 Gold", price: 2.99 },
      { id: "bs-680", amount: "680 Gold", price: 5.99, popular: true, bonus: "+5% Bonus" },
      { id: "bs-1400", amount: "1,400 Gold", price: 11.99, bonus: "+10% Bonus" },
      { id: "bs-2800", amount: "2,800 Gold", price: 22.99, bonus: "+15% Bonus" },
      { id: "bs-7000", amount: "7,000 Gold", price: 49.99, bonus: "+20% Bonus" },
    ],
  },
];

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}