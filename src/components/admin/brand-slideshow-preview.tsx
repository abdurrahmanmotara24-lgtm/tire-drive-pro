import { useState } from "react";
import { ImageBandSlideshowBg } from "@/components/marketing/image-band-slideshow-bg";
import type { BrandSlideshowContent } from "@/lib/brand-slideshow";
import { selectActiveSlides } from "@/lib/brand-slideshow";
import { cn } from "@/lib/utils";

type Props = {
  draft: BrandSlideshowContent;
  className?: string;
  onFilesDropped?: (files: FileList) => void;
  uploading?: boolean;
};

export function BrandSlideshowPreview({ draft, className, onFilesDropped, uploading }: Props) {
  const slides = selectActiveSlides(draft);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate min-h-[12rem] overflow-hidden rounded-md border border-border sm:min-h-[14rem]",
        dragOver && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className,
      )}
      onDragOver={(e) => {
        if (!onFilesDropped) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!onFilesDropped) return;
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) onFilesDropped(e.dataTransfer.files);
      }}
    >
      {slides.length === 0 ? (
        <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 bg-muted px-4 text-center text-sm text-muted-foreground sm:min-h-[14rem]">
          <p>No active slides — enable at least one slide to preview.</p>
          {onFilesDropped && <p className="text-xs">Drop images here to add slides</p>}
        </div>
      ) : (
        <>
          <ImageBandSlideshowBg slides={slides} settings={draft.settings} />
          <div className="image-band__gradient image-band__gradient--slideshow absolute inset-0" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Preview</p>
            <p className="font-display mt-1 text-lg text-foreground">Premium brands in stock</p>
          </div>
          {onFilesDropped && (
            <p className="pointer-events-none absolute inset-x-0 top-2 z-10 text-center text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
              {uploading ? "Uploading…" : dragOver ? "Drop to add slides" : "Drop images to add"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
