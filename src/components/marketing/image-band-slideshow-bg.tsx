import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BrandSlideshowPublicSlide, BrandSlideshowSettings } from "@/lib/brand-slideshow";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { cn } from "@/lib/utils";

const DEFAULT_FADE_MS = 1400;

type Props = {
  slides: BrandSlideshowPublicSlide[];
  settings?: Partial<BrandSlideshowSettings>;
};

export function ImageBandSlideshowBg({ slides, settings }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const reducedMotion = usePrefersReducedMotion();
  const progressKeyRef = useRef(0);
  const count = slides.length;
  const slideMs = settings?.autoplay_ms ?? 4500;
  const fadeMs = DEFAULT_FADE_MS;
  const overlayStrength = (settings?.overlay_opacity ?? 72) / 100;
  const zoomEnabled = settings?.zoom_enabled !== false;
  const autoplayEnabled = !reducedMotion && count > 1 && !paused;

  const markLoaded = useCallback((index: number) => {
    setLoaded((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
  }, []);

  useEffect(() => {
    if (count <= 1) return;
    slides.forEach((slide, i) => {
      if (i === active || i === (active + 1) % count) {
        const img = new Image();
        img.decoding = "async";
        img.src = slide.image_url;
      }
    });
  }, [slides, count, active]);

  useEffect(() => {
    if (count <= 1 || typeof document === "undefined") return;
    const next = slides[(active + 1) % count];
    if (!next) return;

    const id = "slideshow-preload-link";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "preload";
      link.as = "image";
      document.head.appendChild(link);
    }
    link.href = next.image_url;

    return () => {
      link?.remove();
    };
  }, [active, count, slides]);

  useEffect(() => {
    setActive(0);
    setLoaded({});
    progressKeyRef.current += 1;
  }, [slides.map((s) => `${s.image_url}|${s.focal_x}|${s.focal_y}`).join(";"), slideMs]);

  useEffect(() => {
    if (!autoplayEnabled) return;
    const id = window.setInterval(() => {
      setActive((prev) => {
        progressKeyRef.current += 1;
        return (prev + 1) % count;
      });
    }, slideMs);
    return () => window.clearInterval(id);
  }, [autoplayEnabled, count, slideMs]);

  const goTo = (index: number) => {
    progressKeyRef.current += 1;
    setActive(index);
  };

  const goPrev = () => goTo((active - 1 + count) % count);
  const goNext = () => goTo((active + 1) % count);

  if (count === 0) return null;

  return (
    <div
      className={cn(
        "image-band__slideshow",
        !zoomEnabled && "image-band__slideshow--no-zoom",
        paused && "image-band__slideshow--paused",
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Brand showcase slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      style={
        {
          "--slide-duration": `${slideMs}ms`,
          "--fade-duration": `${fadeMs}ms`,
          "--slideshow-overlay-strength": overlayStrength,
        } as CSSProperties
      }
    >
      {slides.map((slide, i) => (
        <div
          key={`${i}-${slide.image_url}`}
          className={cn("image-band__slide", i === active && "is-active")}
          aria-hidden={i !== active}
        >
          <img
            src={slide.image_url}
            alt=""
            className={cn("image-band__slide-img", loaded[i] && "is-loaded")}
            style={{
              objectPosition: `${slide.focal_x ?? 66}% ${slide.focal_y ?? 48}%`,
            }}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
            sizes="100vw"
            onLoad={() => markLoaded(i)}
          />
        </div>
      ))}
      <div className="image-band__slideshow-scrim" aria-hidden />
      {count > 1 && (
        <>
          <button
            type="button"
            className="image-band__slideshow-nav image-band__slideshow-nav--prev"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="image-band__slideshow-nav image-band__slideshow-nav--next"
            onClick={goNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          {paused && (
            <span className="image-band__slideshow-paused-badge" aria-live="polite">
              Paused
            </span>
          )}
          <div
            className="image-band__slideshow-progress"
            role="tablist"
            aria-label="Slideshow slides"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "image-band__progress-seg",
                  i === active && "is-active",
                  i < active && "is-done",
                )}
                onClick={() => goTo(i)}
              >
                <span
                  key={i === active ? progressKeyRef.current : `done-${i}`}
                  className="image-band__progress-fill"
                  style={
                    i === active && autoplayEnabled
                      ? { animationDuration: `${slideMs}ms` }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
