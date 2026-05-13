import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, signOut } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Phone,
  MapPin,
  Sliders,
  Search,
  Users,
  LogOut,
  Eye,
  Palette,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tires Near You" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: ImageIcon },
  { to: "/admin/sections", label: "Sections", icon: Sliders },
  { to: "/admin/contact", label: "Contact", icon: Phone },
  { to: "/admin/locations", label: "Locations", icon: MapPin },
  { to: "/admin/media", label: "Media Library", icon: FolderOpen },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/users", label: "Admin Users", icon: Users },
];

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
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
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link to="/admin" className="text-base font-bold">Tires Admin</Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
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

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background px-3">
        <Link to="/admin" className="text-sm font-bold">Tires Admin</Link>
        <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="text-xs">Sign out</button>
      </div>

      <main className="flex-1 md:ml-0 mt-12 md:mt-0">
        {/* Mobile nav */}
        <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 text-xs">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-md px-2.5 py-1.5 hover:bg-secondary whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
