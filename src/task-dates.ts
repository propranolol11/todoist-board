import { DateTime } from "luxon";
import type { AddTaskArgs } from "./todoist-service";
import type { Task, TodoistDue } from "./types";

export interface TaskDateFields {
  due?: string;
  repeats?: string;
}

export interface SyncTaskDue {
  date?: string;
  string?: string;
  is_recurring?: boolean;
  lang?: string;
  timezone?: string | null;
}

const calendarDate = /^\d{4}-\d{2}-\d{2}$/;
const fixedTime = /(?:Z|[+-]\d{2}:?\d{2})$/i;

/** API v1 uses date for both dates and timestamps; older cached REST tasks use datetime. */
export function toSyncTaskDue(due: TodoistDue): SyncTaskDue {
  const result: SyncTaskDue = {};
  if (due.datetime || due.date) result.date = due.datetime || due.date;
  if (due.string !== undefined) result.string = due.string;
  const recurring = due.is_recurring ?? due.isRecurring;
  if (recurring !== undefined) result.is_recurring = recurring;
  if (due.lang !== undefined) result.lang = due.lang;
  if (due.timezone !== undefined) result.timezone = due.timezone;
  return result;
}

export function getTaskDateFields(task: Task | undefined, timezone = "local"): Required<TaskDateFields> {
  const source = task?.due;
  const raw = source?.datetime || source?.date || "";
  let due = raw.slice(0, 10);
  if (raw && fixedTime.test(raw)) {
    const zoned = DateTime.fromISO(raw, { setZone: true }).setZone(timezone);
    if (zoned.isValid) due = zoned.toISODate() || due;
  }
  return {
    due,
    repeats: (source?.isRecurring || source?.is_recurring) ? source.string || "" : "",
  };
}

/** Let Todoist parse the rule, including completion-based every! schedules. */
export function buildAddTaskDue(due?: string, repeats?: string): Partial<AddTaskArgs> {
  const date = due?.trim() || "";
  const rule = repeats?.trim() || "";
  if (!rule) return date ? { dueDate: date } : {};
  // A complete custom rule can already specify its own start. Never append a second one.
  const hasStart = /\b(?:starting|starts?|from)\b/i.test(rule);
  return { dueString: date && !hasStart ? `${rule} starting ${date}` : rule, dueLang: "en" };
}

/** Move only the current occurrence, retaining its wall-clock time and recurrence metadata. */
export function rescheduleTaskDue(due: TodoistDue | null | undefined, date: string, timezone = "local"): SyncTaskDue {
  const result = due ? toSyncTaskDue(due) : {};
  const raw = result.date || "";
  if (raw.includes("T") && fixedTime.test(raw)) {
    const scheduleZone = due?.timezone || timezone;
    const original = DateTime.fromISO(raw, { setZone: true }).setZone(scheduleZone);
    const target = DateTime.fromISO(date, { zone: timezone });
    if (!original.isValid || !target.isValid) throw new Error("Invalid due date");
    // The calendar chooses a day in the board's zone, but the time belongs to the
    // task's schedule zone. They can observe DST on different days (or have
    // different calendar dates), so construct in the schedule zone first.
    const scheduledTime = {
      hour: original.hour, minute: original.minute, second: original.second, millisecond: original.millisecond,
    };
    let occurrence = target.setZone(scheduleZone).set(scheduledTime);
    const displayedDate = occurrence.setZone(timezone).toISODate();
    if (displayedDate && displayedDate < date) occurrence = occurrence.plus({ days: 1 }).set(scheduledTime);
    if (displayedDate && displayedDate > date) occurrence = occurrence.minus({ days: 1 }).set(scheduledTime);
    result.date = occurrence.toUTC().toISO() || date;
  } else {
    result.date = raw.includes("T") ? `${date}${raw.slice(10)}` : date;
  }
  // One-time relative labels such as 'tomorrow' become stale after a move.
  if (!result.is_recurring) delete result.string;
  return result;
}

export function buildTaskDueUpdate(
  task: Task | undefined,
  initial: TaskDateFields,
  submitted: TaskDateFields,
  timezone = "local",
): Record<string, unknown> {
  const initialDate = initial.due?.trim() || "";
  const initialRule = initial.repeats?.trim() || "";
  const date = submitted.due?.trim() || "";
  const rule = submitted.repeats?.trim() || "";
  if (date === initialDate && rule === initialRule) return {};
  if (date && !calendarDate.test(date)) throw new Error("Invalid due date");

  if (rule !== initialRule && rule) {
    return { ...buildAddTaskDue(date, rule) };
  }
  if (!date) {
    // Recurring tasks always have a date. With no explicit date, Todoist chooses the next one.
    return rule ? { dueString: rule, ...(task?.due?.lang ? { dueLang: task.due.lang } : {}) } : { due: null };
  }

  const due = rescheduleTaskDue(task?.due, date, timezone);
  if (initialRule && !rule) {
    due.is_recurring = false;
    delete due.string;
  }
  return { due };
}
