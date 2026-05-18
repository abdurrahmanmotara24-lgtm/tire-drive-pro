export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[next]] = [copy[next]!, copy[index]!];
  return copy;
}

export function duplicateItem<T>(items: T[], index: number): T[] {
  const item = items[index];
  if (!item) return items;
  const copy = [...items];
  copy.splice(index + 1, 0, structuredClone(item));
  return copy;
}
