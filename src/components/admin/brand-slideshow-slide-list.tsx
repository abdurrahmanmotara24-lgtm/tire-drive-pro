import { useRef, useState } from "react";
import { Copy, GripVertical, ImageUp, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  BRAND_SLIDESHOW_DEFAULT_FOCAL,
  type BrandSlideshowSlide,
  createEmptySlide,
  reorderSlides,
} from "@/lib/brand-slideshow";
import { uploadFile } from "@/components/admin/media-picker";
import { toast } from "sonner";
import { storagePathFromUrl } from "@/lib/brand-slideshow";

type Props = {
  slides: BrandSlideshowSlide[];
  onChange: (slides: BrandSlideshowSlide[]) => void;
  onDeleteStorage?: (storagePath: string) => Promise<void>;
};

export function BrandSlideshowSlideList({ slides, onChange, onDeleteStorage }: Props) {
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const sorted = [...slides].sort((a, b) => a.sort_order - b.sort_order);

  const updateSlide = (id: string, patch: Partial<BrandSlideshowSlide>) => {
    onChange(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSlide = async (slide: BrandSlideshowSlide) => {
    if (!confirm("Remove this slide from the slideshow?")) return;
    const path = slide.storage_path ?? storagePathFromUrl(slide.image_url);
    if (path && onDeleteStorage) {
      try {
        await onDeleteStorage(path);
      } catch (e) {
        toast.error((e as Error).message);
        return;
      }
    }
    onChange(
      slides
        .filter((s) => s.id !== slide.id)
        .map((s, i) => ({ ...s, sort_order: i })),
    );
    toast.success("Slide removed");
  };

  const startReplace = (slideId: string) => {
    setReplacingId(slideId);
    replaceRef.current?.click();
  };

  const handleReplace = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !replacingId) return;
    const slide = slides.find((s) => s.id === replacingId);
    if (!slide) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      const path = url.includes("/site-media/") ? (storagePathFromUrl(url) ?? undefined) : undefined;
      const oldPath = slide.storage_path ?? storagePathFromUrl(slide.image_url);
      if (oldPath && onDeleteStorage) {
        try {
          await onDeleteStorage(oldPath);
        } catch {
          /* keep going — new image is already uploaded */
        }
      }
      updateSlide(replacingId, { image_url: url, storage_path: path });
      toast.success("Image replaced — save slideshow to publish");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      setReplacingId(null);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const added: BrandSlideshowSlide[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        const path = url.includes("/site-media/") ? storagePathFromUrl(url) ?? undefined : undefined;
        added.push({
          ...createEmptySlide(url, path),
          sort_order: slides.length + added.length,
        });
      }
      onChange([...slides, ...added].map((s, i) => ({ ...s, sort_order: i })));
      toast.success(added.length === 1 ? "Slide added" : `${added.length} slides added`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyFocusToAll = () => {
    onChange(
      slides.map((s) => ({
        ...s,
        focal_x: BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x,
        focal_y: BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y,
      })),
    );
    toast.success("Focus reset on all slides");
  };

  const duplicateSlide = (slide: BrandSlideshowSlide) => {
    const copy: BrandSlideshowSlide = {
      ...slide,
      id: crypto.randomUUID(),
      sort_order: slides.length,
    };
    onChange([...slides, copy].map((s, i) => ({ ...s, sort_order: i })));
    toast.success("Slide duplicated");
  };

  const onDrop = (targetIndex: number) => {
    if (dragIndex == null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    onChange(reorderSlides(sorted, dragIndex, targetIndex));
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-1.5 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload slides"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleUpload(e.target.files)}
        />
        <input
          ref={replaceRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleReplace(e.target.files)}
        />
        <Button type="button" variant="outline" size="sm" disabled={!sorted.length} onClick={applyFocusToAll}>
          Apply focus to all
        </Button>
        <span className="text-xs text-muted-foreground">
          Upload or replace per row · drag to reorder · drop on preview to add
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No slides yet. Upload images or save defaults to get started.
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((slide, index) => (
            <li
              key={slide.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(index);
              }}
              className={cn(
                "flex flex-col gap-3 rounded-md border border-border bg-card p-2 transition-shadow sm:p-3",
                dragOverIndex === index && dragIndex !== index && "ring-2 ring-primary/40",
                !slide.active && "opacity-60",
              )}
            >
              <div className="flex gap-3">
              <button
                type="button"
                className="mt-1 flex shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                aria-label="Drag to reorder"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-5 w-5" />
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={() => startReplace(slide.id)}
                className="group relative h-16 w-24 shrink-0 overflow-hidden rounded border border-border sm:h-20 sm:w-32"
                title="Replace image"
              >
                <img
                  src={slide.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${slide.focal_x ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x}% ${slide.focal_y ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y}%`,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {replacingId === slide.id && uploading ? "…" : "Replace"}
                </span>
              </button>

              <div className="min-w-0 flex-1 space-y-2">
                <p className="truncate text-xs text-muted-foreground" title={slide.image_url}>
                  {slide.storage_path ? `Storage: ${slide.storage_path}` : slide.image_url}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`active-${slide.id}`}
                      checked={slide.active}
                      onCheckedChange={(active) => updateSlide(slide.id, { active })}
                    />
                    <Label htmlFor={`active-${slide.id}`} className="text-xs font-normal">
                      Active
                    </Label>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Order {index + 1}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Duplicate slide"
                  onClick={() => duplicateSlide(slide)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  className="h-8 gap-1 px-2 text-xs"
                  onClick={() => startReplace(slide.id)}
                >
                  <ImageUp className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Replace</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Delete slide"
                  onClick={() => void removeSlide(slide)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              </div>

              <div className="grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">
                    Focus horizontal ({slide.focal_x ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x}%)
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Lower = show more left (logos)</p>
                  <Slider
                    className="mt-2"
                    min={0}
                    max={100}
                    step={1}
                    value={[slide.focal_x ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_x]}
                    onValueChange={([v]) => updateSlide(slide.id, { focal_x: v })}
                  />
                </div>
                <div>
                  <Label className="text-xs">
                    Focus vertical ({slide.focal_y ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y}%)
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Centre logos vertically</p>
                  <Slider
                    className="mt-2"
                    min={0}
                    max={100}
                    step={1}
                    value={[slide.focal_y ?? BRAND_SLIDESHOW_DEFAULT_FOCAL.focal_y]}
                    onValueChange={([v]) => updateSlide(slide.id, { focal_y: v })}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
