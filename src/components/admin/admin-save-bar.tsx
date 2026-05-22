import { Button } from "@/components/ui/button";

type Props = {
  busy: boolean;
  isDirty: boolean;
  onSave: () => void;
  label?: string;
};

export function AdminSaveBar({ busy, isDirty, onSave, label = "Save changes" }: Props) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:-mx-8 md:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
        <p className="text-xs text-muted-foreground">
          {isDirty ? (
            <>
              Unsaved changes · <kbd className="rounded border border-border px-1">Ctrl+S</kbd> to save
            </>
          ) : (
            "All changes saved"
          )}
        </p>
        <Button
          onClick={onSave}
          disabled={busy || !isDirty}
          size="sm"
          className="w-full md:w-auto"
        >
          {busy ? "Saving…" : isDirty ? label : "Saved"}
        </Button>
      </div>
    </div>
  );
}
