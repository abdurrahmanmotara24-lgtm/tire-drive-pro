/** Normalize #rgb / #rrggbb to lowercase #rrggbb. */
export function normalizeHex(hex: string): string | null {
  const t = hex.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(t);
  if (short) {
    const [, s] = short;
    return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`.toLowerCase();
  }
  const long = /^#([0-9a-f]{6})$/i.exec(t);
  if (long) return `#${long[1].toLowerCase()}`;
  return null;
}

export function isCssColorString(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (normalizeHex(v)) return true;
  return /^(oklch|oklab|lab|lch|hsl|hwb|rgb|color)\(/i.test(v);
}

/** Best-effort: any CSS color → #rrggbb (for native color input). */
export function cssColorToHex(color: string, fallback = "#c41e1e"): string {
  const direct = normalizeHex(color);
  if (direct) return direct;
  if (typeof document === "undefined") return fallback;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = color.trim();
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  } catch {
    return fallback;
  }
}
