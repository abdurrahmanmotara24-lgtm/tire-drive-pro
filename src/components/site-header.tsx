import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { MobileIconNav } from "@/components/mobile-icon-nav";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/locations", label: "Locations" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { telHref, hasPhone } = useContactContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${el.offsetHeight}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      data-over-hero={scrolled ? undefined : "true"}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "max-md:border-b max-md:border-border max-md:bg-background/95 max-md:backdrop-blur-md",
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-md" : "md:bg-transparent",
      )}
    >
      <div className="container-tny grid w-full min-h-[4.5rem] grid-cols-[auto_1fr] items-center gap-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] max-[380px]:gap-2 md:min-h-[7.875rem] md:grid-cols-[auto_1fr_auto] md:gap-x-6 md:py-3 lg:min-h-[8.625rem] lg:gap-x-10">
        <Link
          to="/"
          className="hover-logo col-start-1 flex min-w-0 items-center justify-self-start"
        >
          <img
            src={logo}
            alt="Tires Near You"
            width={360}
            height={108}
            className="h-20 w-auto sm:h-[5.25rem] md:h-24 lg:h-[6.75rem]"
          />
        </Link>

        <div className="site-header-mobile-actions col-start-2 flex items-center justify-end gap-1.5 justify-self-end max-[380px]:gap-1 md:hidden">
          <MobileIconNav />
          <ThemeModeToggle />
        </div>

        <nav
          className="site-header-nav col-start-2 hidden w-full items-center justify-center gap-6 md:flex md:justify-self-center lg:gap-14"
          aria-label="Main"
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{
                className:
                  "site-header-nav-link hover-nav is-active rounded-sm px-2 py-2 text-xs font-semibold uppercase tracking-wider text-primary md:px-4 lg:text-sm",
              }}
              activeOptions={{ exact: n.to === "/" }}
              className="site-header-nav-link hover-nav rounded-sm px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-4 lg:text-sm"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-desktop-actions col-start-3 hidden items-center justify-self-end gap-1 md:flex md:gap-3">
          <ThemeModeToggle />
          {hasPhone && telHref && (
            <a
              href={telHref}
              className="site-header-call hover-btn-outline hover-icon-bump hidden items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider md:inline-flex"
            >
              <Phone className="icon-bump h-3.5 w-3.5" /> Call
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
