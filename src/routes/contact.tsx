import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HASA GOLD STORE" },
      { name: "description", content: "Get in touch with HASA GOLD STORE Sri Lanka. 24/7 live chat, WhatsApp, email and phone support." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  { icon: MessageCircle, t: "WhatsApp", d: "Fastest response · Sinhala / Tamil / English", v: "+94 77 123 4567", action: "Chat now" },
  { icon: Mail, t: "Email", d: "Reply within 2 hours, 24/7", v: "hello@hasa.lk", action: "Send email" },
  { icon: Phone, t: "Call", d: "Mon–Sun, 8 AM – 11 PM IST", v: "+94 11 234 5678", action: "Call us" },
];

function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHeader
        eyebrow="Contact"
        title="We're here, 24/7."
        description="Real humans, real fast. Reach our Colombo support team however you like."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <div key={c.t} className="glass-card group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{c.t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
              <p className="mt-3 font-mono text-sm font-semibold text-foreground">{c.v}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">{c.action}</Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Send us a message</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">We typically reply within 1–2 hours.</p>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" placeholder="Saman Perera" />
              <Input label="Email" type="email" placeholder="you@hasa.lk" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone (optional)" placeholder="+94 77 123 4567" />
              <Select label="Topic" options={["General question", "Order issue", "Refund request", "Partnership", "Press"]} />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</span>
              <textarea rows={5} placeholder="Tell us how we can help…" className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
            </label>
            <Button variant="hero" size="lg" type="submit"><Send className="h-4 w-4" /> Send message</Button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="glass-card overflow-hidden rounded-3xl">
            <div className="relative h-44 bg-[linear-gradient(135deg,oklch(0.35_0.15_260),oklch(0.55_0.22_260))]">
              <div className="bg-grid absolute inset-0 opacity-30" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <MapPin className="h-3 w-3" /> Colombo HQ
              </div>
            </div>
            <div className="p-6">
              <p className="font-semibold text-foreground">HASA GOLD STORE Pvt Ltd</p>
              <p className="mt-1 text-sm text-muted-foreground">Level 18, World Trade Center<br />Echelon Square, Colombo 01<br />Sri Lanka 🇱🇰</p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Clock className="h-4 w-4 text-primary" /> Operating hours</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Live chat & WhatsApp</dt><dd className="font-medium text-emerald-400">24/7</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Phone support</dt><dd className="text-foreground">8 AM – 11 PM</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Office visits</dt><dd className="text-foreground">Mon–Fri, 9–5</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input {...rest} className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none" />
    </label>
  );
}
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-foreground focus:border-primary/40 focus:outline-none">
        {options.map((o) => <option key={o} className="bg-background">{o}</option>)}
      </select>
    </label>
  );
}