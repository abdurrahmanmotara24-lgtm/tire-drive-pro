import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/site-content";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCarousel({ testimonials }: { testimonials: TestimonialItem[] }) {
  const reveal = useReveal<HTMLElement>();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [Autoplay({ delay: 5500, stopOnInteraction: true })],
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideHeight, setSlideHeight] = useState<number | undefined>();
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef],
  );

  useLayoutEffect(() => {
    if (!emblaApi) return;
    const measure = () => {
      const slide = emblaApi.slideNodes()[emblaApi.selectedScrollSnap()];
      if (slide) setSlideHeight(slide.offsetHeight);
    };
    measure();
    emblaApi.on("select", measure);
    emblaApi.on("reInit", measure);
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => {
      emblaApi.off("select", measure);
      emblaApi.off("reInit", measure);
      ro.disconnect();
    };
  }, [emblaApi]);

  return (
    <section id="testimonials" ref={reveal.ref} className={`section ${reveal.className}`}>
      <div className="container-tny">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Reviews" title="Driver approved" />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className="hover-carousel-btn touch-target flex h-11 w-11 items-center justify-center rounded-sm border border-border disabled:opacity-30"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className="hover-carousel-btn touch-target flex h-11 w-11 items-center justify-center rounded-sm border border-border disabled:opacity-30"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          className="testimonial-carousel__viewport mt-8 overflow-hidden"
          ref={setViewportRef}
          style={slideHeight != null ? { height: slideHeight } : undefined}
        >
          <div className="flex gap-4">
            {testimonials.map((t) => (
              <article
                key={`${t.name}-${t.text.slice(0, 24)}`}
                className="hover-glass glass-panel min-w-0 flex-[0_0_100%] rounded-sm p-6 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 font-display text-sm text-primary">
                    {initials(t.name)}
                  </span>
                  <div>
                    <div className="flex gap-0.5 text-primary" aria-label={`${t.rating} stars`}>
                      {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
                      ))}
                    </div>
                    {t.service && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {t.service}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm text-chrome">{t.name}</p>
                  {t.review_url?.trim() && (
                    <a
                      href={t.review_url.trim()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Google review <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2 md:hidden" role="tablist" aria-label="Review slides">
          {testimonials.map((t, i) => (
            <button
              key={`dot-${t.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="touch-target flex h-11 w-11 items-center justify-center p-0"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-colors ${i === selectedIndex ? "bg-primary" : "bg-border"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
