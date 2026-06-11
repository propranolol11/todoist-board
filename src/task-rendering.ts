import { MarkdownRenderer, setIcon } from "obsidian";
import { DateTime } from "luxon";
import { TODOIST_COLORS, TODOIST_COLORS_NUM } from "./constants";
import { clearEl } from "./dom";
import { getZone, safeZone, useHour12 } from "./time";
import type { App, Component } from "obsidian";
import type { Label, Project, TodoistBoardSettings, TodoistTask } from "./types";

export interface TaskContentRenderOptions {
  task: TodoistTask;
  projectMap: Record<string, string>;
  labelMap: Record<string, string>;
  labelColorMap: Record<string, string>;
  projects: Project[];
  labels: Label[];
  settings: TodoistBoardSettings;
  app: App;
  owner: Component;
}

export function getProjectHexColor(task: TodoistTask, projects: Project[]): string {
  const color = projects.find((project) => String(project.id) === String(task.projectId))?.color;
  if (typeof color === "number") {
    return TODOIST_COLORS_NUM[color] || "#e5e7eb";
  }
  if (typeof color === "string") {
    return TODOIST_COLORS[color] || "#e5e7eb";
  }
  return "#e5e7eb";
}

export function createTaskContent(options: TaskContentRenderOptions): HTMLElement {
  const {
    task,
    projectMap,
    labelMap,
    labelColorMap,
    projects,
    labels,
    settings,
    app,
    owner,
  } = options;

  const left = activeDocument.createElement("div");
  left.className = "task-content";

  const titleSpan = activeDocument.createElement("span");
  clearEl(titleSpan);
  void MarkdownRenderer.render(app, task.content, titleSpan, "", owner);
  titleSpan.className = "task-title";

  const metaSpan = activeDocument.createElement("small");
  metaSpan.className = "task-metadata";

  const pills = createTaskPills({
    task,
    projectMap,
    labelMap,
    labelColorMap,
    projects,
    labels,
    settings,
  });
  pills.forEach((pill) => metaSpan.appendChild(pill));

  const descEl = activeDocument.createElement("div");
  descEl.className = "task-description";
  if (typeof task.description === "string" && task.description.trim()) {
    descEl.textContent = task.description;
    descEl.classList.add("has-description", "desc-collapsed");
    const toggleDescription = activeDocument.createElement("button");
    toggleDescription.className = "task-description-toggle";
    toggleDescription.type = "button";
    toggleDescription.setAttribute("aria-label", "Expand description");
    toggleDescription.setAttribute("aria-expanded", "false");
    setIcon(toggleDescription, "chevron-down");
    const syncDescriptionToggle = (expanded: boolean) => {
      descEl.classList.toggle("desc-expanded", expanded);
      descEl.classList.toggle("desc-collapsed", !expanded);
      toggleDescription.setAttribute("aria-expanded", String(expanded));
      toggleDescription.setAttribute("aria-label", expanded ? "Collapse description" : "Expand description");
      setIcon(toggleDescription, expanded ? "chevron-up" : "chevron-down");
    };
    const toggleExpandedDescription = () => {
      const expanded = !descEl.classList.contains("desc-expanded");
      syncDescriptionToggle(expanded);
    };
    let toggledFromTouchPointer = false;
    toggleDescription.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    toggleDescription.addEventListener("pointerup", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        toggledFromTouchPointer = true;
        toggleExpandedDescription();
        window.setTimeout(() => {
          toggledFromTouchPointer = false;
        }, 0);
      }
    });
    toggleDescription.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (toggledFromTouchPointer) return;
      toggleExpandedDescription();
    };
    descEl.appendChild(toggleDescription);
    scheduleDescriptionOverflowSync(descEl);
  } else {
    descEl.classList.add("desc-empty");
  }

  const contentWrapper = activeDocument.createElement("div");
  contentWrapper.className = "task-content-wrapper";
  contentWrapper.appendChild(titleSpan);
  contentWrapper.appendChild(descEl);

  const whenRow = activeDocument.createElement("div");
  whenRow.className = "task-when";

  const dueInline = createDueInline(task, settings);
  if (dueInline) whenRow.appendChild(dueInline);

  const deadlineInline = createDeadlineInline(task, settings);
  if (deadlineInline) {
    if (whenRow.childNodes.length) {
      whenRow.appendChild(createMidSeparator());
    }
    whenRow.appendChild(deadlineInline);
  }
  contentWrapper.appendChild(whenRow);

  const metaRow = activeDocument.createElement("div");
  metaRow.className = "task-meta-compact";

  const projectInline = createProjectPill(task.projectId, projectMap, projects);
  if (projectInline) metaRow.appendChild(projectInline);

  const labelsInline = createLabelPill(task.labels, labelMap, labelColorMap, labels, isTaskRecurring(task));
  if (labelsInline) {
    if (projectInline) {
      metaRow.appendChild(createMidSeparator());
    }
    metaRow.appendChild(labelsInline);
  }
  contentWrapper.appendChild(metaRow);

  contentWrapper.appendChild(metaSpan);
  left.appendChild(contentWrapper);

  return left;
}

