import { createFileRoute } from "@tanstack/react-router";
import { useAdminUsers, useSetUserStatus, useUserOrders, useDeleteUser, type AccountStatus } from "@/lib/hooks/db";
import { formatDate, lkr } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Search, User as UserIcon, Ban, ShieldOff, ShieldCheck, Trash2, X, Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

const STATUS_META: Record<AccountStatus, { color: string; label: string }> = {
  active: { color: "bg-emerald-500/20 text-emerald-400", label: "Active" },
  pending: { color: "bg-amber-500/20 text-amber-400", label: "Pending" },
  suspended: { color: "bg-amber-500/20 text-amber-400", label: "Suspended" },
  banned: { color: "bg-red-500/20 text-red-400", label: "Banned" },
};

type AdminUser = ReturnType<typeof useAdminUsers>["data"] extends (infer T)[] | undefined ? T : never;

function UsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const filtered = (users ?? []).filter((u) =>
    !q || (u.display_name ?? "").toLowerCase().includes(q.toLowerCase()) || (u.phone ?? "").includes(q),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">{users?.length ?? 0} registered accounts.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone"
          className="h-11 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">Loading users…</p>}
        {!isLoading && filtered.length === 0 && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No users found.</p>}
        {filtered.map((u) => {
          const status = (u.status ?? "active") as AccountStatus;
          const meta = STATUS_META[status];
          return (
            <button
              key={u.id}
              onClick={() => setSelected(u)}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left backdrop-blur-xl transition hover:border-primary/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/30" />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 text-sm font-bold text-primary-foreground">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{u.display_name ?? "Unnamed"}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.phone ?? "no phone"}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${meta?.color ?? "bg-white/5 text-muted-foreground"}`}>{meta?.label ?? status}</span>
                {u.roles.map((r) => (
                  <span key={r} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${r === "ADMIN" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>{r}</span>
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground">Joined {formatDate(u.created_at)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && <UserDetailDialog user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function UserDetailDialog({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const setStatus = useSetUserStatus();
  const { data: orders } = useUserOrders(user.id);
  const status = (user.status ?? "active") as AccountStatus;
  const isAdmin = user.roles.includes("ADMIN");
  const deleteUser = useDeleteUser();
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Permanently delete ${user.display_name ?? "this user"}? This removes their account and all data.`)) return;
    setDeleting(true);
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin"] });
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  const totalSpent = (orders ?? []).filter((o) => o.status !== "failed" && o.status !== "refunded" && o.status !== "cancelled").reduce((s, o) => s + Number(o.total_lkr), 0);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-3xl border border-white/10 bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30" />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 text-primary-foreground">
                <UserIcon className="h-6 w-6" />
              </div>
            )}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{user.display_name ?? "Unnamed user"}</h2>
              <p className="text-xs text-muted-foreground">{user.phone ?? "no phone"} · {user.country ?? "—"}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_META[status].color}`}>{STATUS_META[status].label}</span>
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>

        {user.status_reason && (
          <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">Reason: {user.status_reason}</p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Orders" value={String((orders ?? []).length)} />
          <Stat label="Lifetime spend" value={lkr(totalSpent)} />
          <Stat label="Joined" value={formatDate(user.created_at)} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Moderation</p>
          <div className="flex flex-wrap gap-2">
            <ActionBtn disabled={isAdmin || status === "active" || setStatus.isPending} onClick={() => setStatus.mutate({ userId: user.id, status: "active", reason: "Reinstated by admin" })} color="emerald" icon={ShieldCheck}>Reinstate</ActionBtn>
            <ActionBtn disabled={isAdmin || status === "suspended" || setStatus.isPending} onClick={() => { const r = prompt("Reason for suspension?") ?? undefined; setStatus.mutate({ userId: user.id, status: "suspended", reason: r }); }} color="amber" icon={ShieldOff}>Suspend</ActionBtn>
            <ActionBtn disabled={isAdmin || status === "banned" || setStatus.isPending} onClick={() => { const r = prompt("Reason for ban?") ?? undefined; setStatus.mutate({ userId: user.id, status: "banned", reason: r }); }} color="red" icon={Ban}>Ban</ActionBtn>
            <ActionBtn disabled={isAdmin || deleting} onClick={handleDelete} color="red" icon={Trash2}>Delete account</ActionBtn>
          </div>
          {isAdmin && <p className="mt-2 text-[11px] text-muted-foreground">Admin accounts cannot be moderated from this panel.</p>}
        </div>

        <div className="mt-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Package className="h-3.5 w-3.5" /> Recent orders</p>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-white/5 bg-white/[0.02]">
            {(orders ?? []).length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">No orders yet.</p>
            ) : (
              <ul className="divide-y divide-white/5 text-xs">
                {(orders ?? []).slice(0, 20).map((o) => (
                  <li key={o.id} className="flex items-center justify-between px-4 py-2">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-foreground">#{o.order_number}</p>
                      <p className="truncate text-muted-foreground">{o.game_name} · {o.package_label}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{lkr(Number(o.total_lkr))}</p>
                      <p className="capitalize text-muted-foreground">{o.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function ActionBtn({ children, onClick, disabled, color, icon: Icon }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; color: "emerald" | "amber" | "red"; icon: typeof Ban }) {
  const colors = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
    red: "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  }[color];
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${colors}`}>
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}