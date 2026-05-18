import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { resolveBrandPalette } from "@/lib/brand-colors";
import { DEFAULTS, fetchContent, resolveTheme } from "@/lib/site-content";
import { useColorMode } from "@/hooks/use-color-mode";

const FONT_STACKS: Record<string, string> = {
  Inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  "Source Sans 3": '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  system: 'ui-sans-serif, system-ui, sans-serif',
};

export function ThemeApplier() {
  const { mode } = useColorMode();
  const { data: raw } = useQuery({
    queryKey: ["content", "theme"],
    queryFn: () => fetchContent("theme"),
    placeholderData: DEFAULTS.theme,
  });
  const theme = resolveTheme(raw);

  useEffect(() => {
    const root = document.documentElement;
    const palette = resolveBrandPalette(theme, mode);

    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--brand-red-accent", palette.brandRedAccent);
    root.style.setProperty("--primary-glow", palette.primary);
    root.style.setProperty("--chrome", theme.brand_red);
    root.style.setProperty("--destructive", palette.primary);
    root.style.setProperty("--ring", palette.primary);
    root.style.setProperty(
      "--gradient-accent",
      `linear-gradient(135deg, ${palette.primary} 0%, color-mix(in oklch, ${palette.primary} 80%, black) 100%)`,
    );
    root.style.setProperty(
      "--gradient-chrome",
      `linear-gradient(90deg, ${palette.primary}, color-mix(in oklch, ${palette.primary} 70%, white), ${palette.primary})`,
    );
    root.style.setProperty(
      "--shadow-glow",
      `0 0 44px -8px color-mix(in oklch, ${palette.primary} 50%, transparent)`,
    );
    if (theme.radius) root.style.setProperty("--radius", theme.radius);
    document.body.style.fontFamily = FONT_STACKS[theme.font] ?? FONT_STACKS["Source Sans 3"];
  }, [theme, mode]);

  return null;
}
