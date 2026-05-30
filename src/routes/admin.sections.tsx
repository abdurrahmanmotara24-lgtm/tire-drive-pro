import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { fetchContent, saveContent, type SectionsContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useAdminForm } from "@/hooks/use-admin-form";

export const Route = createFileRoute("/admin/sections")({ component: SectionsAdmin });

const labels: Record<keyof SectionsContent, string> = {
  brands_enabled: "Brand Showcase",
  why_us_enabled: "Services",
  specials_enabled: "Specials",
  process_enabled: "How It Works",
  testimonials_enabled: "Testimonials",
  quote_enabled: "Quote / Lead Form",
  final_cta_enabled: "Final CTA Bar",
};

const previews: Record<keyof SectionsContent, string> = {
  brands_enabled: "/#brands",
  why_us_enabled: "/#services",
  specials_enabled: "/#specials",
  process_enabled: "/#process",
  testimonials_enabled: "/#testimonials",
  quote_enabled: "/#quote",
  final_cta_enabled: "/#final-cta",
};

function SectionsAdmin() {
  const { data } = useQuery({ queryKey: ["content", "sections"], queryFn: () => fetchContent("sections") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "sections"],
    onSave: (v) => saveContent("sections", v),
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Homepage Sections</h1>
      <p className="text-sm text-muted-foreground">Show or hide sections on the homepage.</p>
      <Card className="mt-6 space-y-3 p-6">
        {(Object.keys(labels) as (keyof SectionsContent)[]).map((k) => (
          <div key={k} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
            <div className="min-w-0">
              <span className="text-sm font-medium">{labels[k]}</span>
              <Link
                to="/"
                hash={previews[k].slice(2)}
                target="_blank"
                className="mt-0.5 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Preview <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Switch checked={form[k]} onCheckedChange={(v) => setForm({ ...form, [k]: v })} />
          </div>
        ))}
        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
      </Card>
    </div>
  );
}
