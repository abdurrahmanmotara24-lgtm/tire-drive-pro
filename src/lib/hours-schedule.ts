export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export type DaySchedule = {
  closed: boolean;
  open: string;
  close: string;
};

export type HoursSchedule = Record<DayKey, DaySchedule>;

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DEFAULT_DAY: DaySchedule = { closed: false, open: "08:00", close: "18:00" };

export const DEFAULT_HOURS_SCHEDULE: HoursSchedule = {
  mon: { ...DEFAULT_DAY },
  tue: { ...DEFAULT_DAY },
  wed: { ...DEFAULT_DAY },
  thu: { ...DEFAULT_DAY },
  fri: { ...DEFAULT_DAY },
  sat: { ...DEFAULT_DAY },
  sun: { closed: true, open: "08:00", close: "18:00" },
};

export function normalizeHoursSchedule(raw?: Partial<HoursSchedule> | null): HoursSchedule {
  const out = { ...DEFAULT_HOURS_SCHEDULE };
  if (!raw) return out;
  for (const key of DAY_KEYS) {
    if (raw[key]) out[key] = { ...out[key], ...raw[key] };
  }
  return out;
}

function formatTime12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return m ? `${hour12}:${String(m).padStart(2, "0")} ${suffix}` : `${hour12} ${suffix}`;
}

export function formatHoursSummary(schedule: HoursSchedule): string {
  const openDays = DAY_KEYS.filter((d) => !schedule[d].closed);
  if (openDays.length === 0) return "Closed";

  const first = schedule[openDays[0]!];
  const sameHours = openDays.every(
    (d) => schedule[d].open === first.open && schedule[d].close === first.close,
  );

  if (openDays.length === 7 && sameHours) {
    return `Daily ${formatTime12h(first.open)}–${formatTime12h(first.close)}`;
  }
  if (
    openDays.length === 6 &&
    schedule.sun.closed &&
    sameHours &&
    openDays.every((d) => d !== "sun")
  ) {
    return `Mon–Sat ${formatTime12h(first.open)}–${formatTime12h(first.close)}`;
  }
  if (
    openDays.length === 5 &&
    schedule.sat.closed &&
    schedule.sun.closed &&
    sameHours &&
    ["mon", "tue", "wed", "thu", "fri"].every((d) => openDays.includes(d as DayKey))
  ) {
    return `Mon–Fri ${formatTime12h(first.open)}–${formatTime12h(first.close)}`;
  }

  return openDays
    .map((d) => {
      const s = schedule[d];
      return `${DAY_LABELS[d].slice(0, 3)} ${formatTime12h(s.open)}–${formatTime12h(s.close)}`;
    })
    .join(" · ");
}

function parseTimeToHours(time: string): number | null {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h + (Number.isNaN(m) ? 0 : m) / 60;
}

const JS_DAY_TO_KEY: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getHoursStatusFromSchedule(schedule: HoursSchedule): { open: boolean | null; label: string } {
  const key = JS_DAY_TO_KEY[new Date().getDay()];
  const day = schedule[key];
  if (day.closed) return { open: false, label: "Closed today" };

  const openH = parseTimeToHours(day.open);
  const closeH = parseTimeToHours(day.close);
  if (openH === null || closeH === null) return { open: null, label: formatHoursSummary(schedule) };

  let end = closeH;
  if (end <= openH) end += 12;

  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = hour >= openH && hour < end;
  return {
    open: isOpen,
    label: isOpen ? `Open now · until ${formatTime12h(day.close)}` : "Closed now",
  };
}
