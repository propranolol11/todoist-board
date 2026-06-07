/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, no-empty */
import { DateTime } from "luxon";
import type { Filter, TodoistBoardSettings } from "./types";

export function parseBlockParams(raw: string): Record<string, string> {
  const params: Record<string, string> = {};
  for (const line of (raw || "").split("\n")) {
    const match = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)$/);
    if (match) params[match[1].trim()] = match[2].trim();
  }
  return params;
}

export function resolveFilterFromSource(
  source: string,
  priorFilter: string | null,
  settings: TodoistBoardSettings,
): string {
  const parsed = parseBlockParams(source || "");
  let filter = String(priorFilter || "");

  if (typeof parsed.Filter === "string" && parsed.Filter.trim()) {
    filter = parsed.Filter.trim();
  } else {
    const match = (source || "").match(/\bfilter\s*:\s*(.+)/i);
    if (match?.[1]?.trim()) filter = match[1].trim();
  }

  if (!filter) {
    filter = String(
      settings.filters?.find((entry) => entry.isDefault)?.filter
        ?? settings.filters?.[0]?.filter
        ?? "today",
    );
  }

  return filter;
}

export function sourceOrDefault(source: string, filters: Filter[]): string {
  if (!source || !source.trim()) {
    const defaultFilter = filters.find((filter) => filter.isDefault) || filters[0];
    return `filter: ${defaultFilter?.filter ?? "today"}`;
  }
  return source
    .split("\n")
    .filter((line) => !line.trim().toLowerCase().startsWith("toolbar:"))
    .join("\n");
}

export function parseTodoistQuery(query: string, timezone: string): Record<string, any> {
  const now = DateTime.now().setZone(timezone);
  const result: any = { is_completed: false };
  const andParts = query.toLowerCase().split("&").map((part) => part.trim());

  for (const part of andParts) {
    if (part === "today") {
      result.due_after = now.startOf("day").toISO();
      result.due_before = now.endOf("day").toISO();
    } else if (part === "overdue") {
      result.due_before = now.startOf("day").toISO();
    } else if (part.startsWith("next ")) {
      const match = part.match(/next (\d+) day/);
      if (match) {
        const days = Number.parseInt(match[1], 10);
        result.due_after = now.startOf("day").toISO();
        result.due_before = now.plus({ days }).endOf("day").toISO();
      }
    } else if (part.startsWith("p")) {
      const match = part.match(/p([1-4])/);
      if (match) result.priority = Number(match[1]);
    } else if (part.startsWith("#")) {
      result.project_id = "inbox";
    }
  }

  return result;
}

export function getDefaultFilters(timezone: string): Record<string, { name: string; filter: any }> {
  const now = DateTime.now().setZone(timezone);
  return {
    Today: {
      name: "Today",
      filter: {
        due_after: now.startOf("day").toISO(),
        due_before: now.endOf("day").toISO(),
        is_completed: false,
      },
    },
    Overdue: {
      name: "Overdue",
      filter: {
        due_before: now.startOf("day").toISO(),
        is_completed: false,
      },
    },
    "No Due Date": {
      name: "No Due Date",
      filter: {
        due_before: null,
        due_after: null,
        is_completed: false,
      },
    },
  };
}
