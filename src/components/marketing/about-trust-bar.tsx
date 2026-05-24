import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function AboutTrustBar({ className }: Props) {
  const { contact, telHref, hasPhone } = useContactContent();

  const items = [
    contact.address?.trim() && {
      icon: MapPin,
      label: "Visit us",
      detail: contact.address,
      href: "/locations" as const,
    },
    contact.hours?.trim() && {
      icon: Clock,
      label: "Hours",
      detail: contact.hours,
      href: "/hours" as const,
    },
    hasPhone &&
      telHref && {
        icon: Phone,
        label: "Call",
        detail: contact.phone,
        href: telHref,
        external: true,
      },
  ].filter(Boolean) as {
    icon: typeof MapPin;
    label: string;
    detail: string;
    href: string;
    external?: boolean;
  }[];

  if (items.length === 0) return null;

  return (
    <section className={cn("border-y border-border bg-muted/25", className)} aria-label="Visit information">
      <div className="container-tny grid gap-4 py-6 sm:grid-cols-3 sm:gap-6 sm:py-8">
        {items.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">{item.detail}</p>
              </div>
            </>
          );
          const className =
            "hover-glass flex gap-3 rounded-sm border border-transparent p-3 transition-colors hover:border-border";

          if (item.external) {
            return (
              <a key={item.label} href={item.href} className={className}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={item.label} to={item.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
