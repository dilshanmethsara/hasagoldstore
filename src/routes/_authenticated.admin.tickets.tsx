import { createFileRoute } from "@tanstack/react-router";
import { useAdminTickets } from "@/lib/hooks/db";
import { formatDate } from "@/lib/format";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  const { data: tickets, isLoading } = useAdminTickets();
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Support Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">{tickets?.length ?? 0} tickets in queue.</p>
      </div>

      <div className="space-y-3">
        {isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Loading tickets…</p>}
        {!isLoading && (tickets ?? []).length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No support tickets yet.</p>}
        {(tickets ?? []).map((t) => (
          <div key={t.id} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-xl">
            <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <LifeBuoy className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{t.subject ?? "Ticket"}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  t.status === "open" ? "bg-amber-500/20 text-amber-400"
                  : t.status === "pending" ? "bg-sky-500/20 text-sky-400"
                  : "bg-emerald-500/20 text-emerald-400"
                }`}>{t.status}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.category}</p>
              <p className="mt-2 text-[10px] text-muted-foreground">Opened {formatDate(t.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}