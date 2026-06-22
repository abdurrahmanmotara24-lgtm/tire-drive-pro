import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { moveItem } from "@/lib/list-utils";
import {
  SOCIAL_PLATFORM_OPTIONS,
  getSocialIcon,
  type SocialAccount,
  type SocialPlatform,
} from "@/lib/social-accounts";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  value: SocialAccount[];
  onChange: (accounts: SocialAccount[]) => void;
};

export function SocialAccountsEditor({ value, onChange }: Props) {
  const add = () => {
    onChange([...value, { platform: "facebook", url: "" }]);
  };

  const update = (index: number, patch: Partial<SocialAccount>) => {
    const next = [...value];
    next[index] = { ...next[index]!, ...patch };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Social media accounts</Label>
        <p className="text-xs text-muted-foreground">
          Add links shown in the site footer. Leave URL blank to hide an account.
        </p>
      </div>
      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">No social accounts yet.</p>
      )}
      {value.map((account, i) => {
        const Icon = getSocialIcon(account.platform);
        return (
          <div key={i} className="flex gap-2 rounded-md border p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === value.length - 1}
              onMoveUp={() => onChange(moveItem(value, i, -1))}
              onMoveDown={() => onChange(moveItem(value, i, 1))}
            />
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <Select
                  value={account.platform}
                  onValueChange={(platform) => update(i, { platform: platform as SocialPlatform })}
                >
                  <SelectTrigger className="w-full sm:max-w-[200px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Profile URL</Label>
                <Input
                  value={account.url}
                  placeholder="https://..."
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </div>
              {account.platform === "other" && (
                <div className="sm:col-span-2">
                  <Label className="text-xs">Display label</Label>
                  <Input
                    value={account.label ?? ""}
                    placeholder="e.g. Threads, Google Business"
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                </div>
              )}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove account">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1 h-4 w-4" />
        Add social account
      </Button>
    </div>
  );
}
