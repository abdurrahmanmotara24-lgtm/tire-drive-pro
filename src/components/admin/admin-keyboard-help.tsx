import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SHORTCUTS = [
  { keys: "?", desc: "Show this shortcuts panel" },
  { keys: "Ctrl + S", desc: "Save current page (when a save bar is focused)" },
  { keys: "Esc", desc: "Close dialogs and menus" },
];

export function AdminKeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Press ? anytime in admin to open this panel.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          {SHORTCUTS.map((s) => (
            <li key={s.keys} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs">{s.keys}</kbd>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
