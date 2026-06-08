// ======================= 🌟 Constants & Interfaces =======================
// --- Selected Filter Index State ---
let selectedFilterIndex: number = 0;

import {
  Modal,
  Plugin,
  MarkdownPostProcessorContext,
  Notice,
} from "obsidian";


import { setIcon, Menu, MenuItem } from "obsidian";
import {
  TODOIST_BOARD_VIEW_TYPE as CORE_TODOIST_BOARD_VIEW_TYPE,
  TODOIST_COLORS,
} from "./src/constants";
import {
  COMMON_TIMEZONES,
  DEFAULT_SETTINGS as CORE_DEFAULT_SETTINGS,
  normalizeSettings,
} from "./src/settings";
import {
  TodoistBoardStorage,
} from "./src/storage";
import { StorageRepository } from "./src/storage-repository";
import { TaskStore } from "./src/task-store";
import { TodoistService, type TodoistTaskFetchResult } from "./src/todoist-service";
import { TaskActions } from "./src/task-actions";
import { TaskSheetModal } from "./src/modals/task-sheet-modal";
import { openFilterSettingsModal } from "./src/modals/filter-settings-modal";
import { buildRenderInput as buildRenderInputCore } from "./src/sort";
import { startTaskPolling } from "./src/polling";
import { TodoistBoardView } from "./src/view";
import { TodoistBoardSettingTab } from "./src/settings-tab";
import { markTaskHierarchyClasses, populateLabelPillText, syncDirectTaskDomOrder } from "./src/board-renderer";
import { a11yButton, applyDimClass, clearEl } from "./src/dom";
import { resolveFilterFromSource, sourceOrDefault } from "./src/filters";
import { getZone } from "./src/time";
import { createTaskContent, getProjectHexColor } from "./src/task-rendering";
import { getTaskId, getTaskParentId, TaskHierarchy } from "./src/task-hierarchy";
import type {
	  GetSectionsResponse,
  Filter,
	  Label,
	  Project,
	  Task,
	  TodoistBoardSettings as CoreTodoistBoardSettings,
} from "./src/types";

type TodoistBoardSettings = CoreTodoistBoardSettings;
type LogArg = unknown;
type RenderContext = MarkdownPostProcessorContext | Record<string, unknown>;
type RenderData = {
  tasks?: Task[];
  sections?: GetSectionsResponse[];
  projects?: Project[];
  labels?: Label[];
};
type DivOptions = { cls?: string };
type MenuWithMouseEvent = Menu & { showAtMouseEvent?: (event: MouseEvent) => void };
type BusyHTMLElement = HTMLElement & { _busy?: boolean };
type RootWithContainer = { containerEl?: { hasClass?: (className: string) => boolean } };

declare global {
  interface Window {
    todoistApi?: ReturnType<TodoistService["getApi"]>;
  }
}

const TODOIST_BOARD_VIEW_TYPE = CORE_TODOIST_BOARD_VIEW_TYPE;

const DEFAULT_SETTINGS: TodoistBoardSettings = CORE_DEFAULT_SETTINGS;

export default class TodoistBoardPlugin extends Plugin {
  // Debug logger helpers (gated by settings.enableLogs)
  private log(...args: LogArg[]) {
    if (this.settings?.enableLogs) window.console?.log(...args);
  }
  private info(...args: LogArg[]) {
    if (this.settings?.enableLogs) window.console?.info(...args);
  }
  private warn(...args: LogArg[]) {
    if (this.settings?.enableLogs) window.console?.warn(...args);
  }
  private error(...args: LogArg[]) {
    if (this.settings?.enableLogs) window.console?.error(...args);
  }

  // Closes any Todoist Board modal (edit/add)
  private closeAnyModal() {
    const modal = activeDocument.querySelector('.todoist-modal');
    if (modal && modal.parentElement) modal.parentElement.removeChild(modal);
    this.closeModal();
  }

  // Back-compat
  private dbg(...args: LogArg[]) { this.log(...args); }

  // Centralized helper for sorting and metadata selection used by all views
  private buildRenderInput(base: Task[], container: HTMLElement, filterKey: string) {
    const stored = this.getSortMode(filterKey);
    if (!container.dataset.sortMode) container.dataset.sortMode = stored;
    const mode = container.dataset.sortMode || stored;

    const projects = (Array.isArray(this.projectCache) && this.projectCache.length)
      ? this.projectCache
      : this.storage?.loadMetadata().projects || [];

    const labels = (Array.isArray(this.labelCache) && this.labelCache.length)
      ? this.labelCache
      : this.storage?.loadMetadata().labels || [];

    return buildRenderInputCore({
      base: Array.isArray(base) ? base : [],
      mode,
      timezone: getZone(this.settings),
      projects,
      labels,
    });
  }

  // Sort state helpers
  private getSortMode(filterKey: string) {
    this.ensureRefactoredRuntime();
    return this.storageRepository.getSortMode(String(filterKey));
  }
  private setSortMode(filterKey: string, mode: string) {
    this.ensureRefactoredRuntime();
    this.storageRepository.setSortMode(String(filterKey), mode);
  }

  // =========== Plugin ready state and ensurePluginReady ==============
  private _ready: boolean = false;

  private async ensurePluginReady(): Promise<void> {
    if (this._ready) return;

    this.ensureRefactoredRuntime(this.settings.apiKey);

    if (!this.projectCache || this.projectCache.length === 0) {
      const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
      this.projectCache = metadata.projects;
      this.labelCache = metadata.labels;
      this.projectCacheTimestamp = Date.now();
      this.labelCacheTimestamp = Date.now();
    }

    await this.preloadFilters();

    this._ready = true;
  }
  public currentFilter: string = "";

  public setCurrentFilter(filter: string) {
    this.currentFilter = filter;
  }
  // --- Cancellation token for filter rendering ---
  private currentRenderToken: string = "";
  private compactMode: boolean = false;
  private _globalClickListener = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    // Do nothing for clicks inside the left sidebar (file explorer)
    if (t && t.closest(".workspace-split.mod-left-split")) return;

