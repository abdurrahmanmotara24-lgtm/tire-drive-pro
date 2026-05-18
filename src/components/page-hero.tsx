import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  variant?: "gradient" | "photo";
  backgroundImage?: string;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "gradient",
  backgroundImage,
  overlayOpacity = 75,
  className,
  children,
}: PageHeroProps) {
  const isPhoto = variant === "photo" && backgroundImage;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden -mt-14 pt-14",
        !isPhoto && "bg-hero-gradient",
        className,
      )}
    >
      {isPhoto && (
        <>
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center photo-warm"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/80 via-primary/65 to-primary/85"
            style={{ opacity: overlayOpacity / 100 }}
            aria-hidden
          />
        </>
      )}
      <div className="container-tny py-12 text-primary-foreground lg:py-16">
        {children ?? (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red-accent">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
