import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeApplier } from "@/components/theme-applier";
import { MessageCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useContactContent } from "@/hooks/use-contact-content";
import { DEFAULTS } from "@/lib/site-content";
import { colorModeScript } from "@/components/color-mode-script";

import { useContentRealtime } from "@/hooks/use-content-realtime";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="hover-btn-primary mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="hover-btn-primary mt-6 rounded-sm bg-primary px-6 py-3 font-bold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: DEFAULTS.seo.title },
      { name: "description", content: DEFAULTS.seo.description },
      { property: "og:title", content: DEFAULTS.seo.title },
      { property: "og:description", content: DEFAULTS.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function WhatsAppFab() {
  const { waHref } = useContactContent();
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="hover-btn-primary hover-scale fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-glow md:flex"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

function RealtimeBridge() {
  useContentRealtime();
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isChrome = !location.pathname.startsWith("/admin") && location.pathname !== "/login";
  const isHome = location.pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeBridge />
      <ThemeApplier />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen flex-col">
        {isChrome && <SiteHeader />}
        <main
          id="main"
          className={cn(
            "flex-1",
            isChrome && !isHome && "has-mobile-top-nav",
          )}
          tabIndex={-1}
        >
          <Outlet />
        </main>
        {isChrome && <SiteFooter />}
        
        {isChrome && <WhatsAppFab />}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
