import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type BrandItem, type ServiceItem } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useDirtyGuard, useSaveShortcut } from "@/hooks/use-admin-form";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_ICON_OPTIONS } from "@/lib/icon-catalog";
import { getIcon } from "@/lib/icons";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { MediaPicker } from "@/components/admin/media-picker";
import { DEFAULTS } from "@/lib/site-content";
import { duplicateItem, moveItem } from "@/lib/list-utils";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "services"], queryFn: () => fetchContent("services") });
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [busy, setBusy] = useState(false);
  const baselineRef = useRef("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!data || loaded) return;
    void fetchContent("brands").then((b) => {
      setItems(data);
      setBrands(b);
      baselineRef.current = JSON.stringify({ items: data, brands: b });
      setLoaded(true);
    });
  }, [data, loaded]);

  const isDirty =
    baselineRef.current !== "" && JSON.stringify({ items, brands }) !== baselineRef.current;

  const submit = useCallback(async () => {
    setBusy(true);
    try {
      await saveContent("services", items);
      await saveContent("brands", brands.filter((b) => b.name.trim()));
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
    <Card className="space-y-6 p-6">
      <ResetDefaultsButton
        onReset={() => {
          setItems(DEFAULTS.services);
          setBrands([...DEFAULTS.brands]);
        }}
      />
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Services</h2>
          <p className="text-xs text-muted-foreground">Homepage service cards.</p>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 rounded-md border p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === items.length - 1}
              onMoveUp={() => setItems(moveItem(items, i, -1))}
              onMoveDown={() => setItems(moveItem(items, i, 1))}
            />
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getIcon(item.icon);
                  return (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                  );
                })()}
                <Select
                  value={item.icon || "Wrench"}
                  onValueChange={(icon) => {
                    const next = [...items];
                    next[i] = { ...item, icon };
                    setItems(next);
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
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setItems(duplicateItem(items, i))}
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
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-sm font-semibold">Brand marquee logos</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Upload transparent PNG or SVG logos (~200–400px wide), cropped tight to the artwork (no extra white
            padding). All logos display in the same square slot on the conveyor. Add a light-on-dark variant if the
            default logo disappears in dark mode. Leave logo empty to show the brand name as text.
          </p>
        </div>
        {brands.map((brand, i) => (
          <div key={i} className="flex gap-2 rounded-md border p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === brands.length - 1}
              onMoveUp={() => setBrands(moveItem(brands, i, -1))}
              onMoveDown={() => setBrands(moveItem(brands, i, 1))}
            />
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Brand name"
                value={brand.name}
                onChange={(e) => {
                  const next = [...brands];
                  next[i] = { ...brand, name: e.target.value };
                  setBrands(next);
                }}
              />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Logo (optional)</Label>
                <MediaPicker
                  value={brand.logo ?? ""}
                  onChange={(url) => {
                    const next = [...brands];
                    next[i] = { ...brand, logo: url };
                    setBrands(next);
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Logo for dark background (optional)</Label>
                <MediaPicker
                  value={brand.logoDark ?? ""}
                  onChange={(url) => {
                    const next = [...brands];
                    next[i] = { ...brand, logoDark: url || undefined };
                    setBrands(next);
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Link (optional)</Label>
                <Input
                  placeholder="https://…"
                  value={brand.href ?? ""}
                  onChange={(e) => {
                    const next = [...brands];
                    next[i] = { ...brand, href: e.target.value.trim() || undefined };
                    setBrands(next);
                  }}
                />
              </div>
              {(brand.logo || brand.logoDark) && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Live slot preview</Label>
                  <div className="flex flex-wrap gap-3">
                    {brand.logo && (
                      <div className="brand-marquee-preview section-dark inline-flex rounded-md border border-border p-3">
                        <span className="brand-marquee__logo-frame">
                          <img
                            src={brand.logo}
                            alt={brand.name || "Brand"}
                            className="brand-marquee__logo"
                          />
                        </span>
                      </div>
                    )}
                    {brand.logoDark && (
                      <div className="brand-marquee-preview section-dark dark inline-flex rounded-md border border-border p-3">
                        <span className="brand-marquee__logo-frame">
                          <img
                            src={brand.logoDark}
                            alt={`${brand.name || "Brand"} (dark)`}
                            className="brand-marquee__logo"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setBrands(duplicateItem(brands, i))}
                aria-label="Duplicate"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={brands.length <= 1}
                onClick={() => setBrands(brands.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setBrands([...brands, { name: "" }])}>
          Add brand
        </Button>
      </div>

      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Services & Brands</h1>
      <p className="text-sm text-muted-foreground">Homepage service cards and scrolling brand logos.</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <AdminPreviewMobileLink previewPath="/" previewHash="services" />
        <AdminPreviewMobileLink previewPath="/" previewHash="brands" />
      </div>
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/" previewHash="brands">
          {formPanel}
        </AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}
