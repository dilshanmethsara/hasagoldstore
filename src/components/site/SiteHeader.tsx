import { Link } from "@tanstack/react-router";
import { Search, Moon, Sun, Menu, X, User, Bell, Gamepad2, Home, Star, PackageSearch, LifeBuoy, Mail, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";
import { useTheme } from "@/lib/use-theme";

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
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
          "shadow-[0_10px_40px_-12px_oklch(0.55_0.2_255/0.35),inset_0_1px_0_0_oklch(1_0_0/0.06)]",
          scrolled && "bg-background/80 border-primary/20 shadow-[0_15px_50px_-15px_oklch(0.55_0.2_255/0.5),inset_0_1px_0_0_oklch(1_0_0/0.08)]"
        )}>
          <Link to="/" className="shrink-0"><Logo /></Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-0.5 xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground"
                activeProps={{ className: "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.65_0.2_255/0.25)]" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Search (md+) */}
          <div className="ml-auto hidden flex-1 max-w-xs md:block xl:max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search games, top-ups..."
                className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/40 focus:bg-muted/60 focus:outline-none"
              />
              <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground lg:block">⌘K</kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <Button variant="ghost" size="icon" className="relative hidden md:inline-flex">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <Link to="/dashboard" className="hidden md:inline-flex">
                <Button variant="hero" size="sm">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="hidden md:inline-flex">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4" /> Log in
                  </Button>
                </Link>
                <Link to="/auth/signup" className="hidden md:inline-flex">
                  <Button variant="hero" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

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
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search games..."
              className="h-11 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
            />
          </div>

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