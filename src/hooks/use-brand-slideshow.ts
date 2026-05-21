import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_BRAND_SLIDESHOW,
  fetchBrandSlideshowPublic,
  toPublicSlideshow,
  type BrandSlideshowPublic,
} from "@/lib/brand-slideshow";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";

export function useBrandSlideshow() {
  const cmsReady = usePublicContentReady();
  return useQuery({
    queryKey: ["brand_slideshow", "public"],
    queryFn: fetchBrandSlideshowPublic,
    enabled: cmsReady,
    placeholderData: toPublicSlideshow(DEFAULT_BRAND_SLIDESHOW),
  });
}

export type { BrandSlideshowPublic };
