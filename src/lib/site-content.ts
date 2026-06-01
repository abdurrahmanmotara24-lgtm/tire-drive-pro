import { requireSupabaseConfigured, supabase } from "@/lib/supabase-browser";
import { isSupabasePublicEnvConfigured, readSupabasePublicEnv } from "@/lib/env";
import {
  DEFAULT_HOURS_SCHEDULE,
  formatHoursSummary,
  normalizeHoursSchedule,
  type HoursSchedule,
} from "@/lib/hours-schedule";
import { BRAND_DEFAULT_EMAIL, BRAND_FULL_TITLE, BRAND_NAME } from "@/lib/brand";

export type HeroOffering = {
  label: string;
  description: string;
  icon: string;
  /** Prefills the quote form when this offering is clicked */
  quote_service?: string;
};

export type HeroContent = {
  badge: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  /** Primary service lines shown in the hero (passenger, truck, mag wheels, etc.) */
  offerings: HeroOffering[];
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

export const DEFAULT_HERO_OFFERINGS: HeroOffering[] = [
  {
    label: "Passenger tyres",
    description: "Premium brands & precision fitment",
    icon: "Gauge",
    quote_service: "Passenger tyres",
  },
  {
    label: "Truck tyres",
    description: "Commercial, fleet & heavy-duty",
    icon: "Truck",
    quote_service: "Truck tyres",
  },
  {
    label: "Mag wheels",
    description: "Alloy wheels fitted & balanced",
    icon: "Disc2",
    quote_service: "Mag wheels",
  },
];

export function resolveHero(stored: Partial<HeroContent> | null | undefined): HeroContent {
  const d = DEFAULTS.hero;
  const offerings =
    Array.isArray(stored?.offerings) && stored.offerings.length > 0
      ? stored.offerings.map((o, i) => ({
          ...DEFAULT_HERO_OFFERINGS[i % DEFAULT_HERO_OFFERINGS.length],
          ...o,
          label: o.label?.trim() || DEFAULT_HERO_OFFERINGS[i % DEFAULT_HERO_OFFERINGS.length]!.label,
        }))
      : d.offerings;
  return {
    ...d,
    ...(stored ?? {}),
    offerings,
    focal_x: stored?.focal_x ?? d.focal_x,
    focal_y: stored?.focal_y ?? d.focal_y,
  };
}

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
  specials_enabled: boolean;
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
    specials_enabled: toBool(stored?.specials_enabled, d.specials_enabled),
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

export type BrandItem = {
  name: string;
  /** Logo URL from Media Library — transparent PNG/SVG recommended */
  logo?: string;
  /** Optional light logo for dark backgrounds (#brands band in dark mode) */
  logoDark?: string;
  /** Optional link (manufacturer or internal page) */
  href?: string;
};

export function resolveBrands(stored: unknown): BrandItem[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return DEFAULTS.brands;
  }
  return stored
    .map((item) => {
      if (typeof item === "string") {
        const name = item.trim();
        return name ? { name } : null;
      }
      const row = item as Partial<BrandItem>;
      const name = row.name?.trim() ?? "";
      if (!name) return null;
      return {
        name,
        logo: row.logo?.trim() || undefined,
        logoDark: row.logoDark?.trim() || undefined,
        href: row.href?.trim() || undefined,
      };
    })
    .filter((item): item is BrandItem => item !== null);
}

export type SpecialItem = {
  icon: string;
  title: string;
  desc: string;
  price: string;
  badge?: string;
  valid_until?: string;
  image?: string;
  /** Prefills the quote form when this special is clicked */
  quote_service?: string;
};

export function resolveSpecials(stored: unknown): SpecialItem[] {
  const arr = Array.isArray(stored) && stored.length > 0 ? (stored as SpecialItem[]) : DEFAULTS.specials;
  return arr
    .map((item, i) => {
      const fallback = DEFAULTS.specials[i % DEFAULTS.specials.length]?.icon ?? "Gauge";
      const icon =
        item.icon?.trim() ||
        resolveServiceIcon({ icon: fallback, title: item.title ?? "", desc: item.desc ?? "" }).icon;
      return {
        icon,
        title: item.title?.trim() ?? "",
        desc: item.desc?.trim() ?? "",
        price: item.price?.trim() ?? "",
        badge: item.badge?.trim() || undefined,
        valid_until: item.valid_until?.trim() || undefined,
        image: item.image?.trim() || undefined,
        quote_service: item.quote_service?.trim() || undefined,
      };
    })
    .filter((item) => item.title.length > 0);
}

