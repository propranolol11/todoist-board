import { DateTime } from "luxon";
import type { Label, Project, RenderInput, SortMode, TodoistTask } from "./types";

type SortRow = {
  t: TodoistTask;
  id: string;
  hasDue: number;
  day: number;
  allDay: number;
  slot: number;
  negPr: number;
  alpha: string;
};

const ORDER_DUE: (keyof SortRow)[] = ["hasDue", "day", "allDay", "slot", "negPr", "alpha", "id"];
const ORDER_PRIO: (keyof SortRow)[] = ["negPr", "hasDue", "day", "allDay", "slot", "alpha", "id"];
const ORDER_ALPHA: (keyof SortRow)[] = ["alpha", "hasDue", "day", "allDay", "slot", "negPr", "id"];

function toRow(task: TodoistTask, timezone: string): SortRow {
  const due = task?.due;
  let hasDue = 1;
  let day = Number.POSITIVE_INFINITY;
  let allDay = 1;
  let slot = Number.POSITIVE_INFINITY;

  if (due?.datetime) {
    const dt = DateTime.fromISO(due.datetime).setZone(timezone);
    if (dt.isValid) {
      hasDue = 0;
      allDay = 0;
      day = dt.startOf("day").toMillis();
      slot = dt.toMillis();
    }
  } else if (due?.date) {
    const dt = DateTime.fromISO(due.date, { zone: timezone });
    if (dt.isValid) {
      hasDue = 0;
      allDay = 1;
      day = dt.startOf("day").toMillis();
      slot = dt.endOf("day").toMillis();
    }
  }

  return {
    t: task,
    id: String(task?.id ?? ""),
    hasDue,
    day,
    allDay,
    slot,
    negPr: -(Number(task?.priority) || 0),
    alpha: String(task?.content || "").toLowerCase(),
  };
}

function compareBy(order: (keyof SortRow)[]) {
  return (a: SortRow, b: SortRow) => {
    for (const key of order) {
      if (key === "t") continue;
      if (key === "alpha") {
        const result = a.alpha.localeCompare(b.alpha, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        if (result) return result;
      } else if (key === "id") {
        const result = a.id.localeCompare(b.id);
        if (result) return result;
      } else {
        const left = a[key] as number;
        const right = b[key] as number;
        if (left !== right) return left - right;
      }
    }
    return 0;
  };
}

export function normalizeSortMode(mode: string | null | undefined): SortMode {
  if (mode === "Priority" || mode === "Alphabetical" || mode === "Manual") return mode;
  return "Due Date";
}

export function sortTasksLikeTodoist(tasks: TodoistTask[], mode: string, timezone: string): TodoistTask[] {
  const normalized = normalizeSortMode(mode);
  if (normalized === "Manual") return tasks.slice();

  const rows = (tasks || []).map((task) => toRow(task, timezone));
  if (normalized === "Priority") rows.sort(compareBy(ORDER_PRIO));
  else if (normalized === "Alphabetical") rows.sort(compareBy(ORDER_ALPHA));
  else rows.sort(compareBy(ORDER_DUE));
  return rows.map((row) => row.t);
}

export function buildRenderInput(args: {
  base: TodoistTask[];
  mode: string;
  timezone: string;
  projects: Project[];
  labels: Label[];
}): RenderInput {
  const mode = normalizeSortMode(args.mode);
  const base = Array.isArray(args.base) ? args.base.slice() : [];
  return {
    mode,
    viewTasks: mode === "Manual" ? base : sortTasksLikeTodoist(base, mode, args.timezone),
    projects: Array.isArray(args.projects) ? args.projects : [],
    labels: Array.isArray(args.labels) ? args.labels : [],
  };
}
