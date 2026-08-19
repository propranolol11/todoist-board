import { DateTime } from "luxon";
import type { Label, Project } from "./types";

export interface AddTaskFilterDefaults {
  due?: string;
  priority?: number;
  projectId?: string;
  labels?: string[];
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function findProjectId(name: string, projects: Project[]): string | undefined {
  const normalizedName = unquote(name).toLocaleLowerCase();
  const project = projects.find((candidate) =>
    candidate.name.trim().toLocaleLowerCase() === normalizedName
      || (normalizedName === "inbox" && candidate.isInboxProject === true),
  );
  return project ? String(project.id) : undefined;
}

function findLabelName(name: string, labels: Label[]): string | undefined {
  const normalizedName = unquote(name).toLocaleLowerCase();
  return labels.find((candidate) => candidate.name.trim().toLocaleLowerCase() === normalizedName)?.name;
}

/**
 * Converts deterministic, positive Todoist filter clauses into add-task defaults.
 * OR filters and ambiguous clauses are deliberately ignored so a new task is not
 * silently assigned to an arbitrary branch of the filter.
 */
export function getAddTaskDefaultsFromFilter(
  filter: string,
  projects: Project[],
  labels: Label[],
  timezone: string,
  now = DateTime.now(),
): AddTaskFilterDefaults {
  const query = String(filter || "").trim();
  if (!query || /[|,]/.test(query)) return {};

  const defaults: AddTaskFilterDefaults = {};
  const projectNames: string[] = [];
  const selectedLabels: string[] = [];
  const zonedNow = now.setZone(timezone);

  for (const rawClause of query.split("&")) {
    const clause = rawClause.trim();
    if (!clause || clause.startsWith("!") || /^not\b/i.test(clause)) continue;

    const projectMatch = /^#{1,2}(.+)$/.exec(clause);
    if (projectMatch?.[1]) {
      projectNames.push(projectMatch[1]);
      continue;
    }

    const labelMatch = /^@(.+)$/.exec(clause);
    if (labelMatch?.[1]) {
      const labelName = findLabelName(labelMatch[1], labels);
      if (labelName && !selectedLabels.includes(labelName)) selectedLabels.push(labelName);
      continue;
    }

    const priorityMatch = /^p([1-4])$/i.exec(clause);
    if (priorityMatch?.[1]) {
      defaults.priority = 5 - Number(priorityMatch[1]);
      continue;
    }

    const dueMatch = /^(?:due:\s*)?(today|tomorrow)$/i.exec(clause);
    if (dueMatch?.[1] && zonedNow.isValid) {
      const dueDate = dueMatch[1].toLocaleLowerCase() === "tomorrow"
        ? zonedNow.plus({ days: 1 })
        : zonedNow;
      defaults.due = dueDate.toISODate() || undefined;
    }
  }

  if (projectNames.length === 1) {
    defaults.projectId = findProjectId(projectNames[0], projects);
  }
  if (selectedLabels.length > 0) defaults.labels = selectedLabels;

  return defaults;
}
