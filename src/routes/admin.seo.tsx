import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchContent, saveContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/media-picker";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useAdminForm } from "@/hooks/use-admin-form";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/seo")({ component: SeoAdmin });

function CharCount({ value, max, className }: { value: string; max: number; className?: string }) {
  const len = value.length;
  return (
    <p className={cn("text-right text-[11px]", len > max ? "text-destructive" : "text-muted-foreground", className)}>
      {len}/{max}
    </p>
  );
}

function SeoAdmin() {
  const { data } = useQuery({ queryKey: ["content", "seo"], queryFn: () => fetchContent("seo") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "seo"],
    onSave: (v) => saveContent("seo", v),
    successMessage: "SEO saved",
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">SEO</h1>
      <p className="text-sm text-muted-foreground">Meta title, description, and Open Graph image for search and social sharing.</p>
      <Card className="mt-6 space-y-4 p-6">
        <div>
          <Label>Meta title (≤60 chars)</Label>
          <Input value={form.title} maxLength={70} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <CharCount value={form.title} max={60} />
        </div>
        <div>
          <Label>Meta description (≤160 chars)</Label>
          <Textarea rows={3} maxLength={180} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <CharCount value={form.description} max={160} />
        </div>
        <div>
          <Label>Open Graph image</Label>
          <MediaPicker value={form.og_image} onChange={(url) => setForm({ ...form, og_image: url })} />
        </div>
        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} label="Save SEO" />
      </Card>
    </div>
  );
}
