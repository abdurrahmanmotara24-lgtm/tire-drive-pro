const MAX_WIDTH = 2400;
const WEBP_QUALITY = 0.85;

/** Resize and compress images before CMS upload (slideshow, media library). */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || typeof document === "undefined") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = bitmap.width > MAX_WIDTH ? MAX_WIDTH / bitmap.width : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await canvasToBlob(canvas, "image/webp", WEBP_QUALITY);
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      type,
      quality,
    );
  });
}
