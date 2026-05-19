export function AdminUnsavedPill({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200"
      role="status"
    >
      Unsaved changes
    </span>
  );
}
