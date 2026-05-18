import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Options<T> = {
  data: T | undefined;
  queryKey: readonly unknown[];
  onSave: (value: T) => Promise<void>;
  successMessage?: string;
};

export function useAdminForm<T>({ data, queryKey, onSave, successMessage = "Saved" }: Options<T>) {
  const qc = useQueryClient();
  const [form, setForm] = useState<T | null>(null);
  const baselineRef = useRef("");
  const syncedRef = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data === undefined || syncedRef.current) return;
    setForm(data);
    baselineRef.current = JSON.stringify(data);
    syncedRef.current = true;
  }, [data]);

  const isDirty = form !== null && JSON.stringify(form) !== baselineRef.current;

  const submit = useCallback(async () => {
    if (!form || busy) return;
    setBusy(true);
    try {
      await onSave(form);
      baselineRef.current = JSON.stringify(form);
      await qc.invalidateQueries({ queryKey });
      toast.success(successMessage);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [form, busy, onSave, qc, queryKey, successMessage]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty && !busy) void submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDirty, busy, submit]);

  return { form, setForm, busy, isDirty, submit, ready: form !== null };
}

export function useDirtyGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);
}

export function useSaveShortcut(onSave: () => void, enabled: boolean) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (enabled) onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave, enabled]);
}
