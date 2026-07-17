import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { MaintenanceGate } from "@/components/system/MaintenanceGate";
import { AccountStatusGate } from "@/components/system/AccountStatusGate";
import { THEME_INIT_SCRIPT } from "@/lib/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HASA GOLD STORE — Fast, Secure, Instant Game Top-Ups" },
      { name: "description", content: "Top up Free Fire, PUBG Mobile, Mobile Legends and Blood Strike instantly. Best prices, secure payments, 24/7 support." },
      { name: "author", content: "HASA GOLD STORE" },
      { name: "theme-color", content: "#0b1224" },
      { property: "og:title", content: "HASA GOLD STORE — Fast, Secure, Instant Game Top-Ups" },
      { property: "og:description", content: "Top up Free Fire, PUBG Mobile, Mobile Legends and Blood Strike instantly. Best prices, secure payments, 24/7 support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "HASA GOLD STORE — Fast, Secure, Instant Game Top-Ups" },
      { name: "twitter:description", content: "Top up Free Fire, PUBG Mobile, Mobile Legends and Blood Strike instantly. Best prices, secure payments, 24/7 support." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/297f9b8f-ffe2-4cab-bcd1-1c4dd218309d/id-preview-2de1efc3--cdbb07b0-3858-47c1-9358-09822cab0342.lovable.app-1781526258991.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/297f9b8f-ffe2-4cab-bcd1-1c4dd218309d/id-preview-2de1efc3--cdbb07b0-3858-47c1-9358-09822cab0342.lovable.app-1781526258991.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/jpeg", href: "/hasa-logo.jpg" },
      { rel: "shortcut icon", type: "image/jpeg", href: "/hasa-logo.jpg" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <MaintenanceGate>
          <AccountStatusGate>
            <Outlet />
          </AccountStatusGate>
        </MaintenanceGate>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
