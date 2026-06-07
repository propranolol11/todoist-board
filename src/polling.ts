/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, no-empty */
import type { TodoistTask } from "./types";

export interface PollingPluginAdapter {
  settings: { apiKey: string };
  fetchFilteredTasksFromREST(apiKey: string, filter: string): Promise<{ results?: TodoistTask[] }>;
  fetchMetadataFromSync(apiKey: string): Promise<any>;
  getViewTasks(filter: string): TodoistTask[];
  upsertTasks(filter: string, tasks: TodoistTask[]): void;
  renderTodoistBoard(container: HTMLElement, source: string, ctx: any, apiKey: string, initialData?: any): void;
  refreshAllInlineBoards(): void;
  projectCache: any[];
  labelCache: any[];
  projectCacheTimestamp: number;
  labelCacheTimestamp: number;
}

export function startTaskPolling(plugin: PollingPluginAdapter, interval = 10000): () => void {
  let lastActivity = Date.now();
  const handlers: { event: string; fn: () => void }[] = [];
  const updateActivity = () => {
    lastActivity = Date.now();
  };

  ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
    handlers.push({ event, fn: updateActivity });
  });

  const timer = window.setInterval(async () => {
    if (activeDocument.visibilityState !== "visible") return;
    if (Date.now() - lastActivity >= interval * 2) return;

    try {
      const filters = Array.from(
        new Set(
          Array.from(activeDocument.querySelectorAll(".todoist-board"))
            .map((el) => el.getAttribute("data-current-filter") || "today"),
        ),
      );
      let changedAny = false;

      for (const filter of filters) {
        const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, filter);
        const tasks = Array.isArray(response?.results) ? response.results : [];
        const existing = plugin.getViewTasks(filter);
        if (hasTaskChanges(existing, tasks)) {
          changedAny = true;
          plugin.upsertTasks(filter, tasks);
        }
      }

      if (!changedAny) return;

      activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach(async (el) => {
        const filter = el.getAttribute("data-current-filter") || "today";
        const metadata = await plugin.fetchMetadataFromSync(plugin.settings.apiKey);
        plugin.projectCache = metadata.projects || [];
        plugin.labelCache = metadata.labels || [];
        plugin.projectCacheTimestamp = Date.now();
        plugin.labelCacheTimestamp = Date.now();
        plugin.renderTodoistBoard(el as HTMLElement, `filter: ${filter}`, {}, plugin.settings.apiKey, {
          tasks: plugin.getViewTasks(filter),
          projects: plugin.projectCache,
          labels: plugin.labelCache,
        });
      });
      plugin.refreshAllInlineBoards();
    } catch {
      // Polling should never break the plugin UI.
    }
  }, interval);

  return () => {
    window.clearInterval(timer);
    handlers.forEach(({ event, fn }) => window.removeEventListener(event, fn as any));
  };
}

export function hasTaskChanges(previous: TodoistTask[], next: TodoistTask[]): boolean {
  const oldTasks = Array.isArray(previous) ? previous : [];
  const newTasks = Array.isArray(next) ? next : [];
  if (oldTasks.length !== newTasks.length) return true;

  const oldIds = new Set(oldTasks.map((task) => String(task.id)));
  const newIds = new Set(newTasks.map((task) => String(task.id)));
  if ([...oldIds].some((id) => !newIds.has(id))) return true;

  return newTasks.some((task) => {
    const previousTask = oldTasks.find((candidate) => String(candidate.id) === String(task.id));
    if (!previousTask) return true;
    const previousDue = (previousTask as any).due?.datetime ?? (previousTask as any).due?.date ?? null;
    const nextDue = (task as any).due?.datetime ?? (task as any).due?.date ?? null;
    const previousLabels = Array.isArray((previousTask as any).labels)
      ? (previousTask as any).labels.join(",")
      : (previousTask as any).labels;
    const nextLabels = Array.isArray((task as any).labels)
      ? (task as any).labels.join(",")
      : (task as any).labels;

    return previousDue !== nextDue
      || (previousTask as any).content !== (task as any).content
      || previousLabels !== nextLabels
      || String((previousTask as any).projectId ?? "") !== String((task as any).projectId ?? "");
  });
}
