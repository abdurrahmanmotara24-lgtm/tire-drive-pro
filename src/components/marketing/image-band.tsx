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
        !isSlideshow && "image-band--static",
        !isSlideshow && align === "right" && "image-band--align-right",
        !isSlideshow && align !== "right" && "image-band--align-left",
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
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="low"
        />

      )}
      {!isSlideshow && <div className="image-band__static-scrim absolute inset-0 z-[1]" aria-hidden />}
      <div
        className={cn(
          "image-band__gradient absolute inset-0 z-[2]",
          isSlideshow && "image-band__gradient--slideshow",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "container-tny relative z-10 flex min-h-[min(40vh,20rem)] items-end py-10 md:min-h-[min(52vh,28rem)] md:items-center md:py-16",
          align === "right" ? "md:justify-end md:text-right" : "",
          "image-band__content",
        )}
      >
        <div
          className={cn(
            "image-band__text-panel",
            isSlideshow && align === "right" && "max-w-lg",
            isSlideshow && align !== "right" && "image-band__text-panel--compact",
          )}
        >
          {eyebrow && (
            <p className="image-band__eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2
            className={cn(
              "image-band__title font-display mt-2 leading-tight",
              isSlideshow && align === "right"
                ? "text-2xl sm:text-4xl lg:text-5xl"
                : "text-xl sm:text-2xl lg:text-3xl",
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "image-band__subtitle leading-relaxed",
                isSlideshow && align === "right"
                  ? "mt-3 text-sm sm:text-lg"
                  : "mt-2 text-xs sm:text-sm",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
