import { supabase } from "@/integrations/supabase/client";
import { isSupabasePublicEnvConfigured, readSupabasePublicEnv } from "@/lib/env";
import {
  DEFAULT_HOURS_SCHEDULE,
  formatHoursSummary,
  normalizeHoursSchedule,
  type HoursSchedule,
} from "@/lib/hours-schedule";

export type HeroContent = {
  badge: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  background_image: string;
  /** Optional hero photo tuned for light mode; falls back to background_image */
  background_image_light?: string;
  overlay_opacity: number;
  focal_x?: number;
  focal_y?: number;
  stats: { value: string; label: string }[];
};

export type ContactContent = {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  hours: string;
  hours_schedule?: HoursSchedule;
  lead_notify_email?: string;
  facebook: string;
  instagram: string;
  twitter: string;
};

export type SectionsContent = {
  brands_enabled: boolean;
  why_us_enabled: boolean;
  process_enabled: boolean;
  testimonials_enabled: boolean;
  quote_enabled: boolean;
  final_cta_enabled: boolean;
};

/** Coerce CMS / JSON values to booleans (handles "false", 0, null, etc.). */
export function toBool(value: unknown, fallback: boolean): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value === null) return false;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "1" || v === "yes" || v === "on") return true;
    if (v === "false" || v === "0" || v === "no" || v === "off" || v === "") return false;
  }
  return fallback;
}

export function resolveSections(stored: Partial<SectionsContent> | null | undefined): SectionsContent {
  const d = DEFAULTS.sections;
  return {
    brands_enabled: toBool(stored?.brands_enabled, d.brands_enabled),
    why_us_enabled: toBool(stored?.why_us_enabled, d.why_us_enabled),
    process_enabled: toBool(stored?.process_enabled, d.process_enabled),
    testimonials_enabled: toBool(stored?.testimonials_enabled, d.testimonials_enabled),
    quote_enabled: toBool(stored?.quote_enabled, d.quote_enabled),
    final_cta_enabled: toBool(stored?.final_cta_enabled, d.final_cta_enabled),
  };
}

export function resolveHomepage(stored: Partial<HomepageContent> | null | undefined): HomepageContent {
  const d = DEFAULTS.homepage;
  return {
    about_story_image: typeof stored?.about_story_image === "string" ? stored.about_story_image : d.about_story_image,
    about_banner_image:
      typeof stored?.about_banner_image === "string" ? stored.about_banner_image : d.about_banner_image,
    technician_band: { ...d.technician_band, ...(stored?.technician_band ?? {}) },
    inventory_band: { ...d.inventory_band, ...(stored?.inventory_band ?? {}) },
  };
}

export type ImageBandContent = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type HomepageContent = {
  technician_band: ImageBandContent;
  inventory_band: ImageBandContent;
  about_story_image: string;
  about_banner_image: string;
};

export type ServiceItem = { icon: string; title: string; desc: string };
export type TestimonialItem = { name: string; text: string; rating: number };
export type AboutValue = { title: string; text: string };
export type AboutContent = {
  headline: string;
  intro: string;
  story: string;
  values: AboutValue[];
};
export type ProcessStep = { step: string; title: string; desc: string };

export type {
  BrandSlideshowContent,
  BrandSlideshowSettings,
  BrandSlideshowSlide,
} from "@/lib/brand-slideshow";
import {
  DEFAULT_BRAND_SLIDESHOW,
  resolveBrandSlideshow,
  type BrandSlideshowContent,
} from "@/lib/brand-slideshow";

export type ThemeContent = {
  primary: string;
  /** Optional separate primaries per resolved mode (falls back to primary) */
  primary_light?: string;
  primary_dark?: string;
  brand_green?: string;
  brand_red_accent?: string;
  brand_red: string;
  radius: string;
  font: string;
  palette_version?: number;
};

export const THEME_PALETTE_VERSION = 5;

const LEGACY_VERSIONS = new Set([1, 2]);

export function resolveTheme(stored: Partial<ThemeContent> | null | undefined): ThemeContent {
  const merged: ThemeContent = { ...DEFAULTS.theme, ...stored };
  const version = merged.palette_version ?? 1;
  if (LEGACY_VERSIONS.has(version) || version < THEME_PALETTE_VERSION) {
    return { ...merged, ...DEFAULTS.theme, palette_version: THEME_PALETTE_VERSION };
  }
  return merged;
}

export type SeoContent = {
  title: string;
  description: string;
  og_image: string;
};

