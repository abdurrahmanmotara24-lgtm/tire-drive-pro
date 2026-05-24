import { Link, useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Menu, Phone, X } from "lucide-react";
import logo from "@/assets/logo.png";
import logoWebp from "@/assets/logo.webp";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { OpenNowChip } from "@/components/open-now-chip";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About", exact: false },
  { to: "/locations", label: "Visit us", exact: false },
  { to: "/hours", label: "Hours", exact: false },
  { to: "/contact", label: "Contact", exact: false },
] as const;

const desktopNavLink =
  "site-header-nav-link hover-nav rounded-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground";
const desktopNavLinkActive =
  "site-header-nav-link hover-nav is-active rounded-sm font-semibold uppercase tracking-wider text-primary transition-colors";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const showHeaderLogo = !isHome || scrolled;
  const { telHref, hasPhone } = useContactContent();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = document.getElementById("site-header-menu");
    if (!panel) return;

    const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );

    const focusables = getFocusables();
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) closeMenu();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

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
  }, [menuOpen, showHeaderLogo]);

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const overHero = isHome && !scrolled;
  const showSolidBg = scrolled || menuOpen || !overHero;

  return (
    <header
      ref={headerRef}
      data-over-hero={overHero ? "true" : undefined}
      data-menu-open={menuOpen ? "true" : undefined}
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        showSolidBg
          ? cn(
              "border-b border-border bg-background/95 backdrop-blur-md",
              scrolled ? "shadow-md" : "shadow-sm",
            )
          : "border-b border-transparent max-lg:border-border/40 max-lg:bg-background/90 max-lg:backdrop-blur-md",
        overHero && "lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none",
      )}
    >
      <div
        className={cn(
          "site-header-bar container-tny grid w-full items-center gap-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] lg:gap-x-8 lg:py-3",
          showHeaderLogo
            ? "grid-cols-[1fr_auto] lg:min-h-[5.5rem] lg:grid-cols-[auto_1fr_auto] xl:min-h-[6rem]"
            : "min-h-[3.25rem] grid-cols-[1fr_auto] lg:min-h-16 lg:grid-cols-[1fr_auto]",
        )}
      >
        {showHeaderLogo ? (
          <div className="site-header-brand flex min-w-0 items-center justify-self-start">
            <Link to="/" className="hover-logo block leading-none" onClick={closeMenu}>
              <picture>
                <source srcSet={logoWebp} type="image/webp" />
                <img
                  src={logo}
                  alt="Tyres Near Me"
                  width={1024}
                  height={512}
                  className="site-header-logo-img h-10 w-auto max-w-[min(72vw,10rem)] sm:h-11 sm:max-w-[11rem] lg:h-12 lg:max-w-[12rem] xl:h-14 xl:max-w-[14rem]"
                />
              </picture>
            </Link>
          </div>
        ) : null}

        <nav
          className={cn(
            "site-header-nav hidden items-center justify-center gap-1 lg:flex lg:gap-0.5 xl:gap-1",
            showHeaderLogo ? "lg:col-start-2" : "lg:col-start-1 lg:justify-self-center",
          )}
          aria-label="Main"
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className={desktopNavLink}
              activeProps={{ className: desktopNavLinkActive }}
            >
              <span className="site-header-nav-link__label px-3 py-2 text-xs xl:px-4 xl:text-sm">
                {n.label}
              </span>
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "site-header-actions flex items-center justify-end gap-1.5 justify-self-end lg:gap-2",
            showHeaderLogo ? "lg:col-start-3" : "lg:col-start-2",
          )}
        >
          <OpenNowChip className="hidden lg:inline-flex lg:mr-1" />
          {hasPhone && telHref && (
            <>
              <a
                href={telHref}
                className="site-header-call-mobile site-header-action-btn touch-target hover-icon-bump lg:hidden"
                aria-label="Call us"
              >
                <Phone className="icon-bump h-4 w-4" />
              </a>
              <a
                href={telHref}
                className="site-header-call hover-btn-outline hover-icon-bump hidden items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider lg:inline-flex"
              >
                <Phone className="icon-bump h-3.5 w-3.5" /> Call
              </a>
            </>
          )}
          <ThemeModeToggle />
          <button
            type="button"
            className="site-header-menu-btn site-header-action-btn touch-target hover-icon-bump lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-header-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu
              className={cn(
                "site-header-menu-btn__icon icon-bump absolute h-5 w-5 transition-all duration-300",
                menuOpen ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
              )}
              aria-hidden={menuOpen}
            />
            <X
              className={cn(
                "site-header-menu-btn__icon icon-bump absolute h-5 w-5 transition-all duration-300",
                menuOpen ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0",
              )}
              aria-hidden={!menuOpen}
            />
          </button>
        </div>
      </div>

      <div
        id="site-header-menu"
        className={cn("site-header-menu lg:hidden", menuOpen && "site-header-menu--open")}
        aria-hidden={!menuOpen}
      >
        <nav className="site-header-menu__inner container-tny" aria-label="Mobile">
          <ul className="site-header-menu__list">
            {nav.map((n, i) => {
              const active = isActive(n.to, n.exact);
              return (
                <li
                  key={n.to}
                  className="site-header-menu__item"
                  style={{ "--menu-item-index": i } as CSSProperties}
                >
                  <Link
                    to={n.to}
                    onClick={closeMenu}
                    className={cn(
                      "site-header-menu__link",
                      active && "site-header-menu__link--active",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {hasPhone && telHref && (
            <a
              href={telHref}
              onClick={closeMenu}
              className="site-header-menu__call hover-btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Call now
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
