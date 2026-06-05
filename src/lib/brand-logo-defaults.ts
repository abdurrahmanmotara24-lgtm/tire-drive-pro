import type { BrandItem } from "@/lib/site-content";
import { readServerSupabasePublicEnv, readSupabasePublicEnv } from "@/lib/env";

import bridgestone from "@/assets/brands/bridgestone.svg?url";
import bridgestoneLight from "@/assets/brands/bridgestone-light.svg?url";
import continental from "@/assets/brands/continental.svg?url";
import continentalLight from "@/assets/brands/continental-light.svg?url";
import dunlop from "@/assets/brands/dunlop.svg?url";
import dunlopLight from "@/assets/brands/dunlop-light.svg?url";
import goodyear from "@/assets/brands/goodyear.svg?url";
import goodyearLight from "@/assets/brands/goodyear-light.svg?url";
import hankook from "@/assets/brands/hankook.svg?url";
import hankookLight from "@/assets/brands/hankook-light.svg?url";
import michelin from "@/assets/brands/michelin.svg?url";
import michelinLight from "@/assets/brands/michelin-light.svg?url";
import pirelli from "@/assets/brands/pirelli.svg?url";
import pirelliLight from "@/assets/brands/pirelli-light.svg?url";
import yokohama from "@/assets/brands/yokohama.svg?url";
import yokohamaLight from "@/assets/brands/yokohama-light.svg?url";

const BUNDLED_LOGOS: Record<string, { logo: string; logoDark: string }> = {
  michelin: { logo: michelin, logoDark: michelinLight },
  bridgestone: { logo: bridgestone, logoDark: bridgestoneLight },
  pirelli: { logo: pirelli, logoDark: pirelliLight },
  continental: { logo: continental, logoDark: continentalLight },
  goodyear: { logo: goodyear, logoDark: goodyearLight },
  dunlop: { logo: dunlop, logoDark: dunlopLight },
  hankook: { logo: hankook, logoDark: hankookLight },
  yokohama: { logo: yokohama, logoDark: yokohamaLight },
};

function brandSlug(name: string): string | undefined {
  const slug = name.trim().toLowerCase();
  return slug in BUNDLED_LOGOS ? slug : undefined;
}

function supabaseProjectUrl(): string | undefined {
  if (typeof window === "undefined") {
    return readServerSupabasePublicEnv().url;
  }
  return readSupabasePublicEnv().url;
}

/** Turn storage paths / partial URLs from the CMS into absolute public URLs. */
export function resolveBrandLogoUrl(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  const base = supabaseProjectUrl()?.replace(/\/$/, "");
  if (!base) return undefined;

  if (trimmed.startsWith("storage/v1/")) {
    return `${base}/${trimmed}`;
  }

  if (trimmed.includes("/site-media/")) {
    const marker = "/site-media/";
    const idx = trimmed.indexOf(marker);
    const objectPath = trimmed.slice(idx + marker.length).replace(/^\//, "");
    return `${base}/storage/v1/object/public/site-media/${objectPath}`;
  }

  const objectPath = trimmed.replace(/^\//, "");
  return `${base}/storage/v1/object/public/site-media/${objectPath}`;
}

export function getBundledBrandLogos(name: string): { logo: string; logoDark: string } | undefined {
  const slug = brandSlug(name);
  return slug ? BUNDLED_LOGOS[slug] : undefined;
}

export function withBrandLogoDefaults(brand: BrandItem): BrandItem {
  const logo = resolveBrandLogoUrl(brand.logo);
  const logoDark = resolveBrandLogoUrl(brand.logoDark);

  if (logo) {
    const bundled = getBundledBrandLogos(brand.name);
    return {
      ...brand,
      logo,
      logoDark: logoDark || bundled?.logoDark,
    };
  }

  const bundled = getBundledBrandLogos(brand.name);
  if (!bundled) return brand;

  return {
    ...brand,
    logo: bundled.logo,
    logoDark: brand.logoDark?.trim() ? logoDark : bundled.logoDark,
  };
}

export function applyBrandLogoDefaults(brands: BrandItem[]): BrandItem[] {
  return brands.map(withBrandLogoDefaults);
}
