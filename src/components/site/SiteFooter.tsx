import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Twitter, Instagram, Youtube, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The trusted platform for instant game top-ups. Fast, secure and always at the best prices.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Instagram, Youtube, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Games" links={[
            ["Free Fire", "/games/free-fire"],
            ["PUBG Mobile", "/games/pubg-mobile"],
            ["Mobile Legends", "/games/mobile-legends"],
            ["Blood Strike", "/games/blood-strike"],
          ]} />
          <FooterCol title="Company" links={[
            ["About Us", "/about"], ["Contact", "/contact"], ["Careers", "/careers"], ["Blog", "/blog"],
          ]} />
          <FooterCol title="Support" links={[
            ["Help Center", "/help"], ["Reviews", "/reviews"], ["Refund Policy", "/refund"], ["Terms", "/terms"],
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HASA GOLD STORE. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/refund" className="hover:text-foreground">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}