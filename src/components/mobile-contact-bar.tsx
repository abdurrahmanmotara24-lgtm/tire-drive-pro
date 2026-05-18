import { Link, useLocation } from "@tanstack/react-router";
import { Home, Info, Phone, Clock, Sunrise } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type DockItem = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  to?: string;
  icon: React.ReactNode;
  variant?: "wa" | "default";
};

export function MobileContactBar() {
  const { telHref, waHref, hasPhone } = useContactContent();
  const location = useLocation();

  const items: DockItem[] = [];

  if (waHref) {
    items.push({
      key: "wa",
      label: "WhatsApp",
      href: waHref,
      external: true,
      variant: "wa",
      icon: (
        <img
          src={logo}
          alt=""
          className="h-7 w-7 object-contain"
          draggable={false}
        />
      ),
    });
  }

  items.push({
    key: "home",
    label: "Home",
    href: "/",
    to: "/",
    icon: <Home className="h-5 w-5" strokeWidth={2.2} />,
  });
  items.push({
    key: "about",
    label: "About",
    href: "/about",
    to: "/about",
    icon: <Info className="h-5 w-5" strokeWidth={2.2} />,
  });
  if (hasPhone && telHref) {
    items.push({
      key: "call",
      label: "Call",
      href: telHref,
      icon: <Phone className="h-5 w-5" strokeWidth={2.2} />,
    });
  }
  items.push({
    key: "hours",
    label: "Hours",
    href: "/contact",
    to: "/contact",
    icon: <Clock className="h-5 w-5" strokeWidth={2.2} />,
  });
  items.push({
    key: "locations",
    label: "Locations",
    href: "/locations",
    to: "/locations",
    icon: <Sunrise className="h-5 w-5 text-[oklch(0.72_0.18_55)]" strokeWidth={2.2} />,
  });

  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 px-3",
      )}
      aria-label="Quick navigation"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between gap-2">
        {items.map((it) => {
          const active = it.to ? location.pathname === it.to : false;
          const isWa = it.variant === "wa";
          const cls = cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform active:scale-95",
            "shadow-[0_6px_18px_-6px_oklch(0_0_0/0.25),0_2px_4px_-2px_oklch(0_0_0/0.15)]",
            isWa
              ? "bg-[oklch(0.62_0.18_145)] text-white"
              : active
                ? "bg-[oklch(0.97_0.04_27)] text-primary ring-1 ring-primary/40"
                : "bg-white text-[oklch(0.18_0.02_264)]",
          );
          const content = (
            <span className={cls} aria-label={it.label}>
              {it.icon}
            </span>
          );
          return (
            <li key={it.key}>
              {it.to ? (
                <Link to={it.to} aria-label={it.label}>
                  {content}
                </Link>
              ) : (
                <a
                  href={it.href}
                  {...(it.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={it.label}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
