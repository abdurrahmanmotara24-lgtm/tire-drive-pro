import { useColorMode } from "@/hooks/use-color-mode";
import rimModeIcon from "@/assets/rim-mode-icon.png";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function ThemeModeToggle({ className }: Props) {
  const { mode, toggle } = useColorMode();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      data-mode={mode}
      className={cn(
        "rim-mode-toggle touch-target",
        isDark ? "rim-mode-toggle--dark" : "rim-mode-toggle--light",
        className,
      )}
      aria-label={isDark ? "Switch to showroom light mode" : "Switch to graphite dark mode"}
      aria-pressed={isDark}
    >
      <span className="rim-mode-toggle__well" aria-hidden>
        <img
          src={rimModeIcon}
          alt=""
          className="rim-mode-toggle__wheel"
          width={28}
          height={28}
          draggable={false}
        />
      </span>
    </button>
  );
}
