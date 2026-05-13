import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type ThemeContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/theme")({ component: ThemeAdmin });

function ThemeAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "theme"], queryFn: () => fetchContent("theme") });
  const [form, setForm] = useState<ThemeContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const submit = async () => {
    setBusy(true);
    try { await saveContent("theme", form); qc.invalidateQueries({ queryKey: ["content", "theme"] }); toast.success("Theme saved. Refresh to see changes everywhere."); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Theme</h1>
      <p className="text-sm text-muted-foreground">Brand colors, radius, and font. Use OKLCH or hex values.</p>
      <Card className="mt-6 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Primary color (green)</Label>
            <Input value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
            <div className="mt-1 h-6 rounded" style={{ background: form.primary }} />
          </div>
          <div>
            <Label>Brand red (accent)</Label>
            <Input value={form.brand_red} onChange={(e) => setForm({ ...form, brand_red: e.target.value })} />
            <div className="mt-1 h-6 rounded" style={{ background: form.brand_red }} />
          </div>
          <div>
            <Label>Border radius</Label>
            <Input value={form.radius} onChange={(e) => setForm({ ...form, radius: e.target.value })} placeholder="0.625rem" />
          </div>
          <div>
            <Label>Font family</Label>
            <Input value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} placeholder="Inter" />
          </div>
        </div>
        <div className="flex justify-end"><Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save theme"}</Button></div>
      </Card>
    </div>
  );
}
