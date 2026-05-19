import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_BRAND_SLIDESHOW,
  fetchBrandSlideshowPublic,
  toPublicSlideshow,
  type BrandSlideshowPublic,
} from "@/lib/brand-slideshow";

export function useBrandSlideshow() {
  return useQuery({
    queryKey: ["brand_slideshow", "public"],
    queryFn: fetchBrandSlideshowPublic,
    placeholderData: toPublicSlideshow(DEFAULT_BRAND_SLIDESHOW),
    staleTime: 60_000,
  });
}

export type { BrandSlideshowPublic };
