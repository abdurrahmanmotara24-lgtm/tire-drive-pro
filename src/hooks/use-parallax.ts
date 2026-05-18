import { useEffect, useState } from "react";

/** Subtle translate based on scroll position for hero depth (desktop only). */
export function useParallax(factor = 0.35) {
  const [offset, setOffset] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      return;
    }
    const onScroll = () => setOffset(window.scrollY * factor);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor, enabled]);

  return offset;
}
