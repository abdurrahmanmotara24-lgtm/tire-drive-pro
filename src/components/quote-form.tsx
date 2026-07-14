import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
import { PublicField } from "@/components/public-field";
import { PublicButton, PublicOutlineButton } from "@/components/public-button";
import { submitLead } from "@/lib/site-content";
import { buildQuoteWaMeUrl, normalizeWhatsAppDigits } from "@/lib/phone-utils";
import { useContactContent } from "@/hooks/use-contact-content";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const quoteFieldsSchema = z.object({
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
  quantity: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 20), "1–20 tyres"),

});

const schema = quoteFieldsSchema.superRefine((data, ctx) => {
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

type Props = { serviceHint?: string };

const step1Schema = quoteFieldsSchema.pick({ name: true, phone: true });
const step2Schema = quoteFieldsSchema.pick({ year: true, make: true, model: true });
const quoteFieldNames = ["name", "phone", "year", "make", "model", "tireSize", "quantity"] as const;

type QuoteFieldName = (typeof quoteFieldNames)[number];
type QuoteFormState = Record<QuoteFieldName, string>;

const emptyQuoteValues: QuoteFormState = {
  name: "",
  phone: "",
  year: "",
  make: "",
  model: "",
  tireSize: "",
  quantity: "4",
};

export function QuoteForm({ serviceHint }: Props) {
  const { contact } = useContactContent();
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const callbackMessage = getQuoteCallbackMessage(normalizeHoursSchedule(contact.hours_schedule));
  const waRaw = contact.whatsapp.trim() || contact.phone.trim();
  const hasWhatsApp = Boolean(normalizeWhatsAppDigits(waRaw));
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<QuoteFormState>(() => ({ ...emptyQuoteValues }));
  const useSteps = isMobile;
  const totalSteps = 3;

  useEffect(() => {
    setStep(1);
  }, [serviceHint, useSteps]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    // On mobile multi-step, an implicit submit (e.g. keyboard "Go") should
    // advance to the next step instead of submitting early.
    if (useSteps && step < totalSteps) {
      nextStep();
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      setStatus("err");
      if (useSteps) {
        const first = parsed.error.issues[0]?.path[0];
        if (first === "name" || first === "phone") setStep(1);
        else if (first === "year" || first === "make" || first === "model") setStep(2);
        else setStep(3);
      }
      return;
    }
    setErrors({});
    setErrorMsg("");
    setStatus("submitting");

    const vehicle = formatVehicleDescription(
      parsed.data.year ?? "",
      parsed.data.make,
      parsed.data.model,
    );
    const tireSize = parsed.data.tireSize ? normalizeTireSize(parsed.data.tireSize) : undefined;
    const quantity = parsed.data.quantity ? Number(parsed.data.quantity) : undefined;
    const interest = serviceHint?.trim();
    const messageParts: string[] = [];
    if (interest) messageParts.push(`Service interest: ${interest}`);
    if (quantity) messageParts.push(`Quantity: ${quantity} ${quantity === 1 ? "tyre" : "tyres"}`);
    const message = messageParts.length ? messageParts.join(" | ") : undefined;

    const waUrl = buildQuoteWaMeUrl(waRaw, {
      name: parsed.data.name,
      phone: parsed.data.phone,
      vehicle,
      tireSize,
      quantity,
      service: interest,
    });

    let leadSaved = false;
    try {
      await submitLead({
        type: "quote",
        name: parsed.data.name,
        phone: parsed.data.phone,
        vehicle,
        tire_size: tireSize,
        message,
      });
      leadSaved = true;
    } catch {
      /* WhatsApp is the primary hand-off; lead save is best-effort */
    }

    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setStatus("ok");
      setValues({ ...emptyQuoteValues });
      setStep(1);
      if (!leadSaved) {
        setErrorMsg("");
      }
      return;
    }

    if (leadSaved) {
      setStatus("ok");
      setValues({ ...emptyQuoteValues });
      setStep(1);
      return;
    }

    setStatus("err");
    setErrorMsg("Could not send your quote. Please call or WhatsApp us directly.");
  }

  function applyFieldErrors(issues: z.ZodIssue[]) {
    const errs: Record<string, string> = {};
    issues.forEach((i) => {
      const key = i.path[0];
      if (typeof key === "string") errs[key] = i.message;
    });
    setErrors(errs);
    setStatus("err");
  }

  function validateCurrentStep(): boolean {
    if (!formRef.current) return true;
    const data = values;
    if (step === 3) {
      const tire = data.tireSize?.trim() ?? "";
      const qty = data.quantity?.trim() ?? "";
      const nextErrs: Record<string, string> = {};
      if (tire && !isValidTireSize(tire)) nextErrs.tireSize = "Use format 225/45R18";
      if (qty && !(/^\d+$/.test(qty) && Number(qty) >= 1 && Number(qty) <= 20)) {
        nextErrs.quantity = "1–20 tyres";
      }
      if (Object.keys(nextErrs).length) {
        setErrors(nextErrs);
        setStatus("err");
        return false;
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next.tireSize;
        delete next.quantity;
        return next;
      });
      return true;
    }

    const partial = step === 1 ? step1Schema.safeParse(data) : step2Schema.safeParse(data);
    if (partial.success && step === 2) {
      const y = data.year?.trim();
      if (y) {
        const n = Number(y);
        if (n < 1980 || n > currentYear + 1) {
          setErrors({ year: `Year between 1980–${currentYear + 1}` });
          setStatus("err");
          return false;
        }
      }
    }
    if (partial.success) {
      setErrors((prev) => {
        const next = { ...prev };
        const keys = step === 1 ? ["name", "phone"] : step === 2 ? ["year", "make", "model"] : ["tireSize"];
        keys.forEach((k) => delete next[k]);
        return next;
      });
      return true;
    }
    applyFieldErrors(partial.error.issues);
    return false;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(totalSteps, s + 1));
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  function updateField(name: QuoteFieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setErrorMsg("");
    if (status === "err") setStatus("idle");
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.currentTarget.name;
    if (quoteFieldNames.includes(name as QuoteFieldName)) {
      updateField(name as QuoteFieldName, e.currentTarget.value);
    }
  }

  const contactFields = (
    <div className="grid gap-3 sm:grid-cols-2">
      <PublicField
        id="quote-name"
        label="Name"
        name="name"
        value={values.name}
        onChange={handleFieldChange}
        error={errors.name}
        disabled={status === "submitting"}
      />
      <PublicField
        id="quote-phone"
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        value={values.phone}
        onChange={handleFieldChange}
        error={errors.phone}
        disabled={status === "submitting"}
      />
    </div>
  );

  const vehicleFields = (
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
          value={values.year}
          onChange={handleFieldChange}
          error={errors.year}
          disabled={status === "submitting"}
        />
        <PublicField
          id="quote-make"
          label="Make"
          name="make"
          placeholder="e.g. BMW"
          value={values.make}
          onChange={handleFieldChange}
          error={errors.make}
          disabled={status === "submitting"}
        />
        <PublicField
          id="quote-model"
          label="Model"
          name="model"
          placeholder="e.g. M340i"
          value={values.model}
          onChange={handleFieldChange}
          error={errors.model}
          disabled={status === "submitting"}
        />
      </div>
    </fieldset>
  );

  const tireFields = (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div>
        <PublicField
          id="quote-tireSize"
          label="Tyre size"
          name="tireSize"
          placeholder={TIRE_SIZE_PLACEHOLDER}
          optional
          value={values.tireSize}
          onChange={handleFieldChange}
          error={errors.tireSize}
          disabled={status === "submitting"}
        />
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{TIRE_SIZE_HINT}</p>
      </div>
      <PublicField
        id="quote-quantity"
        label="Quantity"
        name="quantity"
        type="number"
        inputMode="numeric"
        placeholder="4"
        value={values.quantity}
        onChange={handleFieldChange}
        error={errors.quantity}
        disabled={status === "submitting"}
      />
    </div>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 p-5 sm:p-6">
      <div>
        <h3 className="font-display text-xl">Free quote</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Year, make, model, and tyre size help us quote faster.
        </p>
        {serviceHint && (
          <p className="mt-3 rounded-sm border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-foreground">
            Quoting for: <span className="font-semibold text-primary">{serviceHint}</span>
          </p>
        )}
      </div>

      {useSteps && (
        <div className="flex items-center gap-2" aria-label={`Step ${step} of ${totalSteps}`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                n <= step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
      )}

      <div hidden={useSteps && step !== 1}>{contactFields}</div>
      <div hidden={useSteps && step !== 2}>{vehicleFields}</div>
      <div hidden={useSteps && step !== 3}>{tireFields}</div>

      <div className="flex flex-wrap gap-2">
        {useSteps && step > 1 && (
          <PublicOutlineButton
            type="button"
            className="min-h-11"
            onClick={prevStep}
            disabled={status === "submitting"}
          >
            Back
          </PublicOutlineButton>
        )}
        {useSteps && step < totalSteps ? (
          <PublicButton
            key={`continue-${step}`}
            type="button"
            className="min-h-11 flex-1 sm:flex-none"
            onClick={nextStep}
            disabled={status === "submitting"}
          >
            Continue
          </PublicButton>
        ) : (
          <PublicButton
            key="final-submit"
            type="submit"
            className="min-h-11 w-full sm:w-auto"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : hasWhatsApp ? "Request quote on WhatsApp" : "Request quote"}
          </PublicButton>
        )}
      </div>

      {status === "ok" && (
        <div
          className="quote-form-success flex items-start gap-3 rounded-sm border border-primary/30 bg-primary/5 p-3"
          role="status"
        >
          <span className="quote-form-success__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {hasWhatsApp ? "Opening WhatsApp…" : "Quote received"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {hasWhatsApp
                ? `${callbackMessage} Your quote details have been pre-filled in the chat.`
                : callbackMessage}
            </p>
          </div>
        </div>
      )}
      {status === "err" && errorMsg && <p className="text-xs font-semibold text-destructive">{errorMsg}</p>}
    </form>
  );
}
