import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  name: string;
  text: string;
  rating?: number;
  className?: string;
};

export function TestimonialCard({ name, text, rating = 5, className }: TestimonialCardProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={cn("rounded-xl bg-card p-5 ring-1 ring-border shadow-soft transition-transform hover:-translate-y-0.5", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
          {initial}
        </div>
        <div>
          <div className="flex gap-0.5 text-brand-red-accent" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
            ))}
          </div>
          <p className="text-sm font-semibold text-primary">{name}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">&ldquo;{text}&rdquo;</p>
    </div>
  );
}
