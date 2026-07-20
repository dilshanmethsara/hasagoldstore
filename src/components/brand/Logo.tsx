import { cn } from "@/lib/utils";
import logoImg from "@/assets/hasa-logo.jpg";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-primary/30 shadow-[0_0_20px_-4px_var(--primary)]">
        <img src={logoImg} alt="HASA GOLD STORE" className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-primary/10 blur-xl" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold tracking-wider text-foreground">HASA GOLD</span>
          <span className="font-display text-[10px] font-medium tracking-[0.25em] text-muted-foreground">STORE</span>
        </div>
      )}
    </div>
  );
}
