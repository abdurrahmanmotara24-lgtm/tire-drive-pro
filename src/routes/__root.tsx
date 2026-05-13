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
import { MessageCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 font-bold text-brand-red-foreground">Go home</Link>
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
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tires Near You — Premium Tires & Expert Fitment Centre" },
      { name: "description", content: "Quality tires, professional fitment, wheel alignment and balancing. Top brands at unbeatable prices. Visit your local Tires Near You today." },
      { property: "og:title", content: "Tires Near You — Premium Tires & Fitment Centre" },
      { property: "og:description", content: "Quality tires, professional fitment, alignment & balancing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isChrome = !location.pathname.startsWith("/admin") && location.pathname !== "/login";
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        {isChrome && <SiteHeader />}
        <main className="flex-1">
          <Outlet />
        </main>
        {isChrome && <SiteFooter />}
        {isChrome && (
          <a
            href="https://wa.me/10000000000"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform hover:scale-110"
          >
            <MessageCircle className="h-7 w-7" />
          </a>
        )}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
