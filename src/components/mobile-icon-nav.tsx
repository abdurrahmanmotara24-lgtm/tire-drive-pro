import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Info, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/about", label: "About", icon: Info, exact: false },
  { to: "/locations", label: "Locations", icon: MapPin, exact: false },
  { to: "/contact", label: "Contact", icon: Phone, exact: false },
] as const;

function isActive(pathname: string, to: string, exact: boolean) {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function MobileIconNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="mobile-icon-nav flex min-w-0 shrink-0 items-center justify-end gap-1.5 max-[380px]:gap-1 md:hidden"
      aria-label="Mobile quick navigation"
    >
      {routes.map((item) => {
        const active = isActive(pathname, item.to, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={cn("mobile-icon-nav-btn hover-scale", active && "mobile-icon-nav-btn-active")}
          >
            <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={active ? 2.25 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}
