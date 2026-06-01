import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MARQUEE_SPEED_DESKTOP = 48;
const MARQUEE_SPEED_MOBILE = 40;

function getMarqueeSpeedPxPerSec() {
  if (typeof window === "undefined") return MARQUEE_SPEED_DESKTOP;
  return window.matchMedia("(max-width: 767px)").matches
    ? MARQUEE_SPEED_MOBILE
    : MARQUEE_SPEED_DESKTOP;
}

type MarqueeTrackProps<T> = {
  items: T[];
  renderItem: (item: T, index: number, opts: { duplicate: boolean }) => ReactNode;
  getItemKey: (item: T, index: number) => string;
  segmentClassName?: string;
  trackClassName?: string;
  reverse?: boolean;
};

/** Infinite horizontal scroll; measures first segment width for a seamless loop. */
export function MarqueeTrack<T>({
  items,
  renderItem,
  getItemKey,
  segmentClassName,
  trackClassName,
  reverse = false,
}: MarqueeTrackProps<T>) {
  const segmentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ distance: 0, duration: 45 });

  useEffect(() => {
    const el = segmentRef.current;
    if (!el) return;

    const measure = () => {
      const distance = el.offsetWidth;
      const speed = getMarqueeSpeedPxPerSec();
      setMetrics({
        distance,
        duration: distance > 0 ? distance / speed : 45,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  const trackStyle = {
    "--marquee-distance": `${metrics.distance}px`,
    "--marquee-duration": `${metrics.duration}s`,
  } as CSSProperties;

  return (
    <div className="overflow-hidden">
      <div
        className={cn("marquee-track px-4", reverse && "marquee-track--reverse", trackClassName)}
        style={trackStyle}
      >
        <div
          ref={segmentRef}
          className={cn("marquee-track__segment gap-10 sm:gap-12 md:gap-14", segmentClassName)}
        >
          {items.map((item, index) => (
            <div key={getItemKey(item, index)}>{renderItem(item, index, { duplicate: false })}</div>
          ))}
        </div>
        <div
          className={cn("marquee-track__segment gap-10 sm:gap-12 md:gap-14", segmentClassName)}
          aria-hidden
        >
          {items.map((item, index) => (
            <div key={`dup-${getItemKey(item, index)}`}>
              {renderItem(item, index, { duplicate: true })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
