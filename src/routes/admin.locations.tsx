import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchLocations, type LocationRow } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/locations")({ component: LocationsAdmin });

function LocationsAdmin() {
  const qc = useQueryClient();
  const { data: locs } = useQuery({ queryKey: ["locations", "all"], queryFn: () => fetchLocations(true) });

  const refresh = () => qc.invalidateQueries({ queryKey: ["locations"] });

  const create = async () => {
    const { error } = await supabase.from("locations").insert({ name: "New Branch", sort_order: (locs?.length ?? 0) + 1 });
    if (error) toast.error(error.message); else { toast.success("Added"); refresh(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-sm text-muted-foreground">Manage your branches.</p>
        </div>
        <Button onClick={create}><Plus className="mr-1 h-4 w-4" /> Add branch</Button>
      </div>

      <div className="mt-6 space-y-4">
        {locs?.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">No branches yet.</Card>}
        {locs?.map((l) => <LocationCard key={l.id} loc={l} onChange={refresh} />)}
      </div>
    </div>
  );
}

function LocationCard({ loc, onChange }: { loc: LocationRow; onChange: () => void }) {
  const [form, setForm] = useState<LocationRow>(loc);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("locations").update({
      name: form.name, address: form.address, phone: form.phone, email: form.email,
      hours: form.hours, map_embed_url: form.map_embed_url, sort_order: form.sort_order, is_active: form.is_active,
    }).eq("id", form.id);
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Saved"); onChange(); }
  };
  const remove = async () => {
    if (!confirm("Delete this branch?")) return;
    const { error } = await supabase.from("locations").delete().eq("id", form.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChange(); }
  };

  const f = (k: keyof LocationRow, label: string, placeholder?: string) => (
    <div>
      <Label>{label}</Label>
      <Input value={(form[k] as string) ?? ""} placeholder={placeholder} onChange={(e) => setForm({ ...form, [k]: e.target.value } as LocationRow)} />
    </div>
  );

  return (
    <Card className="p-5 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {f("name", "Branch name")}
        {f("phone", "Phone")}
        {f("email", "Email")}
        {f("hours", "Hours")}
      </div>
      <div>
        <Label>Address</Label>
        <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div>
        <Label>Google Maps embed URL (iframe src)</Label>
        <Textarea rows={2} value={form.map_embed_url ?? ""} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="m-0">Active</Label>
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        </div>
        <div className="flex items-center gap-2">
          <Label className="m-0 text-xs">Sort</Label>
          <Input type="number" className="w-20" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={remove}><Trash2 className="h-4 w-4" /></Button>
          <Button size="sm" onClick={save} disabled={busy}>{busy ? "…" : "Save"}</Button>
        </div>
      </div>
    </Card>
  );
}