function scheduleDescriptionOverflowSync(descEl: HTMLElement) {
  const sync = () => {
    const wasExpanded = descEl.classList.contains("desc-expanded");
    if (wasExpanded) descEl.classList.remove("desc-expanded");
    descEl.classList.add("desc-collapsed");
    const hasOverflow = descEl.scrollHeight > descEl.clientHeight + 1;
    descEl.classList.toggle("has-overflow", hasOverflow);
    if (wasExpanded) {
      descEl.classList.toggle("desc-expanded", hasOverflow);
      descEl.classList.toggle("desc-collapsed", !hasOverflow);
    }
  };

  window.requestAnimationFrame(() => {
    sync();
    window.setTimeout(sync, 60);
  });
}

interface TaskPillOptions {
  task: TodoistTask;
  projectMap: Record<string, string>;
  labelMap: Record<string, string>;
  labelColorMap: Record<string, string>;
  projects: Project[];
  labels: Label[];
  settings: TodoistBoardSettings;
}

function createTaskPills(options: TaskPillOptions): HTMLElement[] {
  const { task, projectMap, labelMap, labelColorMap, projects, labels, settings } = options;
  const pills: HTMLElement[] = [];
  const zone = safeZone(getZone(settings));

  let dueDate = task.due?.date;
  let dueTime: string | undefined;
  let sourceDateTime: DateTime | null = null;

  if (task.due?.datetime) {
    sourceDateTime = DateTime.fromISO(task.due.datetime, { setZone: true });
  } else if (task.due?.date && task.due.date.includes("T")) {
    sourceDateTime = DateTime.fromISO(task.due.date, { setZone: true });
  } else if (task.due?.time) {
    sourceDateTime = DateTime.fromISO(`${task.due.date}T${task.due.time}`, { setZone: true });
  }

  if (sourceDateTime?.isValid) {
    const dt = sourceDateTime.setZone(zone);
    if (dt.hour !== 0 || dt.minute !== 0) {
      dueTime = dt.toFormat(useHour12() ? "h:mm a" : "HH:mm");
    }
    dueDate = dt.toISODate() || dueDate;
  }

  const duePill = createDuePill(dueDate, dueTime, settings);
  if (duePill) pills.push(duePill);

  const projectPill = createProjectPill(task.projectId, projectMap, projects);
  if (projectPill) pills.push(projectPill);

  const labelPill = createLabelPill(task.labels, labelMap, labelColorMap, labels, isTaskRecurring(task));
  if (labelPill) pills.push(labelPill);

  return pills.filter((pill) => pill.style.display !== "none");
}

