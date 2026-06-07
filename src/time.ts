import { DateTime } from "luxon";
import type { TodoistBoardSettings } from "./types";

let hour12: boolean | null = null;

export function getZone(settings: Pick<TodoistBoardSettings, "timezoneMode" | "manualTimezone">) {
  return settings.timezoneMode === "manual"
    ? settings.manualTimezone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function safeZone(zone?: string | null): string {
  return (zone && zone.trim()) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function useHour12(): boolean {
  if (hour12 !== null) return hour12;
  try {
    const formatter = new Intl.DateTimeFormat(undefined, { timeStyle: "short" });
    const resolved = formatter.resolvedOptions();
    if (resolved && typeof resolved.hour12 === "boolean") {
      hour12 = resolved.hour12;
      return hour12 ?? false;
    }
    const parts = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    hour12 = parts.some((part) => part.type === "dayPeriod");
    return hour12;
  } catch {
    hour12 = false;
    return hour12;
  }
}

export function getDayLabel(dt: DateTime): string {
  if (!dt?.isValid) return "";
  const zone = dt.zoneName || "UTC";
  const today = DateTime.now().setZone(zone).startOf("day");
  const target = dt.startOf("day");
  if (target.hasSame(today, "day")) return "Today";
  if (target.hasSame(today.plus({ days: 1 }), "day")) return "Tomorrow";
  if (target.hasSame(today.minus({ days: 1 }), "day")) return "Yesterday";
  return dt.toFormat("MMM d");
}
