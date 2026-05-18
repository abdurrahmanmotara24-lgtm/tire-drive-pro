import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchContent,
  fetchContentMeta,
  fetchLeads,
  fetchLocations,
  type LeadRow,
} from "@/lib/site-content";
import { getSiteHealthChecks, formatRelativeUpdated, CONTENT_LABELS } from "@/lib/admin-health";
import {
  ArrowRight,
  Image as ImageIcon,
  MapPin,
  Phone,
  Sliders,
  Wrench,
  MessageSquare,
  FileText,
  Palette,
  Search,
  Inbox,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: locs } = useQuery({ queryKey: ["locations", "all"], queryFn: () => fetchLocations(true) });
  const { data: newLeads = [] } = useQuery({
    queryKey: ["leads", "new-list"],
    queryFn: () => fetchLeads("new"),
    refetchInterval: 60_000,
  });
  const { data: recentLeads = [] } = useQuery({
    queryKey: ["leads", "recent"],
    queryFn: async () => (await fetchLeads("all")).slice(0, 5),
    refetchInterval: 60_000,
  });
  const { data: meta = {} } = useQuery({ queryKey: ["content", "meta"], queryFn: fetchContentMeta });
  const { data: contact } = useQuery({ queryKey: ["content", "contact"], queryFn: () => fetchContent("contact") });
  const { data: seo } = useQuery({ queryKey: ["content", "seo"], queryFn: () => fetchContent("seo") });

  const health = getSiteHealthChecks({
    contact: contact ?? { phone: "", email: "", whatsapp: "", address: "", hours: "", facebook: "", instagram: "", twitter: "" },
    seo: seo ?? { title: "", description: "", og_image: "" },
    contentMeta: meta,
  });

  const cards = [
    { to: "/admin/hero", title: "Hero Section", desc: "Headline, subtitle, CTAs, background.", icon: ImageIcon },
    { to: "/admin/sections", title: "Homepage Sections", desc: "Toggle and preview homepage blocks.", icon: Sliders },
    { to: "/admin/services", title: "Services & Brands", desc: "Service cards and brand marquee.", icon: Wrench },
    { to: "/admin/testimonials", title: "Reviews", desc: "Customer testimonials carousel.", icon: MessageSquare },
    { to: "/admin/about", title: "About & Process", desc: "About page story and process steps.", icon: FileText },
    { to: "/admin/contact", title: "Contact Info", desc: "Phone, email, WhatsApp, socials.", icon: Phone },
    { to: "/admin/leads", title: `Leads${newLeads.length ? ` (${newLeads.length} new)` : ""}`, desc: "Quote requests and contact form messages.", icon: Inbox },
    { to: "/admin/locations", title: `Locations (${locs?.length ?? 0})`, desc: "Branches and store hours.", icon: MapPin },
    { to: "/admin/theme", title: "Theme", desc: "Brand colors, radius, and fonts.", icon: Palette },
    { to: "/admin/seo", title: "SEO", desc: "Meta tags and Open Graph image.", icon: Search },
  ];

  const contentKeys = ["hero", "contact", "sections", "services", "testimonials", "about", "theme", "seo"] as const;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Command center</h1>
          <p className="text-sm text-muted-foreground">Overview, health checks, and quick actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant={newLeads.length ? "default" : "outline"}>
            <Link to="/admin/leads">
              <Inbox className="mr-1.5 h-4 w-4" />
              {newLeads.length ? `${newLeads.length} new leads` : "View leads"}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href="/" target="_blank" rel="noreferrer">
              View site
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-bold">Site health</h2>
          {health.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" /> All checks passed.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {health.map((issue) => (
                <li key={issue.id} className="flex items-start gap-2 text-sm">
                  <AlertTriangle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${issue.level === "error" ? "text-destructive" : "text-amber-600"}`}
                  />
                  <span className="flex-1">{issue.message}</span>
                  {issue.fixTo && (
                    <Link to={issue.fixTo} className="shrink-0 text-xs font-medium text-primary hover:underline">
                      Fix
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Recent leads</h2>
            <Link to="/admin/leads" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentLeads.map((lead) => (
                <RecentLeadRow key={lead.id} lead={lead} />
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-sm font-bold">Content last updated</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {contentKeys.map((key) => (
            <li key={key} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs">
              <span className="font-medium">{CONTENT_LABELS[key] ?? key}</span>
              <span className="text-muted-foreground">{formatRelativeUpdated(meta[key])}</span>
            </li>
          ))}
        </ul>
      </Card>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Manage content</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

function RecentLeadRow({ lead }: { lead: LeadRow }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
      <div>
        <span className="text-sm font-medium">{lead.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">{format(new Date(lead.created_at), "MMM d, h:mm a")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {lead.type}
        </Badge>
        <Badge variant={lead.status === "new" ? "default" : "secondary"} className="text-[10px]">
          {lead.status}
        </Badge>
      </div>
    </li>
  );
}
