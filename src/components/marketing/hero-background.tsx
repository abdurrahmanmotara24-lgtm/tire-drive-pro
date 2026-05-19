import { isVideoUrl } from "@/lib/media";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  className?: string;
  variant?: "default" | "warehouse";
  objectPosition?: string;
};

export function HeroBackground({ src, className = "", variant = "default", objectPosition }: Props) {
  const parallax = useParallax(0.4);
  const isVideo = isVideoUrl(src);
  const mediaClass = cn(
    "hero-parallax-media absolute inset-0 h-[115%] w-full object-cover",
    variant === "warehouse" && "hero-parallax-warehouse",
    className,
  );
  const positionStyle = objectPosition ? { objectPosition } : undefined;

  if (isVideo) {
    return (
      <video
        className={mediaClass}
        style={{ transform: `translate3d(0, ${parallax * -0.5}px, 0) scale(1.05)`, ...positionStyle }}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={mediaClass}
      style={{ transform: `translate3d(0, ${parallax * -0.5}px, 0) scale(1.05)`, ...positionStyle }}
      fetchPriority="high"
      sizes="100vw"
      decoding="async"
    />
  );
}
