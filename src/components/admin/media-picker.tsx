import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, X } from "lucide-react";
import { compressImageForUpload } from "@/lib/compress-image";
import { toast } from "sonner";

const BUCKET = "site-media";

export function publicUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

type MediaFile = { name: string; url: string };

export function useMediaList() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from(BUCKET).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setFiles((data ?? []).filter((f) => f.name && !f.name.startsWith(".")).map((f) => ({ name: f.name, url: publicUrl(f.name) })));
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);
  return { files, loading, refresh };
}

export async function uploadFile(file: File): Promise<string> {
  const prepared = await compressImageForUpload(file);
  const ext = prepared.name.split(".").pop() ?? "bin";
  const safe = prepared.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${Date.now()}-${safe.slice(0, 60)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, prepared, {
    upsert: false,
    contentType: prepared.type,
  });
  if (error) throw error;
  return publicUrl(path);
}

export async function deleteFile(name: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) throw error;
}

export function MediaPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const { files, refresh } = useMediaList();
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(value ?? "");

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      await refresh();
      onChange(url);
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} placeholder="Image URL or upload below" onChange={(e) => { onChange(e.target.value); setManual(e.target.value); }} />
        {value ? (
          <Button type="button" variant="outline" size="icon" onClick={() => onChange("")}><X className="h-4 w-4" /></Button>
        ) : null}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-md border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-32 w-full object-cover" />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Uploading…" : "Upload new"}
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        </label>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(!open)}>
          {open ? "Hide library" : "Browse library"}
        </Button>
      </div>

      {open && (
        <div className="grid grid-cols-3 gap-2 rounded-md border border-border p-2 sm:grid-cols-4">
          {files.length === 0 && <div className="col-span-full p-4 text-center text-xs text-muted-foreground">No images yet</div>}
          {files.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => { onChange(f.url); setOpen(false); }}
              className="group relative overflow-hidden rounded border border-border hover:border-primary"
            >
              <img src={f.url} alt="" className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaLibraryGrid() {
  const { files, refresh } = useMediaList();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const f of Array.from(fileList)) await uploadFile(f);
      await refresh();
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this image?")) return;
    try { await deleteFile(name); await refresh(); toast.success("Deleted"); }
    catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : "Upload images"}
        <input type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); }} />
      </label>

      <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {files.length === 0 && <div className="col-span-full p-12 text-center text-sm text-muted-foreground">No images yet</div>}
        {files.map((f) => (
          <div key={f.name} className="group relative overflow-hidden rounded-md border border-border">
            <img src={f.url} alt="" className="aspect-square w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 p-1 text-[10px] text-white opacity-0 group-hover:opacity-100">
              <button onClick={() => { navigator.clipboard.writeText(f.url); toast.success("URL copied"); }} className="truncate">Copy URL</button>
              <button onClick={() => handleDelete(f.name)}><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
