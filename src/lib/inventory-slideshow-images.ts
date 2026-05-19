/** Premium automotive / tyre showroom placeholders (replace via CMS hero image + admin later). */
export const INVENTORY_SLIDESHOW_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1619642756304-60b1c554d300?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1486262715619-67b85e443398?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1625047509168-a7026f36de42?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1487754183691-f7c992f9c329?auto=format&fit=crop&w=1920&q=80",
] as const;

export function buildInventorySlideshowSlides(cmsImage?: string): string[] {
  const primary = cmsImage?.trim();
  if (!primary) return [...INVENTORY_SLIDESHOW_PLACEHOLDERS];
  const rest = INVENTORY_SLIDESHOW_PLACEHOLDERS.filter((url) => url !== primary);
  return [primary, ...rest];
}
