import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchContent, saveContent, type HeroContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { MediaPicker } from "@/components/admin/media-picker";

export const Route = createFileRoute("/admin/hero")({
  component: HeroAdmin,
});

function HeroAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "hero"], queryFn: () => fetchContent("hero") });
  const [form, setForm] = useState<HeroContent | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const update = <K extends keyof HeroContent>(k: K, v: HeroContent[K]) => setForm({ ...form, [k]: v });

  const submit = async () => {
    setBusy(true);
    try {
      await saveContent("hero", form);
      qc.invalidateQueries({ queryKey: ["content", "hero"] });
      toast.success("Hero saved");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Hero Section</h1>
      <p className="text-sm text-muted-foreground">Headline, CTAs and background image at the top of the homepage.</p>

      <Card className="mt-6 p-6 space-y-5">
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
          <Label>Background image</Label>
          <MediaPicker value={form.background_image} onChange={(url) => update("background_image", url)} />
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
                <Input placeholder="Value" value={s.value} onChange={(e) => {
                  const stats = [...form.stats]; stats[i] = { ...s, value: e.target.value }; update("stats", stats);
                }} />
                <Input placeholder="Label" value={s.label} onChange={(e) => {
                  const stats = [...form.stats]; stats[i] = { ...s, label: e.target.value }; update("stats", stats);
                }} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
        </div>
      </Card>
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