function createDueInline(task: TodoistTask, settings: TodoistBoardSettings): HTMLElement | null {
  const due = task?.due?.datetime || task?.due?.date;
  if (!due) return null;

  const zone = getZone(settings);
  const dt = DateTime.fromISO(due).setZone(zone);
  if (!dt?.isValid) return null;

  const today = DateTime.now().setZone(zone).startOf("day");
  const target = dt.startOf("day");
  const days = Math.round(target.diff(today, "days").days);

  const hasTime = /T\d{2}:\d{2}/.test(due);
  const dateLabel =
    days === 0 ? "Today"
      : days === 1 ? "Tomorrow"
        : dt.toFormat("ccc, LLL d");

  const span = activeDocument.createElement("span");
  span.className = "due-inline";
  span.textContent = hasTime ? `${dateLabel} @ ${dt.toFormat(useHour12() ? "h:mm a" : "HH:mm")}` : dateLabel;

  if (isTaskRecurring(task)) {
    const recurring = activeDocument.createElement("span");
    recurring.className = "repeat-indicator";
    recurring.setAttribute("aria-label", "Repeats");
    recurring.title = "Repeats";
    recurring.textContent = " \uD83D\uDD01";
    span.appendChild(recurring);
  }

  return span;
}

function isTaskRecurring(task: TodoistTask): boolean {
  return Boolean(
    task?.due?.isRecurring === true ||
    task?.due?.is_recurring === true ||
    (typeof task?.due?.string === "string" && /\b(every|daily|weekly|monthly|yearly|weekday|weekend)\b/i.test(task.due.string))
  );
}

function createDeadlineInline(task: TodoistTask, settings: TodoistBoardSettings): HTMLElement | null {
  const deadline = task.deadline?.date;
  if (!deadline) return null;

  const zone = getZone(settings);
  const dt = DateTime.fromISO(deadline, { zone });
  if (!dt?.isValid) return null;

  const today = DateTime.now().setZone(zone).startOf("day");
  const target = dt.startOf("day");
  const days = Math.round(target.diff(today, "days").days);

  const span = activeDocument.createElement("span");
  span.className = "deadline-inline";
  span.textContent =
    days === 0 ? "🎯 today"
      : days === 1 ? "🎯 in 1 day"
        : days < 0 ? `🎯 ${Math.abs(days)} days ago`
          : `🎯 in ${days} days`;

  return span;
}

function createDuePill(
  dueDate: string | undefined,
  dueTime: string | undefined,
  settings: TodoistBoardSettings,
): HTMLElement | null {
  if (!dueDate) return null;

  const zone = safeZone(getZone(settings));
  let dt: DateTime | null = null;
  let hasTime = false;

  if (dueTime) {
    let parsed = DateTime.fromFormat(dueTime, "h:mm a", { zone });
    if (!parsed.isValid) parsed = DateTime.fromFormat(dueTime, "HH:mm", { zone });

    if (parsed.isValid) {
      const hhmm = parsed.toFormat("HH:mm");
      dt = DateTime.fromISO(`${dueDate}T${hhmm}`, { zone }).setZone(zone);
      hasTime = true;
    }
  }

  if (!dt || !dt.isValid) {
    dt = DateTime.fromISO(dueDate, { zone }).startOf("day");
    hasTime = false;
  }

  const pill = activeDocument.createElement("span");
  pill.className = "due-pill";

  const day = getDayLabel(dt);
  pill.textContent = hasTime
    ? `${day} @ ${dt.toFormat(useHour12() ? "h:mm a" : "HH:mm")}`
    : day;

  return pill;
}

function getDayLabel(dt: DateTime): string {
  if (!dt?.isValid) return "";

  const zone = dt.zoneName;
  const today = DateTime.now().setZone(zone || "UTC").startOf("day");
  const target = dt.startOf("day");

  if (target.hasSame(today, "day")) return "Today";
  if (target.hasSame(today.plus({ days: 1 }), "day")) return "Tomorrow";
  if (target.hasSame(today.minus({ days: 1 }), "day")) return "Yesterday";

  return dt.toFormat("MMM d");
}