export function resolveServiceIcon(item: ServiceItem): ServiceItem {
  const t = item.title.trim().toLowerCase();
  if (t.includes("aircon") || t.includes("air con") || (t.includes("regas") && (t.includes("air") || t.includes("ac")))) {
    return { ...item, icon: "Snowflake" };
  }
  if (/\bbrake\b/.test(t) && /\b(pads?|discs?)\b/.test(t)) {
    return { ...item, icon: "BrakePad" };
  }
  if (/\bmag\b/.test(t) && /\b(wheel|rim)s?\b/.test(t)) {
    return { ...item, icon: "Disc2" };
  }
  if (/\btruck\b/.test(t) && /\btyres?\b/.test(t)) {
    return { ...item, icon: "Truck" };
  }
  return item;
}

export function resolveServices(stored: unknown): ServiceItem[] {
  const arr = Array.isArray(stored) && stored.length > 0 ? (stored as ServiceItem[]) : DEFAULTS.services;
  return arr.map(resolveServiceIcon);
}

export type TestimonialItem = {
  name: string;
  text: string;
  rating: number;
  branch?: string;
  service?: string;
  review_url?: string;
};
export type AboutValue = { title: string; text: string };
export type AboutContent = {
  headline: string;
  intro: string;
  story: string;
  story_bullets: string[];
  values: AboutValue[];
};

