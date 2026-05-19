import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.documentElement.classList.add("js");

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    // If element is already within (or close to) the viewport on mount, reveal immediately.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh + 200 && rect.bottom > -200) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 10% 0px" },
    );
    io.observe(el);

    // Safety net — never let content stay hidden.
    const fallback = window.setTimeout(() => setVisible(true), 900);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return { ref, visible, className: visible ? "reveal is-visible" : "reveal" };
}
