import { supabase } from "@/lib/supabase-browser";
import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { INVENTORY_SLIDESHOW_PLACEHOLDERS } from "@/lib/inventory-slideshow-images";

/** Default focus — left-centre keeps logos visible (section text sits on the right). */
export const BRAND_SLIDESHOW_DEFAULT_FOCAL = { focal_x: 32, focal_y: 50 } as const;

export type BrandSlideshowSlide = {
  id: string;
  image_url: string;
  /** Storage object name in `site-media` bucket (for delete) */
  storage_path?: string;
  alt?: string;
  /** Crop anchor 0–100 (%). Adjust after upload so logos stay in frame. */
  focal_x?: number;
  focal_y?: number;
  active: boolean;
  sort_order: number;
};

export type BrandSlideshowPublicSlide = Pick<
  BrandSlideshowSlide,
  "image_url" | "focal_x" | "focal_y"
>;

export type BrandSlideshowSettings = {
  /** Autoplay interval in milliseconds */
  autoplay_ms: number;
  /** Overlay strength 0–100 (higher = darker) */
  overlay_opacity: number;
  zoom_enabled: boolean;
};

export type BrandSlideshowContent = {
  slides: BrandSlideshowSlide[];
  settings: BrandSlideshowSettings;
};

export type BrandSlideshowPublic = {
  slides: BrandSlideshowPublicSlide[];
  settings: BrandSlideshowSettings;
};

const LOCAL_STORAGE_KEY = "tny-brand-slideshow";

export const BRAND_SLIDESHOW_DEFAULT_SETTINGS: BrandSlideshowSettings = {
  autoplay_ms: 4500,
  overlay_opacity: 72,
  zoom_enabled: true,
};

function newSlideId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `slide-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createPlaceholderSlides(): BrandSlideshowSlide[] {
  return INVENTORY_SLIDESHOW_PLACEHOLDERS.map((url, index) => ({
    id: `placeholder-${index}`,
    image_url: url,
    active: true,
    sort_order: index,
    ...BRAND_SLIDESHOW_DEFAULT_FOCAL,
  }));
}

export const DEFAULT_BRAND_SLIDESHOW: BrandSlideshowContent = {
  slides: createPlaceholderSlides(),
  settings: { ...BRAND_SLIDESHOW_DEFAULT_SETTINGS },
};

export function resolveBrandSlideshow(
  stored: Partial<BrandSlideshowContent> | null | undefined,
): BrandSlideshowContent {
  const base = DEFAULT_BRAND_SLIDESHOW;
  const settings = {
    ...base.settings,
    ...(stored?.settings ?? {}),
  };
  settings.autoplay_ms = clamp(settings.autoplay_ms ?? base.settings.autoplay_ms, 3000, 9000);
  settings.overlay_opacity = clamp(settings.overlay_opacity ?? base.settings.overlay_opacity, 0, 100);
  settings.zoom_enabled = settings.zoom_enabled !== false;

  const rawSlides = Array.isArray(stored?.slides) ? stored.slides : base.slides;
  const slides = rawSlides
    .map((s, i) => normalizeSlide(s, i))
    .filter((s): s is BrandSlideshowSlide => s != null)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s, i) => ({ ...s, sort_order: i }));

  return {
    slides: slides.length > 0 ? slides : base.slides,
    settings,
  };
}

function normalizeSlide(raw: unknown, fallbackOrder: number): BrandSlideshowSlide | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<BrandSlideshowSlide>;
  const image_url = typeof s.image_url === "string" ? s.image_url.trim() : "";
  if (!image_url) return null;
  return {
    id: typeof s.id === "string" && s.id ? s.id : newSlideId(),
    image_url,
    storage_path: typeof s.storage_path === "string" ? s.storage_path : undefined,
    alt: typeof s.alt === "string" ? s.alt : "",
    active: s.active !== false,
    sort_order: typeof s.sort_order === "number" ? s.sort_order : fallbackOrder,
    focal_x: clampFocal(s.focal_x, BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x),
    focal_y: clampFocal(s.focal_y, BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y),
  };
}

function clampFocal(value: unknown, fallback: number) {
  const n = typeof value === "number" ? value : fallback;
  return clamp(n, 0, 100);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function selectActiveSlides(content: BrandSlideshowContent): BrandSlideshowPublicSlide[] {
  return [...content.slides]
    .filter((s) => s.active && s.image_url.trim())
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      image_url: s.image_url,
      focal_x: s.focal_x ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x,
      focal_y: s.focal_y ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y,
    }));
}

/** @deprecated Use selectActiveSlides */
export function selectActiveSlideUrls(content: BrandSlideshowContent): string[] {
  return selectActiveSlides(content).map((s) => s.image_url);
}

export function toPublicSlideshow(content: BrandSlideshowContent): BrandSlideshowPublic {
  const slides = selectActiveSlides(content);
  return {
    slides:
      slides.length > 0
        ? slides
        : INVENTORY_SLIDESHOW_PLACEHOLDERS.map((image_url) => ({
            image_url,
            ...BRAND_SLIDESHOW_DEFAULT_FOCAL,
          })),
    settings: content.settings,
  };
}

function readLocalBrandSlideshow(): BrandSlideshowContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return resolveBrandSlideshow(JSON.parse(raw) as BrandSlideshowContent);
  } catch {
    return null;
  }
}

function writeLocalBrandSlideshow(content: BrandSlideshowContent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
}

/** Public site: active slide URLs + settings */
export async function fetchBrandSlideshowPublic(): Promise<BrandSlideshowPublic> {
  const content = await fetchBrandSlideshowContent();
  return toPublicSlideshow(content);
}

/** Admin + persistence */
export async function fetchBrandSlideshowContent(): Promise<BrandSlideshowContent> {
  if (!isSupabasePublicEnvConfigured()) {
    return readLocalBrandSlideshow() ?? DEFAULT_BRAND_SLIDESHOW;
  }

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "brand_slideshow")
      .maybeSingle();

    if (error) {
      console.warn("[brand-slideshow] fetch:", error.message);
      return DEFAULT_BRAND_SLIDESHOW;
    }

    return resolveBrandSlideshow(data?.value as BrandSlideshowContent | null);
  } catch (e) {
    console.warn("[brand-slideshow] fetch:", e);
    return DEFAULT_BRAND_SLIDESHOW;
  }
}

export async function saveBrandSlideshowContent(content: BrandSlideshowContent): Promise<void> {
  const normalized = resolveBrandSlideshow(content);

  if (!isSupabasePublicEnvConfigured()) {
    writeLocalBrandSlideshow(normalized);
    return;
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "brand_slideshow", value: normalized as never }, { onConflict: "key" });

  if (error) throw error;
}

export function createEmptySlide(image_url: string, storage_path?: string): BrandSlideshowSlide {
  return {
    id: newSlideId(),
    image_url,
    storage_path,
    alt: "",
    active: true,
    sort_order: 0,
    ...BRAND_SLIDESHOW_DEFAULT_FOCAL,
  };
}

export function reorderSlides(
  slides: BrandSlideshowSlide[],
  fromIndex: number,
  toIndex: number,
): BrandSlideshowSlide[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return slides;
  const next = [...slides];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) return slides;
  next.splice(toIndex, 0, moved);
  return next.map((s, i) => ({ ...s, sort_order: i }));
}

export function storagePathFromUrl(url: string): string | null {
  if (!url || url.startsWith("data:")) return null;
  const marker = "/site-media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0] || null;
}
