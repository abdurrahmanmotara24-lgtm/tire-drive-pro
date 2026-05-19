import { useColorMode } from "@/hooks/use-color-mode";
import rimModeIcon from "@/assets/rim-mode-icon.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function ThemeModeToggle({ className }: Props) {
  const { isDark, toggle } = useColorMode();

  const currentLabel = isDark ? "Dark mode" : "Light mode";
  const targetLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
            data-mode={isDark ? "dark" : "light"}
            className={cn(
              "rim-mode-toggle touch-target",
              isDark ? "rim-mode-toggle--dark" : "rim-mode-toggle--light",
              className,
            )}
            aria-label={`${currentLabel}. ${targetLabel}`}
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
            <span className="sr-only">{currentLabel}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8} className="max-w-[11rem] text-center">
          <p className="font-semibold leading-tight">{currentLabel}</p>
          <p className="mt-0.5 text-[10px] font-normal text-primary-foreground/85">{targetLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
