import { useEffect, type RefObject } from "react";

/** Writes an element's offsetHeight to a CSS custom property on :root. */
export function useSyncCssVar(ref: RefObject<HTMLElement | null>, cssVar: string, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const sync = () => {
      document.documentElement.style.setProperty(cssVar, `${el.offsetHeight}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [ref, cssVar, enabled]);
}
