import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULTS,
  DEFAULT_HERO_OFFERINGS,
  fetchContent,
  saveContent,
  type HeroContent,
  type HeroOffering,
} from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { HeroPreviewPanel } from "@/components/admin/hero-preview-panel";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { useAdminForm } from "@/hooks/use-admin-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_ICON_OPTIONS } from "@/lib/icon-catalog";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/admin/hero")({
  component: HeroAdmin,
});

function HeroAdmin() {
  const { data } = useQuery({ queryKey: ["content", "hero"], queryFn: () => fetchContent("hero") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "hero"],
    onSave: (v) => saveContent("hero", v),
    successMessage: "Hero saved",
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const update = <K extends keyof HeroContent>(k: K, v: HeroContent[K]) => setForm({ ...form, [k]: v });

  const formPanel = (
    <Card className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <HeroPreviewPanel form={form} className="w-full lg:hidden" />
        <ResetDefaultsButton onReset={() => setForm({ ...DEFAULTS.hero })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Badge text" value={form.badge} onChange={(v) => update("badge", v)} />
        <Field label="Headline line 1" value={form.title_line1} onChange={(v) => update("title_line1", v)} />
        <Field label="Headline line 2 (highlighted)" value={form.title_line2} onChange={(v) => update("title_line2", v)} />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Textarea rows={2} value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        <p className="mt-1 text-xs text-muted-foreground">
          Keep this general — use the service lines below for passenger, truck, and mag wheels.
        </p>
      </div>

      <div>
        <Label>Hero service lines</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Three focus areas shown as cards under the headline (each links to the quote form).
        </p>
        <div className="mt-3 space-y-3">
          {form.offerings.map((o, i) => (
            <OfferingEditor
              key={i}
              offering={o}
              onChange={(patch) => {
                const offerings = [...form.offerings];
                offerings[i] = { ...o, ...patch };
                update("offerings", offerings);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="mt-2 text-xs text-primary hover:underline"
          onClick={() => update("offerings", [...DEFAULT_HERO_OFFERINGS])}
        >
          Reset service lines to defaults
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary CTA text" value={form.cta_primary_text} onChange={(v) => update("cta_primary_text", v)} />
        <Field label="Primary CTA link" value={form.cta_primary_link} onChange={(v) => update("cta_primary_link", v)} />
        <Field label="Secondary CTA text" value={form.cta_secondary_text} onChange={(v) => update("cta_secondary_text", v)} />
        <Field label="Secondary CTA link" value={form.cta_secondary_link} onChange={(v) => update("cta_secondary_link", v)} />
      </div>

      <div>
        <Label>Overlay darkness ({form.overlay_opacity}%)</Label>
        <Slider value={[form.overlay_opacity]} min={0} max={100} step={5} onValueChange={(v) => update("overlay_opacity", v[0])} />
      </div>

      <div>
        <Label>Stats (3 items)</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {form.stats.map((s, i) => (
            <div key={i} className="space-y-2 rounded-md border border-border p-3">
              <Input
                placeholder="Value"
                value={s.value}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...s, value: e.target.value };
                  update("stats", stats);
                }}
              />
              <Input
                placeholder="Label"
                value={s.label}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...s, label: e.target.value };
                  update("stats", stats);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Hero Section</h1>
      <p className="text-sm text-muted-foreground">
        Headline, CTAs, and overlay for the homepage hero. Change the background photo on{" "}
        <Link to="/admin/images" className="text-primary hover:underline">
          Site Images
        </Link>
        .
      </p>
      <AdminPreviewMobileLink previewPath="/" />
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/">
          <HeroPreviewPanel form={form} className="mb-4" />
          {formPanel}
        </AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}

function OfferingEditor({
  offering,
  onChange,
}: {
  offering: HeroOffering;
  onChange: (patch: Partial<HeroOffering>) => void;
}) {
  const Icon = getIcon(offering.icon);
  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex items-start gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="grid flex-1 gap-2 sm:grid-cols-2">
          <Input
            placeholder="Label e.g. Truck tyres"
            value={offering.label}
            onChange={(e) => onChange({ label: e.target.value })}
          />
          <Select value={offering.icon || "Truck"} onValueChange={(icon) => onChange({ icon })}>
            <SelectTrigger>
              <SelectValue placeholder="Icon" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_ICON_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="sm:col-span-2"
            placeholder="Short description"
            value={offering.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="Quote prefill (optional)"
            value={offering.quote_service ?? ""}
            onChange={(e) => onChange({ quote_service: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
