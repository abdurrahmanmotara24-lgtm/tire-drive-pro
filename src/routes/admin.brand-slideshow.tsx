import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { BrandSlideshowPreview } from "@/components/admin/brand-slideshow-preview";
import { BrandSlideshowSlideList } from "@/components/admin/brand-slideshow-slide-list";
import { AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { deleteFile, uploadFile } from "@/components/admin/media-picker";
import { AdminUnsavedPill } from "@/components/admin/admin-unsaved-pill";
import { useAdminForm } from "@/hooks/use-admin-form";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useLovableCloudBackend } from "@/hooks/use-lovable-cloud-backend";
import { LOVABLE_CLOUD_CREDENTIALS_HINT } from "@/lib/lovable-cloud-backend";
import {
  createEmptySlide,
  DEFAULT_BRAND_SLIDESHOW,
  fetchBrandSlideshowContent,
  saveBrandSlideshowContent,
  storagePathFromUrl,
  type BrandSlideshowContent,
} from "@/lib/brand-slideshow";

export const Route = createFileRoute("/admin/brand-slideshow")({
  component: BrandSlideshowAdmin,
});

function BrandSlideshowAdmin() {
  const qc = useQueryClient();
  const cloudBackend = useLovableCloudBackend();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [previewUploading, setPreviewUploading] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["content", "brand_slideshow"],
    queryFn: async () => {
      setLoadError(null);
      try {
        return await fetchBrandSlideshowContent();
      } catch (e) {
        const msg = (e as Error).message;
        setLoadError(msg);
        throw e;
      }
    },
    retry: 1,
  });

  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm<BrandSlideshowContent>({
    data,
    queryKey: ["content", "brand_slideshow"],
    onSave: async (v) => {
      await saveBrandSlideshowContent(v);
      await qc.invalidateQueries({ queryKey: ["brand_slideshow"] });
    },
    successMessage: "Brand slideshow saved.",
  });

  const handleDeleteStorage = useCallback(async (storagePath: string) => {
    if (!isSupabaseConfigured()) return;
    await deleteFile(storagePath);
  }, []);

  const addSlidesFromFiles = useCallback(
    async (files: FileList) => {
      if (!form || !files.length) return;
      setPreviewUploading(true);
      try {
        const added = [];
        for (const file of Array.from(files)) {
          const url = await uploadFile(file);
          const path = url.includes("/site-media/") ? (storagePathFromUrl(url) ?? undefined) : undefined;
          added.push({
            ...createEmptySlide(url, path),
            sort_order: form.slides.length + added.length,
          });
        }
        setForm({
          ...form,
          slides: [...form.slides, ...added].map((s, i) => ({ ...s, sort_order: i })),
        });
        toast.success(added.length === 1 ? "Slide added from preview" : `${added.length} slides added`);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setPreviewUploading(false);
      }
    },
    [form, setForm],
  );

  if (isLoading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading brand slideshow…
      </div>
    );
  }

  if (isError && !form) {
    return (
      <Card className="flex items-start gap-3 border-destructive/40 bg-destructive/5 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Could not load slideshow</p>
          <p className="mt-1 text-sm text-muted-foreground">{(error as Error)?.message ?? loadError}</p>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-primary hover:underline"
            onClick={() => void refetch()}
          >
            Try again
          </button>
        </div>
      </Card>
    );
  }

  if (!ready || !form) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Preparing editor…
      </div>
    );
  }

  const autoplaySec = Math.round(form.settings.autoplay_ms / 1000);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Brand Slideshow</h1>
        <AdminUnsavedPill show={isDirty} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the &ldquo;Premium brands in stock&rdquo; background slideshow. Changes preview below before you save.
      </p>
      {cloudBackend === "unavailable" && (
        <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Cloud storage unavailable in this preview — uploads save locally only. {LOVABLE_CLOUD_CREDENTIALS_HINT}
        </p>
      )}
      <AdminPreviewMobileLink previewPath="/" previewHash="inventory-band" />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr,min(420px,42%)]">
        <div className="space-y-6">
          <Card className="space-y-4 p-4 sm:p-6">
            <h2 className="text-sm font-bold">Slideshow settings</h2>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label>Autoplay speed</Label>
                  <span className="text-xs text-muted-foreground">{autoplaySec}s</span>
                </div>
                <Slider
                  className="mt-2"
                  min={3}
                  max={9}
                  step={1}
                  value={[autoplaySec]}
                  onValueChange={([v]) =>
                    setForm({
                      ...form,
                      settings: { ...form.settings, autoplay_ms: (v ?? 4.5) * 1000 },
                    })
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label>Overlay darkness</Label>
                  <span className="text-xs text-muted-foreground">{form.settings.overlay_opacity}%</span>
                </div>
                <Slider
                  className="mt-2"
                  min={20}
                  max={95}
                  step={1}
                  value={[form.settings.overlay_opacity]}
                  onValueChange={([v]) =>
                    setForm({
                      ...form,
                      settings: { ...form.settings, overlay_opacity: v ?? 72 },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
                <div>
                  <Label htmlFor="zoom-enabled">Ken Burns zoom</Label>
                  <p className="text-xs text-muted-foreground">Subtle slow zoom on each slide</p>
                </div>
                <Switch
                  id="zoom-enabled"
                  checked={form.settings.zoom_enabled}
                  onCheckedChange={(zoom_enabled) =>
                    setForm({ ...form, settings: { ...form.settings, zoom_enabled } })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-sm font-bold">Slides</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {form.slides.filter((s) => s.active).length} active of {form.slides.length} total
            </p>
            <div className="mt-4">
              <BrandSlideshowSlideList
                slides={form.slides}
                onChange={(slides) => setForm({ ...form, slides })}
                onDeleteStorage={isSupabaseConfigured() ? handleDeleteStorage : undefined}
              />
            </div>
            <button
              type="button"
              className="mt-4 text-xs text-muted-foreground hover:text-foreground hover:underline"
              onClick={() => setForm(DEFAULT_BRAND_SLIDESHOW)}
            >
              Reset to default placeholders
            </button>
          </Card>

          <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} label="Save slideshow" />
        </div>

        <Card className="h-fit p-4 sm:p-6 xl:sticky xl:top-8">
          <h2 className="text-sm font-bold">Live preview</h2>
          <p className="mt-1 text-xs text-muted-foreground">Unsaved draft — matches homepage band after save</p>
          <BrandSlideshowPreview
            draft={form}
            className="mt-4"
            onFilesDropped={(files) => void addSlidesFromFiles(files)}
            uploading={previewUploading}
          />
        </Card>
      </div>
    </div>
  );
}
