import { isVideoUrl } from "@/lib/media";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  mobileSrc?: string;
  className?: string;
  variant?: "default" | "warehouse";
  objectPosition?: string;
};

function HeroBackgroundMedia({
  src,
  className,
  variant,
  objectPosition,
  parallax,
  responsiveClass,
}: {
  src: string;
  className?: string;
  variant: "default" | "warehouse";
  objectPosition?: string;
  parallax: number;
  responsiveClass?: string;
}) {
  const mediaClass = cn(
    "hero-parallax-media absolute inset-0 h-[115%] w-full object-cover",
    variant === "warehouse" && "hero-parallax-warehouse",
    responsiveClass,
    className,
  );
  const positionStyle = objectPosition ? { objectPosition } : undefined;
  const transformStyle = { transform: `translate3d(0, ${parallax * -0.5}px, 0) scale(1.05)`, ...positionStyle };

  if (isVideoUrl(src)) {
    return (
      <video
        className={mediaClass}
        style={transformStyle}
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
      style={transformStyle}
      fetchPriority="high"
      sizes="100vw"
      decoding="async"
    />
  );
}

export function HeroBackground({
  src,
  mobileSrc,
  className = "",
  variant = "default",
  objectPosition,
}: Props) {
  const parallax = useParallax(0.4);
  const mobile = mobileSrc?.trim() || src;
  const useResponsive = mobile !== src;

  if (!useResponsive) {
    return (
      <HeroBackgroundMedia
        src={src}
        className={className}
        variant={variant}
        objectPosition={objectPosition}
        parallax={parallax}
      />
    );
  }

  return (
    <>
      <HeroBackgroundMedia
        src={mobile}
        className={className}
        variant={variant}
        objectPosition={objectPosition}
        parallax={parallax}
        responsiveClass="md:hidden"
      />
      <HeroBackgroundMedia
        src={src}
        className={className}
        variant={variant}
        objectPosition={objectPosition}
        parallax={parallax}
        responsiveClass="hidden md:block"
      />
    </>
  );
}
