import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Track Order — HASA GOLD STORE" }] }),
  component: TrackingPage,
});

function TrackingPage() {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.22_260/0.3),transparent_60%)]" />
          <div className="relative">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/15 text-primary shadow-[var(--shadow-glow)]"><Package className="h-7 w-7" /></div>
            <h1 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl">Track Your Order</h1>
            <p className="mt-2 text-sm text-muted-foreground">Enter your order number to see live delivery status.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (id.trim()) navigate({ to: "/order/$id", params: { id: id.trim() } }); }} className="mt-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={id} onChange={(e) => setId(e.target.value)} placeholder="HGS-ABC12345" className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-center font-mono text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
              </div>
              <Button variant="hero" size="lg" type="submit" className="mt-4 w-full">Track Order</Button>
            </form>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}