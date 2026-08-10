import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { defaultSettings } from "@/lib/settings";

function NotFoundComponent() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-bold">This page could not be found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page may have moved, or the property listing is no longer available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/properties">Browse properties</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">This page didn't load</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Something went wrong on our end. Try again, or head back to the property search.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Go home</a>
        </Button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: defaultSettings.defaultSeoTitle },
      { name: "description", content: defaultSettings.defaultSeoDescription },
      { property: "og:site_name", content: "Property Masters" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Property Masters",
          description: defaultSettings.defaultSeoDescription,
          areaServed: "Kenya",
        }),
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
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col">
            {!isAdmin && <Header />}
            <main className="flex-1">
              <Outlet />
            </main>
            {!isAdmin && <Footer />}
          </div>
          <Toaster />
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
