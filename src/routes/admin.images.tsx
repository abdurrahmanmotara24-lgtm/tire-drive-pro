import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DEFAULTS,
  fetchContent,
  saveContent,
  type HeroContent,
  type HomepageContent,
  type ImageBandContent,
} from "@/lib/site-content";
import { FALLBACK_IMAGES } from "@/lib/site-images";
import heroWarehouse from "@/assets/hero-warehouse.png";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/admin/media-picker";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { useDirtyGuard, useSaveShortcut } from "@/hooks/use-admin-form";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/images")({
  component: ImagesAdmin,
});

type FormState = {
  hero: Pick<HeroContent, "background_image" | "focal_x" | "focal_y">;
  homepage: HomepageContent;
};

function ImagesAdmin() {
  const qc = useQueryClient();
  const { data: heroData } = useQuery({ queryKey: ["content", "hero"], queryFn: () => fetchContent("hero") });
  const { data: homepageData } = useQuery({
    queryKey: ["content", "homepage"],
    queryFn: () => fetchContent("homepage"),
  });
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const baselineRef = useRef("");

  useEffect(() => {
    if (!heroData || !homepageData || baselineRef.current) return;
    const initial: FormState = {
      hero: {
        background_image: heroData.background_image,
        focal_x: heroData.focal_x ?? DEFAULTS.hero.focal_x,
        focal_y: heroData.focal_y ?? DEFAULTS.hero.focal_y,
      },
      homepage: homepageData,
    };
    setForm(initial);
    baselineRef.current = JSON.stringify(initial);
  }, [heroData, homepageData]);

  const isDirty = form !== null && baselineRef.current !== "" && JSON.stringify(form) !== baselineRef.current;

  const submit = useCallback(async () => {
    if (!form || !heroData) return;
    setBusy(true);
    try {
      await saveContent("hero", {
        ...heroData,
        background_image: form.hero.background_image,
        focal_x: form.hero.focal_x,
        focal_y: form.hero.focal_y,
      });
      await saveContent("homepage", form.homepage);
      baselineRef.current = JSON.stringify(form);
      await qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Images saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [form, heroData, qc]);

  useDirtyGuard(isDirty);
  useSaveShortcut(() => void submit(), isDirty && !busy);

  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const heroPreview = form.hero.background_image || heroWarehouse;
  const fx = form.hero.focal_x ?? 36;
  const fy = form.hero.focal_y ?? 46;

  const updateBand = (key: "technician_band" | "inventory_band", patch: Partial<ImageBandContent>) => {
    setForm({
      ...form,
      homepage: {
        ...form.homepage,
        [key]: { ...form.homepage[key], ...patch },
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Images</h1>
      <p className="text-sm text-muted-foreground">
        Upload photos for the homepage hero, feature bands, and about page. Use the{" "}
        <Link to="/admin/media" className="text-primary hover:underline">
          media library
        </Link>{" "}
        to manage uploads, or{" "}
        <Link to="/admin/hero" className="text-primary hover:underline">
          hero settings
        </Link>{" "}
        for headline and CTA text.
      </p>
      <AdminPreviewMobileLink previewPath="/" />

      <div className="mt-6 space-y-6">
        <Card className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold">Homepage hero background</h2>
              <p className="text-xs text-muted-foreground">Full-width image behind the main headline.</p>
            </div>
            <ResetDefaultsButton
              label="Reset hero image"
              onReset={() =>
                setForm({
                  ...form,
                  hero: {
                    ...form.hero,
                    background_image: "",
                    focal_x: DEFAULTS.hero.focal_x,
                    focal_y: DEFAULTS.hero.focal_y,
                  },
                })
              }
            />
          </div>

          <div className="overflow-hidden rounded-md border border-border">
            <img
              src={heroPreview}
              alt=""
              className="aspect-[16/9] w-full object-cover"
              style={{ objectPosition: `${fx}% ${fy}%` }}
            />
          </div>

          <MediaPicker
            value={form.hero.background_image}
            onChange={(url) => setForm({ ...form, hero: { ...form.hero, background_image: url } })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Focus X ({fx}%)</Label>
              <Slider
                value={[fx]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => setForm({ ...form, hero: { ...form.hero, focal_x: v[0] } })}
              />
            </div>
            <div>
              <Label>Focus Y ({fy}%)</Label>
              <Slider
                value={[fy]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => setForm({ ...form, hero: { ...form.hero, focal_y: v[0] } })}
              />
            </div>
          </div>
        </Card>

        <BandEditor
          title="“Technicians who care” band"
          description="Large photo section on the homepage (and default for the about story image)."
          band={form.homepage.technician_band}
          fallback={FALLBACK_IMAGES.technician}
          onChange={(patch) => updateBand("technician_band", patch)}
          onReset={() =>
            setForm({ ...form, homepage: { ...form.homepage, technician_band: { ...DEFAULTS.homepage.technician_band } } })
          }
        />

        <BandEditor
          title="“Premium brands in stock” band"
          description="Second feature band on the homepage before the process steps."
          band={form.homepage.inventory_band}
          fallback={FALLBACK_IMAGES.inventory}
          onChange={(patch) => updateBand("inventory_band", patch)}
          onReset={() =>
            setForm({ ...form, homepage: { ...form.homepage, inventory_band: { ...DEFAULTS.homepage.inventory_band } } })
          }
        />

        <Card className="space-y-4 p-6">
          <h2 className="text-sm font-bold">About page images</h2>
          <p className="text-xs text-muted-foreground">
            Optional overrides. Leave empty to reuse the technician or inventory band photos above.
          </p>

          <ImageField
            label="Our story photo"
            value={form.homepage.about_story_image}
            fallback={form.homepage.technician_band.image || FALLBACK_IMAGES.technician}
            onChange={(url) => setForm({ ...form, homepage: { ...form.homepage, about_story_image: url } })}
            onClear={() => setForm({ ...form, homepage: { ...form.homepage, about_story_image: "" } })}
          />

          <ImageField
            label="Values section banner"
            value={form.homepage.about_banner_image}
            fallback={form.homepage.inventory_band.image || FALLBACK_IMAGES.inventory}
            onChange={(url) => setForm({ ...form, homepage: { ...form.homepage, about_banner_image: url } })}
            onClear={() => setForm({ ...form, homepage: { ...form.homepage, about_banner_image: "" } })}
          />
        </Card>

        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} label="Save images" />
      </div>
    </div>
  );
}

function BandEditor({
  title,
  description,
  band,
  fallback,
  onChange,
  onReset,
}: {
  title: string;
  description: string;
  band: ImageBandContent;
  fallback: string;
  onChange: (patch: Partial<ImageBandContent>) => void;
  onReset: () => void;
}) {
  const preview = band.image.trim() || fallback;

  return (
    <Card className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ResetDefaultsButton label="Reset section" onReset={onReset} />
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <img src={preview} alt="" className="aspect-[21/9] w-full object-cover" />
      </div>

      <div>
        <Label>Photo</Label>
        <MediaPicker value={band.image} onChange={(url) => onChange({ image: url })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Eyebrow</Label>
          <Input value={band.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} />
        </div>
        <div>
          <Label>Headline</Label>
          <Input value={band.title} onChange={(e) => onChange({ title: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Subtitle</Label>
        <Textarea rows={2} value={band.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} />
      </div>
    </Card>
  );
}

function ImageField({
  label,
  value,
  fallback,
  onChange,
  onClear,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (url: string) => void;
  onClear: () => void;
}) {
  const preview = value.trim() || fallback;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-md border border-border">
        <img src={preview} alt="" className="aspect-[4/3] max-h-48 w-full object-cover" />
      </div>
      <MediaPicker value={value} onChange={onChange} />
      {value ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Use band default
        </Button>
      ) : null}
    </div>
  );
}
