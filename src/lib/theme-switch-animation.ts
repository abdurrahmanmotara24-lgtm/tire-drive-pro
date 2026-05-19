export type ThemeSwitchOrigin = { x: number; y: number };
export type ThemeSwitchMode = "light" | "dark";

const DURATION_MS = 820;

const MODE_BG: Record<ThemeSwitchMode, string> = {
  light: "#f7f6f4",
  dark: "#0c0c0c",
};

export function setThemeSwitchOrigin(origin?: ThemeSwitchOrigin) {
  const root = document.documentElement;
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius =
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 64;

  root.style.setProperty("--theme-switch-x", `${x}px`);
  root.style.setProperty("--theme-switch-y", `${y}px`);
  root.style.setProperty("--theme-switch-radius", `${radius}px`);
  root.dataset.themeReveal = "active";
}

function clearThemeSwitchVars() {
  const root = document.documentElement;
  root.style.removeProperty("--theme-switch-x");
  root.style.removeProperty("--theme-switch-y");
  root.style.removeProperty("--theme-switch-radius");
  delete root.dataset.themeReveal;
}

function runCircleOverlayFallback(
  apply: () => void,
  previousMode: ThemeSwitchMode,
  onDone: () => void,
) {
  const overlay = document.createElement("div");
  overlay.className = "theme-switch-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.background = MODE_BG[previousMode];

  apply();
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add("theme-switch-overlay--reveal"));
  });

  const finish = () => {
    overlay.remove();
    onDone();
  };

  overlay.addEventListener("transitionend", (e) => {
    if (e.target === overlay && e.propertyName === "clip-path") finish();
  });

  window.setTimeout(finish, DURATION_MS + 120);
}

export function runThemeSwitchTransition(
  apply: () => void,
  options: {
    origin?: ThemeSwitchOrigin;
    previousMode: ThemeSwitchMode;
    onDone: () => void;
  },
) {
  setThemeSwitchOrigin(options.origin);

  const finish = () => {
    options.onDone();
    window.setTimeout(clearThemeSwitchVars, 80);
  };

  if (typeof document.startViewTransition === "function") {
    const transition = document.startViewTransition(() => {
      apply();
    });
    void transition.finished.then(finish).catch(finish);
    return;
  }

  runCircleOverlayFallback(apply, options.previousMode, finish);
}

export const THEME_SWITCH_DURATION_MS = DURATION_MS;
