import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DAY_KEYS,
  DAY_LABELS,
  type HoursSchedule,
  formatHoursSummary,
} from "@/lib/hours-schedule";

type Props = {
  value: HoursSchedule;
  onChange: (next: HoursSchedule) => void;
};

export function HoursScheduleEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Summary shown on the site: <span className="font-medium text-foreground">{formatHoursSummary(value)}</span>
      </p>
      <div className="space-y-2">
        {DAY_KEYS.map((key) => {
          const day = value[key];
          return (
            <div key={key} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded-md border border-border p-2 sm:grid-cols-[8rem_5rem_1fr_1fr]">
              <span className="text-sm font-medium">{DAY_LABELS[key]}</span>
              <div className="flex items-center gap-2 justify-self-end sm:justify-self-start">
                <Switch
                  checked={!day.closed}
                  onCheckedChange={(on) => onChange({ ...value, [key]: { ...day, closed: !on } })}
                  aria-label={`${DAY_LABELS[key]} open`}
                />
                <span className="text-[10px] uppercase text-muted-foreground">{day.closed ? "Closed" : "Open"}</span>
              </div>
              <div>
                <Label className="sr-only">Opens</Label>
                <Input
                  type="time"
                  value={day.open}
                  disabled={day.closed}
                  onChange={(e) => onChange({ ...value, [key]: { ...day, open: e.target.value } })}
                />
              </div>
              <div>
                <Label className="sr-only">Closes</Label>
                <Input
                  type="time"
                  value={day.close}
                  disabled={day.closed}
                  onChange={(e) => onChange({ ...value, [key]: { ...day, close: e.target.value } })}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