export const DEFAULTS = {
  hero: {
    badge: "Premium Fitment Centre",
    title_line1: "Drive",
    title_line2: "Performance.",
    subtitle:
      "Top-tier tires, precision fitment, and same-day service from technicians who treat every vehicle like their own.",
    cta_primary_text: "Get a Free Quote",
    cta_primary_link: "#quote",
    cta_secondary_text: "Call Now",
    cta_secondary_link: "",
    background_image: "",
    overlay_opacity: 62,
    focal_x: 36,
    focal_y: 46,
    stats: [
      { value: "10K+", label: "Vehicles serviced" },
      { value: "20+", label: "Premium brands" },
      { value: "15+", label: "Years experience" },
    ],
  } as HeroContent,
  contact: {
    phone: "",
    email: "hello@tiresnearyou.com",
    whatsapp: "",
    address: "123 Main Street, City",
    hours: formatHoursSummary(DEFAULT_HOURS_SCHEDULE),
    hours_schedule: DEFAULT_HOURS_SCHEDULE,
    lead_notify_email: "",
    facebook: "",
    instagram: "",
    twitter: "",
  } as ContactContent,
  sections: {
    brands_enabled: true,
    why_us_enabled: true,
    process_enabled: true,
    testimonials_enabled: true,
    quote_enabled: true,
    final_cta_enabled: true,
  } as SectionsContent,
  homepage: {
    technician_band: {
      image: "",
      eyebrow: "Craft",
      title: "Technicians who care",
      subtitle: "Factory-spec torque, laser alignment, and a full safety check on every job.",
    },
    inventory_band: {
      image: "",
      eyebrow: "Inventory",
      title: "Premium brands in stock",
      subtitle: "From daily commuters to performance builds — honest recommendations, no pressure.",
    },
    about_story_image: "",
    about_banner_image: "",
  } as HomepageContent,
  services: [
    { icon: "Wrench", title: "Expert Fitment", desc: "Factory-spec torque and premium equipment on every wheel." },
    { icon: "Gauge", title: "Laser Alignment", desc: "Precision geometry for grip, wear, and confident handling." },
    { icon: "ShieldCheck", title: "Genuine Warranty", desc: "Authorized brands with full manufacturer backing." },
    { icon: "Truck", title: "Fleet & SUV", desc: "Commercial and heavy-duty setups done right." },
  ] as ServiceItem[],
  testimonials: [
    { name: "Marcus T.", text: "Flawless fitment and zero upsell. The shop my crew trusts.", rating: 5 },
    { name: "Elena R.", text: "Booked online, in and out in under an hour. Premium experience.", rating: 5 },
    { name: "David K.", text: "Best alignment I've had — car tracks straight at highway speed.", rating: 5 },
  ] as TestimonialItem[],
  brands: ["Michelin", "Bridgestone", "Pirelli", "Continental", "Goodyear", "Dunlop", "Hankook", "Yokohama"],
  about: {
    headline: "Built for drivers who demand more",
    intro: "Precision, transparency, and craft — that's the standard at Tires Near You.",
    story:
      "We started as a single-bay fitment shop with one promise: treat every customer like family and every vehicle like a flagship. Today we stock the world's leading tire brands, run state-of-the-art alignment bays, and back every job with a full safety inspection — included.",
    values: [
      { title: "Craft", text: "Certified technicians. No shortcuts." },
      { title: "Honesty", text: "Clear options. Fair pricing. No pressure." },
      { title: "Speed", text: "Same-day service when you need it." },
      { title: "Care", text: "Every fitment ends with a safety check." },
    ],
  } as AboutContent,
  process: [
    { step: "01", title: "Book or walk in", desc: "Tell us your vehicle and tire goals." },
    { step: "02", title: "We recommend", desc: "Honest options matched to your driving." },
    { step: "03", title: "Precision fit", desc: "Mount, balance, align, inspect." },
    { step: "04", title: "Drive confident", desc: "Leave with warranty-backed peace of mind." },
  ] as ProcessStep[],
  theme: {
    primary: "oklch(0.48 0.2 27)",
    primary_light: "oklch(0.48 0.2 27)",
    primary_dark: "oklch(0.54 0.21 27)",
    brand_red_accent: "oklch(0.48 0.2 27)",
    brand_red: "oklch(0.82 0.01 0)",
    radius: "0.5rem",
    font: "Source Sans 3",
    palette_version: THEME_PALETTE_VERSION,
  } as ThemeContent,
  brand_slideshow: DEFAULT_BRAND_SLIDESHOW,
  seo: {
    title: "Tires Near You — Premium Tires & Performance Fitment",
    description:
      "Premium tires, precision fitment, laser alignment and balancing. Performance service for drivers who expect more.",
    og_image: "",
  } as SeoContent,
};

