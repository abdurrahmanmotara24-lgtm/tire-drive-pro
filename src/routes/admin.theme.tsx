import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BRAND_RED } from "@/lib/brand-colors";
import { fetchContent, saveContent, THEME_PALETTE_VERSION } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useAdminForm } from "@/hooks/use-admin-form";

export const Route = createFileRoute("/admin/theme")({ component: ThemeAdmin });

function ThemeAdmin() {
  const { data } = useQuery({ queryKey: ["content", "theme"], queryFn: () => fetchContent("theme") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "theme"],
    onSave: (v) => saveContent("theme", { ...v, palette_version: THEME_PALETTE_VERSION }),
    successMessage: "Theme saved. Refresh to see changes everywhere.",
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const primary = form.primary || BRAND_RED;

  return (
    <div>
      <h1 className="text-2xl font-bold">Theme</h1>
      <p className="text-sm text-muted-foreground">Brand colors, radius, and font. Use OKLCH or hex values.</p>
      <Card className="mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Brand red (CTAs, links, accents)</Label>
            <Input
              value={primary}
              onChange={(e) =>
                setForm({
                  ...form,
                  primary: e.target.value,
                  brand_red_accent: e.target.value,
                })
              }
            />
            <div className="mt-1 h-6 rounded" style={{ background: primary }} />
          </div>
          <div>
            <Label>Chrome / neutral</Label>
            <Input value={form.brand_red} onChange={(e) => setForm({ ...form, brand_red: e.target.value })} />
            <div className="mt-1 h-6 rounded" style={{ background: form.brand_red }} />
          </div>
          <div>
            <Label>Border radius</Label>
            <Input value={form.radius} onChange={(e) => setForm({ ...form, radius: e.target.value })} placeholder="0.625rem" />
          </div>
          <div>
            <Label>Font family</Label>
            <Input value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} placeholder="Inter" />
          </div>
        </div>
        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} label="Save theme" />
      </Card>
    </div>
  );
}
