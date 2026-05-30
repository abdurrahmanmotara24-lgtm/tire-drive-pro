import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent, saveContent, type SpecialItem } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { MediaPicker } from "@/components/admin/media-picker";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { duplicateItem, moveItem } from "@/lib/list-utils";
import { useAdminForm } from "@/hooks/use-admin-form";
import { SERVICE_ICON_OPTIONS } from "@/lib/icon-catalog";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/admin/specials")({ component: SpecialsAdmin });

const EMPTY_SPECIAL: SpecialItem = {
  icon: "Gauge",
  title: "",
  desc: "",
  price: "",
  badge: "",
  valid_until: "",
  image: "",
  quote_service: "",
};

function SpecialsAdmin() {
  const { data } = useQuery({ queryKey: ["content", "specials"], queryFn: () => fetchContent("specials") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "specials"],
    onSave: (v) => saveContent("specials", v),
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const items = form;

  const formPanel = (
    <Card className="space-y-4 p-6">
      <ResetDefaultsButton onReset={() => setForm([...DEFAULTS.specials])} />
      {items.map((item, i) => {
        const Icon = getIcon(item.icon || "Gauge");
        return (
          <div key={i} className="flex gap-2 rounded-md border p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === items.length - 1}
              onMoveUp={() => setForm(moveItem(items, i, -1))}
              onMoveDown={() => setForm(moveItem(items, i, 1))}
            />
            <div className="flex-1 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, title: e.target.value };
                    setForm(next);
                  }}
                />
                <Input
                  placeholder="Price (e.g. From R2,499)"
                  value={item.price}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, price: e.target.value };
                    setForm(next);
                  }}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={item.desc}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, desc: e.target.value };
                  setForm(next);
                }}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Badge (e.g. This week)"
                  value={item.badge ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, badge: e.target.value };
                    setForm(next);
                  }}
                />
                <Input
                  placeholder="Valid until (optional text)"
                  value={item.valid_until ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, valid_until: e.target.value };
                    setForm(next);
                  }}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Icon</Label>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Select
                      value={item.icon || "Gauge"}
                      onValueChange={(icon) => {
                        const next = [...items];
                        next[i] = { ...item, icon };
                        setForm(next);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Input
                  placeholder="Quote service prefill (optional)"
                  value={item.quote_service ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, quote_service: e.target.value };
                    setForm(next);
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Photo (optional)</Label>
                <MediaPicker
                  value={item.image ?? ""}
                  onChange={(url) => {
                    const next = [...items];
                    next[i] = { ...item, image: url };
                    setForm(next);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setForm(duplicateItem(items, i))}
                aria-label="Duplicate"
              >
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
        );
      })}
      <Button type="button" variant="outline" onClick={() => setForm([...items, { ...EMPTY_SPECIAL }])}>
        Add special
      </Button>
      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Specials</h1>
      <p className="text-sm text-muted-foreground">
        Homepage deal cards with icons and photos — toggle visibility under Sections.
      </p>
      <AdminPreviewMobileLink previewPath="/" previewHash="specials" />
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/" previewHash="specials">
          {formPanel}
        </AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}
