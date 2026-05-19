import { useState } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
import { PublicField } from "@/components/public-field";
import { PublicButton } from "@/components/public-button";
import { submitLead } from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import {
  formatVehicleDescription,
  getQuoteCallbackMessage,
  normalizeHoursSchedule,
} from "@/lib/hours-schedule";
import {
  isValidTireSize,
  normalizeTireSize,
  TIRE_SIZE_HINT,
  TIRE_SIZE_PLACEHOLDER,
} from "@/lib/tire-size";

const currentYear = new Date().getFullYear();

const schema = z
  .object({
    name: z.string().trim().min(1, "Name required").max(100),
    phone: z.string().trim().min(7, "Valid phone required").max(20),
    year: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^(19|20)\d{2}$/.test(v), "Enter a 4-digit year"),
    make: z.string().trim().min(1, "Make required").max(60),
    model: z.string().trim().min(1, "Model required").max(60),
    tireSize: z.string().trim().max(20).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.tireSize && !isValidTireSize(data.tireSize)) {
      ctx.addIssue({
        code: "custom",
        path: ["tireSize"],
        message: "Use format 225/45R18",
      });
    }
    const y = data.year?.trim();
    if (y) {
      const n = Number(y);
      if (n < 1980 || n > currentYear + 1) {
        ctx.addIssue({ code: "custom", path: ["year"], message: `Year between 1980–${currentYear + 1}` });
      }
    }
  });

export function QuoteForm() {
  const { contact } = useContactContent();
  const callbackMessage = getQuoteCallbackMessage(normalizeHoursSchedule(contact.hours_schedule));
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
      const vehicle = formatVehicleDescription(
        parsed.data.year ?? "",
        parsed.data.make,
        parsed.data.model,
      );
      const tireSize = parsed.data.tireSize ? normalizeTireSize(parsed.data.tireSize) : undefined;

      await submitLead({
        type: "quote",
        name: parsed.data.name,
        phone: parsed.data.phone,
        vehicle,
        tire_size: tireSize,
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
        <p className="mt-1 text-xs text-muted-foreground">
          Year, make, model, and tire size help us quote faster — all fields help us fit you right.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PublicField id="quote-name" label="Name" name="name" error={errors.name} disabled={status === "submitting"} />
        <PublicField
          id="quote-phone"
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          error={errors.phone}
          disabled={status === "submitting"}
        />
      </div>

      <fieldset className="grid gap-3 rounded-sm border border-border/80 p-3 sm:p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your vehicle
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <PublicField
            id="quote-year"
            label="Year"
            name="year"
            placeholder={String(currentYear)}
            inputMode="numeric"
            optional
            error={errors.year}
            disabled={status === "submitting"}
          />
          <PublicField
            id="quote-make"
            label="Make"
            name="make"
            placeholder="e.g. BMW"
            error={errors.make}
            disabled={status === "submitting"}
          />
          <PublicField
            id="quote-model"
            label="Model"
            name="model"
            placeholder="e.g. M340i"
            error={errors.model}
            disabled={status === "submitting"}
          />
        </div>
      </fieldset>

      <div>
        <PublicField
          id="quote-tireSize"
          label="Tire size"
          name="tireSize"
          placeholder={TIRE_SIZE_PLACEHOLDER}
          optional
          error={errors.tireSize}
          disabled={status === "submitting"}
        />
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{TIRE_SIZE_HINT}</p>
      </div>

      <PublicButton type="submit" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request quote"}
      </PublicButton>

      {status === "ok" && (
        <div
          className="quote-form-success flex items-start gap-3 rounded-sm border border-primary/30 bg-primary/5 p-3"
          role="status"
        >
          <span className="quote-form-success__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Quote received</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{callbackMessage}</p>
          </div>
        </div>
      )}
      {status === "err" && errorMsg && <p className="text-xs font-semibold text-destructive">{errorMsg}</p>}
    </form>
  );
}
