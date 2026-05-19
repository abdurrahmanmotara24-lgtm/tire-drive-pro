import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  runThemeSwitchTransition,
  THEME_SWITCH_DURATION_MS,
  type ThemeSwitchOrigin,
} from "@/lib/theme-switch-animation";

export type ColorModePreference = "light" | "dark" | "system";
export type ResolvedColorMode = "light" | "dark";

const STORAGE_KEY = "tny-color-mode";

const THEME_COLORS: Record<ResolvedColorMode, string> = {
  light: "#f7f6f4",
  dark: "#0c0c0c",
};

const COLOR_MODE_EVENT = "tny-color-mode-change";

function subscribeColorMode(onStoreChange: () => void) {
  window.addEventListener(COLOR_MODE_EVENT, onStoreChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener(COLOR_MODE_EVENT, onStoreChange);
    mq.removeEventListener("change", onStoreChange);
  };
}

function getResolvedSnapshot(): ResolvedColorMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function notifyColorModeChange() {
  window.dispatchEvent(new Event(COLOR_MODE_EVENT));
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSystemMode(): ResolvedColorMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveColorMode(preference: ColorModePreference): ResolvedColorMode {
  if (preference === "system") return getSystemMode();
  return preference;
}

export function getStoredPreference(): ColorModePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function applyColorMode(
  mode: ResolvedColorMode,
  options?: { animate?: boolean; origin?: ThemeSwitchOrigin },
) {
  const root = document.documentElement;
  const previousMode = getResolvedSnapshot();
  const shouldAnimate = options?.animate !== false && !prefersReducedMotion() && previousMode !== mode;

  const apply = () => {
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.style.colorScheme = mode;
    root.dataset.colorMode = mode;
    updateThemeColorMeta(mode);
    notifyColorModeChange();
  };

  const endTransition = () => {
    window.setTimeout(() => root.classList.remove("theme-transition"), THEME_SWITCH_DURATION_MS);
  };

  if (!shouldAnimate || typeof document === "undefined") {
    apply();
    return;
  }

  root.classList.add("theme-transition");

  runThemeSwitchTransition(apply, {
    origin: options?.origin,
    previousMode,
    onDone: endTransition,
  });
}

export function updateThemeColorMeta(mode: ResolvedColorMode) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", THEME_COLORS[mode]);
}

export function useColorMode() {
  const resolved = useSyncExternalStore(subscribeColorMode, getResolvedSnapshot, () => "dark" as ResolvedColorMode);

  const preference = useSyncExternalStore(
    subscribeColorMode,
    () => getStoredPreference(),
    () => "system" as ColorModePreference,
  );

  useEffect(() => {
    const pref = getStoredPreference();
    const initial = resolveColorMode(pref);
    if (!document.documentElement.classList.contains("light") && !document.documentElement.classList.contains("dark")) {
      applyColorMode(initial, { animate: false });
    }
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = mq.matches ? "dark" : "light";
      if (getResolvedSnapshot() !== next) applyColorMode(next, { animate: true });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next: ColorModePreference, origin?: ThemeSwitchOrigin) => {
    localStorage.setItem(STORAGE_KEY, next);
    const resolvedNext = resolveColorMode(next);
    applyColorMode(resolvedNext, { animate: true, origin });
  }, []);

  const cyclePreference = useCallback((origin?: ThemeSwitchOrigin) => {
    const next: ColorModePreference = getResolvedSnapshot() === "dark" ? "light" : "dark";
    setPreference(next, origin);
  }, [setPreference]);

  return {
    preference,
    mode: resolved,
    resolved,
    setPreference,
    setMode: (m: ResolvedColorMode, origin?: ThemeSwitchOrigin) => setPreference(m, origin),
    toggle: cyclePreference,
    isDark: resolved === "dark",
  };
}
