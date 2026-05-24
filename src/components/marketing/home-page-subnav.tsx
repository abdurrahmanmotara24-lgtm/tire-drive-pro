import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { SectionsContent } from "@/lib/site-content";
import { useSyncCssVar } from "@/hooks/use-sync-css-var";
import { cn } from "@/lib/utils";

const LINKS: { key: keyof SectionsContent; hash: string; label: string }[] = [
  { key: "why_us_enabled", hash: "services", label: "Services" },
  { key: "brands_enabled", hash: "brands", label: "Brands" },
  { key: "process_enabled", hash: "process", label: "Process" },
  { key: "testimonials_enabled", hash: "testimonials", label: "Reviews" },
  { key: "quote_enabled", hash: "quote", label: "Quote" },
];

export function HomePageSubnav({ sections }: { sections: SectionsContent }) {
  const navRef = useRef<HTMLElement>(null);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const items = LINKS.filter((l) => sections[l.key]);
  const itemHashes = items.map((i) => i.hash).join(",");

  useSyncCssVar(navRef, "--home-subnav-height", items.length >= 2);

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
      <div className="container-tny flex gap-1.5 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    </nav>
  );
}
