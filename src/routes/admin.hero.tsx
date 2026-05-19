import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent, saveContent, type HeroContent } from "@/lib/site-content";
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
        <Textarea rows={3} value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
