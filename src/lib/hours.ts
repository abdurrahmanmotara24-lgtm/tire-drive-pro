import { getHoursStatusFromSchedule, normalizeHoursSchedule, type HoursSchedule } from "@/lib/hours-schedule";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getHoursStatus(
  hours: string,
  schedule?: HoursSchedule | null,
): { open: boolean | null; label: string } {
  if (schedule) {
    return getHoursStatusFromSchedule(normalizeHoursSchedule(schedule));
  }
  const text = hours.trim();
  if (!text) return { open: null, label: "" };

  const now = new Date();
  const day = now.getDay();
  const dayName = DAY_NAMES[day];
  const hour = now.getHours() + now.getMinutes() / 60;

  const mentionsToday =
    text.includes(dayName) ||
    (day >= 1 && day <= 5 && /Mon[^a-z]*Fri/i.test(text)) ||
    (day >= 1 && day <= 6 && /Mon[^a-z]*Sat/i.test(text)) ||
    /daily|every day|7\s*days/i.test(text);

  const closedSunday = day === 0 && /Mon[^a-z]*Sat/i.test(text) && !/Sun/i.test(text);
  if (closedSunday) return { open: false, label: "Closed today" };

  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(?:–|-|to)\s*(\d{1,2})(?::(\d{2}))?/i);
  if (!timeMatch || !mentionsToday) {
    return { open: null, label: text };
  }

  const openH = Number(timeMatch[1]) + (timeMatch[2] ? Number(timeMatch[2]) / 60 : 0);
  let closeH = Number(timeMatch[3]) + (timeMatch[4] ? Number(timeMatch[4]) / 60 : 0);
  if (closeH <= openH) closeH += 12;

  const open = hour >= openH && hour < closeH;
  return {
    open,
    label: open ? `Open now · until ${timeMatch[3]}${timeMatch[4] ? `:${timeMatch[4]}` : ""}` : "Closed now",
  };
}
