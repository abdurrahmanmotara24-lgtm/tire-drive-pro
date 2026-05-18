import heroWarehouse from "@/assets/hero-warehouse.png";
import type { HeroContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type Props = {
  form: HeroContent;
  className?: string;
};

export function HeroPreviewPanel({ form, className }: Props) {
  const bg = form.background_image || heroWarehouse;
  const overlay = (form.overlay_opacity ?? 62) / 100;
  const fx = form.focal_x ?? 36;
  const fy = form.focal_y ?? 46;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <p className="border-b border-border bg-secondary/50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Hero preview
      </p>
      <div className="relative aspect-[16/9] min-h-[200px] bg-black">
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${fx}% ${fy}%` }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"
          style={{ opacity: overlay }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" style={{ opacity: overlay * 0.8 }} />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome">{form.badge}</p>
          <p className="font-display mt-1 text-2xl leading-tight">
            {form.title_line1}
            <span className="block text-primary">{form.title_line2}</span>
          </p>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{form.subtitle}</p>
        </div>
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/40 shadow-[0_0_12px_var(--primary)]"
          style={{ left: `${fx}%`, top: `${fy}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
