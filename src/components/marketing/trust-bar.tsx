import { ShieldCheck, Truck, BadgeCheck, Headphones } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const items = [
  { icon: ShieldCheck, title: "Genuine products", desc: "Authorized brands only" },
  { icon: Truck, title: "Fast fitment", desc: "Same-day when available" },
  { icon: BadgeCheck, title: "Best price promise", desc: "Honest, competitive rates" },
  { icon: Headphones, title: "Expert support", desc: "Real advice, no pressure" },
];

export function TrustBar() {
  const reveal = useReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className={`border-b border-border bg-card py-10 ${reveal.className}`}>
      <div className="container-tny">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Built for drivers & fleet managers
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="hover-lift hover-icon-bump flex items-start gap-3 rounded-sm border border-transparent p-3 hover:border-border"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-primary transition-colors hover:bg-primary/25">
                <item.icon className="icon-bump h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
