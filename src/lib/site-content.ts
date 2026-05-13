import { supabase } from "@/integrations/supabase/client";

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
  overlay_opacity: number;
  stats: { value: string; label: string }[];
};

export type ContactContent = {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
};

export type SectionsContent = {
  promos_enabled: boolean;
  brands_enabled: boolean;
  why_us_enabled: boolean;
  testimonials_enabled: boolean;
  quote_enabled: boolean;
  final_cta_enabled: boolean;
};

export type ThemeContent = {
  primary: string;
  brand_red: string;
  radius: string;
  font: string;
};

export type SeoContent = {
  title: string;
  description: string;
  og_image: string;
};

export const DEFAULTS = {
  hero: {
    badge: "#1 Local Fitment Centre",
    title_line1: "Premium Tires.",
    title_line2: "Unbeatable Prices.",
    subtitle:
      "Top brand tires, expert fitment, and same-day service. Drive safer, save more — with the team your neighbours trust.",
    cta_primary_text: "Get a Free Quote",
    cta_primary_link: "#quote",
    cta_secondary_text: "Call Now",
    cta_secondary_link: "tel:+10000000000",
    background_image: "",
    overlay_opacity: 85,
    stats: [
      { value: "10K+", label: "Happy drivers" },
      { value: "20+", label: "Top brands" },
      { value: "4.9★", label: "Customer rating" },
    ],
  } as HeroContent,
  contact: {
    phone: "+1 (000) 000-0000",
    email: "hello@tiresnearyou.com",
    whatsapp: "10000000000",
    address: "123 Main Street, City",
    hours: "Mon–Sat 8:00–18:00",
    facebook: "",
    instagram: "",
    twitter: "",
  } as ContactContent,
  sections: {
    promos_enabled: true,
    brands_enabled: true,
    why_us_enabled: true,
    testimonials_enabled: true,
    quote_enabled: true,
    final_cta_enabled: true,
  } as SectionsContent,
  theme: {
    primary: "oklch(0.45 0.18 145)",
    brand_red: "oklch(0.58 0.22 27)",
    radius: "0.625rem",
    font: "Inter",
  } as ThemeContent,
  seo: {
    title: "Tires Near You — Premium Tires & Fitment Centre",
    description:
      "Quality tires, professional fitment, wheel alignment and balancing.",
    og_image: "",
  } as SeoContent,
};

export type ContentMap = {
  hero: HeroContent;
  contact: ContactContent;
  sections: SectionsContent;
  theme: ThemeContent;
  seo: SeoContent;
};

export async function fetchContent<K extends keyof ContentMap>(
  key: K,
): Promise<ContentMap[K]> {
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return { ...DEFAULTS[key], ...(data?.value as object | null ?? {}) } as ContentMap[K];
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

export async function fetchLocations(includeInactive = false): Promise<LocationRow[]> {
  let q = supabase.from("locations").select("*").order("sort_order");
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
