import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Homepage “Premium brands in stock” band */
const SCROLL_ANCHOR_ID = "inventory-band";

function updateVisibility(anchor: HTMLElement, setVisible: (v: boolean) => void) {
  const { top, bottom } = anchor.getBoundingClientRect();
  const vh = window.innerHeight;
  // Show when the band enters the viewport, stay visible after scrolling past
  const inView = top < vh && bottom > 0;
  const past = top < 0;
  setVisible(inView || past);
}

export function ScrollToTopButton({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let pollId: ReturnType<typeof setInterval> | undefined;

    const attach = () => {
      const anchor = document.getElementById(SCROLL_ANCHOR_ID);
      if (!anchor) return false;

      observer?.disconnect();
      observer = new IntersectionObserver(
        () => updateVisibility(anchor, setVisible),
        { threshold: [0, 0.01, 0.05, 0.1, 0.25] },
      );
      observer.observe(anchor);
      updateVisibility(anchor, setVisible);
      return true;
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);

      const anchor = document.getElementById(SCROLL_ANCHOR_ID);
      if (anchor) updateVisibility(anchor, setVisible);
    };

    if (!attach()) {
      pollId = window.setInterval(() => {
        if (attach()) window.clearInterval(pollId);
      }, 150);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      if (pollId) window.clearInterval(pollId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`Back to top, ${progress}% down the page`}
      className={cn(
        "scroll-to-top touch-target fixed z-40 flex flex-col items-center justify-center gap-0.5 rounded-sm border border-border bg-background/95 text-foreground shadow-md backdrop-blur-md transition-[opacity,transform] duration-300 hover:border-primary/40 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        className,
      )}
    >
      <ArrowUp className="h-4 w-4 shrink-0" aria-hidden />
      <span className="scroll-to-top__pct text-[9px] font-bold tabular-nums leading-none opacity-80">
        {progress}%
      </span>
    </button>
  );
}
