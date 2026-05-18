import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  className?: string;
};

export function ReorderButtons({ onMoveUp, onMoveDown, disableUp, disableDown, className }: Props) {
  return (
    <div className={`flex flex-col gap-0.5 ${className ?? ""}`}>
      <Button type="button" variant="outline" size="icon" className="h-7 w-7" disabled={disableUp} onClick={onMoveUp} aria-label="Move up">
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="h-7 w-7" disabled={disableDown} onClick={onMoveDown} aria-label="Move down">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
