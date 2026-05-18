import { useState } from "react";
import { z } from "zod";
import { PublicField } from "@/components/public-field";
import { PublicButton } from "@/components/public-button";
import { submitLead } from "@/lib/site-content";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  vehicle: z.string().trim().min(1, "Vehicle required").max(100),
  tireSize: z.string().trim().max(50).optional().or(z.literal("")),
});

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      setStatus("err");
      return;
    }
    setErrors({});
    setErrorMsg("");
    setStatus("submitting");
    try {
      await submitLead({
        type: "quote",
        name: parsed.data.name,
        phone: parsed.data.phone,
        vehicle: parsed.data.vehicle,
        tire_size: parsed.data.tireSize || undefined,
      });
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("err");
      setErrorMsg((err as Error).message || "Something went wrong. Please call us instead.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 p-5 sm:p-6">
      <div>
        <h3 className="font-display text-xl">Free quote</h3>
        <p className="mt-1 text-xs text-muted-foreground">We&apos;ll call back with your best price.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <PublicField id="quote-name" label="Name" name="name" error={errors.name} disabled={status === "submitting"} />
        <PublicField id="quote-phone" label="Phone" name="phone" error={errors.phone} disabled={status === "submitting"} />
        <PublicField
          id="quote-vehicle"
          label="Vehicle"
          name="vehicle"
          placeholder="e.g. BMW M340i 2022"
          error={errors.vehicle}
          disabled={status === "submitting"}
        />
        <PublicField
          id="quote-tireSize"
          label="Tire size"
          name="tireSize"
          placeholder="e.g. 225/45 R18"
          optional
          error={errors.tireSize}
          disabled={status === "submitting"}
        />
      </div>
      <PublicButton type="submit" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request quote"}
      </PublicButton>
      {status === "ok" && <p className="text-xs font-semibold text-primary">Thanks — we&apos;ll be in touch shortly.</p>}
      {status === "err" && errorMsg && <p className="text-xs font-semibold text-destructive">{errorMsg}</p>}
    </form>
  );
}
