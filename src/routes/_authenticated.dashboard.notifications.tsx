import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Sparkles, Receipt, Wallet, MessageCircle } from "lucide-react";
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/lib/hooks/db";
import { timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — HASA GOLD STORE" }] }),
  component: NotificationsPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  order: Receipt, wallet: Wallet, promo: Sparkles, ticket: MessageCircle,
};

function NotificationsPage() {
  const { data: items = [], isLoading } = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const mark = useMarkNotificationRead();
  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">{unread > 0 ? `${unread} unread` : "You're all caught up"}</p>
        </div>
        {unread > 0 && <Button variant="outline" size="sm" onClick={() => markAll.mutate()}><CheckCheck className="h-4 w-4" /> Mark all read</Button>}
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5"><Bell className="h-6 w-6 text-muted-foreground" /></div>
          <p className="mt-4 font-display font-semibold text-foreground">No notifications</p>
          <p className="mt-1 text-sm text-muted-foreground">We'll let you know when something happens.</p>
        </div>
      ) : (
        <ul className="glass-card divide-y divide-white/5 rounded-3xl">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <li key={n.id} onClick={() => !n.is_read && mark.mutate(n.id)} className={`flex cursor-pointer gap-3 p-4 transition-colors hover:bg-white/5 ${!n.is_read ? "bg-primary/5" : ""}`}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                  {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}