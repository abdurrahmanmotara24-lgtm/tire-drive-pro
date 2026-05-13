import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type SectionsContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/sections")({ component: SectionsAdmin });

const labels: Record<keyof SectionsContent, string> = {
  promos_enabled: "Promotions",
  brands_enabled: "Brand Showcase",
  why_us_enabled: "Why Choose Us",
  testimonials_enabled: "Testimonials",
  quote_enabled: "Quote / Lead Form",
  final_cta_enabled: "Final CTA Bar",
};

function SectionsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "sections"], queryFn: () => fetchContent("sections") });
  const [form, setForm] = useState<SectionsContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const submit = async () => {
    setBusy(true);
    try { await saveContent("sections", form); qc.invalidateQueries({ queryKey: ["content", "sections"] }); toast.success("Saved"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Homepage Sections</h1>
      <p className="text-sm text-muted-foreground">Show or hide sections on the homepage.</p>
      <Card className="mt-6 p-6 space-y-3">
        {(Object.keys(labels) as (keyof SectionsContent)[]).map((k) => (
          <div key={k} className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="text-sm font-medium">{labels[k]}</span>
            <Switch checked={form[k]} onCheckedChange={(v) => setForm({ ...form, [k]: v })} />
          </div>
        ))}
        <div className="flex justify-end pt-2"><Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button></div>
      </Card>
    </div>
  );
}