    const openDropdown = activeDocument.querySelector(".menu-dropdown:not(.hidden)");
    if (openDropdown) openDropdown.classList.add("hidden");
  };
  // --- Timezone tracking for cache invalidation ---
  private lastKnownTimezone: string | null = null;
  private todoistApi!: ReturnType<TodoistService["getApi"]>;

  static commonTimezones = COMMON_TIMEZONES;
  // ======================= 🔌 Plugin Class =======================
  settings!: TodoistBoardSettings;
  public taskStore: Record<string, Task> = {};              // id → task (single source of truth)
  public filterIndex: Record<string, string[]> = {};       // filterKey → [taskId]
  public taskCache: Record<string, Task[]> = {};            // legacy (kept for compatibility)
  public projectCache: Project[] = [];
  public labelCache: Label[] = [];
  private loadingOverlay?: HTMLDivElement;
  private taskCacheTimestamps: Record<string, number> = {};
  public projectCacheTimestamp: number = 0;
  public labelCacheTimestamp: number = 0;
  private storage!: TodoistBoardStorage;
  private storageRepository!: StorageRepository;
  private taskStoreController!: TaskStore;
  private todoistService!: TodoistService;
  private taskActions!: TaskActions;
  private stopTaskPolling?: () => void;
  private settingsTab?: TodoistBoardSettingTab;
  private readonly taskPageSize = 100;
  private filterNextCursor: Record<string, string | null> = {};
  private taskHierarchy = new TaskHierarchy();

  private ensureRefactoredRuntime(apiKey: string = this.settings?.apiKey || "") {
    if (!this.storage) this.storage = new TodoistBoardStorage(this.app);
    if (!this.storageRepository) this.storageRepository = new StorageRepository(this.storage, this.app);
    if (!this.taskStoreController) {
      this.taskStoreController = new TaskStore(this.storage);
      const filters = (this.settings?.filters || DEFAULT_SETTINGS.filters || [])
        .map((filter) => String(filter.filter));
      this.taskStoreController.hydrate(filters);
      this.syncTaskStoreRefs();
    }
    if (!this.todoistService) {
      this.todoistService = new TodoistService(apiKey, {
        getCachedTasks: (filterKey) => this.getViewTasks(filterKey),
      });
      this.taskActions = new TaskActions(this.todoistService);
      this.todoistApi = this.todoistService.getApi();
      window.todoistApi = this.todoistApi;
    } else {
      this.todoistService.setApiKey(apiKey);
      this.todoistApi = this.todoistService.getApi();
      window.todoistApi = this.todoistApi;
    }
  }

  private syncTaskStoreRefs() {
    if (!this.taskStoreController) return;
    this.taskStore = this.taskStoreController.tasksById;
    this.filterIndex = this.taskStoreController.filterIndex;
    this.taskCache = this.taskStoreController.taskCache;
    this.taskCacheTimestamps = this.taskStoreController.timestamps;
  }

  async validateTodoistApiKey(apiKey: string): Promise<boolean> {
    this.ensureRefactoredRuntime(apiKey);
    return this.todoistService.validateApiKey(apiKey);
  }


  // ---- Single-source helpers ----
  public upsertTasks(filterKey: string, tasks: Task[], opts?: { silentSidebar?: boolean; preferExisting?: boolean }) {
    this.ensureRefactoredRuntime();
    const { changed } = this.taskStoreController.upsert(String(filterKey), Array.isArray(tasks) ? tasks : [], {
      preferExisting: opts?.preferExisting,
    });
    this.syncTaskStoreRefs();

    // Re-render all visible sidebar boards immediately (event-driven, like inline)
    // Avoid echo loops when upsert is called from within render paths
    if (changed && !opts?.silentSidebar) {
      try {
        const boards = Array.from(activeDocument.querySelectorAll<HTMLElement>(".todoist-board.plugin-view"));
        boards.forEach((board) => {
          const f = board.getAttribute("data-current-filter") || "today";
          const tasksForView = this.getViewTasks(f);
          this.renderTodoistBoard(
            board,
            `filter: ${f}`,
            {},
            this.settings.apiKey,
            { tasks: tasksForView, projects: this.projectCache, labels: this.labelCache }
          );
          const badge = board.querySelector(`.filter-row[data-filter="${f}"] .filter-badge-count`);
          if (badge) badge.textContent = this.formatFilterCount(tasksForView.length, Boolean(this.filterNextCursor[f]));
        });
      } catch {
        // Ignore sidebar refresh failures; the next render cycle will recover.
      }
    }
    this.refreshAllInlineBoards();
  }

  private deleteTaskEverywhere(taskId: string) {
    this.ensureRefactoredRuntime();
    this.taskStoreController.removeEverywhere(String(taskId));
    this.syncTaskStoreRefs();
    this.refreshAllInlineBoards();
  }

  private clearTasksForFilter(filterKey: string) {
    this.ensureRefactoredRuntime();
    this.taskStoreController.clearFilter(String(filterKey));
    this.syncTaskStoreRefs();
  }

  public getViewTasks(filterKey: string): Task[] {
    this.ensureRefactoredRuntime();
    return this.taskStoreController.getViewTasks(String(filterKey));
  }
  // --- Project Map for id lookup ---
  projectMap: Map<string, Project> = new Map();

  async fetchFilteredTasksFromREST(
    apiKey: string,
    args: string,
    options: { cursor?: string | null } = {},
  ): Promise<TodoistTaskFetchResult> {
    const filterKey = args || "today";
    this.ensureRefactoredRuntime(apiKey);
    const result = await this.todoistService.fetchFilteredTasks(filterKey, {
      cursor: options.cursor,
      limit: this.taskPageSize,
    });
    this.filterNextCursor[filterKey] = result.nextCursor || null;
    return {
      results: Array.isArray(result.results) ? result.results : [],
      nextCursor: result.nextCursor || null,
      hasMore: Boolean(result.nextCursor),
      source: result.source,
    };
  }

  async fetchMetadataFromSync(apiKey: string): Promise<{
    projects: Project[];
    sections: GetSectionsResponse[];
    labels: Label[];
  }> {
    this.ensureRefactoredRuntime(apiKey);
    const metadata = await this.todoistService.fetchMetadata();
    if (metadata.projects.length || metadata.labels.length || metadata.sections.length) {
      this.storage.saveMetadata(metadata);
      return metadata;
    }
    return this.storage.loadMetadata();
  }
  async loadSettings() {
    const saved: unknown = await this.loadData();
    this.settings = normalizeSettings(
      saved && typeof saved === "object" ? saved : undefined
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
    // refresh inline boards
    activeDocument.querySelectorAll(".todoist-inline-board").forEach((el) => {
      el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
    });
    // update sidebar boards right away
    activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
      const on = !!this.settings.compactMode;
      const list = el.querySelector(".list-wrapper");
      if (list) (list as HTMLElement).classList.toggle("compact-mode", on);
    });
  }

  private formatFilterCount(count: number, hasMore = false): string {
    if (hasMore || count > this.taskPageSize) return `${this.taskPageSize}+`;
    return String(count);
  }

  private mergeTaskLists(existing: Task[], incoming: Task[]): Task[] {
    const byId = new Map<string, Task>();
    for (const task of Array.isArray(existing) ? existing : []) {
      const id = String(task?.id ?? "");
      if (id) byId.set(id, task);
    }
    for (const task of Array.isArray(incoming) ? incoming : []) {
      const id = String(task?.id ?? "");
      if (id) byId.set(id, task);
    }
    return Array.from(byId.values());
  }

  private getFilterRow(container: HTMLElement, filterKey: string): HTMLElement | null {
    return Array.from(container.querySelectorAll<HTMLElement>(".filter-row"))
      .find((row) => row.getAttribute("data-filter") === String(filterKey)) || null;
  }

  private updateFilterBadge(container: HTMLElement, filterKey: string, count: number, hasMore = false) {
    const row = this.getFilterRow(container, filterKey) || activeDocument.querySelector<HTMLElement>(`.filter-row[data-filter="${filterKey}"]`);
    const badge = row?.querySelector<HTMLElement>(".filter-badge-count");
    const badgeShell = row?.querySelector<HTMLElement>(".filter-badge");
    if (badgeShell) badgeShell.style.display = row?.classList.contains("selected") ? "" : "none";
    if (badge) badge.textContent = this.formatFilterCount(count, hasMore);
  }

  private updateVisibleFilterBadges(container: HTMLElement) {
    container.querySelectorAll<HTMLElement>(".filter-row").forEach((row) => {
      const badge = row.querySelector<HTMLElement>(".filter-badge");
      if (badge) badge.style.display = row.classList.contains("selected") ? "" : "none";
    });
  }

  private showFilterLoading(container: HTMLElement, filterKey: string, visibleTaskCount = 0) {
    container.classList.add("is-loading-filter");
    const row = this.getFilterRow(container, filterKey);
    row?.classList.add("is-loading");

    const listWrapper = container.querySelector<HTMLElement>(".list-wrapper");
    if (!listWrapper) return;
    listWrapper.classList.add("is-loading-filter");

    const title = row?.querySelector<HTMLElement>(".filter-title")?.textContent || "tasks";
    if (visibleTaskCount <= 0) {
      clearEl(listWrapper);
      listWrapper.appendChild(this.createTaskLoadingState(`Loading ${title}...`));
      return;
    }

    if (!listWrapper.querySelector(".task-loading-inline")) {
      const inline = this.createTaskLoadingState(`Refreshing ${title}...`);
      inline.classList.add("task-loading-inline");
      listWrapper.prepend(inline);
    }
  }

  private hideFilterLoading(container: HTMLElement, filterKey: string) {
    container.classList.remove("is-loading-filter");
    this.getFilterRow(container, filterKey)?.classList.remove("is-loading");
    const listWrapper = container.querySelector<HTMLElement>(".list-wrapper");
    listWrapper?.classList.remove("is-loading-filter");
    listWrapper?.querySelectorAll(".task-loading-state").forEach((el) => el.remove());
  }

  private createTaskLoadingState(message: string): HTMLElement {
    const state = activeDocument.createElement("div");
    state.className = "task-loading-state";
    const spinner = state.createSpan({ cls: "task-loading-spinner" });
    spinner.setAttribute("aria-hidden", "true");
    state.createSpan({ cls: "task-loading-text", text: message });
    return state;
  }

  private appendLoadMoreButton(listWrapper: HTMLElement, filterKey: string, apiKey: string) {
    const key = String(filterKey || "");
    const cursor = this.filterNextCursor[key];
    if (!key || !cursor || listWrapper.querySelector(".todoist-load-more-wrapper")) return;

    const wrapper = activeDocument.createElement("div");
    wrapper.className = "todoist-load-more-wrapper";
    const button = activeDocument.createElement("button");
    button.className = "todoist-load-more";
    button.textContent = "Load more";
    button.onclick = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextCursor = this.filterNextCursor[key];
      if (!nextCursor) return;

      button.disabled = true;
      button.textContent = "Loading...";
      try {
        const response = await this.fetchFilteredTasksFromREST(apiKey, key, { cursor: nextCursor });
        const incoming = Array.isArray(response.results) ? response.results : [];
        const combined = this.mergeTaskLists(this.getViewTasks(key), incoming);
        this.upsertTasks(key, combined, { silentSidebar: true });
        const boardRoot = listWrapper.closest<HTMLElement>(".todoist-board") ?? activeDocument.body;
        this.updateFilterBadge(boardRoot, key, combined.length, Boolean(response.nextCursor));

        const board = listWrapper.closest<HTMLElement>(".todoist-board");
        if (board) {
          this.renderTodoistBoard(board, `filter: ${key}`, {}, apiKey, {
            tasks: combined,
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || [],
          });
        }
      } catch {
        button.disabled = false;
        button.textContent = "Load more";
        new Notice("Could not load more tasks");
      }
    };

    wrapper.appendChild(button);
    listWrapper.appendChild(wrapper);
  }

  // ======================= 🔄 Refresh All Inline Boards =======================
  refreshAllInlineBoards() {
    activeDocument.querySelectorAll(".todoist-inline-board").forEach((el) => {
      el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
    });
  }
  async preloadFilters(): Promise<void> {
    const now = Date.now();
    const cacheTTL = 24 * 60 * 60 * 1000;
    const filters = this.settings.filters || DEFAULT_SETTINGS.filters!;

    await Promise.all(filters.map(async (f) => {
      try {
        const key = f.filter;
        let localTasks = this.getViewTasks(key);
        let timestamp = this.taskCacheTimestamps[key] || 0;
        if (!localTasks.length) {
          localTasks = this.storageRepository.loadTaskCache(key);
          timestamp = this.storageRepository.getTaskCacheTimestamp(key);
          if (localTasks.length) {
            this.upsertTasks(key, localTasks, { silentSidebar: true, preferExisting: true });
          }
        }

        if (localTasks.length && now - timestamp < cacheTTL) {
          // Fully await fetchFilteredTasksFromREST and handle changes synchronously
          const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
          const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
          let oldTasks = this.getViewTasks(key);
          if (!Array.isArray(oldTasks)) oldTasks = [];
          const oldIds = new Set(oldTasks.map((t) => t.id));
          const newIds = new Set(Array.isArray(tasks) ? tasks.map((t) => t.id) : []);
          const hasChanges = oldTasks.length !== (Array.isArray(tasks) ? tasks.length : 0) ||
            (Array.isArray(tasks) && tasks.some((t) => !oldIds.has(t.id))) ||
            oldTasks.some((t) => !newIds.has(t.id));

          if (hasChanges) {
            this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
          }

          const currentFilter = activeDocument.querySelector(".todoist-board.plugin-view")?.getAttribute("data-current-filter");
          if (hasChanges && currentFilter === key) {
            const container = activeDocument.querySelector(".todoist-board.plugin-view") as HTMLElement;
            if (container) {
              clearEl(container);
              this.renderTodoistBoard(container, `filter: ${key}`, {}, this.settings.apiKey);
            }
          }
        } else {
          const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
          const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
          this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
        }
      } catch {
        // Ignore best-effort preload failures for optional filters.
      }
    }));
  }

  async completeTask(taskId: string): Promise<void> {
    this.ensureRefactoredRuntime(this.settings.apiKey);
    await this.taskActions.completeTask(taskId);
    this.deleteTaskEverywhere(String(taskId));

    // Re-render all visible boards so every filter reflects the change
    const boards = Array.from(activeDocument.querySelectorAll<HTMLElement>(".todoist-board.plugin-view"));
    boards.forEach((board) => {
      const f = board.getAttribute("data-current-filter") || "today";
      const tasks = this.getViewTasks(f);
      this.renderTodoistBoard(board, `filter: ${f}`, {}, this.settings.apiKey, {
        tasks,
        projects: this.projectCache,
        labels: this.labelCache
      });
      const selected = board.querySelector(".todoist-card.selected");
      if (selected) selected.classList.remove("selected");
      // update badge in this toolbar
      const badge = board.querySelector(`.filter-row[data-filter="${f}"] .filter-badge-count`);
      if (badge) badge.textContent = this.formatFilterCount(tasks.length, Boolean(this.filterNextCursor[f]));
    });
    this.refreshAllInlineBoards();
  }

  private async openTodoistBoardInRightSidebar() {
    const existingLeaf = this.app.workspace
      .getLeavesOfType(TODOIST_BOARD_VIEW_TYPE)
      .find((leaf) => {
        const root = leaf.getRoot() as unknown as RootWithContainer;
        return root.containerEl?.hasClass?.("mod-right-split") === true;
      });

    const rightLeaf =
      existingLeaf ||
      this.app.workspace.getRightLeaf(false) ||
      this.app.workspace.getRightLeaf(true);

    if (!rightLeaf) return;

    if (rightLeaf.getViewState().type !== TODOIST_BOARD_VIEW_TYPE) {
      await rightLeaf.setViewState({
        type: TODOIST_BOARD_VIEW_TYPE,
        active: true,
      });
    }

    this.app.workspace.rightSplit.expand();
    this.app.workspace.setActiveLeaf(rightLeaf, { focus: true });
  }

  private async openTodoistBoardInNewTab() {
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({
      type: TODOIST_BOARD_VIEW_TYPE,
      active: true,
    });
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  }

  // ======================= 🚀 Plugin Load Lifecycle =======================
  onload = async () => {
    await (async () => {
      // Register the custom view before any command registration
      this.registerView(
        TODOIST_BOARD_VIEW_TYPE,
        (leaf) => new TodoistBoardView(leaf, this)
      );
      // Register command to open Todoist Board in right sidebar (works on mobile and desktop)
      this.addCommand({
        id: "open-sidebar",
        name: "Open in right sidebar",
        callback: () => this.openTodoistBoardInRightSidebar(),
      });
      this.addCommand({
        id: "open-new-tab",
        name: "Open in new tab",
        callback: () => this.openTodoistBoardInNewTab(),
      });
      await this.loadSettings();

      const initialToken = this.settings.apiKey;
      this.ensureRefactoredRuntime(initialToken);

      const cachedMetadata = this.storage.loadMetadata();
      if (Array.isArray(cachedMetadata.projects) && cachedMetadata.projects.length) {
        this.projectCache = cachedMetadata.projects;
        this.projectCacheTimestamp = this.storage.getMetadataTimestamp();
        this.projectMap.clear();
        for (const project of this.projectCache) {
          this.projectMap.set(String(project.id), project);
        }
      }
      if (Array.isArray(cachedMetadata.labels) && cachedMetadata.labels.length) {
        this.labelCache = cachedMetadata.labels;
        this.labelCacheTimestamp = this.storage.getMetadataTimestamp();
      }
      // OAuth2 authentication setup removed.
      if (!initialToken) {
        // console.warn("[Todoist Board] No Todoist API token found. Set one in the plugin settings.");
        // Still register the settings tab so the user can open settings even when not authenticated
        this.settingsTab = new TodoistBoardSettingTab(this.app, this);
        this.addSettingTab(this.settingsTab);
        return;
      }
      this.settingsTab = new TodoistBoardSettingTab(this.app, this);
      this.addSettingTab(this.settingsTab);


      if (!this.settings.filters?.some(f => f.isDefault)) {
        if (this.settings.filters && this.settings.filters.length > 0) {
          this.settings.filters[0].isDefault = true;
        }
      }

      if (this.settings.filters && !this.settings.filters.some(f => f.isDefault)) {
        this.settings.filters.forEach((f, i) => f.isDefault = (i === 0));
      }

      // Set compactMode from settings or default to false
      this.compactMode = this.settings.compactMode ?? false;

      // --- Timezone cache invalidation logic (respects manual mode) ---
      const effectiveZone = getZone(this.settings);
      let storedTimezone = this.storage.getTimezone();
      if (!storedTimezone) {
        this.storage.setTimezone(effectiveZone);
        storedTimezone = effectiveZone;
      }
      this.lastKnownTimezone = storedTimezone;

      if (storedTimezone !== effectiveZone) {
        // Invalidate all cached task data if timezone changed
        this.storage.clearTaskAndMetadataCaches();
        // Store updated timezone
        this.storage.setTimezone(effectiveZone);

        // Re-fetch metadata and update caches
        const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = Date.now();
        this.labelCacheTimestamp = Date.now();

        // Force re-render of current board if any is active
        const boardEl = activeDocument.querySelector(".todoist-board") as HTMLElement;
        const currentFilter = boardEl?.getAttribute("data-current-filter") || "";
        if (boardEl && currentFilter) {
          const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
          const tasks = resp?.results ?? [];
          this.upsertTasks(currentFilter, tasks, { silentSidebar: true });
          this.renderTodoistBoard(boardEl, `filter: ${currentFilter}`, {}, this.settings.apiKey, {
            tasks,
            projects: this.projectCache,
            labels: this.labelCache
          });
        }
      }

      this.loadingOverlay = activeDocument.createElement("div");
      this.loadingOverlay.className = "loading-overlay";
      const spinner = activeDocument.createElement("div");
      spinner.className = "spinner";
      this.loadingOverlay.appendChild(spinner);
      this.registerDomEvent(this.loadingOverlay, "click", (e) => e.stopPropagation());

      this.registerMarkdownCodeBlockProcessor(
        "todoist-board",
        (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
          // Add classes for code block container
          el.classList.add("block-language-todoist-board", "todoist-board", "todoist-inline-board");
          const sourcePath = ctx.sourcePath || "reading-mode-placeholder";
          const parsedFilter = resolveFilterFromSource(source || "", el.getAttribute("data-current-filter"), this.settings);
          const filterKey = parsedFilter;
          this.dbg("🎯 Final filter used:", filterKey);
          // Only update the attribute if it changed or was empty
          if (el.getAttribute("data-current-filter") !== filterKey) {
            el.setAttribute("data-current-filter", filterKey);
          }
          // Offline metadata hydration (so projects/labels resolve)
          const cachedMetadata = this.storage.loadMetadata();
          if (!Array.isArray(this.projectCache) || this.projectCache.length === 0) {
            const proj = cachedMetadata.projects;
            if (Array.isArray(proj) && proj.length) this.projectCache = proj;
          }
          if (!Array.isArray(this.labelCache) || this.labelCache.length === 0) {
            const labs = cachedMetadata.labels;
            if (Array.isArray(labs) && labs.length) this.labelCache = labs;
          }
          // Helper for rendering with sort toolbar
          const renderWithSortToolbar = (tasks: Task[]) => {
            // Per-inline-board compact mode persistence key
            const persistedCompactKeyPath = sourcePath;
            // Clear container
            clearEl(el);
            // Create a wrapper for the filter row and task list, as in createLayout
            const filterRowWrapper = activeDocument.createElement("div");
            filterRowWrapper.className = "filter-row-wrapper";
            filterRowWrapper.classList.add("tb-hidden"); // Hide filter bar for inline boards
            el.appendChild(filterRowWrapper);
            // Insert sort toolbar immediately after filterRowWrapper
            // --- Begin Inline Sort Toolbar ---
            const createDiv = (opts: DivOptions = {}) => {
              const div = activeDocument.createElement("div");
              if (opts.cls) div.className = opts.cls;
              return div;
            };
            // Prevent duplicate toolbar if render() is called twice by parent
            const existing = el.querySelector(".inline-toolbar");
            if (existing) existing.remove();

            const toolbar = createDiv({ cls: "inline-toolbar" });
            toolbar.classList.add("tb-flex", "tb-gap-8", "tb-mb-8");

            const sortButton = createDiv({ cls: "clickable-icon" });
            sortButton.classList.add("tb-fs-08");
            setIcon(sortButton, "arrow-up-down");
            const sortLabel = activeDocument.createElement("span");
            // Persist sort mode per filter key
            let currentSortMode = this.getSortMode(filterKey);
            el.dataset.sortMode = currentSortMode;
            this.setSortMode(filterKey, currentSortMode);
            sortLabel.textContent = `Sort: ${currentSortMode}`;
            sortLabel.classList.add("tb-ml-4", "tb-fs-08");
            sortButton.appendChild(sortLabel);
            sortButton.setAttribute("aria-label", "Sort tasks");
            sortButton.setAttribute("role", "button");
            a11yButton(sortButton, "Sort tasks");
            const render = () => {
              // Apply per-inline persisted compact mode (isolated from sidebar setting)
              const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
              const compactOn = this.storageRepository.getInlineCompact(persistedCompactKeyPath, currentFilterKey);
              el.classList.toggle("compact-mode", compactOn);

              // Remove previous list if any
              const prevList = el.querySelector(".list-wrapper");
              if (prevList) prevList.remove();

              // Build fresh base from cache or fetched "tasks"
              const base: Task[] = this.getViewTasks(currentFilterKey);

              const { mode, viewTasks, projects, labels } = this.buildRenderInput(base, el, currentFilterKey);

              // Render tasks
              const listWrapper = activeDocument.createElement("div");
              listWrapper.className = "list-wrapper";
              el.appendChild(listWrapper);
              // Ensure the newly created list reflects the inline board's own compact mode
              if (compactOn) {
                listWrapper.classList.add("compact-mode");
              } else {
                listWrapper.classList.remove("compact-mode");
              }

              this.projectMap.clear();
              for (const p of (projects || [])) this.projectMap.set(String(p.id), p);

              void this.renderTaskList(
                listWrapper,
                sourcePath,
                this.settings.apiKey,
                { tasks: viewTasks, projects, labels }
              );

              if (mode !== "Manual") {
                syncDirectTaskDomOrder(listWrapper, viewTasks);
                markTaskHierarchyClasses(listWrapper, viewTasks, this.taskStore);
              }
              populateLabelPillText(listWrapper, viewTasks, this.labelCache);
              // ——— Apply persisted dimming (inline board) ———
              try {
                const hidden = this.storageRepository.getHiddenSet();
                const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));
                nodes.forEach((node) => {
                  const id = String(node.dataset.taskId || "");
                  if (!id) return;
                  applyDimClass(node, hidden.has(id));
                });
              } catch {
                // Ignore dim-state failures; task rendering should still complete.
              }
            };

            render();


            // allow external refresh without destroying toolbar/sort state
            if (el.dataset.refreshBound !== "1") {
              el.addEventListener("todoist-inline-refresh", () => { render(); });
              el.dataset.refreshBound = "1";
            }

            // Use native Obsidian Menu instead of custom dropdown
            sortButton.onclick = (event) => {
              try {
                const menu = new Menu();
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Due date").setIcon("calendar").onClick(() => {
                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Due Date");
                    currentSortMode = "Due Date";
                    el.dataset.sortMode = currentSortMode;
                    this.setSortMode(filterKey, currentSortMode);
                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                    render();
                  })
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Priority").setIcon("arrow-up").onClick(() => {
                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Priority");
                    currentSortMode = "Priority";
                    el.dataset.sortMode = currentSortMode;
                    this.setSortMode(filterKey, currentSortMode);
                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                    render();
                  })
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Alphabetical").setIcon("list-ordered").onClick(() => {
                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Alphabetical");
                    currentSortMode = "Alphabetical";
                    el.dataset.sortMode = currentSortMode;
                    this.setSortMode(filterKey, currentSortMode);
                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                    render();
                  })
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Manual").setIcon("grip-vertical").onClick(() => {
                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Manual");
                    currentSortMode = "Manual";
                    el.dataset.sortMode = currentSortMode;
                    this.setSortMode(filterKey, currentSortMode);
                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                    render();
                  })
                );
                menu.addSeparator();
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Clear sort").setIcon("x-circle").onClick(() => {
                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Clear Sort (Manual)");
                    currentSortMode = "Manual";
                    el.dataset.sortMode = currentSortMode;
                    this.setSortMode(filterKey, currentSortMode);
                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                    render();
                  })
                );
                const menuWithMouse = menu as MenuWithMouseEvent;
                if (event.instanceOf(MouseEvent) && typeof menuWithMouse.showAtMouseEvent === "function") {
                  menuWithMouse.showAtMouseEvent(event);
                } else {
                  const r = sortButton.getBoundingClientRect();
                  menu.showAtPosition({ x: r.left, y: r.bottom });
                }
              } catch (err) {
                this.error("[Sort Button Error]", err);
              }
            };
            toolbar.appendChild(sortButton);

            // --- Capture (+) Button for inline board ---
            const captureBtn = activeDocument.createElement("span");
            captureBtn.className = "clickable-icon todoist-add-task-btn";
            captureBtn.classList.add(
              "tb-scale-125",
              "tb-opacity-60",
              "tb-flex",
              "tb-ai-center",
              "tb-justify-center",
              "tb-cursor-pointer"
            );
            setIcon(captureBtn, "plus-circle");
            captureBtn.title = "Add task";
            captureBtn.onclick = () => {
              void this.openAddTaskModal();
            };
            // Match hover style
            // Hover/focus opacity now handled in CSS via .tb-opacity-60 default and hover rule
            a11yButton(captureBtn, "Add task");
            toolbar.appendChild(captureBtn);
            // --- End Capture (+) Button ---
            // --- Manual Sync Button ---
            const syncButton = activeDocument.createElement("span");
            syncButton.className = "clickable-icon";
            setIcon(syncButton, "refresh-cw");
            syncButton.title = "Manual sync";
            syncButton.onclick = async () => {
              const currentFilter = el.getAttribute("data-current-filter") || "today";

              // If offline, keep cache and just re-render from it
              if (!navigator.onLine) {
                // if (this.settings?.enableLogs) console.warn("[Manual Sync] Offline, using cached tasks.");
                render();
                return;
              }

              // Online: refresh from server
              this.clearTasksForFilter(currentFilter);
              const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
              const tasks = resp?.results ?? [];
              this.upsertTasks(currentFilter, tasks);
              render();
            };
            a11yButton(syncButton, "Manual sync");
            toolbar.appendChild(syncButton);
            // --- Queue Toggle Button ---
            const queueButton = activeDocument.createElement("span");
            queueButton.className = "clickable-icon";
            setIcon(queueButton, "focus");
            queueButton.title = "Toggle queue mode";
            let queueActive = false;
            queueButton.onclick = () => {
              queueActive = !queueActive;
              this.updateQueueView(queueActive, el.querySelector(".list-wrapper")!);
            };
            a11yButton(queueButton, "Toggle queue mode");
            toolbar.appendChild(queueButton);

            // --- Compact Mode Toggle Button ---
            const compactButton = activeDocument.createElement("span");
            compactButton.className = "clickable-icon";
            setIcon(compactButton, "list");
            compactButton.title = "Toggle compact mode";
            compactButton.onclick = () => {
              const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
              const next = !el.classList.contains("compact-mode");
              el.classList.toggle("compact-mode", next);
              const lw = el.querySelector(".list-wrapper");
              if (lw) (lw as HTMLElement).classList.toggle("compact-mode", next);
              this.storageRepository.setInlineCompact(persistedCompactKeyPath, currentFilterKey, next);
            };
            a11yButton(compactButton, "Toggle compact mode");
            toolbar.appendChild(compactButton);

            // Place toolbar at the top; inline boards hide it via CSS when needed
            el.prepend(toolbar);
            // --- End Inline Sort Toolbar ---
          };
          // Use improved cache logic for loading and rendering tasks ---
          let storedTasks = this.getViewTasks(filterKey);
          if (!storedTasks.length) {
            storedTasks = this.storageRepository.loadTaskCache(filterKey);
          }
          let cachedTasks: Task[] = [];
          if (!storedTasks.length && !navigator.onLine) {
            const fallback = this.getViewTasks(filterKey);
            if (Array.isArray(fallback) && fallback.length) {
              cachedTasks = fallback;
              this.upsertTasks(filterKey, cachedTasks, { silentSidebar: true, preferExisting: true });
              renderWithSortToolbar(cachedTasks);
            }
          }


          if (storedTasks.length) {
            try {
              cachedTasks = storedTasks;
              this.dbg("📦 Cached tasks for", filterKey, ":", cachedTasks);
              if (Array.isArray(cachedTasks)) {
                this.upsertTasks(filterKey, cachedTasks, { silentSidebar: true, preferExisting: true });
                if (
                  el.classList.contains("block-language-todoist-board") ||
                  el.classList.contains("todoist-inline-board")
                ) {
                  renderWithSortToolbar(cachedTasks);
                } else {
                  this.renderTodoistBoard(
                    el,
                    `filter: ${filterKey}`,
                    { sourcePath },
                    this.settings.apiKey,
                    {
                      tasks: cachedTasks,
                      projects: this.projectCache || [],
                      labels: this.labelCache || [],
                    }
                  );
                }
              }
            } catch {
              // Ignore offline cache fallback failures and continue with live loading.
            }
          }

          if (navigator.onLine) {
            this.fetchFilteredTasksFromREST(
              this.settings.apiKey,
              parsedFilter
            )
              .then((resp) => {
                const tasks = resp?.results ?? [];
                this.dbg("🛰️ Live fetch results for", filterKey, ":", tasks);
                if (Array.isArray(tasks)) {
                  this.upsertTasks(filterKey, tasks);
                  if (el.isConnected) {
                    // Always use renderWithSortToolbar for inline boards (block-language-todoist-board or todoist-inline-board)
                    if (
                      el.classList.contains("block-language-todoist-board") ||
                      el.classList.contains("todoist-inline-board")
                    ) {
                      renderWithSortToolbar(tasks);
                    } else {
                      this.renderTodoistBoard(
                        el,
                        `filter: ${filterKey}`,
                        { sourcePath },
                        this.settings.apiKey,
                        {
                          tasks,
                          projects: this.projectCache || [],
                          labels: this.labelCache || [],
                        }
                      );
                    }
                  }
                }
              })
              .catch((e) => {
                // console.warn("Fetch failed, using cached data only", e);
              });
          }
        }
      );

      // Skip preloadFilters and initial metadata fetch

      // this.setupDoubleTapPrevention();

      // Ensure onLayoutReady is called with the correct `this` context (fixes TS/Rollup warning):
      window.setTimeout(() => {
        void this.onLayoutReady();
      }, 1);

      // (Removed polling-based initial render block; handled in TodoistBoardView.onOpen)

      this.registerDomEvent(activeDocument, "click", this._globalClickListener);

      // Start polling for task changes after initial rendering and setup
      this.stopTaskPolling?.();
      this.stopTaskPolling = startTaskPolling(this);
    })();
  }

  // ======================= 🏁 Auto-render Default Filter on Startup =======================
  // This block ensures the default filter's board is rendered immediately after UI is ready.
  // Inserted at the end of onload().
  // It waits for DOM elements to be present, then triggers the default filter render.
  async onLayoutReady() {
    // Wait for DOM to be ready (filter bar and board container rendered)
    // We'll use a short interval to check for elements.
    const tryRenderDefault = () => {
      const container = activeDocument.querySelector(".todoist-board.plugin-view");
      const defaultFilterRow = container?.querySelector(".filter-row[data-filter]");
      if (defaultFilterRow && container) {
        const source = defaultFilterRow.getAttribute("data-filter") || "today";
        const prev = container.getAttribute("data-current-filter");
        if (prev !== String(source)) container.setAttribute("data-current-filter", String(source));
        clearEl(container);
        (this as TodoistBoardPlugin).renderTodoistBoard(
          container as HTMLElement,
          `filter: ${String(source)}`,
          {},
          this.settings.apiKey,
          {
            tasks: this.getViewTasks(String(source)),
            sections: [],
            projects: this.projectCache,
            labels: this.labelCache
          }
        );
        activeDocument.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
        defaultFilterRow.classList.add("selected");
        return true;
      }
      return false;
    };
    // Try immediately, then poll for up to 1s.
    if (tryRenderDefault()) return;
    let tries = 0;
    // (Removed recursive setTimeout to prevent runaway retries)
    const interval = window.setInterval(() => {
      if (tryRenderDefault() || ++tries > 20) window.clearInterval(interval);
    }, 50);
  }

  // ======================= 🧹 Persistence & Cleanup =======================
  async savePluginData() {
    await this.saveData(this.settings);
    this.refreshAllInlineBoards();
  }

  onunload() {
    this.stopTaskPolling?.();
    this.stopTaskPolling = undefined;
    // Remove global event listener
    activeDocument.removeEventListener("click", this._globalClickListener);
    // Failsafe: always clear drag/body locks
    activeDocument.body.classList.remove("drag-disable", "tb-scroll-lock", "tb-has-selected-task");

    // Clear dropdowns
    const allDropdowns = activeDocument.querySelectorAll(".menu-dropdown-wrapper");
    allDropdowns.forEach(dropdown => dropdown.remove());

    // Remove any floating toolbars
    const toolbars = activeDocument.querySelectorAll("#mini-toolbar-wrapper");
    toolbars.forEach(toolbar => toolbar.remove());

    // Remove loading overlay
    if (this.loadingOverlay?.parentElement) {
      this.loadingOverlay.remove();
    }

    // Remove UI injected elements (e.g., .todoist-board, .todoist-plugin-ui if any)
    activeDocument.querySelectorAll('.todoist-plugin-ui').forEach(el => el.remove());

    // Remove menu dropdowns that might have been appended to body
    activeDocument.querySelectorAll('.menu-dropdown-wrapper').forEach(el => el.remove());

    // Remove all .todoist-board elements from DOM
    activeDocument.querySelectorAll('.todoist-board').forEach(el => el.remove());

    this.closeModal();
  }

  // ======================= 🧱 Board Renderer =======================
  async render(
    container?: HTMLElement,
    source = "",
    ctx: RenderContext = {},
    apiKey = this.settings.apiKey,
    initialData?: RenderData,
  ) {
    if (!container) return;
    // --- Ensure projectMap is rebuilt from projectCache at the beginning ---
    this.projectMap.clear();
    this.projectCache.forEach((p) => this.projectMap.set(p.id, p));
    // Ensure due time is included in fetched tasks by passing as_time: true
    // no-op fetch removed to avoid extra network calls per render
    this.renderTodoistBoard(container, source, ctx, apiKey, initialData);
  }



  /**
   * Forces re-sorting and re-rendering of the task list according to the current sort option.
   */
  rerenderTasks() {
    const boards = Array.from(activeDocument.querySelectorAll<HTMLElement>(".todoist-board.plugin-view"));
    boards.forEach((container) => {
      const currentFilter = container.getAttribute("data-current-filter") || "";
      const tasks = this.getViewTasks(currentFilter);
      this.renderTodoistBoard(
        container,
        `filter: ${currentFilter}`,
        {},
        this.settings.apiKey,
        {
          tasks,
          projects: this.projectCache,
          labels: this.labelCache,
          sections: []
        }
      );
    });
  }

  renderTodoistBoard(
    container: HTMLElement,
    source = "",
    ctx: RenderContext = {},
    apiKey = this.settings.apiKey,
    initialData: RenderData = { tasks: [], sections: [], projects: [], labels: [] },
  ) {
    // If a render is in progress, queue one more pass and bail
    if (container.getAttribute("data-rendering") === "true") {
      container.setAttribute("data-render-pending", "1");
      return;
    }
    const renderToken = String(Date.now()) + ":" + Math.random().toString(36).slice(2);
    container.setAttribute("data-rendering", "true");
    container.setAttribute("data-render-token", renderToken);
    try {
      // --- Always proceed with rendering, even if same filter and task count ---
      const currentFilter = container.getAttribute("data-current-filter") || "";
      let tasks: Task[] = [];
      let projects: Project[] = [];
      // If initialData provided, prefer its projects; else use this.projectCache
      if (initialData && Array.isArray(initialData.projects)) {
        projects = initialData.projects;
      } else if (Array.isArray(this.projectCache)) {
        projects = this.projectCache;
      }
      // If projectMap is empty, try to load from cached metadata as fallback ---
      if (this.projectMap.size === 0) {
        const cachedProjects = this.storage.loadMetadata().projects;
        if (Array.isArray(cachedProjects) && cachedProjects.length) {
          this.projectCache = cachedProjects;
          this.projectMap.clear();
          for (const project of cachedProjects) {
            this.projectMap.set(String(project.id), project);
          }
        }
      }
      // Update projectMap before rendering ---
      this.projectMap.clear();
      for (const project of projects) {
        this.projectMap.set(String(project.id), project);
      }
      // Use tasks from initialData, not from persisted cache ---
      // Do NOT sort the tasks, preserve the order as passed in
      const taskList = initialData.tasks || [];
      // Fallback to persisted task cache if needed ---
      if ((!Array.isArray(taskList) || taskList.length === 0) && currentFilter) {
        let fallback = this.getViewTasks(currentFilter);
        if (!fallback.length) {
          fallback = this.storageRepository.loadTaskCache(currentFilter);
        }
        // merge cache non-destructively into the store
        this.upsertTasks(currentFilter, Array.isArray(fallback) ? fallback : [], { silentSidebar: true, preferExisting: true });
        // always render from the authoritative store
        tasks = this.getViewTasks(currentFilter);
      } else {
        tasks = [...taskList];
      }
      clearEl(container);
      const currentKey = `${currentFilter}:${tasks?.length || 0}`;
      container.setAttribute("data-prev-render-key", currentKey);

      // Sync in-memory cache with current tasks
      this.upsertTasks(currentFilter, tasks, { silentSidebar: true });
      // If no tasks or not an array, skip render and warn
      if (!tasks || !Array.isArray(tasks)) {
        return;
      }

      if (this.loadingOverlay) {
        this.loadingOverlay.classList.add("is-visible");
      }

      try {
        if (!container.dataset.sortMode) container.dataset.sortMode = this.getSortMode(currentFilter);
        this.setupContainer(container);
        if (container.classList.contains("plugin-view")) {
          container.classList.toggle("compact-mode", this.compactMode);
        }
        // 🧪 Log compact mode application
        // // if (this.settings?.enableLogs) console.log("🧪 Compact mode applied?", this.compactMode, "→ container:", container, "→ has class?", container.classList.contains("compact-mode"));
        const filterOptions = this.getFilterOptions();
        const rawSource = source;
        const hideToolbar = /\btoolbar:\s*false\b/i.test(rawSource);
        source = this.getSourceOrDefault(rawSource, filterOptions);

        // Insert reading mode class logic after root .todoist-board element is created
        const todoistBoardEl = container;
        // Add class to handle reading mode layout
        if (container.closest(".markdown-reading-view")) {
          todoistBoardEl.classList.add("reading-mode");
        }

        const { toolbar, listWrapper } = this.createLayout(container);
        // Only apply compact to the sidebar's list wrapper
        {
          const isSidebar = container.classList.contains("plugin-view");
          if (isSidebar) listWrapper.classList.toggle("compact-mode", this.compactMode);
        }
        // Hide the entire toolbar for inline boards (markdown blocks / reading mode)
        const inlineBoard = container.classList.contains("block-language-todoist-board") || !!container.closest(".markdown-reading-view");
        if (inlineBoard) {
          window.requestAnimationFrame(() => {
            toolbar.classList.add("tb-hidden");
          });
        }
        const skipToolbar = hideToolbar || inlineBoard;
        if (skipToolbar) {
          toolbar.classList.add("hide-toolbar", "tb-hidden");
        } else {
          this.renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper);
        }

        // --- sort for plugin view and render via centralized helper ---
        const filterKey = currentFilter;
        if (!container.dataset.sortMode) {
          container.dataset.sortMode = this.getSortMode(filterKey);
        }
        const baseForView = Array.isArray(tasks) ? tasks.slice() : [];
        const { mode, viewTasks, projects: projectsForRender, labels: labelsForRender } = this.buildRenderInput(baseForView, container, filterKey);

        void this.renderTaskList(listWrapper, source, apiKey, { tasks: viewTasks, projects: projectsForRender, labels: labelsForRender });

        // Keep DOM order and task decorations in sync with the render input.
        try {
          if (mode !== "Manual") {
            syncDirectTaskDomOrder(listWrapper, viewTasks);
            markTaskHierarchyClasses(listWrapper, viewTasks, this.taskStore);
          }
          populateLabelPillText(listWrapper, viewTasks, this.labelCache);
          const hidden = this.storageRepository.getHiddenSet();
          const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));
          nodes.forEach((node) => {
            const id = String(node.dataset.taskId || "");
            if (!id) return;
            applyDimClass(node, hidden.has(id));
          });
        } catch {
          // Ignore dim-state failures; task rendering should still complete.
        }

        // Fetch metadata in background if stale, then re-render
        const now = Date.now();
        const metadataCacheTTL = 5 * 60 * 1000;
        const metadataFresh = this.projectCache && (now - this.projectCacheTimestamp < metadataCacheTTL);

        if (!metadataFresh) {
          void this.fetchMetadataFromSync(apiKey).then(metadata => {
            this.projectCache = metadata.projects;
            this.labelCache = metadata.labels;
            this.projectCacheTimestamp = now;
            this.labelCacheTimestamp = now;

            // Inline boards keep their own sort & render
            if (container.classList.contains("todoist-inline-board")) {
              container.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
            } else {
              this.renderTodoistBoard(container, source, ctx, apiKey);
            }
          });
        }

        this.setupGlobalEventListeners();

      } finally {
        if (this.loadingOverlay) {
          this.loadingOverlay.classList.remove("is-visible");
        }
      }
    } finally {
      const still = container.getAttribute("data-render-token");
      if (still === renderToken) {
        container.removeAttribute("data-rendering");
        container.removeAttribute("data-render-token");
        // If a rerender was requested while we were busy, run it now
        if (container.getAttribute("data-render-pending") === "1") {
          container.removeAttribute("data-render-pending");
          queueMicrotask(() => this.renderTodoistBoard(container, source, ctx, apiKey));
        }
      }
    }
  }

  private setupContainer(container: HTMLElement) {
    container.classList.add("todoist-board");
    container.onpointerup = () => {
      window.getSelection()?.removeAllRanges();
    };

    if (this.loadingOverlay && !container.contains(this.loadingOverlay)) {
      container.appendChild(this.loadingOverlay);
    }
    // Ensure compact mode class is toggled according to this.compactMode
    container.classList.toggle("compact-mode", this.compactMode);
  }

  private createLayout(container: HTMLElement) {
    container.empty();

    const listToolbar = activeDocument.createElement("div");
    listToolbar.className = "list-toolbar";
    container.appendChild(listToolbar);
    if (container.classList.contains("block-language-todoist-board") || container.closest(".markdown-reading-view")) {
      listToolbar.classList.add("tb-hidden");
    }

    const listView = activeDocument.createElement("div");
    listView.classList.add("list-view");

    const listWrapper = activeDocument.createElement("div");
    listWrapper.className = "list-wrapper";
    listWrapper.classList.toggle("compact-mode", this.compactMode);
    listView.appendChild(listWrapper);
    container.appendChild(listView);

    return { toolbar: listToolbar, listWrapper };
  }

  private getFilterOptions(): Filter[] {
    // If you want to use the dynamically generated default filters, insert logic here.
    // However, this method is for returning the filter *list* for the toolbar, which is from settings.
    return (this.settings.filters && this.settings.filters.length > 0)
      ? this.settings.filters
      : DEFAULT_SETTINGS.filters!;
  }

  private getSourceOrDefault(source: string, filterOptions: Filter[]) {
    return sourceOrDefault(source, filterOptions);
  }

  // ======================= 🛠️ Toolbar Rendering =======================
  private renderToolbar(
    toolbar: HTMLElement,
    filterOptions: Filter[],
    source: string,
    container: HTMLElement,
    ctx: RenderContext,
    apiKey: string,
    listWrapper: HTMLElement
  ) {
    // Utility for div creation
    const createDiv = (opts: DivOptions = {}) => {
      const el = activeDocument.createElement("div");
      if (opts.cls) el.className = opts.cls;
      return el;
    };

    // Outer wrapper for the filter row
    const filterWrapper = createDiv({ cls: "filter-row-wrapper" });

    // Ensure filterBar is created with the proper class
    const filterBar = createDiv({ cls: "filter-bar" });

    // Find the current selected filter index (from state or from source)
    let initialIndex = 0;
    const matchIdx = filterOptions.findIndex(opt => source.trim() === `filter: ${opt.filter}`);
    if (matchIdx !== -1) {
      initialIndex = matchIdx;
    } else {
      const defaultIdx = filterOptions.findIndex((f) => f.isDefault);
      if (defaultIdx !== -1) initialIndex = defaultIdx;
    }
    selectedFilterIndex = initialIndex;

    // Render all .filter-row elements (buttons)
    filterOptions.forEach((opt, idx) => {
      const filterRow = activeDocument.createElement("div");
      filterRow.className = "filter-row";
      clearEl(filterRow);

      const iconSpan = filterRow.createSpan({ cls: "filter-icon" });
      // If you have an icon name on the option, use it; else fall back.
      try {
        setIcon(iconSpan, String(opt.icon ?? "filter"));
      } catch {
        iconSpan.textContent = "";
      }

      filterRow.createSpan({ cls: "filter-title", text: String(opt.title ?? "") });
      filterRow.setAttribute("data-filter", opt.filter);
      const iconEl = filterRow.querySelector(".filter-icon") as HTMLElement;
      setIcon(iconEl, opt.icon || "star");
      // --- Begin updated badge code with background and count layering ---
      const badge = activeDocument.createElement("span");
      badge.className = "filter-badge";

      const badgeBg = activeDocument.createElement("span");
      badgeBg.className = "filter-badge-bg";

	      const badgeCount = activeDocument.createElement("span");
	      badgeCount.className = "filter-badge-count";
		      const filterCount = this.taskStoreController.getCount(String(opt.filter));
	      badgeCount.textContent = this.formatFilterCount(filterCount, Boolean(this.filterNextCursor[String(opt.filter)]));

      badge.appendChild(badgeBg);
      badge.appendChild(badgeCount);
      // Assign the background color to the icon container instead
      if (opt.color) {
        filterRow?.setCssProps({ "--badge-bg": opt.color });
        badge.setCssProps({ "--badge-color": "white" });
      }
      if (iconEl) iconEl.appendChild(badge);
      // --- End badge code ---
      badge.style.display = idx === selectedFilterIndex ? "" : "none";
      if (idx === selectedFilterIndex) {
        filterRow.classList.add("selected");
      }
      // Use addEventListener for click, with event handling for reading/live preview ---
      filterRow.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Clear selected class from all
        container.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));

        // Mark this one selected
        filterRow.classList.add("selected");
        this.updateVisibleFilterBadges(container);

        // Update data-current-filter attribute and always force a re-render, even if the same filter is clicked again
        const todoistBoardEl = container.closest<HTMLElement>(".todoist-board.plugin-view");
        if (todoistBoardEl) {
          todoistBoardEl.setAttribute("data-current-filter", String(opt.filter));
          this.showFilterLoading(todoistBoardEl, String(opt.filter), this.taskStoreController.getCount(String(opt.filter)));
          void this.handleFilterClick(opt, todoistBoardEl, ctx, this.settings.apiKey);
        }
      });
      filterBar.appendChild(filterRow);
    });

    // Add queue and settings/refresh buttons
    const queueWrapper = this.createQueueButton(listWrapper);
    const settingsRefreshWrapper = this.createSettingsRefreshButtons(container, source, ctx, apiKey);
    // filterBar.appendChild(queueWrapper); // Move queueWrapper out of filterBar

    // --- Wrap the filterBar with filterWrapper ---
    filterWrapper.appendChild(filterBar);

    // --- Begin: Add Capture (+) Button before settings/refresh buttons ---
    // Create Capture (+) Button using Obsidian icon
    const captureBtn = activeDocument.createElement("span");
    captureBtn.className = "add-task-btn clickable-icon";
    setIcon(captureBtn, "plus-circle");
    captureBtn.title = "Add task";
    captureBtn.addClass("capture-btn");
    captureBtn.onclick = () => {
      void this.openAddTaskModal();
    };
    // --- End: Add Capture (+) Button ---


    // Set queue icon color to black
    const queueBtn = queueWrapper.querySelector(".queue-btn");
    if (queueBtn) {
      // (queueBtn as HTMLElement).style.color = "black";
    }

    toolbar.appendChild(filterWrapper);
    toolbar.appendChild(queueWrapper);
    toolbar.appendChild(captureBtn);
    toolbar.appendChild(settingsRefreshWrapper);
  }
  // ======================= ✏️ Async Edit Modal (instant open, lazy hydrate) =======================
  /**
   * Move a task to a new project/section/parent using the official REST endpoint.
   * Used as a fallback if SDK moveTasks is unavailable or fails.
   */
  private async moveTaskREST(taskId: string, payload: { project_id?: string | null; section_id?: string | null; parent_id?: string | null; }) {
    this.ensureRefactoredRuntime(this.settings.apiKey);
    return this.taskActions.moveTaskREST(taskId, payload);
  }
  private activeTaskModal: TaskSheetModal | null = null;

  private closeModal() {
    if (this.activeTaskModal) {
      this.activeTaskModal.close();
      this.activeTaskModal = null;
    }
  }

  private openAddTaskModalPreferences() {
    this.closeModal();
    this.settingsTab?.openPreferencesAddTaskModalSection();

    const appWithSettings = this.app as typeof this.app & {
      setting?: {
        open?: () => void;
        openTabById?: (id: string) => void;
      };
    };
    appWithSettings.setting?.open?.();
    appWithSettings.setting?.openTabById?.(this.manifest.id);

    window.setTimeout(() => {
      this.settingsTab?.openPreferencesAddTaskModalSection();
    }, 80);
  }

  private confirmDeleteTask(): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = new Modal(this.app);
      let settled = false;
      const closeWith = (value: boolean) => {
        settled = true;
        resolve(value);
        modal.close();
      };

      modal.containerEl.classList.add("todoist-confirm-modal");
      modal.setTitle("Delete task?");
      modal.contentEl.createEl("p", {
        text: "This action cannot be undone.",
        cls: "todoist-confirm-message",
      });

      const actions = modal.contentEl.createDiv({ cls: "todoist-confirm-actions" });
      const cancelButton = actions.createEl("button", { text: "Cancel", cls: "todoist-confirm-cancel" });
      const deleteButton = actions.createEl("button", { text: "Delete", cls: "todoist-confirm-delete" });
      cancelButton.onclick = () => closeWith(false);
      deleteButton.onclick = () => closeWith(true);

      modal.onClose = () => {
        clearEl(modal.contentEl);
        if (!settled) resolve(false);
      };
      modal.open();
    });
  }

  public async openEditTaskModalAsync(taskOrId: string | { id: string }, row?: HTMLElement, filters?: string[]) {
    this.ensureRefactoredRuntime(this.settings.apiKey);
    const taskId = typeof taskOrId === "string" ? taskOrId : String(taskOrId?.id);

    const modal = new TaskSheetModal(this.app, {
      title: "Edit task",
      fields: {},
      submitLabel: "Save",
      projects: [],
      labels: [],
      onSubmit: async () => { },
    });
    this.activeTaskModal = modal;
    modal.open();
    modal.setLoading("Edit task");

    // Phase 2: hydrate without blocking first paint
    queueMicrotask(() => {
      void (async () => {
      let task = this.taskStore[String(taskId)];

      // background refresh (don’t await)
      const refresh = (async () => {
        try {
          const live = await this.taskActions.getTask(taskId);
          if (live && live.id) {
            // Use live copy for modal fields, but do not overwrite store here to avoid clobbering edits
            task = live;
          }
        } catch {
          // Ignore live-refresh failures and keep the cached task in the modal.
        }
      })();

      const fields = {
        title: String(task?.content ?? ""),
        description: String(task?.description ?? ""),
        due: (() => {
          const d = task?.due;
          if (!d) return "";
          // Prefer date; if only datetime exists, use YYYY-MM-DD for the <input type="date">
          if (d?.date) return String(d.date);
          if (d?.datetime) return String(d.datetime).slice(0, 10);
          return "";
        })(),
        deadline: String(task?.deadline?.date ?? ""),
        priority: Number(task?.priority ?? 1) || 1,
        projectId: String(task?.projectId ?? ""),
        // Normalize labels to names; SDK expects array of label NAMES (not ids)
        labels: (() => {
          const raw = task?.labels;
          if (!Array.isArray(raw)) return [] as string[];
          return raw.map((lab) => {
            if (typeof lab === "string") return lab; // already a name
            const hit = (this.labelCache || []).find((l) => String(l.id) === String(lab) || String(l.name) === String(lab));
            return String(hit?.name ?? lab);
          });
        })()
      };

      modal.setForm({
        fields,
        submitLabel: "Save",
        projects: this.projectCache,
        labels: this.labelCache,
        onSubmit: async (data) => {
          const id = String(taskId);
          const prevProjectId = String((this.taskStore[id] ?? task)?.projectId || "");
          const targetProjectId = String(data.projectId || "");

          try {
            // 1) Move first if project changed (server truth)
            const prevProjectIdStr = String((prevProjectId ?? task?.projectId ?? "")).trim();
            const targetProjectIdStr = String((targetProjectId ?? "")).trim();
            if (targetProjectIdStr && targetProjectIdStr !== prevProjectIdStr) {
              if (this.settings?.enableLogs) {
                this.info("[Todoist Board] moving task", String(id), "from", prevProjectIdStr, "to", targetProjectIdStr);
              }

              let moved: Task | null = null;

              moved = await this.taskActions.moveTask(String(id), targetProjectIdStr);

              // Keep local store consistent immediately (preserve camelCase shape expected by renderer)
              {
                const local: Task = (this.taskStore[String(id)] ?? task ?? { id: String(id), content: "" });

                const movedProjectId = moved?.projectId ?? targetProjectIdStr;
                const movedParentId = moved ? moved.parentId : undefined;
                const movedSectionId = moved ? moved.sectionId : undefined;

                local.projectId = String(movedProjectId || "");
                if (movedParentId !== undefined) local.parentId = movedParentId ? String(movedParentId) : null;
                if (movedSectionId !== undefined) local.sectionId = movedSectionId ? String(movedSectionId) : null;

                this.taskStore[String(id)] = local;
              }
              if (this.settings?.enableLogs) {
                this.info("[Todoist Board] moved task locally → projectId:", this.taskStore[String(id)]?.projectId);
              }

              // Make sure the destination project exists in caches (prevents blank project pill)
              if (!this.projectMap.has(targetProjectIdStr)) {
                try {
                  const dest = await this.taskActions.getProject(targetProjectIdStr);
                  if (dest) {
                    if (!Array.isArray(this.projectCache)) this.projectCache = [];
                    const idx = this.projectCache.findIndex((p) => String(p.id) === String(dest.id));
                    if (idx >= 0) this.projectCache[idx] = dest;
                    else this.projectCache.push(dest);
                    this.projectMap.set(String(dest.id), dest);
                  }
                } catch {
                  // Ignore destination metadata failures; the task move can still succeed.
                }
              }

              // Make sure the destination project exists in caches (prevents blank project pill)
              if (!this.projectMap.has(targetProjectId)) {
                try {
                  const dest = await this.taskActions.getProject(targetProjectId);
                  if (dest) {
                    if (!Array.isArray(this.projectCache)) this.projectCache = [];
                    const idx = this.projectCache.findIndex((p) => String(p.id) === String(dest.id));
                    if (idx >= 0) this.projectCache[idx] = dest;
                    else this.projectCache.push(dest);
                    this.projectMap.set(String(dest.id), dest);
                  }
                } catch {
                  // Ignore destination metadata failures; the task move can still succeed.
                }
              }
            }

            // 2) Update other editable fields
            await this.taskActions.updateTask(id, {
              content: data.title,
              description: data.description,
              ...(data.due ? { dueDate: data.due } : { dueString: "no date" }),
              deadlineDate: data.deadline || null,
              priority: Number(data.priority) || 1,
              // SDK expects label NAMES
              labels: Array.isArray(data.labels) ? data.labels : []
            });

            // 3) Re-fetch fresh server copy, then update UI
            const fresh = await this.taskActions.getTask(id);
            if (fresh) {
              this.taskStore[id] = fresh;
            }

            // Re-render boards
            this.refreshAllInlineBoards();
            activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
              const f = (el as HTMLElement).getAttribute("data-current-filter") || "today";
              const tasks = this.getViewTasks(f);
              this.renderTodoistBoard(el as HTMLElement, `filter: ${f}`, {}, this.settings.apiKey, {
                tasks,
                projects: this.projectCache,
                labels: this.labelCache
              });
            });
          } catch {
            new Notice("Update failed");
          }
        },
      });
      window.requestAnimationFrame(() => modal.focusTitle(true));

      await refresh;
      })();
    });
  }

  // --- Add Task Modal ---
  async openAddTaskModal() {
    this.ensureRefactoredRuntime(this.settings.apiKey);
    const inboxId = this.projectCache?.find((p) => p.name === "Inbox")?.id;

    const modal = new TaskSheetModal(this.app, {
      title: "Add task",
      fields: {
        title: "",
        description: "",
        due: "",
        deadline: "",
        priority: 1,
        projectId: inboxId || undefined,
        labels: [],
      },
      submitLabel: "Add task",
      projects: this.projectCache,
      labels: this.labelCache,
      visibleFields: this.settings.addTaskModal,
      onOpenSettings: () => this.openAddTaskModalPreferences(),
      onSubmit: async ({ title, description, due, deadline, priority, projectId, labels }) => {
        try {
          await this.taskActions.addTask({
            content: title,
            description,
            projectId: projectId || inboxId,
            ...(due ? { dueString: due } : {}),
            ...(deadline ? { deadlineDate: deadline } : {}),
            priority: Number(priority) || 1,
            ...(labels && labels.length > 0 ? { labels } : {})
          });
          await this.preloadFilters();
          this.app.workspace.trigger("markdown-preview-rendered");
        } catch {
          new Notice("Could not add task");
        }
      },
    });
    this.activeTaskModal = modal;
    modal.open();
    window.setTimeout(() => modal.focusTitle(), 10);

    // Defer dropdown/label population for async data after modal is visible
    if (!Array.isArray(this.projectCache) || !this.projectCache.length || !Array.isArray(this.labelCache) || !this.labelCache.length) {
      window.setTimeout(() => {
        void this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
          const rawProjects = metadata.projects;
          this.projectCache = Array.isArray(rawProjects) ? rawProjects : [];
          if (!Array.isArray(this.projectCache)) this.projectCache = [];

          const rawLabels = metadata.labels;
          this.labelCache = Array.isArray(rawLabels) ? rawLabels : [];

          this.projectCacheTimestamp = Date.now();
          this.labelCacheTimestamp = Date.now();

          modal.setForm({
            projects: this.projectCache,
            labels: this.labelCache,
            visibleFields: this.settings.addTaskModal,
            fields: {
              title: "",
              description: "",
              due: "",
              deadline: "",
              priority: 1,
              projectId: this.projectCache?.find((p) => p.name === "Inbox")?.id || inboxId || undefined,
              labels: [],
            },
          });
        });
      }, 10);
    }
  }



  // The createFilterGroup function is now unused in the new filter bar implementation.

  // ======================= 🔄 Filter Click Handling =======================
  private async handleFilterClick(opt: Filter, container: HTMLElement, ctx: RenderContext, apiKey: string) {
    const now = Date.now();
    // --- Render token logic to ensure only latest filter click is processed ---
    const renderToken = Date.now().toString();
    this.currentRenderToken = renderToken;
    const confirmedFilter = String(opt.filter);
    container.setAttribute("data-current-filter", confirmedFilter);
    // --- Always trigger a full re-render, even if filter unchanged and task count same ---
    let localTasks = this.getViewTasks(confirmedFilter);
    if (!localTasks.length) {
      localTasks = this.storageRepository.loadTaskCache(confirmedFilter);
      if (localTasks.length) {
        this.upsertTasks(confirmedFilter, localTasks, { silentSidebar: true, preferExisting: true });
      }
    }
    if (Array.isArray(localTasks) && localTasks.length > 0) {
      this.renderTodoistBoard(container, `filter: ${confirmedFilter}`, ctx, apiKey, {
        tasks: localTasks,
        sections: [],
        projects: this.projectCache || [],
        labels: this.labelCache || []
      });
      this.showFilterLoading(container, confirmedFilter, localTasks.length);
    } else {
      this.showFilterLoading(container, confirmedFilter, 0);
    }

    // Immediately call the manual sync logic (force refresh)
    // --- Use parser for string filters, with timezone support ---
    const tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, confirmedFilter);
    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
    // --- Guarded block: check for stale render or filter switch ---
    if (
      this.currentRenderToken !== renderToken ||
      container.getAttribute("data-current-filter") !== confirmedFilter
    ) {
      return;
    }

    const freshTasks = Array.isArray(tasks) ? tasks : [];
    this.upsertTasks(confirmedFilter, freshTasks, { silentSidebar: true });
    this.updateFilterBadge(container, confirmedFilter, Array.isArray(tasks) ? tasks.length : 0, Boolean(tasksResponse?.nextCursor));

    this.renderTodoistBoard(container, `filter: ${confirmedFilter}`, ctx, apiKey, {
      tasks: freshTasks.length > 0 ? freshTasks : this.getViewTasks(confirmedFilter),
      sections: [],
      projects: this.projectCache || [],
      labels: this.labelCache || []
    });
    this.hideFilterLoading(container, confirmedFilter);

    const metadata = await this.fetchMetadataFromSync(apiKey);
    this.projectCache = metadata.projects;
    this.labelCache = metadata.labels;
    this.projectCacheTimestamp = now;
    this.labelCacheTimestamp = now;
  }

  private createQueueButton(listWrapper: HTMLElement) {
    let queueActive = false;
    // Use Obsidian's icon system for the queue button (use "list" as example)
    const queueBtn = createSpan({ cls: "queue-btn clickable-icon" });
    setIcon(queueBtn, "focus");
    queueBtn.title = "Queue tasks";
    queueBtn.onclick = () => {
      queueActive = !queueActive;
      this.updateQueueView(queueActive, listWrapper);
    };

    const queueWrapper = activeDocument.createElement("div");
    queueWrapper.className = "queue-wrapper";
    queueWrapper.appendChild(queueBtn);

    return queueWrapper;
  }

  private createSettingsRefreshButtons(container: HTMLElement, source: string, ctx: RenderContext, apiKey: string) {
    // Create a hamburger menu button
    const menuBtn = activeDocument.createElement("button");
    setIcon(menuBtn, "menu");
    menuBtn.title = "Menu";
    menuBtn.classList.add("icon-button");

    // Create dropdown
    const menuDropdown = activeDocument.createElement("div");
    menuDropdown.className = "todoist-board-menu menu-dropdown hidden";

    // Settings option
    const settingsOption = activeDocument.createElement("div");
    // Insert icon span before text
    const settingsIcon = activeDocument.createElement("span");
    setIcon(settingsIcon, "settings");
    settingsIcon.addClass("toolbar-icon");
    settingsOption.appendChild(settingsIcon);
    settingsOption.className = "menu-dropdown-item";
    settingsOption.onclick = () => {
      menuDropdown.classList.add("hidden");
      this.openSettingsModal();
    };
    // Use append() instead of textContent to avoid overwriting icon
    settingsOption.append("Settings");

    // Manual Sync option
    const syncOption = activeDocument.createElement("div");
    // Insert icon span before text
    const syncIcon = activeDocument.createElement("span");
    setIcon(syncIcon, "refresh-cw");
    syncIcon.addClass("toolbar-icon");
    syncOption.appendChild(syncIcon);
    syncOption.className = "menu-dropdown-item";
    syncOption.onclick = async () => {
      menuDropdown.classList.add("hidden");
      // Manual Sync: Clear cache for the current filter, clear list view, trigger fresh render from API
      const currentFilter = container.getAttribute("data-current-filter") || "";
      // Remove cached tasks and timestamp for current filter
      this.clearTasksForFilter(currentFilter);
      // Find the list wrapper inside the container
      const listWrapper = container.querySelector(".list-wrapper") as HTMLElement;
      if (listWrapper) {
        clearEl(listWrapper);
        const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
        const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
        // --- Fetch and update project/label metadata as part of manual sync ---
        const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = Date.now();
        this.labelCacheTimestamp = Date.now();
        // ---
        const freshTasks = Array.isArray(tasks) ? tasks : [];
        this.upsertTasks(currentFilter, freshTasks, { silentSidebar: true });
        const badge = activeDocument.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
        if (badge) {
          badge.textContent = this.formatFilterCount(
            freshTasks.length,
            Boolean(tasksResponse?.nextCursor),
          );
        }

        const projects = this.projectCache || [];
        const labels = this.labelCache || [];

        void this.renderTaskList(listWrapper, `filter: ${currentFilter}`, this.settings.apiKey, {
          tasks: freshTasks,
          projects,
          labels
        });
      } else {
        // Also refresh metadata if not using a listWrapper
        const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = Date.now();
        this.labelCacheTimestamp = Date.now();
        const currentFilterStr = `filter: ${currentFilter}`;
        this.renderTodoistBoard(container, currentFilterStr, { source: currentFilterStr }, this.settings.apiKey);
      }
    };
    // Use append() instead of textContent to avoid overwriting icon
    syncOption.append("Manual sync");

    menuDropdown.appendChild(settingsOption);
    menuDropdown.appendChild(syncOption);

    const divider = activeDocument.createElement("div");
    divider.className = "menu-divider";
    menuDropdown.appendChild(divider);

    const compactOption = activeDocument.createElement("div");
    compactOption.className = "menu-dropdown-item";
    const compactIcon = activeDocument.createElement("span");
    setIcon(compactIcon, "align-justify");
    compactIcon.addClass("toolbar-icon");
    compactOption.appendChild(compactIcon);
    // Set the initial label based on this.compactMode
    compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
    compactOption.prepend(compactIcon);

    compactOption.onclick = () => {
      this.compactMode = !this.compactMode;
      this.settings.compactMode = this.compactMode;
      void this.savePluginData();

      // Update DOM class for compact mode in real-time ---
      const block = activeDocument.querySelector(".block-language-todoist-board");
      if (block) {
        if (this.settings.compactMode) {
          block.classList.add("compact-mode");
        } else {
          block.classList.remove("compact-mode");
        }
      }

      // Updated logic: choose correct board instance for compact mode toggle
      const isSidebarBoard = container.id === "todoist-main-board";
      const currentBoard = isSidebarBoard
        ? activeDocument.getElementById("todoist-main-board")?.querySelector(".list-wrapper")
        : container.querySelector(".list-wrapper");
      if (currentBoard) {
        currentBoard.classList.toggle("compact-mode", this.compactMode);

        // Find the correct board container for getting the filter
        const boardContainer = isSidebarBoard
          ? activeDocument.getElementById("todoist-main-board")
          : container;
        const currentFilter = boardContainer?.getAttribute("data-current-filter") || "";
        let cachedTasks = this.getViewTasks(currentFilter);
        if (!cachedTasks.length) {
          cachedTasks = this.storageRepository.loadTaskCache(currentFilter);
        }
        const board = boardContainer as HTMLElement;
        if (board) {
          clearEl(board);
          const currentFilterStr = `filter: ${currentFilter}`;
          this.renderTodoistBoard(board, currentFilterStr, {}, this.settings.apiKey, {
            tasks: cachedTasks,
            projects: this.projectCache,
            labels: this.labelCache,
            sections: []
          });
        }
      }

      compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
      compactOption.prepend(compactIcon);

      // Hide the menu after toggling compact mode
      // @ts-ignore
      const menu = {
        hideAtMouseEvent: (evt: MouseEvent) => {
          menuDropdown.classList.add("hidden");
        }
      };
      menu.hideAtMouseEvent(new MouseEvent("click"));
    };

    menuDropdown.appendChild(compactOption);

    // Wrap menuDropdown in a menu-dropdown-wrapper to prevent clipping ---
    const menuDropdownWrapper = activeDocument.createElement("div");
    menuDropdownWrapper.className = "todoist-board-menu-wrapper menu-dropdown-wrapper";
    menuDropdownWrapper.appendChild(menuDropdown);

    // --- Move menuDropdownWrapper outside settingsRefreshWrapper and append to body ---
    // We'll store a reference for event handling.
    activeDocument.body.appendChild(menuDropdownWrapper);

    // --- By default, hide the dropdown ---
    menuDropdown.classList.add("hidden");

    // Toggle dropdown on menu button click, position absolutely below the button
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      const rect = menuBtn.getBoundingClientRect();
      menuDropdownWrapper.addClass("menu-dropdown-wrapper");
      menuDropdownWrapper.style.top = `${rect.bottom + window.scrollY}px`;
      menuDropdownWrapper.style.left = `${rect.left + window.scrollX}px`;
      menuDropdown.classList.toggle("hidden");
    };

    // Hide dropdown on outside click
    // This event listener is global and should be cleaned up if needed
    // (Consider registering and removing if you want to be extra clean)
    this.registerDomEvent(activeDocument, "click", (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // Ignore clicks in the file explorer area
      if (t && t.closest(".workspace-split.mod-left-split")) return;
      if (!menuDropdown.classList.contains("hidden")) {
        menuDropdown.classList.add("hidden");
      }
    });

    // Prevent click inside dropdown from closing it
    menuDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // --- Only the menuBtn is inside the wrapper now ---
    const settingsRefreshWrapper = activeDocument.createElement("div");
    settingsRefreshWrapper.className = "settings-refresh-wrapper";
    settingsRefreshWrapper.appendChild(menuBtn);
    // menuDropdownWrapper is now outside, not appended here

    // Use the container argument instead of querying for .todoist-board
    // Find and replace:
    // const board = activeDocument.querySelector(".todoist-board") as HTMLElement;
    // with:
    // const board = container;

    // (This block is in compactOption.onclick)
    // Find the currentBoard and update as before, but use container directly for re-render
    // (No changes needed to the rest of the logic, as container is already passed and used)

    return settingsRefreshWrapper;
  }

  private createRefreshButton(container: HTMLElement, source: string, ctx: RenderContext, apiKey: string) {
    const refreshBtn = activeDocument.createElement("button");
    refreshBtn.type = "button";
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.title = "Force refresh cache";
    refreshBtn.classList.add("icon-button", "refresh-btn");

    refreshBtn.onclick = () => {
      window.requestAnimationFrame(() => {
        refreshBtn.classList.add("syncing");
        const selectedRow = activeDocument.querySelector(".filter-row.selected") as HTMLElement;
        selectedRow?.classList.add("syncing");

        window.requestAnimationFrame(() => {
          void (async () => {
          await this.preloadFilters();
          window.setTimeout(() => {
            refreshBtn.classList.remove("syncing");
            selectedRow?.classList.remove("syncing");
            this.renderTodoistBoard(container, source, ctx, apiKey);
          }, 4000); // Delay to allow animation to register
          })();
        });
      });
    };

    return refreshBtn;
  }

  private createSettingsButton() {
    const settingsBtn = activeDocument.createElement("span");
    setIcon(settingsBtn, "settings")
    settingsBtn.title = "Edit toolbar filters";
    settingsBtn.className = "icon-button";

    settingsBtn.onclick = () => this.openSettingsModal();

    return settingsBtn;
  }

  private openSettingsModal() {
    openFilterSettingsModal({
      app: this.app,
      settings: this.settings,
      onSave: () => this.savePluginData(),
      onResetFilterIndex: () => {
        selectedFilterIndex = 0;
      },
      onClearCache: () => {
        this.ensureRefactoredRuntime(this.settings.apiKey);
        this.storage.clearTaskAndMetadataCaches();
        this.taskStoreController.hydrate((this.settings.filters || []).map((filter) => String(filter.filter)));
        this.syncTaskStoreRefs();
      },
      onRerenderBoards: () => {
        activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((element) => {
          const container = element as HTMLElement;
          const source = container.getAttribute("data-current-filter") || "";
          clearEl(container);
          this.renderTodoistBoard(container, source, {}, this.settings.apiKey || "");
        });
      },
      onRerenderCodeBlocks: () => {
        const markdownElements = activeDocument.querySelectorAll("pre > code.language-todoist-board");
        markdownElements.forEach((element) => {
          const pre = element.parentElement;
          if (!pre) return;
          const container = activeDocument.createElement("div");
          pre.replaceWith(container);
          const source = element.textContent?.trim() || "";
          this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
        });
      },
    });
  }

  // ======================= 📋 Task List Rendering =======================
  private setTaskProjectData(row: HTMLElement, task: Task) {
    const project = this.projectMap.get(String(task.projectId || ""));
    const projectName = project ? project.name : "Unknown Project";
    let projectColor = "#808080";
    if (project && typeof project.color !== "undefined") {
      projectColor = TODOIST_COLORS[project.color as keyof typeof TODOIST_COLORS] || "#808080";
    }
    row.setAttribute("data-project-name", projectName);
    row.setAttribute("data-project-color", projectColor);
  }

  private trimSubtaskRowChrome(row: HTMLElement, task?: Task, filters: string[] = []) {
    row.classList.add("subtask-row", "is-child-task", "todoist-card");

    const meta = row.querySelector(".task-metadata");
    if (meta) meta.remove();

    const desc = row.querySelector(".task-description");
    if (desc) desc.remove();

    const chin = row.querySelector(".fixed-chin");
    if (chin) chin.remove();

    if (task && !row.querySelector(".subtask-inline-edit-btn")) {
      const editButton = activeDocument.createElement("button");
      editButton.type = "button";
      editButton.className = "subtask-inline-edit-btn";
      editButton.setAttribute("aria-label", "Edit subtask");
      editButton.title = "Edit subtask";
      setIcon(editButton, "pencil");

      editButton.addEventListener("pointerdown", (event) => event.stopPropagation());
      editButton.addEventListener("pointerup", (event) => event.stopPropagation());
      editButton.addEventListener("mousedown", (event) => event.stopPropagation());
      editButton.addEventListener("mouseup", (event) => event.stopPropagation());
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        void this.openEditTaskModalAsync(task, row, filters);
      });

      row.appendChild(editButton);
    }
  }

  private setSubtaskToggleIcon(button: HTMLElement, collapsed: boolean) {
    clearEl(button);
    setIcon(button, collapsed ? "chevron-right" : "chevron-down");
    button.setAttribute("aria-expanded", String(!collapsed));
    button.setAttribute("aria-label", collapsed ? "Show subtasks" : "Hide subtasks");
    button.title = collapsed ? "Show subtasks" : "Hide subtasks";
  }

  private createSubtaskToggle(parentRow: HTMLElement, subtaskWrapper: HTMLElement, subtaskCount: number): HTMLButtonElement {
    const parentId = String(parentRow.dataset.taskId || "");
    const collapsed = parentId ? this.taskHierarchy.isCollapsed(parentId) : false;

    parentRow.classList.toggle("subtasks-collapsed", collapsed);
    subtaskWrapper.classList.toggle("tb-hidden", collapsed);

    const button = activeDocument.createElement("button");
    button.type = "button";
    button.className = "subtask-toggle";
    button.setAttribute("data-subtask-count", String(subtaskCount));
    this.setSubtaskToggleIcon(button, collapsed);

    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("pointerup", (event) => event.stopPropagation());
    button.addEventListener("mousedown", (event) => event.stopPropagation());
    button.addEventListener("mouseup", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const nextCollapsed = !parentRow.classList.contains("subtasks-collapsed");
      parentRow.classList.toggle("subtasks-collapsed", nextCollapsed);
      subtaskWrapper.classList.toggle("tb-hidden", nextCollapsed);

      this.taskHierarchy.setCollapsed(parentId, nextCollapsed);

      this.setSubtaskToggleIcon(button, nextCollapsed);
    });

    return button;
  }

  private appendSubtaskRows(
    parentRow: HTMLElement,
    subtasks: Task[],
    projectMap: Record<string, string>,
    labelMap: Record<string, string>,
    labelColorMap: Record<string, string>,
    projects: Project[],
    apiKey: string,
    listWrapper: HTMLElement,
    filters: string[],
  ) {
    if (!Array.isArray(subtasks) || subtasks.length === 0) return;

    parentRow.classList.add("has-children", "parent-task");
    parentRow.setAttribute("data-subtask-count", String(subtasks.length));

    const subtaskWrapper = activeDocument.createElement("div");
    subtaskWrapper.className = "subtask-wrapper";

    for (const sub of subtasks) {
      const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
      this.setTaskProjectData(subRow, sub);
      this.trimSubtaskRowChrome(subRow, sub, filters);
      subtaskWrapper.appendChild(subRow);
    }

    const contentWrapper = parentRow.querySelector(".task-content-wrapper");
    if (contentWrapper) {
      contentWrapper.appendChild(this.createSubtaskToggle(parentRow, subtaskWrapper, subtasks.length));
      contentWrapper.appendChild(subtaskWrapper);
    } else {
      parentRow.appendChild(this.createSubtaskToggle(parentRow, subtaskWrapper, subtasks.length));
      parentRow.appendChild(subtaskWrapper);
    }
  }

  private renderTaskRowsWithSubtasks(
    listWrapper: HTMLElement,
    taskList: Task[],
    projectMap: Record<string, string>,
    labelMap: Record<string, string>,
    labelColorMap: Record<string, string>,
    projects: Project[],
    apiKey: string,
    filters: string[],
  ) {
    const visibleIds = new Set(taskList.map((task) => getTaskId(task)).filter(Boolean));

    taskList.forEach((task: Task) => {
      const taskId = getTaskId(task);
      const parentId = getTaskParentId(task);
      const parentIsVisible = parentId && visibleIds.has(parentId);

      if (parentIsVisible) return;

      if (task.content?.trim().startsWith("* ")) {
        const clonedTask = { ...task, content: task.content.trim().substring(2) };
        const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
        row.classList.add("non-task-note");
        this.setupTaskDragAndDrop(row, listWrapper, filters);
        listWrapper.appendChild(row);
        return;
      }

      const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
      this.setTaskProjectData(row, task);

      if (parentId) {
        row.classList.add("is-child-task", "standalone-subtask-row");
      }

      this.setupTaskDragAndDrop(row, listWrapper, filters);
      listWrapper.appendChild(row);

      const subtasks = this.taskHierarchy.getSubtasksForParent(taskId, taskList, this.taskStore, this.taskCache);
      this.appendSubtaskRows(
        row,
        subtasks,
        projectMap,
        labelMap,
        labelColorMap,
        projects,
        apiKey,
        listWrapper,
        filters,
      );
    });
  }

  private async renderTaskList(
    listWrapper: HTMLElement,
    source: string,
    apiKey: string,
    preloadData?: { tasks: Task[]; projects: Project[]; labels: Label[] },
  ) {
    const match = source.match(/filter:\s*(.*)/);
    const filters = match
      ? match[1].split(",").map(f => f.trim())
      : ["today", "overdue", "next 7 days", "inbox"];

    // preloadData block ---
    if (preloadData) {
      const { tasks, projects, labels } = preloadData;
      // Ensure tasks is an array before sorting
      if (!Array.isArray(tasks)) {
        console.error("cachedTasks is not an array", tasks);
        return;
      }
      // Ensure projects and labels are arrays
      const projectList: Project[] = Array.isArray(projects) ? projects : [];
      const labelList: Label[] = Array.isArray(labels) ? labels : [];
      const projectMap: Record<string, string> = Object.fromEntries(projectList.map((p) => [p.id, p.name]));
      const labelMap: Record<string, string> = Object.fromEntries((labelList ?? []).map((l) => [l.id, l.name]));
      const labelColorMap: Record<string, string> = Object.fromEntries((labelList ?? []).map((l) => [l.id, String(l.color ?? "")]));

      this.ensureRefactoredRuntime(this.settings.apiKey);
      const orderKey = filters.join(",");
      const savedOrder = this.storage.getManualOrder(orderKey);

      tasks.sort((a, b) => {
        const idxA = savedOrder.indexOf(a.id);
        const idxB = savedOrder.indexOf(b.id);
        return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
          (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
      });

      const taskList: Task[] = Array.isArray(tasks) ? tasks : [];
      this.renderTaskRowsWithSubtasks(
        listWrapper,
        taskList,
        projectMap,
        labelMap,
        labelColorMap,
        projectList,
        apiKey,
        filters,
      );
      // ——— Apply persisted dimming (preload path) ———
      try {
        const hidden = this.storageRepository.getHiddenSet();
        const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));
        nodes.forEach((node) => {
          const id = String(node.dataset.taskId || "");
          if (!id) return;
          applyDimClass(node, hidden.has(id));
        });
      } catch {
        // Ignore dim-state failures; task rendering should still complete.
      }
      // --- Insert empty quote if no tasks ---
	      if (taskList.length === 0) {
	        const quoteDiv = activeDocument.createElement("div");
	        quoteDiv.className = "empty-filter";
	        quoteDiv.textContent = "No tasks found for this filter.";
	        listWrapper.appendChild(quoteDiv);
	      }
	      this.appendLoadMoreButton(listWrapper, filters[0], apiKey);
	      return;
	    }

    const now = Date.now();
    const cacheTTL = 24 * 60 * 60 * 1000;

    let projects: Project[] = [];
    let labels: Label[] = [];
    let metadata: { projects: Project[]; sections: GetSectionsResponse[]; labels: Label[] };

    const metadataCacheTTL = 24 * 60 * 60 * 1000;
    const metadataTimestamp = this.projectCacheTimestamp;
    const metadataFresh = this.projectCache && (now - metadataTimestamp < metadataCacheTTL);

    if (metadataFresh) {
      projects = Array.isArray(this.projectCache) ? this.projectCache : [];
      labels = Array.isArray(this.labelCache) ? this.labelCache : [];
      metadata = { projects, sections: [], labels };
    } else {
      metadata = await this.fetchMetadataFromSync(apiKey);
      projects = metadata.projects;
      labels = metadata.labels;
      this.projectCache = projects;
      this.labelCache = labels;
      this.projectCacheTimestamp = now;
      this.labelCacheTimestamp = now;
    }

    let tasks: Task[] = [];
    const filter = filters[0];
    const taskTimestamp = this.taskCacheTimestamps[filter] || 0;
    const cachedForFilter = this.getViewTasks(filter);
    const useCache = cachedForFilter.length > 0 && (now - taskTimestamp < cacheTTL);

    if (useCache) {
      tasks = cachedForFilter;
    } else {
      // check if filter is empty or invalid, fallback to all tasks if so
      const query = filter?.trim();
      let tasksResponse;
      if (query) {
        tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, query);
      } else {
        // fallback to all tasks
        tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, "today");
      }
      tasks = tasksResponse.results ?? [];
      this.upsertTasks(filter, Array.isArray(tasks) ? tasks : [], { silentSidebar: true });
    }

    const projectMap: Record<string, string> = Array.isArray(projects)
      ? Object.fromEntries(projects.map((p) => [p.id, p.name]))
      : {};
    const labelMap: Record<string, string> = Array.isArray(labels)
      ? Object.fromEntries((labels ?? []).map((l) => [l.id, l.name]))
      : {};
    const labelColorMap: Record<string, string> = Array.isArray(labels)
      ? Object.fromEntries((labels ?? []).map((l) => [l.id, String(l.color ?? "")]))
      : {};

    this.ensureRefactoredRuntime(this.settings.apiKey);
    const orderKey = filters.join(",");
    const savedOrder = this.storageRepository.getManualOrder(orderKey);

    const taskList: Task[] = Array.isArray(tasks) ? tasks : [];
    taskList.sort((a: Task, b: Task) => {
      const idxA = savedOrder.indexOf(a.id);
      const idxB = savedOrder.indexOf(b.id);
      return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
        (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
    });

    // Removed local date comparison due to timezone mismatch issues (see GitHub issue #timezone-bug)
    // If any previous logic filtered tasks based on local date (e.g., new Date(task.due.date)), it is now removed.

    this.renderTaskRowsWithSubtasks(
      listWrapper,
      taskList,
      projectMap,
      labelMap,
      labelColorMap,
      projects,
      apiKey,
      filters,
    );
    // ——— Apply persisted dimming (non-preload path) ———
    try {
      const hidden = this.storageRepository.getHiddenSet();
      const nodes2 = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));
      nodes2.forEach((node) => {
        const id = String(node.dataset.taskId || "");
        if (!id) return;
        applyDimClass(node, hidden.has(id));
      });
    } catch {
      // Ignore dim-state failures; task rendering should still complete.
    }
    // --- Insert empty quote if no tasks ---
	    if (taskList.length === 0) {
	      const quoteDiv = activeDocument.createElement("div");
	      quoteDiv.className = "empty-filter";
	      quoteDiv.textContent = "No tasks found for this filter.";
	      listWrapper.appendChild(quoteDiv);
	    }
	    this.appendLoadMoreButton(listWrapper, filter, apiKey);

	    try {
      if (source && source.trim().startsWith("filter:")) {
        this.storage.setLastFilter(source.trim());
      }
    } catch {
      // Ignore last-filter persistence failures.
    }
  }

  // ======================= 🧩 Task Row Creation =======================
  private createTaskRow(
    task: Task,
    projectMap: Record<string, string>,
    labelMap: Record<string, string>,
    labelColorMap: Record<string, string>,
    projects: Project[],
    apiKey: string,
    listWrapper: HTMLElement,
    filters: string[]
  ): HTMLElement {
    const row = activeDocument.createElement("div");
    // Apply .non-task-note class if original content starts with "* " ---
    if (task.content?.trim().startsWith("* ")) {
      row.classList.add("non-task-note");
    }
    row.classList.add("task");
    row.dataset.id = task.id;
    // Set the row id to the task id for later DOM removal
    row.id = task.id;
    row.setAttribute("data-task-id", String(task.id));
    // Set project color CSS variable
    row.style.setProperty("--project-color", getProjectHexColor(task, projects));

    // Add "parent-task" class if task has children (by parentId) ---
    const hasChildren = Object.values(this.taskStore).some((candidate) => candidate?.parentId === task.id);
    if (hasChildren) {
      row.classList.add("parent-task");
    }

    // Add repeating task icon if task is recurring ---
    const isRepeating = !!task.due?.is_recurring;
    if (isRepeating) {
      const repeatIcon = activeDocument.createElement("span");
      repeatIcon.classList.add("repeat-icon");
      setIcon(repeatIcon, "repeat");
      row.appendChild(repeatIcon);
    }

    // Context Menu ---
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const menu = new Menu();

      const actions = this.settings.contextMenuActions;

      if (actions?.scheduleToday) {
        menu.addItem((item) =>
          item
            .setTitle("Schedule today")
            .setIcon("calendar")
            .onClick(async () => {
              this.ensureRefactoredRuntime(apiKey);
              await this.taskActions.scheduleTaskToday(task.id);
              // Optimistic update
              const dueSpan = row.querySelector(".due-inline");
              if (dueSpan) dueSpan.textContent = "Today";
            })
        );
      }

      if (actions?.scheduleTomorrow) {
        menu.addItem((item) =>
          item
            .setTitle("Schedule tomorrow")
            .setIcon("calendar-clock")
            .onClick(async () => {
              this.ensureRefactoredRuntime(apiKey);
              await this.taskActions.deferTaskToTomorrow(task.id);
              // Optimistic update
              const dueSpan = row.querySelector(".due-inline");
              if (dueSpan) dueSpan.textContent = "Tomorrow";
            })
        );
      }

      if (actions?.setPriority) {
        menu.addItem((item) =>
          item
            .setTitle("Set priority")
            .setIcon("flag")
            .onClick((e) => {
              // No submenu support in this API version, show a new menu or just cycle?
              // Let's just show a Notice for now or maybe use a flat list if possible?
              // Actually, let's just add the items directly to the main menu for now if submenu fails,
              // OR better: Create a new Menu for priority selection
              const pMenu = new Menu();
              pMenu.addItem((sub) => sub.setTitle("P1 (high)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 4, apiKey)));
              pMenu.addItem((sub) => sub.setTitle("P2").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 3, apiKey)));
              pMenu.addItem((sub) => sub.setTitle("P3").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 2, apiKey)));
              pMenu.addItem((sub) => sub.setTitle("P4 (low)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 1, apiKey)));
              pMenu.showAtPosition({ x: (e as MouseEvent).pageX, y: (e as MouseEvent).pageY });
            })
        );
      }

      if (actions?.editTask) {
        menu.addItem((item) =>
          item
            .setTitle("Edit task")
            .setIcon("pencil")
            .onClick(() => {
              this.openEditTaskModal(task, row, filters);
            })
        );
      }

      if (actions?.deleteTask) {
        menu.addItem((item) =>
          item
            .setTitle("Delete task")
            .setIcon("trash")
            // .setDestructive(true) // Not available in all API versions
            .onClick(async () => {
              // Use existing delete logic if available or direct API
              await this.deleteTask(task.id, apiKey, row);
            })
        );
      }

      if (actions?.openInTodoist) {
        menu.addItem((item) =>
          item
            .setTitle("Open in Todoist")
            .setIcon("external-link")
            .onClick(() => {
              window.open(task.url, "_blank");
            })
        );
      }

      menu.showAtPosition({ x: event.pageX, y: event.pageY });
    });

    // Replace task-inner with scroll wrapper and fixed chin ---
    const scrollWrapper = activeDocument.createElement("div");
    scrollWrapper.className = "task-scroll-wrapper";

    const taskInner = activeDocument.createElement("div");
    taskInner.className = "task-inner";

    const fixedChin = activeDocument.createElement("div");
    fixedChin.className = "fixed-chin";

    scrollWrapper.appendChild(taskInner);
    scrollWrapper.appendChild(fixedChin);

    // Determine if this is a non-task note (content starts with '* ')
    const isNote = task.content?.trim().startsWith("* ");

    if (isNote) {
      const noteContent = activeDocument.createElement("div");
      noteContent.className = "task-content";
      const titleSpan = activeDocument.createElement("span");
      titleSpan.className = "task-title";
      titleSpan.textContent = task.content.trim().substring(2);
      noteContent.appendChild(titleSpan);
      taskInner.appendChild(noteContent);
      row.appendChild(scrollWrapper);
    } else {
      this.setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters);

      const rowCheckbox = this.createPriorityCheckbox(task.priority ?? 1, async () => {
        if (rowCheckbox.checked) {
          await this.completeTask(task.id);
          const taskRow = activeDocument.getElementById(task.id);
          if (taskRow) taskRow.remove();
          await this.savePluginData();
          this.handleQueueCompletion(listWrapper);
        }
      });
      rowCheckbox.classList.add(`priority-${task.priority}`);
      // Move checkbox out of .task-inner and into .task before scrollWrapper
      row.appendChild(rowCheckbox);

      row.appendChild(scrollWrapper);

      const left = createTaskContent({
        task,
        projectMap,
        labelMap,
        labelColorMap,
        projects,
        labels: this.labelCache,
        settings: this.settings,
        app: this.app,
        owner: this,
      });
      taskInner.appendChild(left);
      // const deadline = this.createTaskDeadline(task);
      // row.appendChild(deadline);
      // this used to be the old right-hand side deadline, now will in the WHEN row
    }
    return row;
  }

  private setupTaskInteractions(
    row: HTMLElement,
    task: Task,
    taskInner: HTMLElement,
    apiKey: string,
    listWrapper: HTMLElement,
    filters: string[]
  ) {
    let tapStartX = 0;
    let tapStartY = 0;

    row.addEventListener("pointerdown", (e: PointerEvent) => {
      if (row.classList.contains("subtask-row")) return;
      tapStartX = e.clientX;
      tapStartY = e.clientY;
    });

    row.addEventListener("pointerup", (e: PointerEvent) => {
      const isCheckbox = (e.target as HTMLElement).closest('input[type="checkbox"]');
      if (isCheckbox) return;

      const dx = Math.abs(e.clientX - tapStartX);
      const dy = Math.abs(e.clientY - tapStartY);
      if (dx > 5 || dy > 5) return;

      e.stopPropagation();

      // Prevent deselection on right-click (context menu) ---
      // If right-click (button 2) and already selected, ignore to keep selection & show menu.
      // If unselected, we allow it to proceed so it gets selected (user preference).
      if (e.button === 2 && row.classList.contains("selected-task")) {
        return;
      }

      // --- Subtask expand/collapse logic ---
      if (row.classList.contains("subtask-row")) {
        const alreadyExpanded = row.classList.contains("expanded-subtask");

        activeDocument.querySelectorAll(".subtask-row.expanded-subtask").forEach(el => {
          el.classList.remove("expanded-subtask");
        });

        if (!alreadyExpanded) {
          row.classList.add("expanded-subtask");
        }

        return;
      }

      // Instead of handling subtask-row here, let handleTaskSelection handle it with event
      this.handleTaskSelection(row, task, apiKey, e);
    });

    this.setupTaskDragAndDrop(row, listWrapper, filters);
  }

  private handleTaskSelection(row: HTMLElement, task: Task, apiKey: string, event?: Event) {
    // If the event originated from within a subtask-row, skip parent selection/deselection
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest(".subtask-row")) return;
    }
    // If already selected, deselect on second click
    if (row.classList.contains("selected-task")) {
      this.deselectTask(row);
      return;
    }
    const titleSpan = row.querySelector(".task-title") as HTMLElement;
    const rowCheckbox = row.querySelector("input[type='checkbox']") as HTMLElement;
    const metaSpan = row.querySelector(".task-metadata") as HTMLElement;

    // Add no-transition and freeze-transition classes as per new logic
    activeDocument.querySelectorAll('.task').forEach(t => {
      t.classList.add('no-transition');
      if (!t.classList.contains('selected-task')) {
        t.classList.add('freeze-transition');
      }
    });

    // Updated deselection logic to allow simultaneous deselect and select transitions
    activeDocument.querySelectorAll(".selected-task").forEach(el => {
      if (el !== row) {
        el.classList.add("task-deselecting");
        el.classList.remove("selected-task", "has-fixed-chin");

        window.setTimeout(() => {
          el.classList.remove("task-deselecting");

          const titleSpan = el.querySelector(".task-title") as HTMLElement;
          const rowCheckbox = el.querySelector("input[type='checkbox']") as HTMLElement;
          const metaSpan = el.querySelector(".task-metadata") as HTMLElement;
          const desc = el.querySelector(".task-description");

          if (titleSpan) titleSpan.classList.remove("task-title-selected");
          if (rowCheckbox) rowCheckbox.classList.remove("task-checkbox-selected");
          if (metaSpan) metaSpan.classList.remove("task-meta-selected");
          if (desc) desc.classList.remove("show-description");

          const toolbar = activeDocument.getElementById("mini-toolbar");
          if (toolbar) toolbar.remove();
        }, 300);
      }
    });

    // Apply new selection immediately
    row.classList.add("selected-task");
    this.syncSelectedTaskState();

    if (row.classList.contains("selected-task")) {
      this.selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey);
      // Remove transition classes after selecting the new task
      window.requestAnimationFrame(() => {
        activeDocument.querySelectorAll('.task').forEach(t => {
          t.classList.remove('no-transition');
          t.classList.remove('freeze-transition');
        });
      });
    } else {
      this.deselectTask(row);
      // Remove transition classes after frame if deselecting
      window.requestAnimationFrame(() => {
        activeDocument.querySelectorAll('.task').forEach(t => {
          t.classList.remove('no-transition');
          t.classList.remove('freeze-transition');
        });
      });
    }
  }

  // ======================= ✴️ Task Selection Logic =======================
  private selectTask(
    row: HTMLElement,
    task: Task,
    titleSpan: HTMLElement,
    rowCheckbox: HTMLElement,
    metaSpan: HTMLElement,
    apiKey: string
  ) {
    titleSpan.classList.add("task-title-selected");
    rowCheckbox.classList.add("task-checkbox-selected");
    metaSpan.classList.add("task-meta-selected");

    row.classList.add("selected-task");
    this.syncSelectedTaskState();
    // Removed code that adds .show-description to .task-description

    this.createMiniToolbar(row, task, apiKey);
    // No dynamic transform here; handled by CSS.
  }

  private deselectTask(row: HTMLElement) {
    // row.classList.add("task-deselecting"); // Removed as per instructions

    const toolbar = activeDocument.getElementById("mini-toolbar");
    if (toolbar) toolbar.remove();

    window.setTimeout(() => {
      row.classList.remove("selected-task", "task-deselecting", "has-fixed-chin");
      this.syncSelectedTaskState();

      const titleSpan = row.querySelector(".task-title") as HTMLElement;
      const rowCheckbox = row.querySelector("input[type='checkbox']") as HTMLElement;
      const metaSpan = row.querySelector(".task-metadata") as HTMLElement;
      const desc = row.querySelector(".task-description");

      if (titleSpan) titleSpan.classList.remove("task-title-selected");
      if (rowCheckbox) rowCheckbox.classList.remove("task-checkbox-selected");
      if (metaSpan) {
        metaSpan.classList.remove("task-meta-selected");
        // Remove transform reset; handled by CSS now.
      }
      if (desc) desc.classList.remove("show-description");
    }, 200);
  }

  // ======================= 🧰 Mini Toolbar =======================
  private createMiniToolbar(row: HTMLElement, task: Task, apiKey: string) {
    const oldWrapper = activeDocument.getElementById("mini-toolbar-wrapper");
    const previousRow = oldWrapper?.closest(".task");
    if (previousRow instanceof HTMLElement) previousRow.classList.remove("has-fixed-chin");
    if (oldWrapper) oldWrapper.remove();
    row.classList.add("has-fixed-chin");

    const wrapper = activeDocument.createElement("div");
    wrapper.id = "mini-toolbar-wrapper";
    wrapper.className = "mini-toolbar-wrapper fixed-chin";

    const chinContainer = activeDocument.createElement("div");
    chinContainer.className = "chin-inner";
    const primaryActions = activeDocument.createElement("div");
    primaryActions.className = "chin-actions chin-actions-primary";
    const secondaryActions = activeDocument.createElement("div");
    secondaryActions.className = "chin-actions chin-actions-secondary";
    chinContainer.appendChild(primaryActions);
    chinContainer.appendChild(secondaryActions);
    const actions = Object.assign({}, DEFAULT_SETTINGS.chinBarActions, this.settings.chinBarActions || {});
    const getFilters = () => {
      let filters: string[] = [];
      const board = row.closest(".todoist-board");
      if (board && board.hasAttribute("data-current-filter")) {
        filters = [board.getAttribute("data-current-filter")!];
      }
      if (!filters.length) filters = ["today"];
      return filters;
    };

    const appendChinButton = (
      className: string,
      iconName: string,
      label: string,
      onClick: (event: MouseEvent, button: HTMLButtonElement) => void,
      container: HTMLElement = primaryActions,
    ) => {
      const button = activeDocument.createElement("button");
      button.className = `chin-btn ${className}`;
      setIcon(button, iconName);
      if (label) button.append(label);
      button.onclick = (event) => onClick(event, button);
      container.appendChild(button);
      return button;
    };

    if (actions.scheduleToday) {
      const todayBtn = appendChinButton("today-btn", "calendar", "Today", (_, button) => {
        void this.setTaskToToday(task.id, apiKey, chinContainer, button);
      });
      const subtitle = activeDocument.createElement("p");
      subtitle.className = "date-subtitle";
      subtitle.textContent = String(new Date().getDate());
      todayBtn.appendChild(subtitle);
    }

    if (actions.scheduleTomorrow) {
      appendChinButton("tomorrow-btn", "sunrise", "Tmrw", () => {
        void this.deferTask(task.id, apiKey, chinContainer);
      });
    }

    if (actions.editTask) {
      appendChinButton("edit-btn", "pencil", "Edit", () => {
        void this.openEditTaskModalAsync(task, row, getFilters());
      });
    }

    if (actions.setPriority) {
      appendChinButton("priority-btn", "flag", "Priority", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const pMenu = new Menu();
        pMenu.addItem((sub) => sub.setTitle("P1 (high)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 4, apiKey)));
        pMenu.addItem((sub) => sub.setTitle("P2").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 3, apiKey)));
        pMenu.addItem((sub) => sub.setTitle("P3").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 2, apiKey)));
        pMenu.addItem((sub) => sub.setTitle("P4 (low)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 1, apiKey)));
        pMenu.showAtPosition({ x: event.pageX, y: event.pageY });
      });
    }

    if (actions.setDeadline) {
      appendChinButton("deadline-btn", "target", "Deadline", () => {
        void this.openEditTaskModalAsync(task, row, getFilters());
      });
    }

    if (actions.hideTask) {
      try {
        const id = String(task.id);
        const hidden = this.storageRepository.getHiddenSet();
        const hideBtn = appendChinButton("task-hide-btn", hidden.has(id) ? "eye-off" : "eye", "", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const node = (e.currentTarget as HTMLElement)?.closest<HTMLElement>('[data-task-id], [data-id]');
          const set = this.storageRepository.getHiddenSet();
          if (set.has(id)) {
            set.delete(id);
            this.storageRepository.saveHiddenSet(set);
            if (node) applyDimClass(node, false);
            setIcon(hideBtn, "eye");
            hideBtn.title = "Hide (dim)";
          } else {
            set.add(id);
            this.storageRepository.saveHiddenSet(set);
            if (node) applyDimClass(node, true);
            setIcon(hideBtn, "eye-off");
            hideBtn.title = "Unhide (undim)";
          }
        }, secondaryActions);
        hideBtn.title = hidden.has(id) ? "Unhide (undim)" : "Hide (dim)";
        a11yButton(hideBtn, hideBtn.title);
      } catch {
        // Ignore hide action UI refresh failures; persisted state is still updated.
      }
    }

    if (actions.deleteTask) {
      appendChinButton("delete-btn", "trash", "", () => {
        void this.deleteTask(task.id, apiKey, chinContainer);
      }, secondaryActions);
    }

    if (actions.openInTodoist && task.url) {
      appendChinButton("open-todoist-btn", "external-link", "Open", () => {
        window.open(task.url, "_blank");
      }, secondaryActions);
    }

    if (!chinContainer.querySelector(".chin-btn")) return;
    wrapper.appendChild(chinContainer);
    row.appendChild(wrapper);

    wrapper.addEventListener("click", (e) => e.stopPropagation());
  }

  // ======================= Edit Task Modal =======================
  openEditTaskModal(task: Task, row: HTMLElement, filters: string[]) {
    void this.openEditTaskModalAsync(task, row, filters);
  }

  // ======================= 📆 Quick Actions (Today, Tmrw, Delete) =======================
  private async setTaskToToday(taskId: string, apiKey: string, toolbar: HTMLElement, btn: HTMLElement) {
    const busyButton = btn as BusyHTMLElement;
    if (busyButton._busy) return;

    busyButton._busy = true;
    const oldText = btn.innerText;
    btn.innerText = "⏳";

    try {
      const today = new Date();
      const iso = today.toISOString().split("T")[0];

      this.ensureRefactoredRuntime(apiKey);
      const resp = await this.taskActions.scheduleTask(taskId, { due_date: iso });

      if (resp.status >= 200 && resp.status < 300) {
        btn.innerText = "🎉";
        window.setTimeout(() => {
          this.deleteTaskEverywhere(taskId);
          const taskRow = activeDocument.getElementById(taskId);
          if (taskRow) taskRow.remove();
        }, 900);
      } else {
        btn.innerText = "❌";
        new Notice("Failed to update task");
      }
    } catch {
      btn.innerText = "❌";
      new Notice("Could not update task");
    } finally {
      window.setTimeout(() => {
        busyButton._busy = false;
        btn.innerText = oldText;
      }, 900);
    }
  }

  private async deferTask(taskId: string, apiKey: string, toolbar: HTMLElement) {
    const btn = toolbar.querySelector('.tomorrow-btn') as HTMLElement;
    const busyButton = btn as BusyHTMLElement;
    if (busyButton._busy) return;

    busyButton._busy = true;
    const oldText = btn.innerText;
    btn.innerText = "⏳";

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const iso = tomorrow.toISOString().split("T")[0];

      this.ensureRefactoredRuntime(apiKey);
      const resp = await this.taskActions.scheduleTask(taskId, { due_date: iso });

      if (resp.status >= 200 && resp.status < 300) {
        btn.innerText = "🎉";
        window.setTimeout(() => {
          this.deleteTaskEverywhere(taskId);
          // Remove the task element from the DOM manually
          const taskRow = activeDocument.getElementById(taskId);
          if (taskRow) taskRow.remove();
          // Will trigger re-render on next filter click
        }, 900);
      } else {
        btn.innerText = "❌";
        new Notice("Failed to update task");
      }
    } catch {
      btn.innerText = "❌";
      new Notice("Could not update task");
    } finally {
      window.setTimeout(() => {
        busyButton._busy = false;
        btn.innerText = oldText;
      }, 900);
    }
  }

  private async updateTaskPriority(taskId: string, priority: number, apiKey: string) {
    try {
      this.ensureRefactoredRuntime(apiKey);
      await this.taskActions.updatePriority(taskId, priority);
      // Optimistic update
      const checkbox = activeDocument.querySelector(`.task[data-id="${taskId}"] input.todoist-checkbox`);
      if (checkbox) {
        checkbox.className = `todoist-checkbox priority-${priority}`;
      }
      new Notice(`Priority updated to P${5 - priority}`); // Todoist API P4=1, P1=4. UI P1=High.
    } catch (e) {
      console.error("Failed to update priority", e);
      new Notice("Failed to update priority");
    }
  }

  private async deleteTask(taskId: string, apiKey: string, toolbar: HTMLElement) {
    if (!(await this.confirmDeleteTask())) return;

    const btn = toolbar.querySelector('.delete-btn') as HTMLElement;
    const busyButton = btn as BusyHTMLElement;
    if (busyButton._busy) return;

    busyButton._busy = true;
    btn.innerText = "⏳";

    try {
      this.ensureRefactoredRuntime(apiKey);
      const resp = await this.taskActions.deleteTask(taskId);

      if (resp.status >= 200 && resp.status < 300) {
        btn.innerText = "✅";
        window.setTimeout(() => {
          this.deleteTaskEverywhere(taskId);
          // Remove the task element from the DOM manually
          const taskRow = activeDocument.getElementById(taskId);
          if (taskRow) taskRow.remove();
          // Will trigger re-render on next filter click
        }, 900);
      } else {
        btn.innerText = "❌";
        new Notice("Failed to delete task");
      }
    } catch {
      btn.innerText = "❌";
      new Notice("Could not delete task");
    } finally {
      window.setTimeout(() => {
        busyButton._busy = false;
        btn.innerText = "🗑";
      }, 900);
    }
  }


  private handleQueueCompletion(listWrapper: HTMLElement) {
    const tasks = Array.from(listWrapper.querySelectorAll(".task"))
      .filter(el => {
        const elHtml = el as HTMLElement;
        return !elHtml.classList.contains("completed") && elHtml.offsetParent !== null;
      });

    const next = tasks[0];
    if (next) {
      // Remove queue-dimmed
      next.classList.remove("queue-dimmed");

      // Select the task as if clicked
      window.requestAnimationFrame(() => {
        next.scrollIntoView({ behavior: "smooth", block: "center" });
        window.requestAnimationFrame(() => {
          next.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        });
      });
    }
  }

  private createTaskDeadline(task: Task): HTMLElement {
    const right = activeDocument.createElement("div");
    right.className = "task-deadline";

    const deadline = task.deadline?.date;
    if (!deadline) return right;

    const deadlineWrapper = activeDocument.createElement("div");
    deadlineWrapper.className = "deadline-wrapper";

    const deadlineLabel = activeDocument.createElement("div");
    deadlineLabel.textContent = "🎯 Deadline";
    deadlineLabel.className = "deadline-label";

    const deadlinePill = activeDocument.createElement("div");
    deadlinePill.className = "pill deadline-date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let deadlineText = "";
    if (diffDays === 0) {
      deadlineText = "Today";
    } else if (diffDays === 1) {
      deadlineText = "Tomorrow";
    } else if (diffDays > 1 && diffDays <= 5) {
      deadlineText = `In ${diffDays} days`;
    } else {
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      deadlineText = deadlineDate.toLocaleDateString("en-US", options);
    }

    deadlinePill.textContent = deadlineText;
    deadlineWrapper.appendChild(deadlineLabel);
    deadlineWrapper.appendChild(deadlinePill);
    right.appendChild(deadlineWrapper);

    return right;
  }

  private getDragLockTargets(listWrapper: HTMLElement): HTMLElement[] {
    const selectors = [
      ".workspace-leaf-content",
      ".markdown-preview-view",
      ".cm-editor",
      ".view-content",
    ];
    const doc = listWrapper.ownerDocument;
    const targets = selectors
      .map((selector) => doc.querySelector<HTMLElement>(selector))
      .filter((element): element is HTMLElement => Boolean(element));
    const listView = listWrapper.closest<HTMLElement>(".list-view");
    if (listView) targets.push(listView);
    return Array.from(new Set(targets));
  }

  private setTaskDragLock(row: HTMLElement, listWrapper: HTMLElement, locked: boolean) {
    const body = listWrapper.ownerDocument.body;
    const targets = this.getDragLockTargets(listWrapper);

    body.classList.toggle("drag-disable", locked);
    body.classList.toggle("tb-scroll-lock", locked);
    row.classList.toggle("tb-touch-none", locked);
    row.classList.toggle("dragging-row", locked);
    listWrapper.classList.toggle("tb-touch-none", locked);
    listWrapper.classList.toggle("drag-scroll-block", locked);

    if (locked) listWrapper.ownerDocument.getSelection()?.removeAllRanges();

    targets.forEach((target) => {
      target.classList.toggle("tb-touch-none", locked);
      target.classList.toggle("tb-overflow-hidden", locked);
      target.classList.toggle("drag-scroll-block", locked && target.classList.contains("list-view"));
    });
  }

  // ======================= 🖱️ Drag & Drop =======================
  private setupTaskDragAndDrop(row: HTMLElement, listWrapper: HTMLElement, filters: string[]) {
    let lastTap = 0;

    row.onpointerdown = (ev: PointerEvent) => {
      // Ignore pointerdown if it's on the mini-toolbar/fixed-chin
      if ((ev.target as HTMLElement)?.closest(".fixed-chin")) return;
      if (row.classList.contains("subtask-row") || row.closest(".subtask-wrapper")) return;
      // // if (this.settings?.enableLogs) console.log("🔽 pointerdown", ev.pointerType, ev.clientX, ev.clientY);
      const tapNow = Date.now();
      if (tapNow - lastTap < 300) return;

      if ((ev.target as HTMLElement).closest('input[type="checkbox"]')) {
        return;
      }

      const isTouch = ev.pointerType === "touch" || ev.pointerType === "pen";
      const startX = ev.clientX;
      const startY = ev.clientY;
      const startRect = row.getBoundingClientRect();
      const dragOffsetX = Math.min(Math.max(startX - startRect.left, 12), Math.max(startRect.width - 12, 12));
      const dragOffsetY = Math.min(Math.max(startY - startRect.top, 12), Math.max(startRect.height - 12, 12));
      let longPressTimer: number | null = null;
      let dragging = false;
      let pid = ev.pointerId;

      const beginDrag = (e?: PointerEvent) => {
        if (dragging) return;
        dragging = true;

        if (e && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.setTaskDragLock(row, listWrapper, true);

        if (navigator.vibrate) {
          navigator.vibrate([30, 20, 30]);
        }

        const ownerDocument = listWrapper.ownerDocument;
        const dragLayer = ownerDocument.createElement("div");
        dragLayer.className = "todoist-board task-drag-layer";
        dragLayer.setCssProps({
          "--task-drag-width": `${startRect.width}px`,
          "--task-drag-min-height": `${startRect.height}px`,
        });

        const dragPreview = row.cloneNode(true) as HTMLElement;
        dragPreview.id = "";
        dragPreview.removeAttribute("data-id");
        dragPreview.removeAttribute("data-task-id");
        dragPreview.classList.remove("dragging-row");
        dragPreview.classList.add("task-drag-preview");
        dragLayer.appendChild(dragPreview);
        ownerDocument.body.appendChild(dragLayer);

        const updateDragPreview = (event: PointerEvent) => {
          const x = event.clientX - dragOffsetX;
          const y = event.clientY - dragOffsetY;
          dragLayer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };
        updateDragPreview(e ?? ev);

        const placeholder = row.cloneNode(true) as HTMLDivElement;
        placeholder.id = "todoist-placeholder";
        placeholder.className = "task-placeholder";
        let dragFinished = false;

        listWrapper.insertBefore(placeholder, row);

        const moveWhileDragging = (e: PointerEvent) => {
          // // if (this.settings?.enableLogs) console.log("📍 pointermove during drag", e.clientY);
          if (e.pointerId !== pid) return;
          e.preventDefault();
          e.stopPropagation();
          updateDragPreview(e);

          const rows = Array.from(listWrapper.children).filter(c => c !== row && c !== placeholder) as HTMLDivElement[];
          for (let i = 0; i < rows.length; i++) {
            const other = rows[i];
            const otherRect = other.getBoundingClientRect();
            if (e.clientY < otherRect.top + otherRect.height / 2) {
              listWrapper.insertBefore(placeholder, other);
              break;
            }
            if (i === rows.length - 1) {
              listWrapper.appendChild(placeholder);
            }
          }
        };

        const finishDrag = (e: PointerEvent) => {
          // // if (this.settings?.enableLogs) console.log("✅ finishDrag");
          if (e.pointerId !== pid) return;
          if (dragFinished) return;
          dragFinished = true;

          if (row.hasPointerCapture(pid)) row.releasePointerCapture(pid);
          row.removeEventListener("pointermove", moveWhileDragging);
          row.removeEventListener("pointerup", finishDrag);
          row.removeEventListener("pointercancel", finishDrag);
          row.removeEventListener("lostpointercapture", finishDrag);

          this.setTaskDragLock(row, listWrapper, false);

          if (placeholder.parentElement) listWrapper.insertBefore(row, placeholder);
          placeholder.remove();
          dragLayer.remove();
          const newOrder = Array.from(listWrapper.children)
            .map(c => c.getAttribute("data-id"))
            .filter(id => id);
          this.ensureRefactoredRuntime(this.settings.apiKey);
          this.storage.setManualOrder(filters.join(","), newOrder as string[]);

          void this.savePluginData();
        };

        row.setPointerCapture(pid);
        row.addEventListener("pointermove", moveWhileDragging);
        row.addEventListener("pointerup", finishDrag);
        row.addEventListener("pointercancel", finishDrag);
        row.addEventListener("lostpointercapture", finishDrag);
      };

      if (isTouch) {
        let moved = false;
        const moveThreshold = 25;

        const onTouchMove = (e: PointerEvent) => {
          // // if (this.settings?.enableLogs) console.log("👣 onTouchMove", e.clientX, e.clientY);
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > moveThreshold || dy > moveThreshold) {
            moved = true;
            cleanup();
          }
        };

        const cleanup = () => {
          // // if (this.settings?.enableLogs) console.log("🧹 Cleanup triggered");
          if (longPressTimer !== null) window.clearTimeout(longPressTimer);
          row.removeEventListener('pointermove', onTouchMove);
          row.removeEventListener('pointerup', cleanup);
          row.removeEventListener('pointercancel', cleanup);
          this.setTaskDragLock(row, listWrapper, false);
        };

        // passive: false for pointermove
        row.addEventListener('pointermove', onTouchMove, { passive: true });
        row.addEventListener('pointerup', cleanup, { passive: true });
        row.addEventListener('pointercancel', cleanup, { passive: true });

        longPressTimer = window.setTimeout(() => {
          // // if (this.settings?.enableLogs) console.log("⏳ Long press timer fired");
          if (!moved) {
            if (ev.cancelable) ev.preventDefault();
            beginDrag(ev);
          }
        }, 150);
      } else if (ev.pointerType === "mouse") {
        const moveCheck = (e: PointerEvent) => {
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > 5 || dy > 5) {
            row.removeEventListener("pointermove", moveCheck);
            beginDrag(e);
          }
        };
        row.addEventListener("pointermove", moveCheck);

        row.addEventListener("pointerup", () => {
          row.removeEventListener("pointermove", moveCheck);
        });
      }
    };

    row.addEventListener("pointercancel", () => {
      // // if (this.settings?.enableLogs) console.log("⚠️ pointercancel triggered");
      window.getSelection()?.removeAllRanges();
    });
  }

  private setupGlobalEventListeners() {
    this.registerDomEvent(this.app.workspace.containerEl, "click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // Don’t react to clicks in the file explorer
      if (target.closest(".workspace-split.mod-left-split")) return;
      if (target.closest(".fixed-chin")) return;
      if (!target.closest(".task-inner")) {
        this.clearSelectedTaskHighlight();
      }
    });
    // Cancel click inside modal
    this.registerDomEvent(activeDocument, "click", (ev: MouseEvent) => {
      const t = ev.target as HTMLElement | null;
      if (!t) return;

      // Common selectors
      const bySelector = t.closest(
        '.todoist-modal .btn-cancel, .todoist-modal [data-action="cancel"], .todoist-modal [data-cancel], .todoist-modal .cancel, .todoist-modal button[aria-label="Cancel"]'
      );

      // Fallback: any button whose text is “Cancel” inside the modal
      const btn = t.closest('button');
      const inModal = t.closest('.todoist-modal');
      const textLooksLikeCancel = btn && /\bcancel\b/i.test((btn.textContent || '').trim());

      if (bySelector || (inModal && textLooksLikeCancel)) {
        ev.preventDefault();
        ev.stopPropagation();
        this.closeAnyModal();
      }
    }, { capture: true });

    // Escape closes modal
    this.registerDomEvent(activeDocument, "keydown", (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && activeDocument.querySelector('.todoist-modal')) {
        ev.preventDefault();
        this.closeAnyModal();
      }
    });
  }

  clearSelectedTaskHighlight(): void {
    activeDocument.querySelectorAll(".selected-task").forEach((el) => {
      el.classList.remove("selected-task", "has-fixed-chin");
      void (el as HTMLElement).offsetWidth; // force reflow

      window.setTimeout(() => {
        const toolbar = el.querySelector("#mini-toolbar-wrapper");
        if (toolbar) toolbar.remove();
      }, 0); // delay toolbar removal until next frame
    });
    this.syncSelectedTaskState();
  }

  private syncSelectedTaskState(): void {
    activeDocument.body.classList.toggle(
      "tb-has-selected-task",
      activeDocument.querySelector(".todoist-board .selected-task") !== null
    );
  }


  createPriorityCheckbox(priority: number, onChange: () => void | Promise<void>): HTMLInputElement {
    const priorityColors: Record<number, string> = {
      4: "#d1453b",  // P1 - red
      3: "#eb8909",  // P2 - orange
      2: "#246fe0",  // P3 - blue
      1: "#808080",  // P4 - grey
    };

    const checkbox = activeDocument.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todoist-checkbox";

    const rowPrioColor = priorityColors[priority] || "#999";
    const rowEl =
      checkbox.closest<HTMLElement>(".todoist-card") ||
      checkbox.closest<HTMLElement>(".task") ||
      checkbox.closest<HTMLElement>(".task-row") ||
      (checkbox.parentElement);

    if (rowEl) rowEl.style.setProperty("--prio-color", rowPrioColor);

    // Prevent task selection when clicking checkbox
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents selecting the task when checking
    });
    checkbox.addEventListener("change", () => {
      void (async () => {
      // Find the row (task container)
      const row = checkbox.closest('.task');
      await onChange();
      // Animation and haptic feedback when marking complete
      if (checkbox.checked && row) {
        if (navigator.vibrate) navigator.vibrate([20]);
        row.classList.add("task-checked-anim");
        // Add completed class and fade out
        row.classList.add("completed");
        // TypeScript fix: cast row to HTMLElement for .style
        const rowEl = row as HTMLElement;
        rowEl.classList.add("tb-dimming");
        window.setTimeout(() => {
          // Optionally remove from DOM after 300ms
          if (rowEl.parentElement) rowEl.parentElement.removeChild(rowEl);
        }, 300);
        window.setTimeout(() => rowEl.classList.remove("task-checked-anim"), 200);
      }
      })();
    });
    return checkbox;
  }

  public updateQueueView(active: boolean, listWrapper: HTMLElement): void {
    const rows = Array.from(listWrapper.children) as HTMLDivElement[];

    rows.forEach((r, i) => {
      const titleSpan = r.querySelector(
        ":scope > .task-scroll-wrapper > .task-inner > .task-content > .task-content-wrapper > .task-title",
      );
      if (!titleSpan) return;

      if (active) {
        if (i === 0) {
          r.classList.remove("queue-dimmed");
          r.classList.add("queue-focused");
          titleSpan.classList.add("queue-focused-title");
          r.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
        } else {
          r.classList.add("queue-dimmed");
          r.classList.remove("queue-focused");
          titleSpan.classList.remove("queue-focused-title");
        }
      } else {
        r.classList.remove("queue-dimmed", "queue-focused");
        titleSpan.classList.remove("queue-focused-title");
      }
    });
  }
}
