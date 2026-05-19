import { useLayoutEffect, useRef, useState } from "react";

function isEmbeddedPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function initialRevealVisible(): boolean {
  if (typeof window === "undefined") return true;
  if (document.documentElement.classList.contains("is-embedded-preview")) return true;
  return isEmbeddedPreview();
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(initialRevealVisible);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => setVisible(true);

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("is-embedded-preview") ||
      isEmbeddedPreview()
    ) {
      show();
      return;
    }

    document.documentElement.classList.add("js");

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh + 400 && rect.bottom > -400) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 25% 0px" },
    );
    io.observe(el);

    const fallback = window.setTimeout(show, 400);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return { ref, visible, className: visible ? "reveal is-visible" : "reveal" };
}
