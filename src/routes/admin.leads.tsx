import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, Inbox, Mail, MessageCircle, Phone } from "lucide-react";
import {
  fetchLeads,
  updateLead,
  type LeadRow,
  type LeadStatus,
} from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdmin,
});

const filters: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" },
];

const pipeline: LeadStatus[] = ["new", "contacted", "booked", "lost", "archived"];

function whatsAppTemplate(lead: LeadRow, businessName = "Tires Near You") {
  const intro =
    lead.type === "quote"
      ? `Hi ${lead.name}, thanks for your quote request at ${businessName}.`
      : `Hi ${lead.name}, thanks for reaching out to ${businessName}.`;
  const detail = [lead.vehicle && `Vehicle: ${lead.vehicle}`, lead.tire_size && `Tire size: ${lead.tire_size}`]
    .filter(Boolean)
    .join(". ");
  return `${intro} ${detail ? `${detail}. ` : ""}How can we help you today?`;
}

function LeadsAdmin() {
  const qc = useQueryClient();
  const { waHref } = useContactContent();
  const [filter, setFilter] = useState<LeadStatus | "all">("new");
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", filter],
    queryFn: () => fetchLeads(filter),
  });

  const { data: newCount = 0 } = useQuery({
    queryKey: ["leads", "new-count"],
    queryFn: async () => (await fetchLeads("new")).length,
    refetchInterval: 45_000,
  });

  const leadMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<LeadRow, "status" | "notes">> }) =>
      updateLead(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportCsv = () => {
    const rows = [
      ["type", "status", "name", "phone", "email", "vehicle", "tire_size", "message", "notes", "created_at"],
      ...leads.map((l) => [
        l.type,
        l.status,
        l.name,
        l.phone ?? "",
        l.email ?? "",
        l.vehicle ?? "",
        l.tire_size ?? "",
        (l.message ?? "").replace(/\n/g, " "),
        (l.notes ?? "").replace(/\n/g, " "),
        l.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${filter}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Pipeline for quote requests and contact messages.
            {newCount > 0 && <span className="ml-1 font-medium text-primary">{newCount} new</span>}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={!leads.length}>
          <Download className="mr-1.5 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.value ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : leads.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center gap-2 p-12 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No leads in this view.</p>
        </Card>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              waBase={waHref}
              onUpdate={(patch) => leadMutation.mutate({ id: lead.id, patch })}
              busy={leadMutation.isPending}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  waBase,
  onUpdate,
  busy,
}: {
  lead: LeadRow;
  waBase?: string;
  onUpdate: (patch: Partial<Pick<LeadRow, "status" | "notes">>) => void;
  busy: boolean;
}) {
  const [expanded, setExpanded] = useState(lead.status === "new");
  const [notes, setNotes] = useState(lead.notes ?? "");
  const tel = lead.phone?.replace(/[^+\d]/g, "");
  const telHref = tel ? `tel:${tel}` : undefined;
  const mailHref = lead.email ? `mailto:${lead.email}` : undefined;
  const waDigits = lead.phone?.replace(/[^\d]/g, "");
  const waMessage = encodeURIComponent(whatsAppTemplate(lead));
  const waHref = waBase && waDigits ? `${waBase}?text=${waMessage}` : waDigits ? `https://wa.me/${waDigits}?text=${waMessage}` : undefined;

  const statusIdx = pipeline.indexOf(lead.status);

  return (
    <Card className={cn("overflow-hidden", lead.status === "new" && "border-primary/40")}>
      <button
        type="button"
        className="flex w-full items-start justify-between gap-2 p-4 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{lead.name}</span>
            <Badge variant={lead.type === "quote" ? "default" : "secondary"}>{lead.type}</Badge>
            <Badge variant="outline">{lead.status}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{format(new Date(lead.created_at), "PPp")}</p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4">
          <div className="mt-3 flex flex-wrap gap-1">
            {pipeline.map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                variant={lead.status === s ? "default" : "outline"}
                disabled={busy || lead.status === s}
                onClick={() => onUpdate({ status: s })}
                className="text-xs capitalize"
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {telHref && (
              <Button type="button" size="sm" variant="outline" asChild>
                <a href={telHref}>
                  <Phone className="mr-1 h-3.5 w-3.5" /> Call
                </a>
              </Button>
            )}
            {waHref && (
              <Button type="button" size="sm" variant="outline" asChild>
                <a href={waHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-1 h-3.5 w-3.5" /> WhatsApp
                </a>
              </Button>
            )}
            {mailHref && (
              <Button type="button" size="sm" variant="outline" asChild>
                <a href={mailHref}>
                  <Mail className="mr-1 h-3.5 w-3.5" /> Email
                </a>
              </Button>
            )}
            {statusIdx >= 0 && statusIdx < pipeline.length - 1 && lead.status !== "archived" && (
              <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={() => onUpdate({ status: pipeline[statusIdx + 1]! })}
              >
                Advance → {pipeline[statusIdx + 1]}
              </Button>
            )}
          </div>

          <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {telHref ? (
                  <a href={telHref} className="hover-link">
                    {lead.phone}
                  </a>
                ) : (
                  lead.phone
                )}
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a href={mailHref} className="hover-link">
                  {lead.email}
                </a>
              </div>
            )}
            {lead.vehicle && (
              <div>
                <dt className="text-xs text-muted-foreground">Vehicle</dt>
                <dd>{lead.vehicle}</dd>
              </div>
            )}
            {lead.tire_size && (
              <div>
                <dt className="text-xs text-muted-foreground">Tire size</dt>
                <dd>{lead.tire_size}</dd>
              </div>
            )}
          </dl>

          {lead.message && (
            <p className="mt-3 whitespace-pre-wrap rounded-md bg-secondary/50 p-3 text-sm">{lead.message}</p>
          )}

          <div className="mt-3">
            <label className="text-xs font-medium text-muted-foreground">Internal notes</label>
            <Textarea
              className="mt-1 min-h-[72px] text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => {
                if (notes !== (lead.notes ?? "")) onUpdate({ notes });
              }}
              placeholder="Follow-up details, parts quoted, etc."
            />
          </div>
        </div>
      )}
    </Card>
  );
}
