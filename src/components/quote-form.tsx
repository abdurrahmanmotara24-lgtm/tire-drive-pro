import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  vehicle: z.string().trim().min(1, "Vehicle required").max(100),
  tireSize: z.string().trim().max(50).optional().or(z.literal("")),
});

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-background p-6 shadow-elegant ring-1 ring-border sm:p-8">
      <h3 className="text-2xl font-extrabold">Get a Free Quote</h3>
      <p className="text-sm text-muted-foreground">Tell us about your vehicle. We'll call back with the best price.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Name</label>
          <input name="name" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
          {errors.name && <p className="mt-1 text-xs text-brand-red">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold">Phone</label>
          <input name="phone" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
          {errors.phone && <p className="mt-1 text-xs text-brand-red">{errors.phone}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold">Vehicle</label>
          <input name="vehicle" placeholder="e.g. Toyota Corolla 2020" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
          {errors.vehicle && <p className="mt-1 text-xs text-brand-red">{errors.vehicle}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold">Tire Size <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input name="tireSize" placeholder="e.g. 205/55 R16" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-bold text-brand-red-foreground shadow-red transition-transform hover:scale-[1.02]">
        Request My Quote
      </button>
      {status === "ok" && <p className="text-sm font-semibold text-primary">✓ Thanks! We'll be in touch shortly.</p>}
    </form>
  );
}
