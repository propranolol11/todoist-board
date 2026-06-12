import type { Label, Project, TodoistMetadata, TodoistTask } from "./types";

export interface PollingPluginAdapter {
  settings: { apiKey: string };
  fetchFilteredTasksFromREST(apiKey: string, filter: string): Promise<{
    results?: TodoistTask[];
    source?: "remote" | "cache" | "empty";
    error?: unknown;
  }>;
  fetchMetadataFromSync(apiKey: string): Promise<TodoistMetadata>;
  getViewTasks(filter: string): TodoistTask[];
  upsertTasks(filter: string, tasks: TodoistTask[]): void;
  renderTodoistBoard(
    container: HTMLElement,
    source: string,
    ctx: Record<string, unknown>,
    apiKey: string,
    initialData?: { tasks: TodoistTask[]; projects: Project[]; labels: Label[] },
  ): void;
  refreshAllInlineBoards(): void;
  projectCache: Project[];
  labelCache: Label[];
  projectCacheTimestamp: number;
  labelCacheTimestamp: number;
}

export function startTaskPolling(plugin: PollingPluginAdapter, interval = 10000): () => void {
  let lastActivity = Date.now();
  let inFlight = false;
  const events: Array<keyof WindowEventMap> = ["mousemove", "keydown", "click", "scroll"];
  const handlers: { event: keyof WindowEventMap; fn: EventListener }[] = [];
  const updateActivity = () => {
    lastActivity = Date.now();
  };

  events.forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
    handlers.push({ event, fn: updateActivity });
  });

  const timer = window.setInterval(() => {
    void (async () => {
    if (inFlight) return;
    if (!plugin.settings.apiKey) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    if (activeDocument.visibilityState !== "visible") return;
    if (Date.now() - lastActivity >= interval * 2) return;

    inFlight = true;
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
        if (response.source && response.source !== "remote") continue;
        const tasks = Array.isArray(response?.results) ? response.results : [];
        const existing = plugin.getViewTasks(filter);
        if (hasTaskChanges(existing, tasks)) {
          changedAny = true;
          plugin.upsertTasks(filter, tasks);
        }
      }

      if (!changedAny) return;

      const boards = Array.from(activeDocument.querySelectorAll<HTMLElement>(".todoist-board.plugin-view"));
      const metadataFresh = Array.isArray(plugin.projectCache)
        && plugin.projectCache.length > 0
        && Date.now() - plugin.projectCacheTimestamp < 5 * 60 * 1000;
      if (!metadataFresh) {
        const metadata = await plugin.fetchMetadataFromSync(plugin.settings.apiKey);
        plugin.projectCache = metadata.projects || [];
        plugin.labelCache = metadata.labels || [];
        plugin.projectCacheTimestamp = Date.now();
        plugin.labelCacheTimestamp = Date.now();
      }

      for (const el of boards) {
        const filter = el.getAttribute("data-current-filter") || "today";
        plugin.renderTodoistBoard(el, `filter: ${filter}`, {}, plugin.settings.apiKey, {
          tasks: plugin.getViewTasks(filter),
          projects: plugin.projectCache,
          labels: plugin.labelCache,
        });
      }
      plugin.refreshAllInlineBoards();
    } catch {
      // Polling should never break the plugin UI.
    } finally {
      inFlight = false;
    }
    })();
  }, interval);

  return () => {
    window.clearInterval(timer);
    handlers.forEach(({ event, fn }) => window.removeEventListener(event, fn));
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
    const previousDue = previousTask.due?.datetime ?? previousTask.due?.date ?? null;
    const nextDue = task.due?.datetime ?? task.due?.date ?? null;
    const previousLabels = Array.isArray(previousTask.labels)
      ? previousTask.labels.join(",")
      : previousTask.labels;
    const nextLabels = Array.isArray(task.labels)
      ? task.labels.join(",")
      : task.labels;

    return previousDue !== nextDue
      || previousTask.content !== task.content
      || previousLabels !== nextLabels
      || String(previousTask.projectId ?? "") !== String(task.projectId ?? "");
  });
}
