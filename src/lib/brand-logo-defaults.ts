import type { BrandItem } from "@/lib/site-content";

/** Slug → bundled logo paths (served from /public/brands). Used when CMS entry has no logo URL. */
const BRAND_LOGO_SLUGS: Record<string, string> = {
  michelin: "michelin",
  bridgestone: "bridgestone",
  pirelli: "pirelli",
  continental: "continental",
  goodyear: "goodyear",
  dunlop: "dunlop",
  hankook: "hankook",
  yokohama: "yokohama",
};

function brandSlug(name: string): string | undefined {
  const slug = name.trim().toLowerCase();
  return BRAND_LOGO_SLUGS[slug] ? slug : undefined;
}

export function withBrandLogoDefaults(brand: BrandItem): BrandItem {
  if (brand.logo?.trim()) return brand;

  const slug = brandSlug(brand.name);
  if (!slug) return brand;

  return {
    ...brand,
    logo: `/brands/${slug}.svg`,
    logoDark: brand.logoDark?.trim() || `/brands/${slug}-light.svg`,
  };
}

export function applyBrandLogoDefaults(brands: BrandItem[]): BrandItem[] {
  return brands.map(withBrandLogoDefaults);
}
