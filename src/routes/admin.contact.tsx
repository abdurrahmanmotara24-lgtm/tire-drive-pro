import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, type ContactContent } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contact")({ component: ContactAdmin });

function ContactAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", "contact"], queryFn: () => fetchContent("contact") });
  const [form, setForm] = useState<ContactContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const f = (k: keyof ContactContent, label: string, placeholder?: string) => (
    <div>
      <Label>{label}</Label>
      <Input value={form[k] as string} placeholder={placeholder} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    </div>
  );

  const submit = async () => {
    setBusy(true);
    try { await saveContent("contact", form); qc.invalidateQueries({ queryKey: ["content", "contact"] }); toast.success("Saved"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Info</h1>
      <p className="text-sm text-muted-foreground">Phone, email, WhatsApp number, address and social links.</p>
      <Card className="mt-6 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {f("phone", "Phone", "+1 (000) 000-0000")}
          {f("email", "Email", "hello@example.com")}
          {f("whatsapp", "WhatsApp number", "10000000000 (digits only)")}
          {f("address", "Address")}
          {f("hours", "Business hours")}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {f("facebook", "Facebook URL")}
          {f("instagram", "Instagram URL")}
          {f("twitter", "Twitter / X URL")}
        </div>
        <div className="flex justify-end"><Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button></div>
      </Card>
    </div>
  );
}
