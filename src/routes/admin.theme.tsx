import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BRAND_RED, BRAND_RED_LIGHT } from "@/lib/brand-colors";
import { fetchContent, saveContent, THEME_PALETTE_VERSION } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { ColorPickerField } from "@/components/admin/color-picker-field";
import { ThemePreviewPanel } from "@/components/admin/theme-preview-panel";
import { useAdminForm } from "@/hooks/use-admin-form";

export const Route = createFileRoute("/admin/theme")({ component: ThemeAdmin });

function ThemeAdmin() {
  const { data } = useQuery({ queryKey: ["content", "theme"], queryFn: () => fetchContent("theme") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "theme"],
    onSave: (v) => saveContent("theme", { ...v, palette_version: THEME_PALETTE_VERSION }),
    successMessage: "Theme saved. Colors apply site-wide immediately.",
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const primaryLight = form.primary_light || form.primary || BRAND_RED_LIGHT;
  const primaryDark = form.primary_dark || form.primary || BRAND_RED;
  const glowLight = form.glow_intensity_light ?? 35;
  const glowDark = form.glow_intensity_dark ?? 50;

  return (
    <div>
      <h1 className="text-2xl font-bold">Theme & colors</h1>
      <p className="text-sm text-muted-foreground">
        Pick brand accent colors and glow strength for buttons, links, cards, and highlights. Changes preview
        below — save to publish.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr,min(380px,38%)]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <h2 className="text-sm font-bold">Brand accent</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Used for primary buttons, links, icons, progress bars, and glow effects.
              </p>
            </div>
            <ColorPickerField
              label="Accent color — light mode"
              value={primaryLight}
              hint="Site when visitors use light theme."
              onChange={(primary_light) =>
                setForm({
                  ...form,
                  primary_light,
                  primary: primary_light,
                  brand_red_accent: primary_light,
                })
              }
            />
            <ColorPickerField
              label="Accent color — dark mode"
              value={primaryDark}
              hint="Site when visitors use dark theme."
              onChange={(primary_dark) => setForm({ ...form, primary_dark })}
            />
            <ColorPickerField
              label="Neutral / chrome tone"
              value={form.brand_red}
              hint="Muted text accents and chrome highlights."
              onChange={(brand_red) => setForm({ ...form, brand_red })}
            />
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <h2 className="text-sm font-bold">Glow & effects</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Controls the soft glow on primary buttons and highlighted cards.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label>Glow strength — light mode</Label>
                <span className="text-xs text-muted-foreground">{glowLight}%</span>
              </div>
              <Slider
                className="mt-2"
                min={0}
                max={100}
                step={1}
                value={[glowLight]}
                onValueChange={([v]) => setForm({ ...form, glow_intensity_light: v ?? 35 })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label>Glow strength — dark mode</Label>
                <span className="text-xs text-muted-foreground">{glowDark}%</span>
              </div>
              <Slider
                className="mt-2"
                min={0}
                max={100}
                step={1}
                value={[glowDark]}
                onValueChange={([v]) => setForm({ ...form, glow_intensity_dark: v ?? 50 })}
              />
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-sm font-bold">Layout</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Border radius</Label>
                <Input
                  className="mt-1"
                  value={form.radius}
                  onChange={(e) => setForm({ ...form, radius: e.target.value })}
                  placeholder="0.5rem"
                />
              </div>
              <div>
                <Label>Font family</Label>
                <Input
                  className="mt-1"
                  value={form.font}
                  onChange={(e) => setForm({ ...form, font: e.target.value })}
                  placeholder="Source Sans 3"
                />
              </div>
            </div>
            <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} label="Save theme" />
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-8">
          <ThemePreviewPanel theme={form} mode="light" />
          <ThemePreviewPanel theme={form} mode="dark" />
        </div>
      </div>
    </div>
  );
}
