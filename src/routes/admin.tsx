import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, signOut } from "@/hooks/use-auth";
import { fetchLeads } from "@/lib/site-content";
import { useLeadNotifications } from "@/hooks/use-lead-notifications";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Images,
  Presentation,
  Phone,
  MapPin,
  Sliders,
  Search,
  Users,
  LogOut,
  Eye,
  Palette,
  FolderOpen,
  Wrench,
  MessageSquare,
  FileText,
  Inbox,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AdminKeyboardHelp } from "@/components/admin/admin-keyboard-help";
import { useLovableCloudBackend } from "@/hooks/use-lovable-cloud-backend";
import { LOVABLE_CLOUD_CREDENTIALS_HINT } from "@/lib/lovable-cloud-backend";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tires Near You" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: ImageIcon },
  { to: "/admin/images", label: "Images", icon: Images },
  { to: "/admin/brand-slideshow", label: "Brand Slideshow", icon: Presentation },
  { to: "/admin/sections", label: "Sections", icon: Sliders },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/testimonials", label: "Reviews", icon: MessageSquare },
  { to: "/admin/about", label: "About", icon: FileText },
  { to: "/admin/contact", label: "Contact", icon: Phone },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/locations", label: "Locations", icon: MapPin },
  { to: "/admin/media", label: "Media Library", icon: FolderOpen },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/users", label: "Admin Users", icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { data: newLeads = 0 } = useQuery({
    queryKey: ["leads", "new-count"],
    queryFn: async () => (await fetchLeads("new")).length,
    refetchInterval: 60_000,
  });

  return (
    <>
      {nav.map((item) => {
        const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
        const showBadge = item.to === "/admin/leads" && newLeads > 0;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-bold">
                {newLeads}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const cloudBackend = useLovableCloudBackend();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useLeadNotifications(Boolean(isStaff && user && !loading));

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  // Force light theme for the admin shell regardless of the public site's color mode
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const prevDark = html.classList.contains("dark");
    html.classList.remove("dark");
    html.classList.add("light");
    const prevScheme = html.style.colorScheme;
    html.style.colorScheme = "light";
    return () => {
      html.classList.remove("light");
      if (prevDark) html.classList.add("dark");
      html.style.colorScheme = prevScheme;
    };
  }, []);

  if (loading) {
    return <div className="admin-light flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Access pending</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) doesn't have admin access yet. Ask an existing admin to grant you the <strong>admin</strong> or <strong>editor</strong> role, or — if you are the first user — set yourself as admin from the database.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">User ID: <code className="text-foreground">{user.id}</code></p>
          <Button className="mt-6" variant="outline" onClick={async () => { await signOut(); navigate({ to: "/login" }); }}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-light flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link to="/admin" className="text-base font-bold">Tires Admin</Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          <NavLinks />
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <Link to="/" target="_blank" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
            <Eye className="h-4 w-4" /> View Site
          </Link>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="mt-2 truncate px-3 text-[11px] text-muted-foreground">{user.email}</div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background px-3 md:hidden">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b border-border px-4 font-bold">Tires Admin</div>
            <nav className="space-y-0.5 p-3">
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="space-y-1 border-t border-border p-3">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                onClick={() => setMenuOpen(false)}
              >
                <Eye className="h-4 w-4" /> View Site
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/admin" className="text-sm font-bold">
          Tires Admin
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate({ to: "/login" });
          }}
          className="text-xs"
        >
          Sign out
        </button>
      </div>

      <main className="mt-12 flex-1 md:ml-0 md:mt-0">
        <div className="mx-auto w-full max-w-[1600px] p-4 md:p-8">
          {cloudBackend === "unavailable" && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            >
              <p className="font-semibold">Cloud keys not loaded in this preview</p>
              <p className="mt-1 text-xs">{LOVABLE_CLOUD_CREDENTIALS_HINT}</p>
            </div>
          )}
          <Outlet />
        </div>
      </main>
      <AdminKeyboardHelp />
    </div>
  );
}
