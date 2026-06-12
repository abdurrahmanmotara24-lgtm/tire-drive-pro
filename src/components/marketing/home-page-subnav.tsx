import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { SectionsContent } from "@/lib/site-content";
import { useSyncCssVar } from "@/hooks/use-sync-css-var";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { cn } from "@/lib/utils";

const LINKS: { key: keyof SectionsContent; hash: string; label: string }[] = [
  { key: "brands_enabled", hash: "brands", label: "Brands" },
  { key: "why_us_enabled", hash: "services", label: "Services" },
  { key: "specials_enabled", hash: "specials", label: "Specials" },
  { key: "process_enabled", hash: "process", label: "Process" },
  { key: "testimonials_enabled", hash: "testimonials", label: "Reviews" },
  { key: "quote_enabled", hash: "quote", label: "Quote" },
];

export function HomePageSubnav({ sections }: { sections: SectionsContent }) {
  const navRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const items = LINKS.filter((l) => sections[l.key]);
  const itemHashes = items.map((i) => i.hash).join(",");

  const updateScrollHint = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    setCanScrollRight(overflow > 8 && el.scrollLeft < overflow - 8);
  }, []);

  useSyncCssVar(navRef, "--home-subnav-height", items.length >= 2);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length < 2) return;

    updateScrollHint();
    el.addEventListener("scroll", updateScrollHint, { passive: true });
    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollHint);
      observer.disconnect();
    };
  }, [itemHashes, items.length, updateScrollHint]);

  useEffect(() => {
    if (items.length < 2) return;

    const ids = itemHashes.split(",").filter(Boolean);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.id;
        if (top) setActiveHash(top);
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.15, 0.35, 0.55],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [itemHashes, items.length]);

  if (items.length < 2) return null;

  return (
    <nav
      ref={navRef}
      className="home-subnav sticky top-[var(--site-header-height,4rem)] z-30 border-b border-border bg-background/92 backdrop-blur-md"
      aria-label="On this page"
    >
      <div className="container-tny relative">
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className={cn(
                "home-subnav__link touch-target flex min-h-11 shrink-0 items-center rounded-sm px-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
                activeHash === item.hash
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-current={activeHash === item.hash ? "true" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {canScrollRight ? (
          <div
            className="home-subnav__scroll-hint pointer-events-none absolute inset-y-0 right-0 z-10 flex w-14 items-center justify-end pr-1 md:hidden"
            aria-hidden
          >
            <span className="home-subnav__scroll-fade absolute inset-y-0 right-0 w-14" />
            <ChevronRight
              className={cn(
                "relative h-4 w-4 text-primary",
                !reducedMotion && "home-subnav__scroll-chevron",
              )}
              strokeWidth={2.5}
            />
          </div>
        ) : null}
      </div>
    </nav>
  );
}
