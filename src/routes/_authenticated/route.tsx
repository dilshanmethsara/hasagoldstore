import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated")({
  // Session lives in an HTTP-only cookie the server cannot read during SSR;
  // we gate client-side from the AuthContext instead.
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { status } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirect =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/dashboard";
      navigate({
        to: "/auth/login",
        search: { redirect } as never,
        replace: true,
      });
    }
  }, [status, navigate]);

  if (status !== "authenticated") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading session…
        </div>
      </div>
    );
  }

  return <Outlet />;
}