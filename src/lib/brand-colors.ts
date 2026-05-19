import type { ThemeContent } from "@/lib/site-content";

export const BRAND_RED = "oklch(0.54 0.21 27)";
export const BRAND_RED_LIGHT = "oklch(0.48 0.2 27)";

export type BrandPalette = {
  primary: string;
  brandRedAccent: string;
};

export function oklchHue(color: string): number | null {
  const match = color.trim().match(/oklch\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  const hue = parseFloat(parts[parts.length - 1] ?? "");
  return Number.isFinite(hue) ? hue : null;
}

export function isGreenHue(color: string): boolean {
  const h = oklchHue(color);
  if (h == null) return false;
  return h >= 85 && h <= 165;
}

/** Map stored greens (legacy CMS) to brand red. */
export function coerceToBrandRed(color: string | undefined, fallback: string): string {
  if (!color?.trim()) return fallback;
  if (isGreenHue(color)) return fallback;
  return color;
}

export function resolveBrandPalette(
  theme: Pick<
    ThemeContent,
    "primary" | "primary_light" | "primary_dark" | "brand_green" | "brand_red_accent"
  >,
  mode: "light" | "dark",
): BrandPalette {
  const fallback = mode === "light" ? BRAND_RED_LIGHT : BRAND_RED;
  const modePrimary =
    mode === "light"
      ? (theme.primary_light ?? theme.primary)
      : (theme.primary_dark ?? theme.primary);
  const primary = coerceToBrandRed(modePrimary, fallback);
  const brandRedAccent = coerceToBrandRed(
    theme.brand_red_accent ?? theme.brand_green ?? modePrimary,
    primary,
  );
  return { primary, brandRedAccent };
}