export function resolveAbout(stored: Partial<AboutContent> | null | undefined): AboutContent {
  const d = DEFAULTS.about;
  const story_bullets =
    Array.isArray(stored?.story_bullets) && stored.story_bullets.length > 0
      ? stored.story_bullets.map((b) => String(b).trim()).filter(Boolean)
      : d.story_bullets;
  const values =
    Array.isArray(stored?.values) && stored.values.length > 0
      ? stored.values.map((v, i) => ({
          ...d.values[i % d.values.length]!,
          ...v,
          title: v.title?.trim() || d.values[i % d.values.length]!.title,
          text: v.text?.trim() || d.values[i % d.values.length]!.text,
        }))
      : d.values;
  return {
    ...d,
    ...(stored ?? {}),
    headline: stored?.headline?.trim() || d.headline,
    intro: stored?.intro?.trim() || d.intro,
    story: stored?.story?.trim() || d.story,
    story_bullets,
    values,
  };
}
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
  /** Glow strength 0–100 (% mixed into --shadow-glow) */
  glow_intensity_light?: number;
  glow_intensity_dark?: number;
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
      "Same-day fitment, laser alignment, and honest advice — from daily drivers to fleets and custom builds.",
    offerings: DEFAULT_HERO_OFFERINGS,
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
    email: BRAND_DEFAULT_EMAIL,
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
    specials_enabled: true,
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
  specials: [
    {
      icon: "Gauge",
      title: "4 tyres + alignment",
      desc: "Bundle fitment, balance, and laser alignment on one visit.",
      price: "From R2,499",
      badge: "Popular",
      quote_service: "Passenger tyres",
    },
    {
      icon: "BrakePad",
      title: "Brake pads & discs",
      desc: "Safety check included with every brake service.",
      price: "Save 10%",
      badge: "This month",
      quote_service: "Brake pads & discs",
    },
    {
      icon: "Truck",
      title: "Fleet & commercial",
      desc: "Volume pricing for vans, trucks, and fleet accounts.",
      price: "Ask us",
      badge: "Fleet",
      quote_service: "Truck tyres",
    },
  ] as SpecialItem[],
  services: [
    { icon: "Gauge", title: "Passenger tyres", desc: "Premium brands, mount, balance, and fitment for every car." },
    { icon: "Truck", title: "Truck tyres", desc: "Commercial, fleet, and SUV — heavy-duty stock and expert fitting." },
    { icon: "Disc2", title: "Mag wheels", desc: "Alloy and mag wheels supplied, fitted, and balanced in-house." },
    { icon: "Gauge", title: "Laser alignment", desc: "Precision geometry for grip, wear, and confident handling." },
    { icon: "BrakePad", title: "Brake pads & discs", desc: "Precision brake servicing for safer stopping." },
    { icon: "Snowflake", title: "Aircon regas", desc: "A/C regas and climate service for comfortable driving." },
  ] as ServiceItem[],
  testimonials: [
    { name: "Marcus T.", text: "Flawless fitment and zero upsell. The shop my crew trusts.", rating: 5 },
    { name: "Elena R.", text: "Booked online, in and out in under an hour. Premium experience.", rating: 5 },
    { name: "David K.", text: "Best alignment I've had — car tracks straight at highway speed.", rating: 5 },
  ] as TestimonialItem[],
  brands: [
    { name: "Michelin" },
    { name: "Bridgestone" },
    { name: "Pirelli" },
    { name: "Continental" },
    { name: "Goodyear" },
    { name: "Dunlop" },
    { name: "Hankook" },
    { name: "Yokohama" },
  ] as BrandItem[],
  about: {
    headline: "One shop. Serious fitment.",
    intro:
      "We're a single-bay tyre and wheel centre — passenger, truck, and mag wheels — with honest advice and no pressure.",
    story:
      `${BRAND_NAME} started with one promise: treat every customer like family and every vehicle like it was our own. From daily commuters to fleets and custom builds, we stock leading brands, fit with factory-spec torque, and finish every job with a full safety inspection — included.`,
    story_bullets: [
      "Passenger, truck, and mag wheel fitment in one place",
      "Laser alignment and factory-spec torque on every job",
      "Full safety check included — walk in or book ahead",
    ],
    values: [
      {
        title: "Craft",
        text: "Certified technicians, laser alignment, and factory-spec torque — no shortcuts.",
      },
      {
        title: "Honesty",
        text: "Clear options and fair pricing. We recommend what your driving actually needs.",
      },
      {
        title: "Speed",
        text: "Same-day fitment when stock is on hand — we respect your time.",
      },
      {
        title: "Care",
        text: "Every fitment ends with a complete safety check before you drive away.",
      },
    ],
  } as AboutContent,
  process: [
    { step: "01", title: "Book or walk in", desc: "Tell us your vehicle and tyre goals." },
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
    glow_intensity_light: 35,
    glow_intensity_dark: 50,
    radius: "0.5rem",
    font: "Source Sans 3",
    palette_version: THEME_PALETTE_VERSION,
  } as ThemeContent,
  brand_slideshow: DEFAULT_BRAND_SLIDESHOW,
  seo: {
    title: BRAND_FULL_TITLE,
    description:
      "Premium tyres, mount & balance, laser alignment, mag wheels and fleet fitment. Same-day service and honest advice — visit our fitment centre or request a free quote.",
    og_image: "",
  } as SeoContent,
};

export type ContentMap = {
  hero: HeroContent;
  homepage: HomepageContent;
  contact: ContactContent;
  sections: SectionsContent;
  services: ServiceItem[];
  specials: SpecialItem[];
  testimonials: TestimonialItem[];
  brands: BrandItem[];
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
    if (key === "services") return resolveServices(defaultVal) as ContentMap[K];
    if (key === "specials") return resolveSpecials(defaultVal) as ContentMap[K];
    if (key === "brands") return resolveBrands(defaultVal) as ContentMap[K];
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
      if (key === "services") {
        return resolveServices(stored) as ContentMap[K];
      }
      if (key === "specials") {
        return resolveSpecials(stored) as ContentMap[K];
      }
      if (key === "brands") {
        return resolveBrands(stored) as ContentMap[K];
      }
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
      return resolveHero(stored as Partial<HeroContent> | null) as ContentMap[K];
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
    if (key === "about") {
      return resolveAbout(stored as Partial<AboutContent> | null) as ContentMap[K];
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
  requireSupabaseConfigured();
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
