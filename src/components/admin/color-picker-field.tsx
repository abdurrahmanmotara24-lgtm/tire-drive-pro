import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cssColorToHex, isCssColorString, normalizeHex } from "@/lib/color-utils";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
};

export function ColorPickerField({ label, value, onChange, hint, className }: Props) {
  const id = useId();
  const pickerId = `${id}-picker`;
  const [pickerHex, setPickerHex] = useState(() => cssColorToHex(value));

  useEffect(() => {
    setPickerHex(cssColorToHex(value));
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={pickerId}>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={pickerId}
          type="color"
          value={pickerHex}
          onChange={(e) => {
            const hex = normalizeHex(e.target.value) ?? e.target.value;
            setPickerHex(hex);
            onChange(hex);
          }}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-sm border border-border bg-transparent p-0.5"
          aria-label={`${label} color picker`}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="oklch(0.48 0.2 27) or #c41e1e"
          className="min-w-0 flex-1 font-mono text-xs"
          spellCheck={false}
        />
        <span
          className="h-11 w-11 shrink-0 rounded-sm border border-border shadow-inner"
          style={{ background: isCssColorString(value) ? value : undefined }}
          title="Preview"
          aria-hidden
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