function createProjectPill(
  projectId: string | undefined,
  projectMap: Record<string, string>,
  projects: Project[],
): HTMLElement | null {
  if (!projectId) return null;

  const projectPill = activeDocument.createElement("span");
  projectPill.className = "pill project-pill";
  projectPill.setAttribute("data-type", "project");

  const projectName = projectMap[String(projectId)] || "Unknown Project";
  const project = Array.isArray(projects)
    ? projects.find((candidate) => String(candidate.id) === String(projectId))
    : undefined;

  let projectHex = "";
  const colorValue = project?.color;
  if (typeof colorValue === "string" && colorValue.trim()) {
    const color = colorValue.trim();
    projectHex = (color.startsWith("#") || color.startsWith("rgb")) ? color : (TODOIST_COLORS[color] || "");
  }

  if (colorValue) projectPill.setAttribute("data-project-color-id", String(colorValue));
  projectPill.style.removeProperty("--project-color");
  if (projectHex) projectPill.style.setProperty("--project-color", projectHex);

  clearEl(projectPill);

  const name = String(projectName || "Unknown");
  if (name.toLowerCase() === "inbox") projectPill.classList.add("project-pill-inbox");

  const hash = activeDocument.createElement("span");
  hash.className = "project-hash";
  hash.textContent = "#";
  if (projectHex) hash.style.color = projectHex;
  projectPill.appendChild(hash);

  const nameSpan = activeDocument.createElement("span");
  nameSpan.className = "project-name";
  nameSpan.textContent = name.toLowerCase() === "inbox" ? "📥 Inbox" : name;
  projectPill.appendChild(nameSpan);

  return projectPill;
}

function createLabelPill(
  labels: (number | string)[] | undefined,
  labelMap: Record<string, string>,
  labelColorMap: Record<string, string>,
  labelCache: Label[],
  hideLeadingRepeatEmoji = false,
): HTMLElement | null {
  if (!Array.isArray(labels) || labels.length === 0) return null;

  const labelPill = activeDocument.createElement("span");
  labelPill.className = "pill label-pill";
  labelPill.setAttribute("data-type", "label");

  const resolveIdKey = (value: string): string | null => {
    const input = String(value);
    if (labelMap[input] !== undefined) return input;
    const numericInput = Number(input);
    if (!Number.isNaN(numericInput) && labelMap[String(numericInput)] !== undefined) return String(numericInput);
    for (const [id, name] of Object.entries(labelMap)) {
      if (String(name) === input) return id;
    }
    return null;
  };

  labels.forEach((raw, index) => {
    const input = String(raw);
    const idKey = resolveIdKey(input);
    const rawName = idKey ? (labelMap[idKey] ?? input) : input;
    const repeatStrippedName = rawName.replace(/^\s*(?:🔁|🔄|↻|⟳|⟲)\s*/u, "");
    const name = hideLeadingRepeatEmoji && repeatStrippedName.trim()
      ? repeatStrippedName
      : rawName;

    let rawColor: string | number | undefined = idKey ? labelColorMap[idKey] : undefined;
    if (!rawColor && labelColorMap[input] !== undefined) {
      rawColor = labelColorMap[input];
    }
    if (!rawColor && Array.isArray(labelCache)) {
      const hit = labelCache.find((label) => {
        return String(label.id) === input || String(label.id) === idKey || String(label.name) === input;
      });
      rawColor = hit?.color;
    }

    let color = "";
    if (typeof rawColor === "string" && rawColor.trim()) {
      const rawHex = rawColor.trim();
      color = (rawHex.startsWith("#") || rawHex.startsWith("rgb")) ? rawHex : (TODOIST_COLORS[rawHex] || rawHex);
    }

    const part = activeDocument.createElement("span");
    part.className = "label-part";

    const at = activeDocument.createElement("span");
    at.className = "label-at";
    at.textContent = "@ ";

    if (color) {
      labelPill.style.setProperty("--label-color", color);
      part.style.setProperty("--label-color", color);
      at.style.setProperty("--label-color", color);
      at.classList.add("label-at");
      at.style.cssText += `; --label-color: ${color}; color: ${color};`;
    }

    part.appendChild(at);
    part.appendChild(activeDocument.createTextNode(String(name)));
    labelPill.appendChild(part);

    if (index < labels.length - 1) {
      const separator = activeDocument.createElement("span");
      separator.className = "label-separator";
      separator.textContent = ",";
      labelPill.appendChild(separator);
    }
  });

  return labelPill;
}

function createMidSeparator(): HTMLElement {
  const separator = activeDocument.createElement("span");
  separator.className = "mid-sep";
  separator.textContent = " | ";
  return separator;
}
