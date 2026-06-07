import { ItemView, type WorkspaceLeaf } from "obsidian";
import { TODOIST_BOARD_VIEW_TYPE } from "./constants";
import { getDefaultFilter } from "./settings";
import { readJSON } from "./storage";
import type { Label, Project, TodoistBoardSettings, TodoistTask } from "./types";

export interface TodoistBoardViewPlugin {
  settings: TodoistBoardSettings;
  projectCache: Project[];
  labelCache: Label[];
  projectMap: Map<string, Project>;
  preloadFilters(): Promise<void>;
  fetchFilteredTasksFromREST(apiKey: string, filter: string): Promise<{ results?: TodoistTask[] }>;
  getViewTasks(filter: string): TodoistTask[];
  upsertTasks(filter: string, tasks: TodoistTask[]): void;
  renderTodoistBoard(
    container: HTMLElement,
    source: string,
    ctx: Record<string, unknown>,
    apiKey: string,
    initialData?: { tasks: TodoistTask[]; projects: Project[]; labels: Label[] },
  ): void | Promise<void>;
}

export class TodoistBoardView extends ItemView {
  constructor(leaf: WorkspaceLeaf, private readonly plugin: TodoistBoardViewPlugin) {
    super(leaf);
    this.icon = "list-todo";
  }

  getViewType() {
    return TODOIST_BOARD_VIEW_TYPE;
  }

  getDisplayText() {
    return "Todoist Board";
  }

  async onOpen() {
    let container = this.containerEl.querySelector(".view-content") as HTMLElement;
    if (!container) {
      container = this.containerEl.createDiv({ cls: "view-content" });
    }
    container.empty?.();
    container.classList.add("todoist-board", "plugin-view");
    container.setAttribute("id", "todoist-main-board");

    const plugin = this.plugin;
    const defaultFilter = getDefaultFilter(plugin.settings);
    plugin.settings.currentFilter = defaultFilter;
    container.setAttribute("data-current-filter", String(defaultFilter));

    await new Promise((resolve) => {
      const checkVisible = () => {
        if (container.offsetParent !== null) return resolve(undefined);
        window.setTimeout(checkVisible, 100);
      };
      checkVisible();
    });

    if (plugin.getViewTasks(defaultFilter).length === 0) {
      await plugin.preloadFilters();
    }

    const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, defaultFilter);
    const live = Array.isArray(response?.results) ? response.results : [];
    const cachedTasks = live.length ? live : plugin.getViewTasks(defaultFilter);
    plugin.upsertTasks(defaultFilter, cachedTasks);

    let projects = plugin.projectCache;
    let labels = plugin.labelCache;
    if (!Array.isArray(projects) || projects.length === 0) {
      projects = readJSON<Project[]>("todoistProjectsCache", []);
      plugin.projectCache = projects;
    }
    if (!Array.isArray(labels) || labels.length === 0) {
      labels = readJSON<Label[]>("todoistLabelsCache", []);
      plugin.labelCache = labels;
    }

    await plugin.renderTodoistBoard(container, `filter: ${defaultFilter}`, {}, plugin.settings.apiKey, {
      tasks: cachedTasks,
      projects,
      labels,
    });
  }

  async onClose() {
    // Obsidian handles the leaf disposal; plugin unload handles global cleanup.
  }
}
