import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type SeoContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/admin/media-picker";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo")({ component: SeoAdmin });

function SeoAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "seo"], queryFn: () => fetchContent("seo") });
  const [form, setForm] = useState<SeoContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const submit = async () => {
    setBusy(true);
    try { await saveContent("seo", form); qc.invalidateQueries({ queryKey: ["content", "seo"] }); toast.success("SEO saved"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">SEO</h1>
      <p className="text-sm text-muted-foreground">Meta title, description, and Open Graph image.</p>
      <Card className="mt-6 p-6 space-y-4">
        <div>
          <Label>Meta title (≤60 chars)</Label>
          <Input value={form.title} maxLength={70} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label>Meta description (≤160 chars)</Label>
          <Textarea rows={3} maxLength={180} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Label>Open Graph image</Label>
          <MediaPicker value={form.og_image} onChange={(url) => setForm({ ...form, og_image: url })} />
        </div>
        <div className="flex justify-end"><Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save"}</Button></div>
      </Card>
    </div>
  );
}
