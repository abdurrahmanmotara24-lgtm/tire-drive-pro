import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type ServiceItem } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useDirtyGuard, useSaveShortcut } from "@/hooks/use-admin-form";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { DEFAULTS } from "@/lib/site-content";
import { duplicateItem, moveItem } from "@/lib/list-utils";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "services"], queryFn: () => fetchContent("services") });
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [brands, setBrands] = useState("");
  const [busy, setBusy] = useState(false);
  const baselineRef = useRef("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!data || loaded) return;
    void fetchContent("brands").then((b) => {
      setItems(data);
      setBrands(b.join("\n"));
      baselineRef.current = JSON.stringify({ items: data, brands: b.join("\n") });
      setLoaded(true);
    });
  }, [data, loaded]);

  const isDirty =
    baselineRef.current !== "" && JSON.stringify({ items, brands }) !== baselineRef.current;

  const submit = useCallback(async () => {
    setBusy(true);
    try {
      await saveContent("services", items);
      await saveContent(
        "brands",
        brands
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      baselineRef.current = JSON.stringify({ items, brands });
      await qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [items, brands, qc]);

  useDirtyGuard(isDirty);
  useSaveShortcut(() => void submit(), isDirty && !busy);

  if (!loaded) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const formPanel = (
    <Card className="space-y-4 p-6">
        <ResetDefaultsButton
          onReset={() => {
            setItems(DEFAULTS.services);
            setBrands(DEFAULTS.brands.join("\n"));
          }}
        />
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 rounded-md border p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === items.length - 1}
              onMoveUp={() => setItems(moveItem(items, i, -1))}
              onMoveDown={() => setItems(moveItem(items, i, 1))}
            />
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <Input
              placeholder="Icon (Wrench, Gauge…)"
              value={item.icon}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, icon: e.target.value };
                setItems(next);
              }}
            />
            <Input
              placeholder="Title"
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, title: e.target.value };
                setItems(next);
              }}
            />
            <Input
              placeholder="Description"
              value={item.desc}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, desc: e.target.value };
                setItems(next);
              }}
            />
            </div>
            <div className="flex flex-col gap-1">
              <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setItems(duplicateItem(items, i))} aria-label="Duplicate">
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={items.length <= 1}
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setItems([...items, { icon: "Wrench", title: "", desc: "" }])}>
          Add service
        </Button>
        <div>
          <Label>Brands (one per line)</Label>
          <Textarea className="mt-1 font-mono text-xs" rows={6} value={brands} onChange={(e) => setBrands(e.target.value)} />
        </div>
      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Services & Brands</h1>
      <p className="text-sm text-muted-foreground">Homepage service cards and brand marquee (one brand per line).</p>
      <AdminPreviewMobileLink previewPath="/" previewHash="services" />
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/" previewHash="services">
          {formPanel}
        </AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}
