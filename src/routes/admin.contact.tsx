import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent, saveContent, type ContactContent } from "@/lib/site-content";
import { formatHoursSummary, normalizeHoursSchedule } from "@/lib/hours-schedule";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { AdminPreviewLayout, AdminPreviewMobileLink } from "@/components/admin/admin-preview-layout";
import { HoursScheduleEditor } from "@/components/admin/hours-schedule-editor";
import { ResetDefaultsButton } from "@/components/admin/reset-defaults-button";
import { SocialAccountsEditor } from "@/components/admin/social-accounts-editor";
import { useAdminForm } from "@/hooks/use-admin-form";
import { contactWithSocialAccounts, syncLegacySocialFields } from "@/lib/social-accounts";
import { formatWhatsAppPreview } from "@/lib/phone-utils";

export const Route = createFileRoute("/admin/contact")({ component: ContactAdmin });

function ContactAdmin() {
  const { data } = useQuery({ queryKey: ["content", "contact"], queryFn: () => fetchContent("contact") });
  const { form, setForm, busy, isDirty, submit, ready } = useAdminForm({
    data,
    queryKey: ["content", "contact"],
    onSave: async (v) => {
      const schedule = normalizeHoursSchedule(v.hours_schedule);
      await saveContent(
        "contact",
        syncLegacySocialFields({
          ...v,
          hours_schedule: schedule,
          hours: formatHoursSummary(schedule),
        }),
      );
    },
  });

  if (!ready || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const schedule = normalizeHoursSchedule(form.hours_schedule);
  const socialAccounts = form.social_accounts ?? contactWithSocialAccounts(form).social_accounts ?? [];
  const waPreview = formatWhatsAppPreview(form.whatsapp.trim() || form.phone.trim());

  const f = (k: keyof ContactContent, label: string, placeholder?: string) => (
    <div>
      <Label>{label}</Label>
      <Input value={(form[k] as string) ?? ""} placeholder={placeholder} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    </div>
  );

  const formPanel = (
    <Card className="space-y-4 p-6">
      <ResetDefaultsButton onReset={() => setForm({ ...DEFAULTS.contact })} />
      <div className="grid gap-4 sm:grid-cols-2">
        {f("phone", "Phone", "082 123 4567")}
        {f("email", "Email", "hello@example.com")}
        {f("address", "Address")}
      </div>
      <div>
        <Label>WhatsApp number</Label>
        <p className="mb-1 text-xs text-muted-foreground">
          Used for quote links and the WhatsApp button. Local (082…), national (82…), or international (+27…) formats all work.
          Leave blank to use the phone number above.
        </p>
        <Input
          value={form.whatsapp ?? ""}
          placeholder="082 123 4567 or 27821234567"
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
        {waPreview ? (
          <p className="mt-1 text-xs text-muted-foreground">
            WhatsApp link will use: <span className="font-medium text-foreground">{waPreview}</span>
          </p>
        ) : (
          (form.whatsapp.trim() || form.phone.trim()) && (
            <p className="mt-1 text-xs text-destructive">Could not parse a valid WhatsApp number — check the format.</p>
          )
        )}
      </div>
      <div>
        <Label>Structured hours</Label>
        <HoursScheduleEditor
          value={schedule}
          onChange={(hours_schedule) => setForm({ ...form, hours_schedule, hours: formatHoursSummary(hours_schedule) })}
        />
      </div>
      <div>
        <Label>Hours summary (auto-generated on save)</Label>
        <Input value={form.hours} readOnly className="bg-secondary/40" />
      </div>
      <div>
        <Label>Lead notification email</Label>
        <p className="mb-1 text-xs text-muted-foreground">
          Optional. New leads trigger an email via Resend when RESEND_API_KEY is set on the server.
        </p>
        <Input
          type="email"
          value={form.lead_notify_email ?? ""}
          placeholder="owner@yourshop.com"
          onChange={(e) => setForm({ ...form, lead_notify_email: e.target.value })}
        />
      </div>
      <SocialAccountsEditor
        value={socialAccounts}
        onChange={(social_accounts) => setForm({ ...form, social_accounts })}
      />
      <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Info</h1>
      <p className="text-sm text-muted-foreground">Phone, email, WhatsApp, structured hours, and social links.</p>
      <AdminPreviewMobileLink previewPath="/contact" />
      <div className="hidden lg:block">
        <AdminPreviewLayout previewPath="/contact">{formPanel}</AdminPreviewLayout>
      </div>
      <div className="mt-6 lg:hidden">{formPanel}</div>
    </div>
  );
}
