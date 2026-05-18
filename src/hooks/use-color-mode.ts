import { useEffect, useState } from "react";

export type ColorMode = "light" | "dark";

const STORAGE_KEY = "tny-color-mode";
const THEME_TRANSITION_MS = 650;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getStoredColorMode(): ColorMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyColorMode(mode: ColorMode, options?: { animate?: boolean }) {
  const root = document.documentElement;
  const shouldAnimate = options?.animate !== false && !prefersReducedMotion();

  const apply = () => {
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.style.colorScheme = mode;
  };

  const endTransition = () => {
    window.setTimeout(() => root.classList.remove("theme-transition"), THEME_TRANSITION_MS);
  };

  if (!shouldAnimate || typeof document === "undefined") {
    apply();
    return;
  }

  root.classList.add("theme-transition");

  if (typeof document.startViewTransition === "function") {
    const transition = document.startViewTransition(() => {
      apply();
    });
    void transition.finished.then(endTransition).catch(endTransition);
    return;
  }

  apply();
  endTransition();
}

export function useColorMode() {
  const [mode, setModeState] = useState<ColorMode>("dark");

  useEffect(() => {
    const initial = getStoredColorMode();
    applyColorMode(initial, { animate: false });
    setModeState(initial);
  }, []);

  const setMode = (next: ColorMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    applyColorMode(next, { animate: true });
    setModeState(next);
  };

  const toggle = () => setMode(mode === "dark" ? "light" : "dark");

  return { mode, setMode, toggle };
}
