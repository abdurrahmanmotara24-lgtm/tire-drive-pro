import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { ImageBandSlideshowBg } from "@/components/marketing/image-band-slideshow-bg";
import type { BrandSlideshowPublicSlide, BrandSlideshowSettings } from "@/lib/brand-slideshow";

type Props = {
  id?: string;
  src: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "right";
  slideshowSlides?: BrandSlideshowPublicSlide[];
  slideshowSettings?: Partial<BrandSlideshowSettings>;
  slideshowLoading?: boolean;
};

export function ImageBand({
  id,
  src,
  eyebrow,
  title,
  subtitle,
  align = "left",
  slideshowSlides,
  slideshowSettings,
  slideshowLoading,
}: Props) {
  const reveal = useReveal<HTMLElement>();
  const isSlideshow = slideshowSlides != null && slideshowSlides.length > 0;

  return (
    <section
      id={id}
      ref={reveal.ref}
      className={cn(
        "image-band relative isolate min-h-[min(40vh,20rem)] overflow-hidden md:min-h-[min(52vh,28rem)]",
        isSlideshow && "image-band--slideshow",
        isSlideshow && align === "right" && "image-band--align-right",
        isSlideshow && align === "left" && "image-band--align-left",
        slideshowLoading && isSlideshow && "image-band--loading",
        reveal.className,
      )}
    >
      {isSlideshow ? (
        <>
          {slideshowLoading && (
            <div className="image-band__loading-shimmer absolute inset-0 z-[1] animate-pulse bg-muted" aria-hidden />
          )}
          <ImageBandSlideshowBg slides={slideshowSlides} settings={slideshowSettings} />
        </>
      ) : (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
      <div
        className={cn(
          "image-band__gradient absolute inset-0",
          !isSlideshow && "md:bg-gradient-to-r md:from-background md:via-background/75 md:to-background/20",
          isSlideshow && "image-band__gradient--slideshow",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "container-tny relative z-10 flex min-h-[min(40vh,20rem)] items-end py-10 md:min-h-[min(52vh,28rem)] md:items-center md:py-16",
          align === "right" ? "md:justify-end md:text-right" : "",
          isSlideshow && "image-band__content",
        )}
      >
        <div className="max-w-lg">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          )}
          <h2 className="font-display mt-2 text-2xl leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
          {subtitle && <p className="mt-3 text-sm text-muted-foreground sm:text-lg">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
