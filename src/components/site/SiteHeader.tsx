import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Moon, Sun, Menu, X, User, Bell, Gamepad2, Home, Star, PackageSearch, LifeBuoy, Mail, LayoutDashboard, Wallet, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/lib/use-theme";
import { useWallet, useProfile } from "@/lib/hooks/db";
import { GAMES } from "@/lib/games";

const NAV = [
  { label: "Home", to: "/", icon: Home },
  { label: "Games", to: "/games", icon: Gamepad2 },
  { label: "Reviews", to: "/reviews", icon: Star },
  { label: "Order Tracking", to: "/tracking", icon: PackageSearch },
  { label: "Help Center", to: "/help", icon: LifeBuoy },
  { label: "Contact", to: "/contact", icon: Mail },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const { user } = useAuth();
  const { logout } = useAuthContext();
  const { theme, toggle } = useTheme();
  
  const { data: walletData } = useWallet();
  const { data: profileData } = useProfile();
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll event
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body overflow during drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Click outside profile dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const filteredGames = searchQuery.trim()
    ? GAMES.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : GAMES;

  const handleSearchItemClick = (slug: string) => {
    setSearchOpen(false);
    navigate({ to: "/games/$slug", params: { slug } });
  };

  return (
    <>
      {/* Spacer so floating bar doesn't cover content */}
      <div aria-hidden className="h-24" />

      <header className={cn(
        "fixed inset-x-0 top-3 z-50 px-3 transition-all duration-300 sm:top-4 sm:px-6",
        scrolled && "top-2 sm:top-3"
      )}>
        <div className={cn(
          "mx-auto flex h-16 max-w-7xl items-center gap-2 rounded-2xl border border-border bg-background/60 px-3 backdrop-blur-2xl transition-all duration-300 sm:gap-4 sm:px-4",
          "shadow-[0_10px_40px_-12px_oklch(0.55_0.2_255/0.25),inset_0_1px_0_0_oklch(1_0_0/0.06)]",
          scrolled && "bg-background/80 border-primary/20 shadow-[0_15px_50px_-15px_oklch(0.55_0.2_255/0.4),inset_0_1px_0_0_oklch(1_0_0/0.08)]"
        )}>
          <Link to="/" className="shrink-0 transition-transform active:scale-95"><Logo /></Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-1 xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground relative group"
                activeProps={{ className: "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.65_0.2_255/0.15)]" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Search trigger button (md+) */}
          <div className="ml-auto hidden flex-1 max-w-xs md:block xl:max-w-sm">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 text-left text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted/60"
            >
              <Search className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Search games, top-ups...</span>
              <kbd className="ml-auto rounded-md border border-border bg-muted/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            {/* Search icon trigger for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="relative hidden md:inline-flex hover:bg-muted/50">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex hover:bg-muted/50"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Widget with avatar + Wallet balance */}
                <button
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition px-2.5 py-1.5"
                >
                  <div className="flex flex-col items-end leading-none text-right hidden sm:flex">
                    <span className="text-xs font-semibold text-foreground">
                      {profileData?.display_name || user.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-0.5">
                      <Wallet className="h-2.5 w-2.5" />
                      Rs. {walletData?.balance?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-md shadow-primary/25">
                    {(profileData?.display_name || user.email).charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-border bg-background/95 p-1.5 shadow-2xl backdrop-blur-md animate-fade-in z-50">
                    <div className="px-3 py-2 border-b border-border/60 text-xs sm:hidden">
                      <p className="font-semibold text-foreground truncate">{profileData?.display_name || user.email.split("@")[0]}</p>
                      <p className="text-primary font-bold mt-1 flex items-center gap-1">
                        <Wallet className="h-3 w-3" /> Rs. {walletData?.balance?.toFixed(2) ?? "0.00"}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/wallet"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition"
                    >
                      <Wallet className="h-4 w-4" />
                      Top Up Wallet
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-500 hover:bg-rose-50/10 transition text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth/login" className="hidden md:inline-flex">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <User className="h-4 w-4" /> Log in
                  </Button>
                </Link>
                <Link to="/auth/signup" className="hidden md:inline-flex">
                  <Button variant="hero" size="sm" className="rounded-xl">Sign Up</Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden hover:bg-muted/50"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Modern Search overlay (Command Menu) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-md animate-fade-in">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setSearchOpen(false)}
          />
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-primary/20 bg-background/95 p-2 shadow-2xl backdrop-blur-2xl animate-fade-up">
            <div className="relative flex items-center border-b border-border/60 px-3 pb-2 pt-1">
              <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games (e.g. Free Fire, PUBG)..."
                className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-lg border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {searchQuery ? "Search Results" : "Featured Games"}
              </p>
              {filteredGames.length > 0 ? (
                <div className="grid gap-1">
                  {filteredGames.map((g) => (
                    <button
                      key={g.slug}
                      onClick={() => handleSearchItemClick(g.slug)}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-primary/10 group"
                    >
                      <img
                        src={g.image}
                        alt={g.name}
                        className="h-10 w-10 rounded-lg object-cover border border-border group-hover:border-primary/30"
                      />
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {g.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {g.tagline}
                        </p>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        Top Up
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No games found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-[100dvh] w-[88%] max-w-sm transform border-l border-border bg-background/95 backdrop-blur-2xl transition-transform duration-300 ease-out xl:hidden",
          "shadow-[-20px_0_60px_-20px_oklch(0.55_0.2_255/0.4)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto p-4">
          <nav className="grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground"
                activeProps={{ className: "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.65_0.2_255/0.25)]" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted/40 text-muted-foreground transition-colors group-hover:text-primary">
                  <n.icon className="h-4 w-4" />
                </span>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-border/60 pt-4">
            <button
              onClick={toggle}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{theme}</span>
            </button>
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block">
                <Button variant="hero" size="lg" className="w-full"><LayoutDashboard className="h-4 w-4" /> Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setOpen(false)} className="block">
                  <Button variant="outline" size="lg" className="w-full"><User className="h-4 w-4" /> Log in</Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)} className="block">
                  <Button variant="hero" size="lg" className="w-full">Create account</Button>
                </Link>
              </>
            )}
            <p className="pt-2 text-center text-[11px] text-muted-foreground">© {new Date().getFullYear()} HASA GOLD STORE</p>
          </div>
        </div>
      </aside>
    </>
  );
}