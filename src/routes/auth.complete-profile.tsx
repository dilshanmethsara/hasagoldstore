import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, AtSign, MapPin, Gamepad2, ArrowRight, Upload } from "lucide-react";
import { AuthLayout, AuthInput } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/complete-profile")({
  head: () => ({ meta: [{ title: "Complete your profile — HASA GOLD STORE" }] }),
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  return (
    <AuthLayout title="Tell us about you." subtitle="Step 2 of 3 · Personalize your HASA experience.">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-white/10" />
      </div>

      <div className="glass-card mb-6 flex items-center gap-4 rounded-2xl p-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--gradient-primary)] font-display text-xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">SP</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Profile photo</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
        </div>
        <Button variant="outline" size="sm"><Upload className="h-4 w-4" /> Upload</Button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/auth/verify-phone" }); }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput label="First name" icon={User} placeholder="Saman" defaultValue="Saman" />
          <AuthInput label="Last name" icon={User} placeholder="Perera" defaultValue="Perera" />
        </div>
        <AuthInput label="Username" icon={AtSign} placeholder="saman_gg" hint="3-20 chars. Letters, numbers, underscore." />
        <AuthInput label="City" icon={MapPin} placeholder="Colombo" defaultValue="Colombo" />
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Favourite game</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Free Fire", "PUBG", "ML", "Blood Strike"].map((g, i) => (
              <label key={g} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${i === 0 ? "border-primary bg-primary/10 text-foreground" : "border-white/5 bg-white/5 text-muted-foreground hover:border-primary/40"}`}>
                <input type="radio" name="game" className="sr-only" defaultChecked={i === 0} />
                <Gamepad2 className="h-3.5 w-3.5" /> {g}
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </AuthLayout>
  );
}