import { useReveal } from "@/hooks/use-reveal";

type Props = {
  src: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "right";
};

export function ImageBand({ src, eyebrow, title, subtitle, align = "left" }: Props) {
  const reveal = useReveal<HTMLElement>();

  return (
    <section
      ref={reveal.ref}
      className={`relative isolate min-h-[min(40vh,20rem)] overflow-hidden md:min-h-[min(52vh,28rem)] ${reveal.className}`}
    >
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20"
        aria-hidden
      />
      <div
        className={`container-tny relative z-10 flex min-h-[min(40vh,20rem)] items-center py-12 md:min-h-[min(52vh,28rem)] md:py-16 ${
          align === "right" ? "max-md:text-left md:justify-end md:text-right" : ""
        }`}
      >
        <div className="max-w-lg">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          )}
          <h2 className="font-display mt-2 text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
          {subtitle && <p className="mt-3 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
