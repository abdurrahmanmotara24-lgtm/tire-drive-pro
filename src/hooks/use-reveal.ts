import { useLayoutEffect, useRef, useState } from "react";

function isEmbeddedPreview() {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin iframe — treat as embedded preview
    return true;
  }
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => setVisible(true);

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      isEmbeddedPreview()
    ) {
      show();
      return;
    }

    document.documentElement.classList.add("js");

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Generous margin so sections below a full-viewport hero still reveal in editor previews
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
