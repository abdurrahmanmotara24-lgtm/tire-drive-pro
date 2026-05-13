import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/site-content";
import { ArrowRight, Image as ImageIcon, MapPin, Phone, Sliders } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: locs } = useQuery({ queryKey: ["locations", "all"], queryFn: () => fetchLocations(true) });

  const cards = [
    { to: "/admin/hero", title: "Hero Section", desc: "Edit headline, subtitle, CTAs, background.", icon: ImageIcon },
    { to: "/admin/sections", title: "Homepage Sections", desc: "Toggle and reorder homepage sections.", icon: Sliders },
    { to: "/admin/contact", title: "Contact Info", desc: "Phone, email, WhatsApp, socials.", icon: Phone },
    { to: "/admin/locations", title: `Locations (${locs?.length ?? 0})`, desc: "Manage branches and store hours.", icon: MapPin },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-sm text-muted-foreground">Manage your website content from here.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="p-5 transition-all hover:border-primary hover:shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{c.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
