import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onReset: () => void;
  label?: string;
};

export function ResetDefaultsButton({ onReset, label = "Reset to defaults" }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => {
        if (confirm("Reset this section to default content? Unsaved changes will be lost.")) onReset();
      }}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
