import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent, saveContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { duplicateItem, moveItem } from "@/lib/list-utils";
import { useAdminForm } from "@/hooks/use-admin-form";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

function TestimonialsAdmin() {
  const { data } = useQuery({ queryKey: ["content", "testimonials"], queryFn: () => fetchContent("testimonials") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "testimonials"],
    onSave: (v) => saveContent("testimonials", v),
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const items = form;

  const formPanel = (
    <Card className="space-y-4 p-6">
      <ResetDefaultsButton onReset={() => setForm([...DEFAULTS.testimonials])} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 rounded-md border p-4">
          <ReorderButtons
            disableUp={i === 0}
            disableDown={i === items.length - 1}
            onMoveUp={() => setForm(moveItem(items, i, -1))}
            onMoveDown={() => setForm(moveItem(items, i, 1))}
          />
          <div className="flex-1 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, name: e.target.value };
                  setForm(next);
                }}
              />
              <Input
                type="number"
                min={1}
                max={5}
                placeholder="Rating"
                value={item.rating}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, rating: Number(e.target.value) };
                  setForm(next);
                }}
              />
            </div>
            <Textarea
              placeholder="Quote"
              value={item.text}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, text: e.target.value };
                setForm(next);
              }}
            />
            <Input
              placeholder="Service (optional)"
              value={item.service ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, service: e.target.value };
                setForm(next);
              }}
            />
            <Input
              placeholder="Google review URL (optional)"
              value={item.review_url ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, review_url: e.target.value };
                setForm(next);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setForm(duplicateItem(items, i))} aria-label="Duplicate">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={items.length <= 1}
              onClick={() => setForm(items.filter((_, j) => j !== i))}
              aria-label="Remove"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setForm([...items, { name: "", text: "", rating: 5 }])}>
        Add review
      </Button>
      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Testimonials</h1>
      <AdminPreviewMobileLink previewPath="/" previewHash="testimonials" />
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/" previewHash="testimonials">
          {formPanel}
        </AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}