export type ContentMap = {
  hero: HeroContent;
  homepage: HomepageContent;
  contact: ContactContent;
  sections: SectionsContent;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  brands: string[];
  about: AboutContent;
  process: ProcessStep[];
  theme: ThemeContent;
  brand_slideshow: BrandSlideshowContent;
  seo: SeoContent;
};

export async function fetchContent<K extends keyof ContentMap>(
  key: K,
): Promise<ContentMap[K]> {
  const defaultVal = DEFAULTS[key];

  if (!isSupabasePublicEnvConfigured()) {
    return defaultVal;
  }

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.warn(`[site-content] ${key}:`, error.message);
      return defaultVal;
    }

    const stored = data?.value;

    if (Array.isArray(defaultVal)) {
      const arr = Array.isArray(stored) && stored.length > 0 ? stored : defaultVal;
      return arr as ContentMap[K];
    }

    const merged = { ...defaultVal, ...(stored as object | null ?? {}) } as ContentMap[K];
    if (key === "theme") return resolveTheme(merged as ThemeContent) as ContentMap[K];
    if (key === "contact") {
      const c = merged as ContactContent;
      const schedule = normalizeHoursSchedule(c.hours_schedule);
      return {
        ...c,
        hours_schedule: schedule,
        hours: c.hours?.trim() ? c.hours : formatHoursSummary(schedule),
      } as ContentMap[K];
    }
    if (key === "hero") {
      const h = merged as HeroContent;
      return {
        ...h,
        focal_x: h.focal_x ?? DEFAULTS.hero.focal_x,
        focal_y: h.focal_y ?? DEFAULTS.hero.focal_y,
      } as ContentMap[K];
    }
    if (key === "sections") {
      return resolveSections(stored as Partial<SectionsContent> | null) as ContentMap[K];
    }
    if (key === "homepage") {
      return resolveHomepage(stored as Partial<HomepageContent> | null) as ContentMap[K];
    }
    if (key === "brand_slideshow") {
      return resolveBrandSlideshow(stored as Partial<BrandSlideshowContent> | null) as ContentMap[K];
    }
    return merged;
  } catch (e) {
    console.warn(`[site-content] ${key}:`, e);
    return defaultVal;
  }
}

export async function saveContent<K extends keyof ContentMap>(
  key: K,
  value: ContentMap[K],
): Promise<void> {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value: value as never }, { onConflict: "key" });
  if (error) throw error;
}

export type LocationRow = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  map_embed_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type LeadType = "quote" | "contact";
export type LeadStatus = "new" | "contacted" | "booked" | "lost" | "archived";

export type LeadRow = {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  phone: string | null;
  email: string | null;
  vehicle: string | null;
  tire_size: string | null;
  message: string | null;
  notes: string | null;
  created_at: string;
};

export async function fetchContentMeta(): Promise<Record<string, string | undefined>> {
  try {
    const { data, error } = await supabase.from("site_content").select("key, updated_at");
    if (error) {
      console.warn("[site-content] meta:", error.message);
      return {};
    }
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.updated_at]));
  } catch (e) {
    console.warn("[site-content] meta:", e);
    return {};
  }
}

export type LeadInsert = {
  type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  tire_size?: string;
  message?: string;
};

export async function submitLead(payload: LeadInsert): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    type: payload.type,
    name: payload.name,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    vehicle: payload.vehicle ?? null,
    tire_size: payload.tire_size ?? null,
    message: payload.message ?? null,
  });
  if (error) throw error;

  try {
    const contact = await fetchContent("contact");
    const notifyEmail = contact.lead_notify_email?.trim();
    await fetch("/api/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, notifyEmail }),
    });
  } catch {
    /* notification is best-effort */
  }
}

export async function fetchLeads(status?: LeadStatus | "all"): Promise<LeadRow[]> {
  let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as LeadRow[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<LeadRow, "status" | "notes">>,
): Promise<void> {
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) throw error;
}

export async function fetchLocations(includeInactive = false): Promise<LocationRow[]> {
  try {
    let q = supabase.from("locations").select("*").order("sort_order");
    if (!includeInactive) q = q.eq("is_active", true);
    const { data, error } = await q;
    if (error) {
      console.warn("[locations]:", error.message);
      return [];
    }
    return data ?? [];
  } catch (e) {
    console.warn("[locations]:", e);
    return [];
  }
}
