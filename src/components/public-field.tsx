import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PublicFieldProps = {
  id: string;
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  as?: "input" | "textarea";
  rows?: number;
  disabled?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export function PublicField({
  id,
  label,
  name,
  error,
  optional,
  type = "text",
  inputMode,
  placeholder,
  as = "input",
  rows = 4,
  disabled,
  value,
  onChange,
}: PublicFieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const fieldClass = cn(
    "mt-1 rounded-sm border-input bg-background/50 transition-[border-color,box-shadow] hover:border-primary/40 focus-visible:ring-primary",
    error && "border-primary",
  );

  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {optional && <span className="font-normal normal-case"> (optional)</span>}
      </Label>
      {as === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement> | undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={fieldClass}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement> | undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={fieldClass}
        />
      )}
      {error && (
        <p id={describedBy} className="mt-1 text-xs text-primary" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
