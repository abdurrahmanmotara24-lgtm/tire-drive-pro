import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { fetchLocations, type LocationRow } from "@/lib/site-content";
import { MAX_STORE_LOCATIONS } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { invalidatePublicContentQueries } from "@/lib/invalidate-public-content";

export const Route = createFileRoute("/admin/locations")({ component: StoreLocationAdmin });

function StoreLocationAdmin() {
  const qc = useQueryClient();
  const { data: locs } = useQuery({ queryKey: ["locations", "all"], queryFn: () => fetchLocations(true) });
  const atStoreLimit = (locs?.length ?? 0) >= MAX_STORE_LOCATIONS;

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["locations"] });
    invalidatePublicContentQueries(qc);
  };

  const create = async () => {
    if (atStoreLimit) {
      toast.error("Only one store location is supported. Edit the existing entry below.");
      return;
    }
    const { error } = await supabase.from("locations").insert({ name: "Our store", sort_order: 1 });
    if (error) toast.error(error.message);
    else {
      toast.success("Store location added");
      refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Store location</h1>
          <p className="text-sm text-muted-foreground">
            Address, map, and hours shown on the Visit us page. Global phone and structured hours are under Contact.
          </p>
        </div>
        {!atStoreLimit && (
          <Button onClick={create}>
            <Plus className="mr-1 h-4 w-4" /> Add store
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {locs?.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No store details yet. Add your address and map embed, or fill in Contact — the public site will use those
            until you save a store here.
          </Card>
        )}
        {locs?.slice(0, MAX_STORE_LOCATIONS).map((l) => (
          <StoreLocationCard key={l.id} loc={l} onChange={refresh} canDelete={(locs?.length ?? 0) > 1} />
        ))}
        {(locs?.length ?? 0) > MAX_STORE_LOCATIONS && (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Extra location rows exist in the database but only the first active store is shown on the public site.
            Remove unused rows if you no longer need them.
          </p>
        )}
      </div>
    </div>
  );
}

function StoreLocationCard({
  loc,
  onChange,
  canDelete,
}: {
  loc: LocationRow;
  onChange: () => void;
  canDelete: boolean;
}) {
  const [form, setForm] = useState<LocationRow>(loc);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("locations")
      .update({
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        hours: form.hours,
        map_embed_url: form.map_embed_url,
        sort_order: form.sort_order,
        is_active: form.is_active,
      })
      .eq("id", form.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      onChange();
    }
  };

  const remove = async () => {
    if (!confirm("Remove this store location?")) return;
    const { error } = await supabase.from("locations").delete().eq("id", form.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Removed");
      onChange();
    }
  };

  const f = (k: keyof LocationRow, label: string, placeholder?: string) => (
    <div>
      <Label>{label}</Label>
      <Input
        value={(form[k] as string) ?? ""}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [k]: e.target.value } as LocationRow)}
      />
    </div>
  );

  return (
    <Card className="space-y-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {f("name", "Store name", "Our store")}
        {f("phone", "Phone (optional if same as Contact)")}
        {f("email", "Email (optional)")}
        {f("hours", "Hours note (optional)", "e.g. Mon–Sat 8am–5pm")}
      </div>
      <div>
        <Label>Address</Label>
        <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div>
        <Label>Google Maps embed URL (iframe src)</Label>
        <Textarea
          rows={2}
          value={form.map_embed_url ?? ""}
          onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label className="m-0">Show on site</Label>
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        </div>
        <div className="flex gap-2">
          {canDelete && (
            <Button variant="outline" size="sm" onClick={remove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" onClick={save} disabled={busy}>
            {busy ? "…" : "Save"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
