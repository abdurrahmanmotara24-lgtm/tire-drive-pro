import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/locations", label: "Locations" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Tires Near You" className="h-12 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-brand-red" }}
              className="text-sm font-semibold text-foreground transition-colors hover:text-brand-red"
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="tel:+10000000000"
            className="hidden items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-brand-red-foreground shadow-red transition-transform hover:scale-105 sm:inline-flex"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="tel:+10000000000"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-brand-red-foreground"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
