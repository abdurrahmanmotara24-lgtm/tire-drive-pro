type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function PageIntro({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" aria-hidden />
      <div className="container-tny relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-3xl sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
