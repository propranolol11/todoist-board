import type { Task } from "@doist/todoist-api-typescript";
import type { Project } from "@doist/todoist-api-typescript";
import type { Label } from "@doist/todoist-api-typescript";
// @ts-ignore
// ======================= 🔄 Polling for Task Changes =======================
let lastFetchTime: number = Date.now();
let _todoistPollInterval: number | undefined;
let _activityHandlers: { event: string; fn: () => void }[] = [];
import {
  TodoistApi,
  AddTaskArgs,
  getSanitizedContent,
  TaskWithSanitizedContent,
  getAuthStateParameter,
  getAuthorizationUrl,
  getAuthToken,
  revokeAuthToken,
} from '@doist/todoist-api-typescript';
import { DateTime } from "luxon";
// ======================= 🧩 Small Utilities =======================
const a11yButton = (el: HTMLElement, label: string) => {
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", label);
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      (el as any).click?.();
      e.preventDefault();
    }
  }, { once: false });
};
const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    if (v === null || v === undefined) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};
const writeJSON = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const getZone = (settings: { timezoneMode: "auto" | "manual"; manualTimezone: string }) =>
  settings.timezoneMode === "manual"
    ? settings.manualTimezone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

const safeZone = (z?: string | null): string =>
  (z && z.trim()) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
// Hour-cycle detection (cache once for formatting use)
let _hour12: boolean | null = null;
const useHour12 = (): boolean => {
  if (_hour12 !== null) return _hour12;
  try {
    const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: "short" }) as any;
const ro = typeof fmt.resolvedOptions === "function" ? fmt.resolvedOptions() : null;
if (ro && typeof ro.hour12 === "boolean") {
  _hour12 = ro.hour12;
  return _hour12 ?? false;
}
    const parts = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: false }).formatToParts(new Date());
    _hour12 = parts.some(p => p.type === "dayPeriod");
    return _hour12;
  } catch {
    _hour12 = false;
    return _hour12;
  }
};

// Centralized count lookup for a filter
const getCountForFilter = (filterKey: string, memCache: Record<string, any[]>): number => {
  const ids = readJSON<string[]>(`todoistFilterIndex:${String(filterKey)}`, []);
  if (Array.isArray(ids) && ids.length) return ids.length;
  const mem = memCache[String(filterKey)];
  if (Array.isArray(mem)) return mem.length;
  const list = readJSON<any[]>(`todoistTasksCache:${String(filterKey)}`, []);
  return Array.isArray(list) ? list.length : 0;
};
// ======================= 🔎 Todoist Query Parser =======================
function parseTodoistQuery(query: string, timezone: string): Record<string, any> {
  const now = DateTime.now().setZone(timezone);
  const result: any = { is_completed: false };
  const andParts = query.toLowerCase().split("&").map(part => part.trim());

  for (let part of andParts) {
    if (part === "today") {
      result.due_after = now.startOf("day").toISO();
      result.due_before = now.endOf("day").toISO();
    } else if (part === "overdue") {
      result.due_before = now.startOf("day").toISO();
    } else if (part.startsWith("next ")) {
      const match = part.match(/next (\d+) day/);
      if (match) {
        const days = parseInt(match[1]);
        result.due_after = now.startOf("day").toISO();
        result.due_before = now.plus({ days }).endOf("day").toISO();
      }
    } else if (part.startsWith("p")) {
      const match = part.match(/p([1-4])/);
      if (match) result.priority = Number(match[1]);
    } else if (part.startsWith("#")) {
      result.project_id = "inbox"; // Placeholder
    }
  }

  return result;
}
import type { GetSectionsResponse } from "@doist/todoist-api-typescript";

type SanitizedTask = TaskWithSanitizedContent;

function pollForTaskChanges(interval = 10000): number {
  let lastActivity = Date.now();

  const updateActivity = () => (lastActivity = Date.now());
  // Remove any previously-registered handlers to avoid leaks/duplication
  if (Array.isArray(_activityHandlers) && _activityHandlers.length > 0) {
    _activityHandlers.forEach(({ event, fn }) => window.removeEventListener(event, fn as any));
    _activityHandlers = [];
  }
  ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
    _activityHandlers.push({ event, fn: updateActivity });
  });

  const isUserActive = () => (Date.now() - lastActivity) < interval * 2;
  const isVisible = () => document.visibilityState === "visible";

  _todoistPollInterval = window.setInterval(async () => {
    if (!isVisible() || !isUserActive()) return;

    try {
      const plugin = (window as any).app?.plugins?.plugins?.["todoist-board"];
      if (!plugin) return;

      const filters = Array.from(
        new Set(
          Array.from(document.querySelectorAll(".todoist-board"))
            .map(el => el.getAttribute("data-current-filter") || "today")
        )
      );

      let anyChanges = false;

      for (const filter of filters) {
        const tasksResponse = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, filter);
        const tasks = Array.isArray(tasksResponse?.results) ? tasksResponse.results : [];

        let cached: Task[] = readJSON<Task[]>(`todoistTasksCache:${filter}`, []);
if (!Array.isArray(cached)) cached = [];

        const cachedIds = new Set(cached.map(t => t.id));
        const newIds = new Set(tasks.map((t: Task) => t.id));
        const deleted = [...cachedIds].some((id: string) => !newIds.has(id));
        const contentChanged = tasks.some((t: Task) => {
          const prev = cached.find((c: Task) => c.id === t.id);
          if (!prev) return true;
          const prevDue = (prev as any).due?.datetime ?? (prev as any).due?.date ?? null;
          const nextDue = (t as any).due?.datetime ?? (t as any).due?.date ?? null;
          const dueChanged = prevDue !== nextDue;
          const titleChanged = (prev as any).content !== (t as any).content;
          const labelsChanged = Array.isArray((prev as any).labels) && Array.isArray((t as any).labels)
            ? (prev as any).labels.join(",") !== (t as any).labels.join(",")
            : (prev as any).labels !== (t as any).labels;
          const projectChanged = (prev as any).projectId !== (t as any).projectId;
          return dueChanged || titleChanged || labelsChanged || projectChanged;
        });
        const changed = deleted || cached.length !== tasks.length || contentChanged;

        if (changed) {
  anyChanges = true;
  plugin.upsertTasks(filter, tasks);
}
      }

      if (anyChanges) {
        document.querySelectorAll(".todoist-board.plugin-view").forEach(async el => {
  const filter = el.getAttribute("data-current-filter") || "today";
  const viewTasks = plugin.getViewTasks(filter);
  const metadata = await plugin.fetchMetadataFromSync(plugin.settings.apiKey);

  plugin.projectCache = metadata.projects;
  plugin.labelCache = metadata.labels;
  plugin.projectCacheTimestamp = Date.now();
  plugin.labelCacheTimestamp = Date.now();

  plugin.renderTodoistBoard(el as HTMLElement, `filter: ${filter}`, {}, plugin.settings.apiKey, {
    tasks: viewTasks,
    projects: metadata.projects,
    labels: metadata.labels
  });
});

// nudge all inline boards too
plugin.refreshAllInlineBoards();
      }

    } catch (err) {
      console.warn("[Todoist Polling Error]", err);
    }
  }, interval);
  return _todoistPollInterval!;
}
// ======================= 🌟 Constants & Interfaces =======================
// --- Todoist Colors by Name to Hex ---
const TODOIST_COLORS: Record<string, string> = {
  berry_red: "#b8256f",
  red: "#db4035",
  orange: "#ff9933",
  yellow: "#fad000",
  olive_green: "#afb83b",
  lime_green: "#7ecc49",
  green: "#299438",
  mint_green: "#6accbc",
  teal: "#158fad",
  sky_blue: "#14aaf5",
  light_blue: "#96c3eb",
  blue: "#4073ff",
  grape: "#884dff",
  violet: "#af38eb",
  lavender: "#eb96eb",
  magenta: "#e05194",
  salmon: "#ff8d85",
  charcoal: "#808080",
  grey: "#b8b8b8",
  taupe: "#ccac93"
};
const TODOIST_COLORS_NUM: Record<number, string> = {
  30: "#b8256f", 31: "#db4035", 32: "#ff9933", 33: "#fad000",
  34: "#afb83b", 35: "#7ecc49", 36: "#299438", 37: "#6accbc",
  38: "#158fad", 39: "#14aaf5", 40: "#96c3eb", 41: "#4073ff",
  42: "#884dff", 43: "#af38eb", 44: "#eb96eb", 45: "#e05194",
  46: "#ff8d85", 47: "#808080", 48: "#b8b8b8", 49: "#ccac93",
};
// --- Selected Filter Index State ---
let selectedFilterIndex: number = 0;
let lastFilterIndex: number = 0;

import {
  Plugin,
  MarkdownPostProcessorContext,
  PluginSettingTab,
  App,
  Setting,
  MarkdownView,
  MarkdownRenderer,
  ItemView,
  WorkspaceLeaf,
  Notice,
} from "obsidian";


import "./style.css";
import { setIcon, Menu, MenuItem } from "obsidian";

// Already defined above as type SanitizedTask = TaskWithSanitizedContent;

interface Filter {
  title: string;
  filter: string;
  icon: string;
  color?: string;
  isDefault?: boolean;
}

interface TodoistBoardSettings {
  apiKey: string;
  filters?: Filter[];
  compactMode?: boolean;
  // For compatibility with new settings tab
  useOAuth?: boolean;
  defaultFilter?: string;
  currentFilter?: string;
  timezoneMode: "auto" | "manual";
  manualTimezone: string;
  debug?: boolean;
  enableLogs?: boolean; // Enables if (this.settings?.enableLogs) console.log/info/warn/error outputs
}


function getDefaultFilters(timezone: string): Record<string, { name: string; filter: any }> {
  const now = DateTime.now().setZone(timezone);
  return {
    "Today": {
      name: "Today",
      filter: {
        due_after: now.startOf("day").toISO(),
        due_before: now.endOf("day").toISO(),
        is_completed: false
      }
    },
    "Overdue": {
      name: "Overdue",
      filter: {
        due_before: now.startOf("day").toISO(),
        is_completed: false
      }
    },
    "No Due Date": {
      name: "No Due Date",
      filter: {
        due_before: null,
        due_after: null,
        is_completed: false
      }
    }
  };
}


const TODOIST_BOARD_VIEW_TYPE = "todoist-board-view";
// ======================= 📋 TodoistBoardView =======================
// (Moved here for patch context)
class TodoistBoardView extends ItemView {
  plugin: TodoistBoardPlugin;
  constructor(leaf: WorkspaceLeaf, plugin: TodoistBoardPlugin) {
    super(leaf);
    this.plugin = plugin;
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
    const defaultFilter =
      plugin.settings.filters?.find((f) => f.isDefault)?.filter
      ?? plugin.settings.filters?.[0]?.filter
      ?? "today";

    // Set default filter on plugin instance directly
    plugin.settings.currentFilter = defaultFilter;

    // ✅ Set data-current-filter so that polling works properly
    container.setAttribute("data-current-filter", String(defaultFilter));

    // 🩹 Wait until container is visible before rendering
    await new Promise((resolve) => {
      const checkVisible = () => {
        if (container.offsetParent !== null) return resolve(undefined);
        setTimeout(checkVisible, 100);
      };
      checkVisible();
    });

    // --- PATCH: Preload tasks if cache is empty, then force immediate fetch from API ---
    if (!plugin.taskCache[defaultFilter] || plugin.taskCache[defaultFilter].length === 0) {
      await plugin.preloadFilters();
    }

    // Force immediate fetch of tasks to avoid waiting for polling
    const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, defaultFilter);
const live = Array.isArray(response?.results) ? response.results : [];
const cachedTasks = (live.length ? live : plugin.getViewTasks(defaultFilter));
plugin.upsertTasks(defaultFilter, cachedTasks);
    let projects = plugin.projectCache;
let labels = plugin.labelCache;
// Offline hydration from localStorage if empty
if (!Array.isArray(projects) || projects.length === 0) {
  projects = readJSON<Project[]>("todoistProjectsCache", []);
  plugin.projectCache = projects;
}
if (!Array.isArray(labels) || labels.length === 0) {
  labels = readJSON<Label[]>("todoistLabelsCache", []);
  plugin.labelCache = labels;
}

    await plugin.renderTodoistBoard(
      container,
      `filter: ${defaultFilter}`,
      {},
      plugin.settings.apiKey,
      {
        tasks: cachedTasks,
        projects,
        labels
      }
    );

    // --- PATCH: Explicitly persist cached data to localStorage after rendering ---
    localStorage.setItem(`todoistTasksCache:${defaultFilter}`, JSON.stringify(cachedTasks));
localStorage.setItem(`todoistTasksCacheTimestamp:${defaultFilter}`, String(Date.now()));
localStorage.setItem("todoistProjectsCache", JSON.stringify(projects));
localStorage.setItem("todoistLabelsCache", JSON.stringify(labels));
  }
  async onClose() {
    // Cleanup if needed
  }
}

const DEFAULT_SETTINGS: TodoistBoardSettings = {
  apiKey: "",
  debug: false,
  enableLogs: false,
  filters: [
    { icon: "star", filter: "today", title: "Today" },
    { icon: "hourglass", filter: "overdue", title: "Overdue" },
    { icon: "moon", filter: "due after: today & due before: +30 days", title: "upcoming" },
    { icon: "inbox", filter: "#inbox", title: "Inbox" },
  ],
  compactMode: false,
  defaultFilter: "today",
  timezoneMode: "auto",
  manualTimezone: "Europe/London",
};

const EMPTY_IMAGE = new Image(1, 1);
EMPTY_IMAGE.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

function getProjectHexColor(task: any, projects: any[]): string {
  const color = projects.find(p => p.id === task.projectId)?.color;
  if (typeof color === "number") {
    return TODOIST_COLORS_NUM[color] || "#e5e7eb";
  }
  if (typeof color === "string") {
    return TODOIST_COLORS[color] || "#e5e7eb";
  }
  return "#e5e7eb";
}

function isCacheFresh(
  cache: Record<string, any>,
  timestamps: Record<string, number>,
  key: string,
  ttl: number
  ): boolean {
  const now = Date.now();
  const last = timestamps[key] || 0;
  return !!cache[key] && (now - last < ttl);
}

export default class TodoistBoardPlugin extends Plugin {
  // Debug logger helpers (gated by settings.enableLogs)
private log(...args: any[]) {
  try { if (this.settings?.enableLogs) console.log(...args); } catch {}
}
private info(...args: any[]) {
  try { if (this.settings?.enableLogs) console.info(...args); } catch {}
}
private warn(...args: any[]) {
  try { if (this.settings?.enableLogs) console.warn(...args); } catch {}
}
private error(...args: any[]) {
  try { if (this.settings?.enableLogs) console.error(...args); } catch {}
}

private createDueInline(task: any): HTMLElement | null {
  const d = task?.due?.datetime || task?.due?.date;
  if (!d) return null;

  const zone =
    this.settings?.timezoneMode === "manual"
      ? this.settings.manualTimezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse respecting user zone
  const dt = DateTime.fromISO(d).setZone(zone);
  if (!dt?.isValid) return null;

  const today = DateTime.now().setZone(zone).startOf("day");
  const target = dt.startOf("day");
  const days = Math.round(target.diff(today, "days").days);

  const hasTime = /T\d{2}:\d{2}/.test(d);
  const dateLabel =
    days === 0 ? "Today"
    : days === 1 ? "Tomorrow"
    : dt.toFormat("ccc, LLL d");

  const span = document.createElement("span");
  span.className = "due-inline";
  const timeFmt = useHour12() ? "h:mm a" : "HH:mm";
  span.textContent = hasTime ? `${dateLabel} @ ${dt.toFormat(timeFmt)}` : dateLabel;

  // 🔁 Recurrence indicator (Todoist exposes `due.isRecurring` and a human `due.string`)
  const isRecurring = Boolean(
    task?.due?.isRecurring === true ||
    (typeof task?.due?.string === "string" && /\b(every|daily|weekly|monthly|yearly|weekday|weekend)\b/i.test(task.due.string))
  );
  if (isRecurring) {
    const r = document.createElement("span");
    r.className = "repeat-indicator";
    r.setAttribute("aria-label", "Repeats");
    r.title = "Repeats";
    r.textContent = " \uD83D\uDD01"; // 🔁
    span.appendChild(r);
  }

  return span;
}

 // Closes any Todoist Board modal (edit/add)
 private closeAnyModal() {
   try {
     const modal = document.querySelector('.todoist-modal');
     if (modal && modal.parentElement) modal.parentElement.removeChild(modal);
   } catch {}
   try {
  if (this.modalHost && this.modalHost.parentElement) this.modalHost.remove();
} catch {}
this.modalHost = null;
 }

 // Back-compat
 private dbg(...args: any[]) { this.log(...args); }

  // Centralized helper for sorting and metadata selection used by all views
  private buildRenderInput(base: any[], container: HTMLElement, filterKey: string) {
    const stored = this.getSortMode(filterKey);
    if (!container.dataset.sortMode) container.dataset.sortMode = stored;
    const mode = container.dataset.sortMode || stored;

    const projects = (Array.isArray(this.projectCache) && this.projectCache.length)
      ? this.projectCache
      : JSON.parse(localStorage.getItem("todoistProjectsCache") || "[]");

    const labels = (Array.isArray(this.labelCache) && this.labelCache.length)
      ? this.labelCache
      : JSON.parse(localStorage.getItem("todoistLabelsCache") || "[]");

    const baseArr = Array.isArray(base) ? base.slice() : [];
    const viewTasks = (mode === "Manual") ? baseArr : this.sortTasksLikeTodoist(baseArr, mode);

    return { mode, viewTasks, projects, labels };
  }

// Sort state helpers
private getSortMode(filterKey: string){ return localStorage.getItem(`todoistSortMode:${filterKey}`) || "Due Date"; }
private setSortMode(filterKey: string, mode: string){ try { localStorage.setItem(`todoistSortMode:${filterKey}`, mode); } catch {} }

// --- unified sorter ---
private sortTasksLikeTodoist(arr: any[], mode: string): any[] {
  const tz = getZone(this.settings);

  type Row = {
    t: any;
    id: string;
    hasDue: number;   // 0 dated, 1 undated
    day: number;      // startOfDay ms (∞ if undated)
    allDay: number;   // 0 timed, 1 all-day
    slot: number;     // exact time ms; for all-day = endOfDay
    negPr: number;    // -priority (so bigger pr sorts first)
    alpha: string;    // lowercase title
  };

  const toRow = (t: any): Row => {
    const d = t?.due;
    let hasDue = 1, day = Number.POSITIVE_INFINITY, allDay = 1, slot = Number.POSITIVE_INFINITY;

if (d?.datetime) {
  // Timed task: parse and normalize to user timezone
  const dt = DateTime.fromISO(d.datetime).setZone(tz);
  if (dt.isValid) {
    hasDue = 0;
    allDay = 0;
    day = dt.startOf("day").toMillis();
    slot = dt.toMillis();
  }
} else if (d?.date) {
  // All-day task: interpret in user timezone
  const dt = DateTime.fromISO(d.date, { zone: tz });
  if (dt.isValid) {
    hasDue = 0;
    allDay = 1;
    day = dt.startOf("day").toMillis();
    slot = dt.endOf("day").toMillis();
  }
}

    return {
      t,
      id: String(t?.id ?? ""),
      hasDue,
      day,
      allDay,
      slot,
      negPr: -(Number(t?.priority) || 0),
      alpha: String(t?.content || "").toLowerCase(),
    };
  };

  const cmpTuple = (A: Row, B: Row, order: (keyof Row)[]) => {
    for (const k of order) {
      if (k === "alpha") {
  const r = A.alpha.localeCompare(B.alpha, undefined, { numeric: true, sensitivity: "base" });
  if (r) return r;
} else if (k === "t") {
        // skip
      } else if (k === "id") {
        const r = A.id.localeCompare(B.id);
        if (r) return r;
      } else {
        const a = A[k] as number, b = B[k] as number;
        if (a !== b) return a - b;
      }
    }
    return 0;
  };

  // Orders:
  // Due Date → dated, earlier day, timed before all-day, earlier time, higher priority, A–Z, id
  const ORDER_DUE: (keyof Row)[]      = ["hasDue", "day", "allDay", "slot", "negPr", "alpha", "id"];
  // Priority → higher priority first, then due ordering, then A–Z, id
  const ORDER_PRIO: (keyof Row)[]     = ["negPr", "hasDue", "day", "allDay", "slot", "alpha", "id"];
  // Alphabetical → A–Z, then due ordering, then higher priority, id
  const ORDER_ALPHA: (keyof Row)[]    = ["alpha", "hasDue", "day", "allDay", "slot", "negPr", "id"];

  const rows = (arr || []).map(toRow);

  if (mode === "Manual") return arr.slice();
  if (mode === "Priority") {
    rows.sort((a, b) => cmpTuple(a, b, ORDER_PRIO));
  } else if (mode === "Alphabetical") {
    rows.sort((a, b) => cmpTuple(a, b, ORDER_ALPHA));
  } else {
    rows.sort((a, b) => cmpTuple(a, b, ORDER_DUE)); // default: Due Date
  }
  return rows.map(r => r.t);
}
  // =========== Plugin ready state and ensurePluginReady ==============
  private _ready: boolean = false;

  private async ensurePluginReady(): Promise<void> {
    if (this._ready) return;

    if (!this.todoistApi) {
      const token = this.settings.apiKey;
      this.todoistApi = new TodoistApi(token);
      (window as any).todoistApi = this.todoistApi;
    }

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
  private _pollInterval: number | undefined;
  private _taskChangeInterval: number | undefined;
  private _mutationObservers: MutationObserver[] = [];
  // --- Cancellation token for filter rendering ---
  private currentRenderToken: string = "";
  private compactMode: boolean = false;
  private _globalClickListener = (e: MouseEvent) => {
    const openDropdown = document.querySelector(".menu-dropdown:not(.hidden)");
    if (openDropdown) openDropdown.classList.add("hidden");
  };
    // --- Timezone tracking for cache invalidation ---
    private lastKnownTimezone: string | null = null;
    private todoistApi!: InstanceType<typeof TodoistApi>;

    // ======================= 🌍 Common Timezones for Manual Dropdown =======================
    // Covers 99% of global use cases, with major cities and non-integer offsets
    static commonTimezones = [
  "UTC",
  // Europe
  "Europe/London","Europe/Dublin","Europe/Lisbon",
  "Europe/Madrid","Europe/Paris","Europe/Amsterdam","Europe/Brussels","Europe/Zurich",
  "Europe/Berlin","Europe/Rome","Europe/Stockholm","Europe/Copenhagen","Europe/Oslo",
  "Europe/Warsaw","Europe/Prague","Europe/Athens","Europe/Bucharest","Europe/Helsinki",
  "Europe/Kyiv","Europe/Istanbul","Europe/Minsk","Europe/Moscow",
  // MENA & Africa
  "Africa/Casablanca","Africa/Algiers","Africa/Tunis","Africa/Tripoli",
  "Africa/Cairo","Africa/Khartoum","Africa/Nairobi","Africa/Johannesburg","Africa/Lagos","Africa/Accra",
  "Asia/Jerusalem","Asia/Amman","Asia/Beirut","Asia/Baghdad","Asia/Riyadh","Asia/Kuwait","Asia/Qatar",
  "Asia/Bahrain","Asia/Dubai","Asia/Muscat","Asia/Tehran",
  // South & Central Asia
  "Asia/Karachi","Asia/Kabul","Asia/Tashkent","Asia/Almaty",
  "Asia/Colombo","Asia/Kolkata","Asia/Kathmandu",
  // East & SE Asia
  "Asia/Shanghai","Asia/Taipei","Asia/Hong_Kong","Asia/Singapore",
  "Asia/Tokyo","Asia/Seoul",
  "Asia/Bangkok","Asia/Kuala_Lumpur","Asia/Jakarta","Asia/Manila","Asia/Ho_Chi_Minh",
  // Oceania
  "Australia/Sydney","Australia/Melbourne","Australia/Brisbane","Australia/Adelaide","Australia/Darwin",
  "Australia/Perth","Pacific/Auckland","Pacific/Fiji","Pacific/Guam","Pacific/Honolulu",
  // North America
  "America/New_York","America/Toronto","America/Chicago","America/Denver","America/Los_Angeles",
  "America/Phoenix","America/Anchorage","America/Halifax","America/Puerto_Rico","America/Mexico_City",
  // Latin America
  "America/Bogota","America/Lima","America/La_Paz","America/Santiago","America/Sao_Paulo",
  "America/Argentina/Buenos_Aires","America/Montevideo"
];
// ======================= 🔌 Plugin Class =======================
  settings!: TodoistBoardSettings;
  private htmlCache: Record<string, string> = {};
  public taskStore: Record<string, any> = {};              // id → task (single source of truth)
public filterIndex: Record<string, string[]> = {};       // filterKey → [taskId]
public taskCache: Record<string, any[]> = {};            // legacy (kept for compatibility)
  public projectCache: Project[] = [];
  private sectionCache: GetSectionsResponse[] = [];
  public labelCache: Label[] = [];
  private loadingOverlay?: HTMLDivElement;
  private taskCacheTimestamps: Record<string, number> = {};
  private projectCacheTimestamp: number = 0;
  private labelCacheTimestamp: number = 0;

  
// ---- Single-source helpers ----
public upsertTasks(filterKey: string, tasks: any[]) {
  const ids: string[] = [];
  for (const t of (Array.isArray(tasks) ? tasks : [])) {
    const id = String(t?.id ?? "");
    if (!id) continue;
    this.taskStore[id] = t;
    ids.push(id);
  }
  this.filterIndex[filterKey] = ids;

  // persist
  try {
    localStorage.setItem("todoistTaskStore", JSON.stringify(this.taskStore));
    localStorage.setItem(`todoistFilterIndex:${filterKey}`, JSON.stringify(ids));
    // keep legacy cache in sync for any old paths still reading it
    localStorage.setItem(`todoistTasksCache:${filterKey}`, JSON.stringify(ids.map(id => this.taskStore[id])));
    localStorage.setItem(`todoistTasksCacheTimestamp:${filterKey}`, String(Date.now()));
  } catch {}
  this.refreshAllInlineBoards();
}

private deleteTaskEverywhere(taskId: string) {
  delete this.taskStore[taskId];
  for (const k of Object.keys(this.filterIndex)) {
    const next = (this.filterIndex[k] || []).filter(id => id !== taskId);
    this.filterIndex[k] = next;
    try {
      localStorage.setItem(`todoistFilterIndex:${k}`, JSON.stringify(next));
      localStorage.setItem(`todoistTasksCache:${k}`, JSON.stringify(next.map(id => this.taskStore[id]).filter(Boolean)));
      localStorage.setItem(`todoistTasksCacheTimestamp:${k}`, String(Date.now()));
    } catch {}
  }
  try { localStorage.setItem("todoistTaskStore", JSON.stringify(this.taskStore)); } catch {}
  this.refreshAllInlineBoards();
}

public getViewTasks(filterKey: string): any[] {
  const ids = (this.filterIndex[filterKey] || readJSON<string[]>(`todoistFilterIndex:${filterKey}`, []));
  if (Array.isArray(ids) && ids.length) {
    return ids.map(id => this.taskStore[id]).filter(Boolean);
  }
  // fallback to legacy cache if index not populated yet
  const legacy = readJSON<any[]>(`todoistTasksCache:${filterKey}`, []);
  if (Array.isArray(legacy) && legacy.length) {
    this.upsertTasks(filterKey, legacy);
    return legacy;
  }
  return [];
}
  // --- Project Map for id lookup ---
  projectMap: Map<string, any> = new Map();

  async fetchFilteredTasksFromREST(apiKey: string, args: any): Promise<any> {
  try {
    const filterKey = typeof args === "string" ? args : "today";

    // Offline-first fallback: serve last known tasks
    if (!navigator.onLine) {
      const cached = this.getViewTasks(filterKey);
      if (Array.isArray(cached) && cached.length) return { results: cached };
      const legacy = readJSON<any[]>(`todoistTasksCache:${filterKey}`, []);
      return { results: Array.isArray(legacy) ? legacy : [] };
    }

    if (!this.todoistApi) this.todoistApi = new TodoistApi(apiKey);
    const api = this.todoistApi;
    const res = await api.getTasksByFilter({ query: filterKey });
    const list = Array.isArray(res)
      ? res
      : (Array.isArray((res as any)?.results) ? (res as any).results : []);
    return { results: Array.isArray(list) ? list : [] };
  } catch {
    // Final safety: try cache on errors
    const filterKey = typeof args === "string" ? args : "today";
    const cached = this.getViewTasks(filterKey);
    if (Array.isArray(cached) && cached.length) return { results: cached };
    const legacy = readJSON<any[]>(`todoistTasksCache:${filterKey}`, []);
    return { results: Array.isArray(legacy) ? legacy : [] };
  }
}

  async fetchMetadataFromSync(apiKey: string): Promise<{
    projects: Project[];
    sections: GetSectionsResponse[];
    labels: Label[];
  }> {
    try {
      // Use SDK methods for all metadata fetches
      const raw = await this.todoistApi.getProjects();
      const projects = Array.isArray(raw) ? raw : raw.results || [];
      // 🗂️ Log all returned project IDs
      // if (this.settings?.enableLogs) console.log("🗂️ Projects returned:", projects.map(p => p.id));
      // For sections, you need a projectId; if not available, fetch for all projects
      // Here we fetch for all projects and flatten
      let sections: GetSectionsResponse[] = [];
      if (Array.isArray(projects) && projects.length > 0) {
        const allSections = await Promise.all(
          projects.map(async (proj) => {
            try {
              return await this.todoistApi.getSections({ projectId: proj.id });
            } catch {
              return [];
            }
          })
        );
        sections = ([] as GetSectionsResponse[]).concat(...allSections);
      }
      const labels = await this.todoistApi.getLabels() as unknown as Label[];

      localStorage.setItem('todoistProjectsCache', JSON.stringify(projects));
      localStorage.setItem('todoistLabelsCache', JSON.stringify(labels));
      localStorage.setItem('todoistProjectsCacheTimestamp', String(Date.now()));
      localStorage.setItem('todoistLabelsCacheTimestamp', String(Date.now()));

      return {
        projects,
        sections,
        labels
      };
    } catch (err) {
      // console.error("Failed to fetch metadata from Todoist", err);
      return {
        projects: [],
        sections: [],
        labels: []
      };
    }
  }
async loadSettings() {
  const saved = await this.loadData();
  this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
}
async saveSettings() {
  await this.saveData(this.settings);
// refresh inline boards
document.querySelectorAll(".todoist-inline-board").forEach((el) => {
  el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
});
// update sidebar boards right away
document.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
  const on = !!this.settings.compactMode;
  el.classList.toggle("compact-mode", on);
  const list = el.querySelector(".list-wrapper");
  if (list) list.classList.toggle("compact-mode", on);
});
}

// ======================= 🔄 Refresh All Inline Boards =======================
refreshAllInlineBoards() {
  document.querySelectorAll(".todoist-inline-board").forEach((el) => {
    el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
  });
}
  async preloadFilters(): Promise<void> {
    const now = Date.now();
    const cacheTTL = 24 * 60 * 60 * 1000;
    const timezone = getZone(this.settings);
    const DEFAULT_FILTERS = getDefaultFilters(timezone);
    const filters = this.settings.filters || DEFAULT_SETTINGS.filters!;
    
    await Promise.all(filters.map(async (f) => {
      try {
        const key = f.filter;
        const local = localStorage.getItem(`todoistTasksCache:${key}`);
        const timestamp = parseInt(localStorage.getItem(`todoistTasksCacheTimestamp:${key}`) || "0");
        
        if (local && now - timestamp < cacheTTL) {
          this.taskCache[key] = JSON.parse(local);
          // Insert safety check: ensure it's always an array
          if (!Array.isArray(this.taskCache[key])) {
            this.taskCache[key] = [];
          }
          this.taskCacheTimestamps[key] = timestamp;

          // Fully await fetchFilteredTasksFromREST and handle changes synchronously
          const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
          const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
          let oldTasks = this.taskCache[key];
          if (!Array.isArray(oldTasks)) oldTasks = [];
          const oldIds = new Set(oldTasks.map((t: any) => t.id));
          const newIds = new Set(Array.isArray(tasks) ? tasks.map((t: any) => t.id) : []);
          const hasChanges = oldTasks.length !== (Array.isArray(tasks) ? tasks.length : 0) ||
            (Array.isArray(tasks) && tasks.some((t: any) => !oldIds.has(t.id))) ||
            oldTasks.some((t: any) => !newIds.has(t.id));

          if (hasChanges) {
  this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
  this.taskCacheTimestamps[key] = Date.now();
}

          const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter");
          if (hasChanges && currentFilter === key) {
            const container = document.querySelector(".todoist-board") as HTMLElement;
            if (container) {
              container.innerHTML = "";
              this.renderTodoistBoard(container, `filter: ${key}`, {}, this.settings.apiKey);
            }
          }
        } else {
          const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
          const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
          this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
this.taskCacheTimestamps[key] = now;
        }
      } catch (err) {
        // console.error("Error preloading filter", f, err);
      }
    }));
  }

  async completeTask(taskId: string): Promise<void> {
  await this.todoistApi.closeTask(taskId);
  this.deleteTaskEverywhere(String(taskId));

  // Re-render all visible boards so every filter reflects the change
  const boards = Array.from(document.querySelectorAll(".todoist-board.plugin-view")) as HTMLElement[];
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
    const badge = board.querySelector(`.filter-row[data-filter="${f}"] .filter-badge-count`) as HTMLElement | null;
    if (badge) badge.textContent = String(tasks.length);
  });
  this.refreshAllInlineBoards();
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
        id: 'open-todoist-board-sidebar',
        name: 'Open Todoist Board (Right Sidebar)',
        callback: async () => {
          // Only open the board if it's not already open in the right sidebar
          const existingLeaf = this.app.workspace
            .getLeavesOfType(TODOIST_BOARD_VIEW_TYPE)
            .find((leaf) => (leaf.getRoot() as any)?.containerEl?.hasClass("mod-right-split"));

          if (existingLeaf) {
            // Already open in right sidebar; do nothing
            return;
          }

          const rightLeaf =
            this.app.workspace.getRightLeaf(false) ||
            this.app.workspace.getRightLeaf(true);

          if (rightLeaf) {
            await rightLeaf.setViewState({
              type: TODOIST_BOARD_VIEW_TYPE,
              active: true,
            });
          }
        },
      });
      await this.loadSettings();

      const initialToken = this.settings.apiKey;
      this.todoistApi = new TodoistApi(initialToken);
      (window as any).todoistApi = this.todoistApi;

      // 🧠 Load metadata from localStorage
      const projLocal = localStorage.getItem('todoistProjectsCache');
      const projTimestamp = parseInt(localStorage.getItem('todoistProjectsCacheTimestamp') || "0");
      if (projLocal) {
        this.projectCache = JSON.parse(projLocal);
        this.projectCacheTimestamp = projTimestamp;
        this.projectMap.clear();
        for (const project of this.projectCache) {
          this.projectMap.set(String(project.id), project);
        }
      }

      const labelLocal = localStorage.getItem('todoistLabelsCache');
      const labelTimestamp = parseInt(localStorage.getItem('todoistLabelsCacheTimestamp') || "0");
      if (labelLocal) {
        this.labelCache = JSON.parse(labelLocal);
        this.labelCacheTimestamp = labelTimestamp;
      }
      // OAuth2 authentication setup removed.
      if (!initialToken) {
        console.warn("[Todoist Board] No Todoist API token found. Set one in the plugin settings.");
        // Still register the settings tab so the user can open settings even when not authenticated
        this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
        return;
      }
      this.addSettingTab(new TodoistBoardSettingTab(this.app, this));


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
let storedTimezone = localStorage.getItem("todoistTimezone");
if (!storedTimezone) {
  localStorage.setItem("todoistTimezone", effectiveZone);
  storedTimezone = effectiveZone;
}
this.lastKnownTimezone = storedTimezone;

if (storedTimezone !== effectiveZone) {
  // Invalidate all cached task data if timezone changed
  for (let i = localStorage.length - 1; i >= 0; i--) {
  const key = localStorage.key(i) || "";
  if (key.startsWith("todoistTasksCache:") || key.startsWith("todoistTasksCacheTimestamp:")) {
    localStorage.removeItem(key);
  }
}
  // Store updated timezone
  localStorage.setItem("todoistTimezone", effectiveZone);

  // Re-fetch metadata and update caches
  const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
  this.projectCache = metadata.projects;
  this.labelCache = metadata.labels;
  this.projectCacheTimestamp = Date.now();
  this.labelCacheTimestamp = Date.now();

  // Force re-render of current board if any is active
  const boardEl = document.querySelector(".todoist-board") as HTMLElement;
  const currentFilter = boardEl?.getAttribute("data-current-filter") || "";
  if (boardEl && currentFilter) {
    const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
    const tasks = resp?.results ?? [];
    this.taskCache[currentFilter] = tasks;
    this.renderTodoistBoard(boardEl, `filter: ${currentFilter}`, {}, this.settings.apiKey, {
      tasks,
      projects: this.projectCache,
      labels: this.labelCache
    });
  }
}

      this.loadingOverlay = document.createElement("div");
      this.loadingOverlay.className = "loading-overlay";
      const spinner = document.createElement("div");
      spinner.className = "spinner";
      this.loadingOverlay.appendChild(spinner);
      this.registerDomEvent(this.loadingOverlay, "click", (e) => e.stopPropagation());

      this.registerMarkdownCodeBlockProcessor(
        "todoist-board",
        (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
          // Add classes for code block container
          el.classList.add("block-language-todoist-board", "todoist-board", "todoist-inline-board");
          const sourcePath = ctx.sourcePath || "reading-mode-placeholder";
          let filter = "today";
          // Parse block params for filter
          function parseBlockParams(raw: string): Record<string, any> {
            const lines = raw.split("\n");
            const params: Record<string, any> = {};
            for (let line of lines) {
              const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
              if (m) {
                params[m[1].trim()] = m[2].trim();
              }
            }
            return params;
          }
          const parsed = parseBlockParams(source);
          this.dbg("📦 Raw source:", source);
          this.dbg("🧩 Parsed block params:", parsed);
          if (parsed.Filter && typeof parsed.Filter === "string") {
            filter = parsed.Filter;
          } else {
            const match = source.match(/filter:\s*(.*)/);
            if (match) {
              filter = match[1].trim();
            } else {
              const defaultFilterObj = this.settings.filters?.find(f => f.isDefault);
              if (defaultFilterObj) filter = defaultFilterObj.filter;
            }
          }
          // Keep Todoist filter as a plain string (the API expects a query string)
const timezone = getZone(this.settings);
const parsedFilter = String(filter);
const filterKey = parsedFilter;
this.dbg("🎯 Final filter used:", filterKey);
el.setAttribute("data-current-filter", filterKey);
// Offline metadata hydration (so projects/labels resolve)
if (!Array.isArray(this.projectCache) || this.projectCache.length === 0) {
  const proj = readJSON<Project[]>("todoistProjectsCache", []);
  if (Array.isArray(proj) && proj.length) this.projectCache = proj;
}
if (!Array.isArray(this.labelCache) || this.labelCache.length === 0) {
  const labs = readJSON<Label[]>("todoistLabelsCache", []);
  if (Array.isArray(labs) && labs.length) this.labelCache = labs as any;
}
          // Helper for rendering with sort toolbar
          const renderWithSortToolbar = (tasks: Task[]) => {
            // Prepare metadata
            const meta = {
              tasks,
              projects: this.projectCache || [],
              labels: this.labelCache || [],
            };
            // Clear container
            el.innerHTML = "";
            // Create a wrapper for the filter row and task list, as in createLayout
            const filterRowWrapper = document.createElement("div");
            filterRowWrapper.className = "filter-row-wrapper";
            filterRowWrapper.style.display = "none"; // Hide filter bar for inline boards
            el.appendChild(filterRowWrapper);
            // Insert sort toolbar immediately after filterRowWrapper
            // --- Begin Inline Sort Toolbar ---
            const createDiv = (opts: any = {}) => {
              const div = document.createElement("div");
              if (opts.cls) div.className = opts.cls;
              return div;
            };
            // Prevent duplicate toolbar if render() is called twice by parent
const existing = el.querySelector(".inline-toolbar");
if (existing) existing.remove();

const toolbar = createDiv("inline-toolbar");
toolbar.style.display = "flex";
toolbar.style.gap = "8px";
toolbar.style.marginBottom = "8px";

            const sortButton = createDiv({ cls: "clickable-icon" });
            sortButton.style.fontSize = "0.8em";
            setIcon(sortButton, "arrow-up-down");
            const sortLabel = document.createElement("span");
            // Persist sort mode per filter key
let currentSortMode = localStorage.getItem(`todoistSortMode:${filterKey}`);
if (!currentSortMode) currentSortMode = el.dataset.sortMode || "Due Date";
el.dataset.sortMode = currentSortMode;
this.setSortMode(filterKey, currentSortMode);
sortLabel.textContent = `Sort: ${currentSortMode}`;
            sortLabel.style.marginLeft = "4px";
            sortLabel.style.fontSize = "0.8em";
            sortButton.appendChild(sortLabel);
            sortButton.setAttribute("aria-label", "Sort Tasks");
            sortButton.setAttribute("role", "button");
            a11yButton(sortButton, "Sort tasks");
            const render = () => {
              // Remove previous list if any
              const prevList = el.querySelector(".list-wrapper");
              if (prevList) prevList.remove();

              // Build fresh base from cache or fetched "tasks"
              const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
const base: Task[] = this.getViewTasks(currentFilterKey);

              const { mode, viewTasks, projects, labels } = this.buildRenderInput(base, el as HTMLElement, currentFilterKey);

              // Render tasks
              const listWrapper = document.createElement("div");
              listWrapper.className = "list-wrapper";
              el.appendChild(listWrapper);

              this.projectMap.clear();
              for (const p of (projects || [])) this.projectMap.set(String((p as any).id), p);

              this.renderTaskList(
                listWrapper,
                sourcePath,
                this.settings.apiKey,
                { tasks: viewTasks, projects, labels }
              );

              // Stamp ids on direct children in the same order as viewTasks
              const directChildren = Array.from(listWrapper.children) as HTMLElement[];
              for (let i = 0; i < directChildren.length && i < viewTasks.length; i++) {
                const id = String((viewTasks as any[])[i]?.id || "");
                if (id) {
                  directChildren[i].classList.add("todoist-card");
                  directChildren[i].dataset.taskId = id;
                }
              }

              // DOM reorder to match sorted order (no-op for Manual)
              if (mode !== "Manual") {
  const targetOrder = new Map((viewTasks as any[]).map((t: any, i: number) => [String(t.id), i]));
  const nodes = Array.from(listWrapper.children) as HTMLElement[];
  // Stamp any missing ids before sorting
  nodes.forEach((n, i) => {
    if (!n.dataset.taskId && (viewTasks as any[])[i]?.id) {
      n.classList.add("todoist-card");
      n.dataset.taskId = String((viewTasks as any[])[i].id);
    }
  });
  nodes.sort((a, b) => {
                  const ai = targetOrder.get(String(a.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                  const bi = targetOrder.get(String(b.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                  return ai - bi;
                });
                nodes.forEach((n) => listWrapper.appendChild(n));

  // Hide metadata for child (sub) tasks AND mark parents (inline boards)
try {
  const vt = (viewTasks as any[]) || [];
const byId = new Map(vt.map((t: any) => [String(t.id), t]));

// Build the parent-id set from the entire store so parents still mark even if children are filtered out
const childParentIds = new Set(
  Object.values(this.taskStore || {})
    .filter((t: any) => t && t.parentId)
    .map((t: any) => String(t.parentId))
);

const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));

nodes.forEach((node) => {
  const id = String(node.dataset.taskId || "");
  const t = byId.get(id);

  // Child rows: hide meta
  if (t && t.parentId) {
    node.classList.add("is-child-task");
    const hideSel =
      ".due-inline, .project-pill, .project-badge, .label-pill, .labels, .task-meta, .meta, .meta-span, .metadata, .task-when, .task-meta-compact";
    node.querySelectorAll(hideSel).forEach((el) => ((el as HTMLElement).style.display = "none"));
  }

  // Parent rows: add inline emoji marker once
  if (childParentIds.has(id)) {
    node.classList.add("has-children", "parent-task");

    const titleEl =
      node.querySelector<HTMLElement>(".task-title, .task-title-text, .task-name, .task-content, .task-title-inner") ||
      node.querySelector<HTMLElement>(".task-content-wrapper") ||
      node;

    if (titleEl && !titleEl.querySelector(".parent-mark")) {
      const mark = document.createElement("span");
      mark.className = "parent-mark";
      mark.textContent = "☰";
      mark.style.marginLeft = "6px";
      mark.style.opacity = "0.8";
      mark.style.display = "inline-block";
      titleEl.appendChild(mark); // placed at the end of the title content
    }
  }
});
} catch {}
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
                  item.setTitle("Due Date").setIcon("calendar").onClick(() => {
  if (this.settings?.enableLogs) console.log("[Sort Click] → Due Date");
  currentSortMode = "Due Date";
el.dataset.sortMode = currentSortMode;
this.setSortMode(filterKey, currentSortMode);
sortLabel.textContent = `Sort: ${currentSortMode}`;
if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
render();
})
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Priority").setIcon("arrow-up").onClick(() => {
  if (this.settings?.enableLogs) console.log("[Sort Click] → Priority");
  currentSortMode = "Priority";
  el.dataset.sortMode = currentSortMode;
  this.setSortMode(filterKey, currentSortMode);
  sortLabel.textContent = `Sort: ${currentSortMode}`;
  if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
  render();
})
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Alphabetical").setIcon("list-ordered").onClick(() => {
  if (this.settings?.enableLogs) console.log("[Sort Click] → Alphabetical");
  currentSortMode = "Alphabetical";
  el.dataset.sortMode = currentSortMode;
  this.setSortMode(filterKey, currentSortMode);
  sortLabel.textContent = `Sort: ${currentSortMode}`;
  if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
  render();
})
                );
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Manual").setIcon("grip-vertical").onClick(() => {
  if (this.settings?.enableLogs) console.log("[Sort Click] → Manual");
  currentSortMode = "Manual";
  el.dataset.sortMode = currentSortMode;
this.setSortMode(filterKey, currentSortMode);
  sortLabel.textContent = `Sort: ${currentSortMode}`;
  if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
  render();
})
                );
                menu.addSeparator();
                menu.addItem((item: MenuItem) =>
                  item.setTitle("Clear Sort").setIcon("x-circle").onClick(() => {
  if (this.settings?.enableLogs) console.log("[Sort Click] → Clear Sort (Manual)");
  currentSortMode = "Manual";
  el.dataset.sortMode = currentSortMode;
  this.setSortMode(filterKey, currentSortMode);
  sortLabel.textContent = `Sort: ${currentSortMode}`;
  if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
  render();
})
                );
                if (event instanceof MouseEvent && typeof (menu as any).showAtMouseEvent === "function") {
  (menu as any).showAtMouseEvent(event);
} else {
  const r = sortButton.getBoundingClientRect();
  menu.showAtPosition({ x: r.left, y: r.bottom });
}
              } catch (err) {
                console.error("[Sort Button Error]", err);
              }
            };
            toolbar.appendChild(sortButton);

// --- Capture (+) Button for inline board ---
const captureBtn = document.createElement("span");
captureBtn.className = "clickable-icon todoist-add-task-btn";
captureBtn.style.transform = "scale(1.25)";
captureBtn.style.opacity = "0.6"; // match faded look
captureBtn.style.display = "flex";
captureBtn.style.alignItems = "center";
captureBtn.style.justifyContent = "center";
captureBtn.style.cursor = "pointer";
setIcon(captureBtn, "plus-circle");
captureBtn.title = "Add Task";
captureBtn.onclick = () => {
  this.openAddTaskModal();
};
// Match hover style
captureBtn.addEventListener("mouseenter", () => captureBtn.style.opacity = "1");
captureBtn.addEventListener("mouseleave", () => captureBtn.style.opacity = "0.6");
a11yButton(captureBtn, "Add task");
toolbar.appendChild(captureBtn);
// --- End Capture (+) Button ---
// --- Copy List Button ---
const copyBtn = document.createElement("span");
copyBtn.className = "clickable-icon";
copyBtn.style.transform = "scale(1.1)";
copyBtn.style.opacity = "0.6";
copyBtn.style.display = "flex";
copyBtn.style.alignItems = "center";
copyBtn.style.justifyContent = "center";
copyBtn.style.cursor = "pointer";
setIcon(copyBtn, "copy");
copyBtn.title = "Copy list";
copyBtn.onclick = async () => {
  try {
    const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
    // Build the current view using the same sorter as the renderer
    const base = this.getViewTasks(currentFilterKey);
    const { viewTasks } = this.buildRenderInput(base, el as HTMLElement, currentFilterKey);

    const lines = (viewTasks as any[]).map((t: any) => {
      const title = String(t?.content || "").trim();
      return `- [ ] ${title}`;
    });
    const text = lines.join("\n");

    if (!text) {
      new Notice("No tasks to copy");
      return;
    }

    // Try Clipboard API first
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for environments without Clipboard API permissions
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-10000px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    new Notice("Copied task list");
  } catch (err) {
    console.warn("[Todoist Board] Copy list failed", err);
    new Notice("Copy failed");
  }
};
copyBtn.addEventListener("mouseenter", () => (copyBtn.style.opacity = "1"));
copyBtn.addEventListener("mouseleave", () => (copyBtn.style.opacity = "0.6"));
a11yButton(copyBtn, "Copy task list");
toolbar.appendChild(copyBtn);
// --- End Copy List Button ---
            // --- Manual Sync Button ---
            const syncButton = document.createElement("span");
            syncButton.className = "clickable-icon";
            setIcon(syncButton, "refresh-cw");
            syncButton.title = "Manual Sync";
            syncButton.onclick = async () => {
  const currentFilter = el.getAttribute("data-current-filter") || "today";

  // If offline, keep cache and just re-render from it
  if (!navigator.onLine) {
    if (this.settings?.enableLogs) console.warn("[Manual Sync] Offline, using cached tasks.");
    render();
    return;
  }

  // Online: refresh from server
  localStorage.removeItem(`todoistTasksCache:${currentFilter}`);
  localStorage.removeItem(`todoistTasksCacheTimestamp:${currentFilter}`);
  const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
  const tasks = resp?.results ?? [];
  this.upsertTasks(currentFilter, tasks);
  render();
};
            a11yButton(syncButton, "Manual sync");
            toolbar.appendChild(syncButton);
            // --- Queue Toggle Button ---
            const queueButton = document.createElement("span");
            queueButton.className = "clickable-icon";
            setIcon(queueButton, "focus");
            queueButton.title = "Toggle Queue Mode";
            let queueActive = false;
            queueButton.onclick = () => {
              queueActive = !queueActive;
              this.updateQueueView(queueActive, el.querySelector(".list-wrapper")!);
            };
            a11yButton(queueButton, "Toggle queue mode");
            toolbar.appendChild(queueButton);

            // --- Compact Mode Toggle Button ---
            const compactButton = document.createElement("span");
            compactButton.className = "clickable-icon";
            setIcon(compactButton, "list");
            compactButton.title = "Toggle Compact Mode";
            compactButton.onclick = () => {
              el.classList.toggle("compact-mode");
              const listWrapper = el.querySelector(".list-wrapper");
              if (listWrapper) {
                listWrapper.classList.toggle("compact-mode");
              }
            };
            a11yButton(compactButton, "Toggle compact mode");
            toolbar.appendChild(compactButton);

           // Place toolbar at the top; inline boards hide it via CSS when needed
el.prepend(toolbar);
            // --- End Inline Sort Toolbar ---
          };
          // --- PATCH: Use improved cache logic for loading and rendering tasks ---
          const cacheKey = `todoistTasksCache:${filterKey}`;
          const cached = localStorage.getItem(cacheKey);
          let cachedTasks: Task[] = [];
          if (!cached && !navigator.onLine) {
  const fallback = this.getViewTasks(filterKey);
  if (Array.isArray(fallback) && fallback.length) {
    cachedTasks = fallback as Task[];
    this.upsertTasks(filterKey, cachedTasks); // populate filterIndex for this session
    renderWithSortToolbar(cachedTasks);
  }
}


          if (cached) {
  try {
    cachedTasks = JSON.parse(cached) as Task[];
    this.dbg("📦 Cached tasks for", filterKey, ":", cachedTasks);
    if (Array.isArray(cachedTasks)) {
      this.taskCache[typeof filterKey === "string" ? filterKey : JSON.stringify(filterKey)] = cachedTasks;
      this.upsertTasks(filterKey, cachedTasks); // make sure filterIndex is ready
      if (
        el.classList.contains("block-language-todoist-board") ||
        el.classList.contains("todoist-inline-board")
      ) {
        renderWithSortToolbar(cachedTasks);
                } else {
                  this.renderTodoistBoard(
                    el,
                    `filter: ${filterKey}`,
                    sourcePath,
                    this.settings.apiKey,
                    {
                      tasks: cachedTasks,
                      projects: this.projectCache || [],
                      labels: this.labelCache || [],
                    }
                  );
                }
              }
            } catch (e) {
              console.warn('Failed to parse cached tasks:', e);
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
                        sourcePath,
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
                console.warn("Fetch failed, using cached data only", e);
              });
          }
        }
      );

      // Skip preloadFilters and initial metadata fetch

      // this.setupDoubleTapPrevention();

      // Ensure onLayoutReady is called with the correct `this` context (fixes TS/Rollup warning):
      setTimeout(this.onLayoutReady.bind(this), 1);

      // (Removed polling-based initial render block; handled in TodoistBoardView.onOpen)

      document.addEventListener("click", this._globalClickListener);

      // Start polling for task changes after initial rendering and setup
      pollForTaskChanges(); // cleanup handled via _todoistPollInterval
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
  const defaultFilterRow = document.querySelector(".filter-row[data-filter]");
  const container = document.querySelector(".todoist-board");
  if (defaultFilterRow && container) {
    const source = defaultFilterRow.getAttribute("data-filter") || "today";
    const prev = container.getAttribute("data-current-filter");
if (prev !== String(source)) container.setAttribute("data-current-filter", String(source));
container.innerHTML = "";
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
    document.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
    defaultFilterRow.classList.add("selected");
    return true;
  }
  return false;
};
    // Try immediately, then poll for up to 1s.
    if (tryRenderDefault()) return;
    let tries = 0;
    // (Removed recursive setTimeout to prevent runaway retries)
    const interval = setInterval(() => {
      if (tryRenderDefault() || ++tries > 20) clearInterval(interval);
    }, 50);
  }



  // ======================= 🧹 Persistence & Cleanup =======================
  async savePluginData() {
    await this.saveData(this.settings);
    this.refreshAllInlineBoards();
  }

  onunload() {
    // Remove global event listener
    document.removeEventListener("click", this._globalClickListener);

    // Remove activity listeners registered by pollForTaskChanges
    if (Array.isArray(_activityHandlers) && _activityHandlers.length > 0) {
      _activityHandlers.forEach(({ event, fn }) => window.removeEventListener(event, fn as any));
      _activityHandlers = [];
    }
    // Clear polling interval started by pollForTaskChanges
    if (typeof _todoistPollInterval !== "undefined") {
      clearInterval(_todoistPollInterval);
      _todoistPollInterval = undefined;
    }

    // Clear dropdowns
    const allDropdowns = document.querySelectorAll(".menu-dropdown-wrapper");
    allDropdowns.forEach(dropdown => dropdown.remove());

    // Clear polling intervals
    if (this._pollInterval !== undefined) {
      clearInterval(this._pollInterval);
      this._pollInterval = undefined;
    }
    if (this._taskChangeInterval !== undefined) {
      clearInterval(this._taskChangeInterval);
      this._taskChangeInterval = undefined;
    }

    // Remove any floating toolbars
    const toolbars = document.querySelectorAll("#mini-toolbar-wrapper");
    toolbars.forEach(toolbar => toolbar.remove());

    // Remove loading overlay
    if (this.loadingOverlay?.parentElement) {
      this.loadingOverlay.remove();
    }

    // Remove UI injected elements (e.g., .todoist-board, .todoist-plugin-ui if any)
    document.querySelectorAll('.todoist-plugin-ui').forEach(el => el.remove());

    // Remove menu dropdowns that might have been appended to body
    document.querySelectorAll('.menu-dropdown-wrapper').forEach(el => el.remove());

    // Disconnect mutation observers if any
    if (this._mutationObservers && this._mutationObservers.length > 0) {
      this._mutationObservers.forEach(obs => obs.disconnect());
      this._mutationObservers = [];
    }

    // Remove all .todoist-board elements from DOM
  document.querySelectorAll('.todoist-board').forEach(el => el.remove());

  // Close lingering modal host
  if (this.modalHost && this.modalHost.parentElement) {
    this.modalHost.remove();
  }
  this.modalHost = null;
}

  // ======================= 🧱 Board Renderer =======================
  async render(...args: any[]) {
    // --- Ensure projectMap is rebuilt from projectCache at the beginning ---
    this.projectMap.clear();
    this.projectCache.forEach((p) => this.projectMap.set(p.id, p));
    // Ensure due time is included in fetched tasks by passing as_time: true
    // no-op fetch removed to avoid extra network calls per render
    await this.renderTodoistBoard(...(args ?? []));
  }



  /**
   * Forces re-sorting and re-rendering of the task list according to the current sort option.
   */
  rerenderTasks() {
  const boards = Array.from(document.querySelectorAll(".todoist-board.plugin-view")) as HTMLElement[];
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

  renderTodoistBoard(...args: any[]) {
    // Extract parameters for backwards compatibility
    let [
      container,
      source,
      ctx,
      apiKey,
      initialData = { tasks: [], sections: [], projects: [], labels: [] }
    ] = args;
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
      let tasks = [];
      let projects: any[] = [];
      // If initialData provided, prefer its projects; else use this.projectCache
      if (initialData && Array.isArray(initialData.projects)) {
        projects = initialData.projects;
      } else if (Array.isArray(this.projectCache)) {
        projects = this.projectCache;
      }
      // --- PATCH: If projectMap is empty, try to load from localStorage cache as fallback ---
      if (this.projectMap.size === 0) {
        const localProjects = localStorage.getItem("todoistProjectsCache");
        if (localProjects) {
          try {
            const parsed = JSON.parse(localProjects);
            if (Array.isArray(parsed)) {
              this.projectCache = parsed;
              this.projectMap.clear();
              for (const project of parsed) {
                this.projectMap.set(String(project.id), project);
              }
            }
          } catch (e) {
            // console.error("Failed to parse project cache fallback", e);
          }
        }
      }
      // --- PATCH: Update projectMap before rendering ---
      this.projectMap.clear();
      for (const project of projects) {
        this.projectMap.set(String(project.id), project);
      }
      // 🔍 Debug: Inspect task-to-project mapping
      if (initialData && Array.isArray(initialData.tasks) && initialData.tasks.length > 0) {
        const task = initialData.tasks[0];
        // if (this.settings?.enableLogs) console.log("🔍 Sample task → projectId:", task.projectId, "→ mapped:", this.projectMap.get(String(task.projectId)));
      }
      // --- PATCH: Use tasks from initialData, not from localStorage or cache ---
      // Do NOT sort the tasks, preserve the order as passed in
      const taskList = initialData.tasks || [];
      // --- PATCH: Fallback to localStorage for tasks if needed ---
      if ((!Array.isArray(taskList) || taskList.length === 0) && currentFilter) {
        const local = localStorage.getItem(`todoistTasksCache:${currentFilter}`);
        let fallback = [];
        try {
          fallback = JSON.parse(local || "[]");
        } catch {}
        this.taskCache[currentFilter] = fallback;
        // console.warn("⚠️ Fallback to localStorage tasks for filter:", currentFilter, fallback);
        tasks = fallback;
      } else {
        // Defensive copy, but preserve order as provided
        tasks = [...taskList];
      }
      container.innerHTML = "";
      const currentKey = `${currentFilter}:${tasks?.length || 0}`;
      container.setAttribute("data-prev-render-key", currentKey);

      // Sync in-memory cache with current tasks
      this.upsertTasks(currentFilter, tasks);
      // PATCH: If no tasks or not an array, skip render and warn
      if (!tasks || !Array.isArray(tasks)) {
        return;
      }

      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = "flex";
      }

      let cachedTasks = tasks;
      let defaultFilter = currentFilter;

      try {
        if (!container.dataset.sortMode) container.dataset.sortMode = localStorage.getItem(`todoistSortMode:${currentFilter}`) || "Due Date";
        this.setupContainer(container);
        container.classList.toggle("compact-mode", this.compactMode);
        // 🧪 Log compact mode application
        // if (this.settings?.enableLogs) console.log("🧪 Compact mode applied?", this.compactMode, "→ container:", container, "→ has class?", container.classList.contains("compact-mode"));
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
listWrapper.classList.toggle("compact-mode", this.compactMode);
      // Hide the entire toolbar for inline boards (markdown blocks / reading mode)
      const inlineBoard = container.classList.contains("block-language-todoist-board") || !!container.closest(".markdown-reading-view");
      if (inlineBoard) {
        requestAnimationFrame(() => {
          toolbar.style.setProperty("display", "none", "important");
        });
      }
      // Toggle compact-mode class on container only
      container.classList.toggle("compact-mode", this.compactMode);
      const skipToolbar = hideToolbar || inlineBoard;
      if (skipToolbar) {
        toolbar.classList.add("hide-toolbar");
        toolbar.style.display = "none";
      } else {
        this.renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper);
      }

        // --- sort for plugin view and render via centralized helper ---
        const filterKey = currentFilter;
        if (!container.dataset.sortMode) {
          container.dataset.sortMode = localStorage.getItem(`todoistSortMode:${filterKey}`) || "Due Date";
        }
        const baseForView = Array.isArray(tasks) ? tasks.slice() : [];
        const { mode, viewTasks, projects: projectsForRender, labels: labelsForRender } = this.buildRenderInput(baseForView, container as HTMLElement, filterKey);

        this.renderTaskList(listWrapper, source, apiKey, { tasks: viewTasks, projects: projectsForRender, labels: labelsForRender });

        // Keep DOM order in sync with viewTasks (plugin view)
        try {
          if (mode !== "Manual") {
            const targetOrder = new Map(viewTasks.map((t: any, i: number) => [String(t.id), i]));
            const children = Array.from(listWrapper.children) as HTMLElement[];
            // Stamp ids if missing
            children.forEach((n, i) => {
              const id = String((viewTasks as any[])[i]?.id || n.dataset.taskId || "");
              if (id) { n.classList.add("todoist-card"); n.dataset.taskId = id; }
            });
            children.sort((a, b) => {
              const ai = targetOrder.get(String(a.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
              const bi = targetOrder.get(String(b.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
              return ai - bi;
            });
            children.forEach((n) => listWrapper.appendChild(n));

            // Hide child metadata AND mark parents (sidebar/plugin board)
try {
  const byId = new Map(viewTasks.map((t: any) => [String(t.id), t]));
const childParentIds = new Set(
  Object.values(this.taskStore || {})
    .filter((t: any) => t && t.parentId)
    .map((t: any) => String(t.parentId))
);
const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));

nodes.forEach((node) => {
  const id = String(node.dataset.taskId || "");
  const t = byId.get(id);

  if (t && t.parentId) {
    node.classList.add("is-child-task");
    const hideSel =
      ".due-inline, .project-pill, .project-badge, .label-pill, .labels, .task-meta, .meta, .meta-span, .metadata, .task-when, .task-meta-compact";
    node.querySelectorAll(hideSel).forEach((el) => ((el as HTMLElement).style.display = "none"));
  }

  if (childParentIds.has(id)) {
    node.classList.add("has-children", "parent-task");

    const titleEl =
      node.querySelector<HTMLElement>(".task-title, .task-title-text, .task-name, .task-content, .task-title-inner") ||
      node.querySelector<HTMLElement>(".task-content-wrapper") ||
      node;

    if (titleEl && !titleEl.querySelector(".parent-mark")) {
      const mark = document.createElement("span");
      mark.className = "parent-mark";
      mark.textContent = "☰";
      mark.style.marginLeft = "6px";
      mark.style.opacity = "0.8";
      mark.style.display = "inline-block";
      titleEl.appendChild(mark);
    }
  }
});
} catch {}
          }
        } catch {}

        // PATCH: Fetch metadata in background if stale, then re-render
        const now = Date.now();
        const metadataCacheTTL = 5 * 60 * 1000;
        const metadataFresh = this.projectCache && (now - this.projectCacheTimestamp < metadataCacheTTL);

        if (!metadataFresh) {
          this.fetchMetadataFromSync(apiKey).then(metadata => {
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
        this.setupMutationObserver(container);

        // --- PATCH: Save the rendered tasks to localStorage after successful render ---
        if (Array.isArray(cachedTasks)) {
          try {
            localStorage.setItem(`todoistTasksCache:${defaultFilter}`, JSON.stringify(cachedTasks));
          } catch (e) {
            // console.error("Error saving rendered tasks to localStorage", e);
          }
        }

      } finally {
        if (this.loadingOverlay) {
          this.loadingOverlay.style.display = "none";
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
    
    const listToolbar = document.createElement("div");
    listToolbar.className = "list-toolbar";
    container.appendChild(listToolbar);
    if (container.classList.contains("block-language-todoist-board") || container.closest(".markdown-reading-view")) {
  listToolbar.style.setProperty("display", "none", "important");
}

    const listView = document.createElement("div");
    listView.classList.add("list-view");
    
    const listWrapper = document.createElement("div");
listWrapper.className = "list-wrapper";
listWrapper.classList.toggle("compact-mode", this.compactMode);
listView.appendChild(listWrapper);
    container.appendChild(listView);

    return { toolbar: listToolbar, listWrapper };
  }

  private getFilterOptions() {
    // If you want to use the dynamically generated default filters, insert logic here.
    // However, this method is for returning the filter *list* for the toolbar, which is from settings.
    return (this.settings.filters && this.settings.filters.length > 0)
      ? this.settings.filters
      : DEFAULT_SETTINGS.filters!;
  }

  private getSourceOrDefault(source: string, filterOptions: any[]) {
    if (!source || !source.trim()) {
      const defaultFilterObj = filterOptions.find(f => f.isDefault) || filterOptions[0];
      return `filter: ${defaultFilterObj?.filter}`;
    }
    // Remove any 'toolbar:' line from the source
    return source
      .split("\n")
      .filter(line => !line.trim().toLowerCase().startsWith("toolbar:"))
      .join("\n");
  }

  // ======================= 🛠️ Toolbar Rendering =======================
  private renderToolbar(
    toolbar: HTMLElement,
    filterOptions: any[],
    source: string,
    container: HTMLElement,
    ctx: any,
    apiKey: string,
    listWrapper: HTMLElement
  ) {
    // Utility for div creation
    const createDiv = (opts: any = {}) => {
      const el = document.createElement("div");
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
  const defaultIdx = filterOptions.findIndex((f: any) => f.isDefault);
  if (defaultIdx !== -1) initialIndex = defaultIdx;
}
selectedFilterIndex = initialIndex;

    // Before looping, update lastFilterIndex
    lastFilterIndex = selectedFilterIndex;

    // Render all .filter-row elements (buttons)
    filterOptions.forEach((opt, idx) => {
      const filterRow = document.createElement("div");
      filterRow.className = "filter-row";
      filterRow.innerHTML = `<span class="filter-icon"></span><span class="filter-title">${opt.title}</span>`;
      filterRow.setAttribute("data-filter", opt.filter);
      const iconEl = filterRow.querySelector(".filter-icon") as HTMLElement;
      setIcon(iconEl, opt.icon || "star");
      // --- Begin updated badge code with background and count layering ---
      const badge = document.createElement("span");
      badge.className = "filter-badge";

      const badgeBg = document.createElement("span");
      badgeBg.className = "filter-badge-bg";

      const badgeCount = document.createElement("span");
      badgeCount.className = "filter-badge-count";
      // Use localStorage to get the latest count for this filter
          badgeCount.textContent = String(getCountForFilter(String(opt.filter), this.taskCache));

      badge.appendChild(badgeBg);
      badge.appendChild(badgeCount);
      // Assign the background color to the icon container instead
      if (opt.color) {
        filterRow?.style.setProperty('--badge-bg', opt.color);
        badge.style.color = 'white';
      }
      if (iconEl) iconEl.appendChild(badge);
      // --- End badge code ---
      // --- Begin conditional badge display logic ---
      if (idx !== selectedFilterIndex) {
        badge.style.display = "none";
      }
      // --- End conditional badge display logic ---
      if (idx === selectedFilterIndex) {
        filterRow.classList.add("selected");
      }
      // --- PATCH: Use addEventListener for click, with event handling for reading/live preview ---
      filterRow.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Clear selected class from all
        container.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));

        // Mark this one selected
        filterRow.classList.add("selected");

        // Update data-current-filter attribute and always force a re-render, even if the same filter is clicked again
        const todoistBoardEl = container.closest(".todoist-board") as HTMLElement | null;
        if (todoistBoardEl) {
          todoistBoardEl.setAttribute("data-current-filter", String(opt.filter));
// Always force a re-render, even if the same filter is clicked again
this.renderTodoistBoard(todoistBoardEl, `filter: ${String(opt.filter)}`, {}, this.settings.apiKey);
// Update badge in this toolbar only
const scopedBadge = container.querySelector(`.filter-row[data-filter="${String(opt.filter)}"] .filter-badge-count`);
if (scopedBadge) {
  const count = getCountForFilter(String(opt.filter), this.taskCache);
  (scopedBadge as HTMLElement).textContent = String(count);
}
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
    const captureBtn = document.createElement("span");
captureBtn.className = "add-task-btn clickable-icon";
setIcon(captureBtn, "plus-circle");
    captureBtn.title = "Add Task";
    captureBtn.style.marginRight = "6px";
    captureBtn.onclick = () => {
      this.openAddTaskModal();
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
private modalHost: HTMLDivElement | null = null;

private getOrCreateModalHost(): HTMLDivElement {
  if (this.modalHost && document.body.contains(this.modalHost)) return this.modalHost;
  const host = document.createElement("div");
  host.className = "taskmodal-host";
  Object.assign(host.style, {
    position: "fixed",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.35)",
    zIndex: "99999"
  });
  // backdrop close
  host.addEventListener("click", (e) => {
    if (e.target === host) this.closeModal();
  });
  this.modalHost = host;
  return host;
}

private showSkeletonModal(title = "Edit Task"): HTMLDivElement {
  const host = this.getOrCreateModalHost();
  host.innerHTML = "";
  // Outer wrapper matches your CSS scope
const box = document.createElement("div");
box.className = "todoist-edit-task-modal";

const inner = document.createElement("div");
inner.className = "taskmodal-wrapper taskmodal-skeleton";

// keep a minimal inline size so it doesn’t jump
Object.assign(inner.style, {
  minWidth: "min(560px, 92vw)",
  maxWidth: "92vw"
});

inner.innerHTML = `
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
    <div class="modal-title" style="font-weight:600;">${title}</div>
    <div class="spinner" style="margin-left:auto;width:16px;height:16px;border-radius:50%;
      border:2px solid var(--text-muted);border-top-color:transparent;animation:spin .9s linear infinite;"></div>
  </div>
  <div class="skeleton-lines">
    <div style="height:36px;background:var(--background-modifier-border);border-radius:8px;margin-bottom:8px;"></div>
    <div style="height:92px;background:var(--background-modifier-border);border-radius:8px;margin-bottom:8px;"></div>
    <div style="height:36px;background:var(--background-modifier-border);border-radius:8px;margin-bottom:8px;"></div>
  </div>
`;

box.appendChild(inner);
  if (!host.parentElement) document.body.appendChild(host);
  host.appendChild(box);
  return box;
}

private closeModal() {
  if (this.modalHost && this.modalHost.parentElement) {
    this.modalHost.remove();
  }
}

public async openEditTaskModalAsync(taskOrId: string | { id: string }, row?: HTMLElement, filters?: string[]) {
  const taskId = typeof taskOrId === "string" ? taskOrId : String(taskOrId?.id);
  // Phase 1: instant shell
  const box = this.showSkeletonModal("Edit Task");
  const host = this.getOrCreateModalHost();

  // Phase 2: hydrate without blocking first paint
  queueMicrotask(async () => {
    let task = this.taskStore[String(taskId)];

    // background refresh (don’t await)
    const refresh = (async () => {
      try {
        const live = await this.todoistApi.getTask(taskId);
        if (live && live.id) {
          this.taskStore[String(live.id)] = live as any;
          task = live as any;
        }
      } catch {}
    })();

    const fields = {
      title: String(task?.content ?? ""),
      description: String((task as any)?.description ?? ""),
      due: (() => {
        const d = (task as any)?.due;
        return d?.datetime || d?.date || "";
      })(),
      projectId: String((task as any)?.projectId ?? ""),
      labels: Array.isArray((task as any)?.labels) ? (task as any).labels : []
    };

    const contentInner = this.buildTaskModalContent(
      fields,
      "Save",
      async (data) => {
        try {
          // Remember current project before updating fields
const oldProjectId = String((this.taskStore[String(taskId)] ?? task)?.projectId || "");

// 1) Update editable fields (no projectId here)
await this.todoistApi.updateTask(taskId, {
  content: data.title,
  description: data.description,
  dueString: data.due || undefined,
  labels: data.labels
});

// 2) If project changed, move the task using moveTasks
if (data.projectId && String(data.projectId) !== oldProjectId) {
  await this.todoistApi.moveTasks([String(taskId)], { projectId: String(data.projectId) }); // must be separate call
  // keep local copy consistent immediately
  const local = this.taskStore[String(taskId)] ?? task;
  if (local) (local as any).projectId = String(data.projectId);
}

// 3) Re-fetch the task to ensure we have the server-truth
const updated = await this.todoistApi.getTask(taskId);
          if (updated) {
            this.taskStore[String(taskId)] = updated as any;
            // refresh visible boards
            this.refreshAllInlineBoards();
            document.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
              const f = (el as HTMLElement).getAttribute("data-current-filter") || "today";
              const tasks = this.getViewTasks(f);
              this.renderTodoistBoard(el as HTMLElement, `filter: ${f}`, {}, this.settings.apiKey, {
                tasks,
                projects: this.projectCache,
                labels: this.labelCache
              });
            });
          }
        } finally {
          this.closeModal();
        }
      }
    );
// match your CSS scope: .todoist-edit-task-modal .taskmodal-wrapper
const wrapper = document.createElement("div");
wrapper.className = "todoist-edit-task-modal";
const inner = document.createElement("div");
inner.className = "taskmodal-wrapper";
inner.appendChild(contentInner);
wrapper.appendChild(inner);

requestAnimationFrame(() => {
  box.replaceWith(wrapper);
  setTimeout(() => {
    const first = wrapper.querySelector(".taskmodal-title-input") as HTMLInputElement | null;
    first?.focus();
    first?.select?.();
  }, 10);
});

    await refresh;
  });
}

// ======================= ➕ Task Modal Content Builder =======================
  /**
   * Build a .taskmodal element for add/edit task.
   * @param fields - {title, description, due, projectId, labels}
   * @param submitLabel - string for submit button
   * @param onSubmit - callback({title, description, due, projectId, labels})
   * @returns HTMLElement (.taskmodal)
   */
  buildTaskModalContent(
    fields: {
      title?: string;
      description?: string;
      due?: string;
      projectId?: string;
      labels?: string[]; // label names (not ids)
    },
    submitLabel: string,
    onSubmit: (data: {title: string; description: string; due: string; projectId: string; labels: string[]}) => void,
    modal?: any // Pass modal for deferred close logic
  ): HTMLElement {
    // Utility functions with taskmodal- prefix
    const createEl = (tag: string, opts: any = {}) => {
      const el = document.createElement(tag);
      if (opts.cls) el.className = opts.cls;
      if (opts.text) el.textContent = opts.text;
      if (opts.type) (el as any).type = opts.type;
      if (opts.value !== undefined) (el as any).value = opts.value;
      if (opts.attr) for (const k in opts.attr) el.setAttribute(k, opts.attr[k]);
      return el;
    };
    const createDiv = (cls?: string) => {
      if (typeof cls === "string") {
        return createEl("div", { cls });
      }
      return createEl("div");
    };

    // Outer wrapper
    const wrapper = createDiv("taskmodal-wrapper");

    // Title field
    const titleField = createDiv("taskmodal-title-field");
    const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: fields.title ?? "" }) as HTMLInputElement;
    titleInput.placeholder = "Task title";
    titleField.appendChild(titleInput);
    wrapper.appendChild(titleField);

    // Description field
    const descField = createDiv("taskmodal-description-field");
    const descInput = createEl("textarea", { cls: "taskmodal-description-input" }) as HTMLTextAreaElement;
    descInput.placeholder = "Description";
    descInput.value = fields.description ?? "";
    descField.appendChild(descInput);
    wrapper.appendChild(descField);

    // Date row
    const dateField = createDiv("taskmodal-date-field");
    const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
    const dateRow = createDiv("taskmodal-date-input-row");
    const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: fields.due ?? "" }) as HTMLInputElement;
    dueInput.placeholder = "Due date";
    const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
    clearDateBtn.title = "Clear Due Date";
    clearDateBtn.onclick = () => { dueInput.value = ""; };
    dateRow.appendChild(dueInput);
    dateRow.appendChild(clearDateBtn);
    dateField.appendChild(dateLabel);
    dateField.appendChild(dateRow);

    // Project select
    const projectField = createDiv("taskmodal-project-field");
    const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
    const projectSelect = createEl("select", { cls: "taskmodal-project-select" }) as HTMLSelectElement;
    const projects = Array.isArray(this.projectCache) ? this.projectCache : [];
    for (const project of projects) {
      const option = createEl("option") as HTMLOptionElement;
      option.value = project.id;
      option.textContent = project.name;
      if (fields.projectId && project.id == fields.projectId) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    }
    projectField.appendChild(projectLabel);
    projectField.appendChild(projectSelect);

    // --- Group project and date fields into a row ---
    const projectAndDateRow = createDiv("taskmodal-row");
    projectAndDateRow.appendChild(projectField);
    projectAndDateRow.appendChild(dateField);
    wrapper.appendChild(projectAndDateRow);

    // Labels (checkbox list to match edit modal)
    const labelField = createDiv("taskmodal-labels-field");
    const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
    const labelList = createDiv("taskmodal-label-list");
    const labelListData = Array.isArray(this.labelCache)
      ? this.labelCache
      : Array.isArray((this.labelCache as any)?.results)
        ? (this.labelCache as any).results
        : [];

    if (!Array.isArray(labelListData)) {
      // console.warn("labelListData fallback failed", this.labelCache);
    }

    labelListData.forEach((label: any) => {
      const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
      const checkbox = createEl("input", { type: "checkbox", attr: { value: label.name } }) as HTMLInputElement;
      checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
      labelCheckbox.appendChild(checkbox);
      labelCheckbox.append(label.name);
      labelList.appendChild(labelCheckbox);
    });
    labelField.appendChild(labelLabel);
    labelField.appendChild(labelList);
    wrapper.appendChild(labelField);

    // Button row
    const buttonRow = createDiv("taskmodal-button-row");
    const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
    // Cancel action is set by modal logic, not here
    const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: submitLabel });
    saveBtn.onclick = async () => {
      const title = titleInput.value.trim();
      if (!title) return;
      // Close modal immediately for native feel
      if (modal && typeof modal.close === "function") {
        modal.close();
      }
      setTimeout(async () => {
        const description = descInput.value.trim();
        const due = dueInput.value;
        const projectId = projectSelect.value;
        const labels = Array.from(wrapper.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked")).map(input => input.value);
        await onSubmit({ title, description, due, projectId, labels });
      }, 10);
    };
    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(saveBtn);
    wrapper.appendChild(buttonRow);

    // Expose for modal logic: { titleInput, descInput, dueInput, projectSelect }
    (wrapper as any)._fields = {
      titleInput, descInput, dueInput, projectSelect
    };
    (wrapper as any)._cancelBtn = cancelBtn;
    return wrapper;
  }

  // --- Add Task Modal ---
  async openAddTaskModal() {
    const Modal = require("obsidian").Modal;
    const modal = new Modal(this.app);
    modal.containerEl.classList.add("todoist-edit-task-modal");

    const inboxId = this.projectCache?.find((p: any) => p.name === "Inbox")?.id;

    // Open modal immediately for responsiveness
    modal.open();

    // Build content and append after modal is open
    const content = this.buildTaskModalContent(
      {
        title: "",
        description: "",
        due: "",
        projectId: inboxId || undefined,
        labels: []
      },
      "Add Task",
      async ({ title, description, due, projectId, labels }) => {
        // userDueString: the user-provided due string (from modal input)
        const userDueString = due;
        await this.todoistApi.addTask({
          content: title,
          description,
          projectId: projectId || inboxId,
          ...(userDueString
            ? {
                due: {
                  string: userDueString,
                  timezone: this.settings.timezoneMode === "manual"
                    ? this.settings.manualTimezone
                    : null
                }
              }
            : {}),
          ...(labels && labels.length > 0 ? { labels } : {})
        });
        await this.preloadFilters();
        this.app.workspace.trigger("markdown-preview-rendered");
      },
      modal // Pass modal for deferred close logic
    );

    (content as any)._cancelBtn.onclick = () => modal.close();
    modal.contentEl.appendChild(content);
    setTimeout(() => {
      (content as any)._fields.titleInput?.focus();
    }, 10);

    // Defer dropdown/label population for async data after modal is visible
    if (!this.projectCache || !this.labelCache) {
      setTimeout(() => {
        this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
          const rawProjects: Project[] | { results: Project[] } = metadata.projects;
          this.projectCache = Array.isArray(rawProjects)
            ? rawProjects
            : Array.isArray((rawProjects as any)?.results)
              ? (rawProjects as any).results
              : [];
          if (!Array.isArray(this.projectCache)) this.projectCache = [];

          const rawLabels = metadata.labels;
          if (Array.isArray(rawLabels)) {
            this.labelCache = rawLabels;
          } else if (rawLabels && Array.isArray((rawLabels as any).results)) {
            this.labelCache = (rawLabels as any).results;
          } else {
            this.labelCache = [];
          }

          this.projectCacheTimestamp = Date.now();
          this.labelCacheTimestamp = Date.now();

          // If modal is still open, update dropdowns
          const projectSelect = modal.contentEl.querySelector(".taskmodal-project-select") as HTMLSelectElement;
          if (projectSelect && Array.isArray(this.projectCache)) {
            projectSelect.innerHTML = "";
            for (const project of this.projectCache) {
              const option = document.createElement("option");
              option.value = project.id;
              option.textContent = project.name;
              projectSelect.appendChild(option);
            }
          }

          const labelList = modal.contentEl.querySelector(".taskmodal-label-list");
          if (labelList && Array.isArray(this.labelCache)) {
            labelList.innerHTML = "";
            this.labelCache.forEach((label: any) => {
              const labelCheckbox = document.createElement("label");
              labelCheckbox.className = "taskmodal-label-checkbox";
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.value = label.name;
              labelCheckbox.appendChild(checkbox);
              labelCheckbox.append(label.name);
              labelList.appendChild(labelCheckbox);
            });
          }
        });
      }, 10);
    }
  }



  // The createFilterGroup function is now unused in the new filter bar implementation.

// ======================= 👀 Mutation Observer Setup =======================
private setupMutationObserver(container: HTMLElement) {
  const observer = new MutationObserver((mutations) => {
    // You can handle DOM changes if needed
  });

  observer.observe(container, { childList: true, subtree: true });
  // Track observer so it is disconnected on unload
  this._mutationObservers.push(observer);
}

  // ======================= 🔄 Filter Click Handling =======================
  private async handleFilterClick(opt: any, container: HTMLElement, ctx: any, apiKey: string) {
    const cacheTTL = 24 * 60 * 60 * 1000;
    const now = Date.now();
    // --- Render token logic to ensure only latest filter click is processed ---
    const renderToken = Date.now().toString();
    this.currentRenderToken = renderToken;
    const confirmedFilter = opt.filter;
    // --- Always trigger a full re-render, even if filter unchanged and task count same ---
    const local = localStorage.getItem(`todoistTasksCache:${opt.filter}`);
    let localTasks = local ? JSON.parse(local) : [];
    // Render from localStorage first (if available) for instant feedback
    this.taskCache[opt.filter] = localTasks;
    // Fallback: if no localTasks, keep previous cache
    if (!localTasks || localTasks.length === 0) {
      localTasks = this.taskCache[opt.filter] || [];
    }
    this.renderTodoistBoard(container, `filter: ${String(opt.filter)}`, ctx, apiKey, {
      tasks: localTasks,
      sections: [],
      projects: this.projectCache || [],
      labels: this.labelCache || []
    });
    container.setAttribute("data-current-filter", String(opt.filter));

    // Immediately call the manual sync logic (force refresh)
    // --- Use parser for string filters, with timezone support ---
    const tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, String(confirmedFilter));
    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
    // --- Guarded block: check for stale render or filter switch ---
    if (
      this.currentRenderToken !== renderToken ||
      container.getAttribute("data-current-filter") !== confirmedFilter
    ) {
      return;
    }

    this.taskCache[opt.filter] = Array.isArray(tasks) ? tasks : [];
    const badge = document.querySelector(`.filter-row[data-filter="${opt.filter}"] .filter-badge-count`);
    if (badge) badge.textContent = String(Array.isArray(tasks) ? tasks.length : 0);
    this.taskCacheTimestamps[opt.filter] = now;

    localStorage.setItem(`todoistTasksCache:${opt.filter}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
    localStorage.setItem(`todoistTasksCacheTimestamp:${opt.filter}`, String(now));

    this.renderTodoistBoard(container, `filter: ${opt.filter}`, ctx, apiKey, {
      tasks: Array.isArray(tasks) && tasks.length > 0 ? tasks : (this.taskCache[opt.filter] || []),
      sections: [],
      projects: this.projectCache || [],
      labels: this.labelCache || []
    });

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

    const queueWrapper = document.createElement("div");
    queueWrapper.className = "queue-wrapper";
    queueWrapper.appendChild(queueBtn);
    
    return queueWrapper;
  }

  private createSettingsRefreshButtons(container: HTMLElement, source: string, ctx: any, apiKey: string) {
    // Create a hamburger menu button
    const menuBtn = document.createElement("button");
    setIcon(menuBtn, "menu");
    menuBtn.title = "Menu";
    menuBtn.classList.add("icon-button");

    // Create dropdown
    const menuDropdown = document.createElement("div");
    menuDropdown.className = "menu-dropdown hidden";

    // Settings option
    const settingsOption = document.createElement("div");
    // Insert icon span before text
    const settingsIcon = document.createElement("span");
    setIcon(settingsIcon, "settings");
    settingsIcon.style.marginRight = "8px";
    settingsOption.appendChild(settingsIcon);
    settingsOption.className = "menu-dropdown-item";
    settingsOption.onclick = () => {
      menuDropdown.classList.add("hidden");
      this.openSettingsModal();
    };
    // Use append() instead of textContent to avoid overwriting icon
    settingsOption.append("Settings");

    // Manual Sync option
    const syncOption = document.createElement("div");
    // Insert icon span before text
    const syncIcon = document.createElement("span");
    setIcon(syncIcon, "refresh-cw");
    syncIcon.style.marginRight = "8px";
    syncOption.appendChild(syncIcon);
    syncOption.className = "menu-dropdown-item";
    syncOption.onclick = async () => {
      menuDropdown.classList.add("hidden");
      // Manual Sync: Clear cache for the current filter, clear list view, trigger fresh render from API
      const currentFilter = container.getAttribute("data-current-filter") || "";
      // Remove cached tasks and timestamp for current filter
      localStorage.removeItem(`todoistTasksCache:${currentFilter}`);
      localStorage.removeItem(`todoistTasksCacheTimestamp:${currentFilter}`);
      // Find the list wrapper inside the container
      const listWrapper = container.querySelector(".list-wrapper") as HTMLElement;
      if (listWrapper) {
        listWrapper.innerHTML = "";
        const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
        const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
        // --- Fetch and update project/label metadata as part of manual sync ---
        const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = Date.now();
        this.labelCacheTimestamp = Date.now();
        // ---
        this.taskCache[currentFilter] = Array.isArray(tasks) ? tasks : [];
        const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
        if (badge) badge.textContent = String(Array.isArray(tasks) ? tasks.length : 0);
        this.taskCacheTimestamps[currentFilter] = Date.now();
        localStorage.setItem(`todoistTasksCache:${currentFilter}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
        localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));

        const projects = this.projectCache || [];
        const labels = this.labelCache || [];

        this.renderTaskList(listWrapper, `filter: ${currentFilter}`, this.settings.apiKey, {
          tasks: Array.isArray(tasks) ? tasks : [],
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
        this.renderTodoistBoard(container, currentFilterStr, currentFilterStr, this.settings.apiKey);
      }
    };
    // Use append() instead of textContent to avoid overwriting icon
    syncOption.append("Manual Sync");

    menuDropdown.appendChild(settingsOption);
    menuDropdown.appendChild(syncOption);

    const divider = document.createElement("div");
    divider.className = "menu-divider";
    menuDropdown.appendChild(divider);

    const compactOption = document.createElement("div");
    compactOption.className = "menu-dropdown-item";
    const compactIcon = document.createElement("span");
    setIcon(compactIcon, "align-justify");
    compactIcon.style.marginRight = "8px";
    compactOption.appendChild(compactIcon);
    // Set the initial label based on this.compactMode
    compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
    compactOption.prepend(compactIcon);

    compactOption.onclick = () => {
      this.compactMode = !this.compactMode;
      this.settings.compactMode = this.compactMode;
      this.savePluginData();

      // --- PATCH: Update DOM class for compact mode in real-time ---
      const block = document.querySelector(".block-language-todoist-board");
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
        ? document.getElementById("todoist-main-board")?.querySelector(".list-wrapper")
        : container.querySelector(".list-wrapper");
      if (currentBoard) {
        currentBoard.classList.toggle("compact-mode", this.compactMode);

        // Find the correct board container for getting the filter
        const boardContainer = isSidebarBoard
          ? document.getElementById("todoist-main-board")
          : container;
        const currentFilter = boardContainer?.getAttribute("data-current-filter") || "";
        const cachedTasks = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
        const board = boardContainer as HTMLElement;
        if (board) {
          board.innerHTML = "";
          const currentFilterStr = `filter: ${currentFilter}`;
          localStorage.setItem(`todoistTasksCache:${currentFilter}`, JSON.stringify(cachedTasks));
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

    // --- PATCH: Wrap menuDropdown in a menu-dropdown-wrapper to prevent clipping ---
    const menuDropdownWrapper = document.createElement("div");
    menuDropdownWrapper.className = "menu-dropdown-wrapper";
    menuDropdownWrapper.appendChild(menuDropdown);

    // --- Move menuDropdownWrapper outside settingsRefreshWrapper and append to body ---
    // We'll store a reference for event handling.
    document.body.appendChild(menuDropdownWrapper);

    // --- By default, hide the dropdown ---
    menuDropdown.classList.add("hidden");

    // Toggle dropdown on menu button click, position absolutely below the button
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      const rect = menuBtn.getBoundingClientRect();
      menuDropdownWrapper.style.position = "absolute";
      menuDropdownWrapper.style.top = `${rect.bottom + window.scrollY}px`;
      menuDropdownWrapper.style.left = `${rect.left + window.scrollX}px`;
      menuDropdown.classList.toggle("hidden");
    };

    // Hide dropdown on outside click
    // This event listener is global and should be cleaned up if needed
    // (Consider registering and removing if you want to be extra clean)
    document.addEventListener("click", (e) => {
      if (!menuDropdown.classList.contains("hidden")) {
        menuDropdown.classList.add("hidden");
      }
    });

    // Prevent click inside dropdown from closing  it
    menuDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // --- Only the menuBtn is inside the wrapper now ---
    const settingsRefreshWrapper = document.createElement("div");
    settingsRefreshWrapper.className = "settings-refresh-wrapper";
    settingsRefreshWrapper.appendChild(menuBtn);
    // menuDropdownWrapper is now outside, not appended here

    // PATCH: Use the container argument instead of querying for .todoist-board
    // Find and replace:
    // const board = document.querySelector(".todoist-board") as HTMLElement;
    // with:
    // const board = container;

    // (This block is in compactOption.onclick)
    // Find the currentBoard and update as before, but use container directly for re-render
    // (No changes needed to the rest of the logic, as container is already passed and used)

    return settingsRefreshWrapper;
  }

  private createRefreshButton(container: HTMLElement, source: string, ctx: any, apiKey: string) {
    const refreshBtn = document.createElement("button");
    refreshBtn.type = "button";
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.title = "Force refresh cache";
    refreshBtn.classList.add("icon-button", "refresh-btn");

    refreshBtn.onclick = () => {
      requestAnimationFrame(() => {
        refreshBtn.classList.add("syncing");
        const selectedRow = document.querySelector(".filter-row.selected") as HTMLElement;
        selectedRow?.classList.add("syncing");

        requestAnimationFrame(async () => {
          await this.preloadFilters();
          setTimeout(() => {
            refreshBtn.classList.remove("syncing");
            selectedRow?.classList.remove("syncing");
            this.renderTodoistBoard(container, source, ctx, apiKey);
          }, 4000); // Delay to allow animation to register
        });
      });
    };

    return refreshBtn;
  }

  private createSettingsButton() {
    const settingsBtn = document.createElement("span");
    setIcon(settingsBtn, "settings")
    settingsBtn.title = "Edit toolbar filters";
    settingsBtn.className = "icon-button";
    
    settingsBtn.onclick = () => this.openSettingsModal();
    
    return settingsBtn;
  }

  private async openSettingsModal() {
    let Modal;
    try {
      ({ Modal } = await import("obsidian"));
    } catch (e) {
      Modal = require("obsidian").Modal;
    }

    const modal = new Modal(this.app);
    modal.containerEl.classList.add("settings-modal", "todoist-settings-modal");
    modal.titleEl.setText("Customize Toolbar Filters");

    if (!this.settings.filters) this.settings.filters = [];
    if (this.settings.filters.length === 0) {
      this.settings.filters.push({ icon: "⭐", filter: "today", title: "Today" });
    }

    // --- Table-based settings UI ---
    const renderSettingsUI = () => {
      const c = modal.contentEl;
      c.empty();

      const table = c.createEl("table", { cls: "settings-filter-table" });

      const thead = table.createEl("thead");
      const headRow = thead.createEl("tr");
      ["Icon", "Title", "Filter", "Default", "Delete", "Reorder"].forEach(text => {
        headRow.createEl("th", { text });
      });

      const tbody = table.createEl("tbody");

      // --- Helper to render a single filter row ---
      const renderFilterRow = (
        f: { icon: string; title: string; filter: string; isDefault?: boolean },
        idx: number
      ) => {
        const thisFilter = this.settings.filters![idx];
        const row = tbody.createEl("tr");

        // Icon picker trigger and popup
        const iconCell = row.createEl("td");
        // Trigger div
        const iconTrigger = iconCell.createDiv({ cls: "icon-trigger" });
        iconTrigger.innerHTML = "";
        setIcon(iconTrigger, f.icon || "star");
        iconTrigger.style.cursor = "pointer";
        iconTrigger.style.fontSize = "1.6em";
        iconTrigger.style.border = "1px solid #ccc";
        iconTrigger.style.borderRadius = "6px";
        iconTrigger.style.width = "36px";
        iconTrigger.style.height = "36px";
        iconTrigger.style.display = "flex";
        iconTrigger.style.alignItems = "center";
        iconTrigger.style.justifyContent = "center";
        iconTrigger.style.position = "relative";

        // Picker wrapper (popup)
        const iconPickerWrapper = iconCell.createDiv({ cls: "icon-picker-wrapper" });
        iconPickerWrapper.classList.remove("visible");
        // --- Scroll styling for icon picker ---
        iconPickerWrapper.style.maxHeight = "160px";
        iconPickerWrapper.style.overflowY = "auto";

        // --- Color Picker Row ---
        const colorRow = iconPickerWrapper.createDiv({ cls: "icon-color-row" });
        // 24 handpicked, aesthetically pleasing and commonly used colors
        const colors = [
          "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#339AF0",
          "#22B8CF", "#20C997", "#51CF66", "#94D82D", "#FCC419", "#FF922B",
          "#FF6B00", "#FFD43B", "#A9E34B", "#69DB7C", "#38D9A9", "#4DABF7",
          "#748FFC", "#9775FA", "#DA77F2", "#F783AC", "#FF8787", "#FF9F40"
        ];
        colors.forEach(color => {
          const swatch = document.createElement("div");
          swatch.className = "icon-color-swatch";
          swatch.style.background = color;
          swatch.onclick = () => {
            iconTrigger.querySelector("svg")?.setAttribute("stroke", color);
            thisFilter.color = color;
          };
          colorRow.appendChild(swatch);
        });
        // Add a final "custom" swatch (color input)
        const customColor = document.createElement("input");
        customColor.type = "color";
        customColor.className = "icon-color-picker";
        customColor.style.padding = "0";
        customColor.style.border = "2px solid #ccc";
        customColor.style.background = "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)";
        customColor.style.cursor = "pointer";
        customColor.oninput = () => {
          iconTrigger.querySelector("svg")?.setAttribute("stroke", customColor.value);
          thisFilter.color = customColor.value;
        };
        colorRow.appendChild(customColor);

        // Use extended Obsidian icon set for icon picker (100 icons)
        const obsidianIcons = [
          "check", "calendar", "star", "heart", "search", "plus", "trash", "pencil", "folder", "document",
          "file-plus", "anchor", "zap", "settings", "book-open", "box", "bug", "camera", "cast", "cloud",
          "command", "compass", "database", "download", "eye", "flag", "globe", "image", "key", "layers",
          "link", "list", "lock", "map", "mic", "moon", "music", "pause", "phone", "refresh-cw", "save",
          "scissors", "send", "share", "shield", "shopping-cart", "sliders", "sun", "terminal", "thumbs-up",
          "toggle-left", "trash-2", "trending-up", "upload", "user", "video", "watch", "wifi", "x-circle",
          "alarm-clock", "bell", "briefcase", "clipboard", "coffee", "credit-card", "disc", "dollar-sign",
          "edit-2", "fast-forward", "file-text", "film", "gift", "hand", "home", "inbox", "info", "layout",
          "lightbulb", "list-checks", "loader", "log-in", "log-out", "menu", "message-circle", "navigation",
          "notebook", "package", "palette", "paperclip", "play", "printer", "repeat", "rss", "server", "shopping-bag",
          "sidebar", "smile", "timer", "target", "toggle-right", "swords", "truck", "umbrella", "wallet", "zap-off"
        ];

        // Move colorRow to the top of the picker UI (before icon grid)
        iconPickerWrapper.appendChild(colorRow);

        obsidianIcons.forEach(iconName => {
          const iconBtn = document.createElement("span");
          iconBtn.className = "icon-grid-btn";
          setIcon(iconBtn, iconName);
          iconBtn.title = iconName;

          if (f.icon === iconName) iconBtn.classList.add("selected");

          iconBtn.onclick = (e) => {
            e.preventDefault();
            thisFilter.icon = iconName;
            iconTrigger.innerHTML = "";
            setIcon(iconTrigger, iconName);
            iconPickerWrapper.classList.remove("visible");
            iconPickerWrapper.querySelectorAll(".icon-grid-btn").forEach((b: HTMLElement) => b.classList.remove("selected"));
            iconBtn.classList.add("selected");
          };

          iconPickerWrapper.appendChild(iconBtn);
        });

        iconTrigger.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          // Close all other pickers
          document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
            if (el !== iconPickerWrapper) el.classList.remove("visible");
          });

          // Toggle this one
          iconPickerWrapper.classList.toggle("visible");
        };

        // Title input
        const titleCell = row.createEl("td");
        const titleInput = titleCell.createEl("input", { type: "text" });
        titleInput.value = f.title || "";
        titleInput.oninput = () => f.title = titleInput.value;

        // Filter input
        const filterCell = row.createEl("td");
        const filterInput = filterCell.createEl("input", { type: "text" });
        // Always display valid JSON for the filter input
        filterInput.value = typeof f.filter === "string" ? f.filter : JSON.stringify(f.filter ?? {});
        filterInput.oninput = () => {
          // No assignment here; handled on save
          // Optionally, you could live-parse and validate, but we only validate on save
        };

        // Default radio
        const defaultCell = row.createEl("td");
        const defaultInput = defaultCell.createEl("input", { type: "radio" });
        defaultInput.name = "default-filter";
        defaultInput.checked = !!f.isDefault;
        defaultInput.onchange = () => {
          this.settings.filters!.forEach((_, i) => this.settings.filters![i].isDefault = (i === idx));
        };

        // Delete button
        const deleteCell = row.createEl("td");
        const deleteBtn = deleteCell.createEl("button");
        setIcon(deleteBtn, "trash-2");
        deleteBtn.querySelector("svg")?.removeAttribute("fill"); // Ensure it's stroke-only
        deleteBtn.className = "icon-button";
        deleteBtn.onclick = () => {
          this.settings.filters!.splice(idx, 1);
          row.remove(); // Just remove the row instead of rerendering everything
        };

        // Reorder buttons (up/down)
        const reorderCell = row.createEl("td");
        const upBtn = reorderCell.createEl("button", { text: "↑" });
        const downBtn = reorderCell.createEl("button", { text: "↓" });

        upBtn.onclick = () => {
          if (idx > 0) {
            const temp = this.settings.filters![idx];
            this.settings.filters![idx] = this.settings.filters![idx - 1];
            this.settings.filters![idx - 1] = temp;
            renderSettingsUI();
          }
        };

        downBtn.onclick = () => {
          if (idx < this.settings.filters!.length - 1) {
            const temp = this.settings.filters![idx];
            this.settings.filters![idx] = this.settings.filters![idx + 1];
            this.settings.filters![idx + 1] = temp;
            renderSettingsUI();
          }
        };

        row.appendChild(reorderCell);
      };

      // Render all filter rows
      this.settings.filters!.forEach((f, idx) => {
        renderFilterRow(f, idx);
      });

      // Add button
      const addRow = c.createEl("div", { cls: "settings-action-row" });
      const addBtn = addRow.createEl("button", { text: "➕ Add Filter" });
      addBtn.onclick = () => {
        const newFilter = { icon: "❔", title: "", filter: "" };
        this.settings.filters!.push(newFilter);
        renderFilterRow(newFilter, this.settings.filters!.length - 1);
      };

      // Save and Clear buttons
      const saveRow = c.createEl("div", { cls: "settings-save-row" });
      const saveBtn = saveRow.createEl("button", { text: "Save" });
      saveBtn.onclick = async () => {
        // Allow any string filter without validating JSON format
        // The filter input fields are in the table; find them
        const filterRows = Array.from(modal.contentEl.querySelectorAll("tbody tr"));
        filterRows.forEach((row, i) => {
          const filterRow = row as HTMLTableRowElement;
          const filterInput = filterRow.querySelector("td:nth-child(3) input");
          if (!filterInput) return;
          const filterInputValue = (filterInput as HTMLInputElement).value.trim();
          // Accept string as-is, or parse JSON if possible
          try {
            this.settings.filters![i].filter = JSON.parse(filterInputValue);
          } catch {
            this.settings.filters![i].filter = filterInputValue;
          }
        });

        if (!this.settings.filters!.some(f => f.isDefault)) {
          this.settings.filters![0].isDefault = true;
        }
        // Ensure the filters array is updated (including color)
        this.settings.filters = [...this.settings.filters!];
        await this.savePluginData();

        // Reset filter index state to reflect the first/default filter after changes
        selectedFilterIndex = 0;
        lastFilterIndex = 0;

        // Optionally trigger markdown rendering again
        this.app.workspace.trigger("markdown-preview-rendered");

        // --- PATCH: Force all todoist-board containers to rerender before closing modal ---
        document.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
          const container = el as HTMLElement;
          const source = container.getAttribute("data-current-filter") || "";
          container.innerHTML = "";
          this.renderTodoistBoard(container, source, {}, (this.settings && this.settings.apiKey) || "");
        });

        modal.close();

        // After closing the modal, force rerender of all matching code blocks after a slight delay
        setTimeout(() => {
          const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
          markdownEls.forEach((el) => {
            const pre = el.parentElement!;
            const container = document.createElement("div");
            pre.replaceWith(container);
            const source = el.textContent?.trim() || "";
            this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
          });
        }, 100);
      };

      const clearCacheBtn = saveRow.createEl("button");
      clearCacheBtn.style.padding = "6px 6px";
      clearCacheBtn.style.marginTop = "4px";
      const iconSpan = document.createElement("span");
      iconSpan.style.marginRight = "6px";
      setIcon(iconSpan, "x-circle");
      clearCacheBtn.appendChild(iconSpan);
      clearCacheBtn.append("Clear Cache");
      clearCacheBtn.onclick = () => {
        // Only clear task/project/label caches, not UI/layout or icon settings
        for (const key in localStorage) {
          if (
            key.startsWith("todoistTasksCache:") ||
            key.startsWith("todoistTasksCacheTimestamp:") ||
            key.startsWith("todoistProjectsCache") ||
            key.startsWith("todoistLabelsCache")
          ) {
            localStorage.removeItem(key);
          }
        }
        // Notification to user (Obsidian-compatible, fallback-safe)
        // @ts-ignore
        new (window as any).Notice("Todoist task cache cleared. Plugin will re-fetch data.");
      };
      // After saveRow is created and appended, add the global click handler for icon picker wrappers
      modal.containerEl.addEventListener("mousedown", (e: MouseEvent) => {
        document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
          const trigger = el.previousElementSibling;
          if (!el.contains(e.target as Node) && !trigger?.contains(e.target as Node)) {
            el.classList.remove("visible");
          }
        });
      });
    };

    renderSettingsUI();
    modal.open();
  }

  // ======================= 📋 Task List Rendering =======================
  private async renderTaskList(listWrapper: HTMLElement, source: string, apiKey: string, preloadData?: { tasks: any[]; projects: any[]; labels: any[] }) {
    const match = source.match(/filter:\s*(.*)/);
    const filters = match
      ? match[1].split(",").map(f => f.trim())
      : ["today", "overdue", "next 7 days", "inbox"];

    // --- PATCH: preloadData block ---
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
      const projectMap = Object.fromEntries(projectList.map((p: Project) => [p.id, p.name]));
      const labelMap = Object.fromEntries((labelList ?? []).map((l: Label) => [l.id, l.name]));
      const labelColorMap = Object.fromEntries((labelList ?? []).map((l: Label) => [l.id, l.color]));

      const orderKey = `todoistBoardOrder:${filters.join(",")}`;
      const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
      
      tasks.sort((a: any, b: any) => {
        const idxA = savedOrder.indexOf(a.id);
        const idxB = savedOrder.indexOf(b.id);
        return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
               (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
      });

      // --- Group subtasks by parentId ---
      const taskList: Task[] = Array.isArray(tasks) ? tasks : [];
      const subtasksByParentId: Record<string, Task[]> = {};
      taskList.forEach((task: Task) => {
        if (task.parentId) {
          if (!subtasksByParentId[task.parentId]) subtasksByParentId[task.parentId] = [];
          subtasksByParentId[task.parentId].push(task);
        }
      });

      // --- Only render parent tasks and their subtasks ---
      taskList.map((task: Task) => {
        if (task.parentId) return; // skip subtasks in top-level loop
        // --- Get project info using projectMap (by id) ---
        const project = this.projectMap.get(String(task.projectId));
        // Debug logs for mapping task to project
        // if (this.settings?.enableLogs) console.log(`🔍 Task ${task.id} → Project ID: ${task.projectId}`);
        // if (this.settings?.enableLogs) console.log("📘 Mapped project:", project);
        const projectName = project ? project.name : "Unknown Project";
        // Use string key for color mapping
        let projectColor = "#808080";
        if (project && typeof project.color !== "undefined") {
          projectColor = TODOIST_COLORS[project.color as keyof typeof TODOIST_COLORS] || "#808080";
        }
        if (task.content?.trim().startsWith("* ")) {
          const clonedTask = { ...task, content: task.content.trim().substring(2) };
          const row = this.createTaskRow(
            clonedTask, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters
          );
          // Set project name/color in rendering logic (if used in createTaskRow)
          row.classList.add("non-task-note");
          this.setupTaskDragAndDrop(row, listWrapper, filters);
          listWrapper.appendChild(row);
          return;
        }
        const row = this.createTaskRow(
          task, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters
        );
        // --- PATCH: Set project name and color as data attributes for use in createTaskRow or CSS ---
        row.setAttribute("data-project-name", projectName);
        row.setAttribute("data-project-color", projectColor);
        // Only setup drag-and-drop for parent tasks
        this.setupTaskDragAndDrop(row, listWrapper, filters);
        listWrapper.appendChild(row);

        // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
        let allSubtasks: Task[] = [];
        try {
          allSubtasks = Object.values(this.taskCache).flat().filter((t: Task) => t.parentId === task.id);
        } catch (err) {
          console.error("Error flattening taskCache for subtasks", err);
        }
        const subtasks: Task[] = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
        // --- Render subtasks directly nested inside parent row, INSIDE task-content-wrapper ---
        if (Array.isArray(subtasks) && subtasks.length > 0) {
          const subtaskWrapper = document.createElement("div");
          subtaskWrapper.className = "subtask-wrapper";
          for (const sub of subtasks) {
            const subProject = this.projectMap.get(sub.projectId);
            const subProjectName = subProject ? subProject.name : "Unknown Project";
            let subProjectColor = "#808080";
            if (subProject && typeof subProject.color !== "undefined") {
              subProjectColor = TODOIST_COLORS[subProject.color as keyof typeof TODOIST_COLORS] || "#808080";
            }
            const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
            subRow.classList.add("subtask-row");
            subRow.setAttribute("data-project-name", subProjectName);
            subRow.setAttribute("data-project-color", subProjectColor);

            // Clean up subtask UI (remove metadata, chin, description)
            const meta = subRow.querySelector(".task-metadata");
            if (meta) meta.remove();

            const desc = subRow.querySelector(".task-description");
            if (desc) desc.remove();

            const chin = subRow.querySelector(".fixed-chin");
            if (chin) chin.remove();

            subtaskWrapper.appendChild(subRow);
          }
          // PATCH: Insert into task-content-wrapper if exists, else fallback to row
          const contentWrapper = row.querySelector('.task-content-wrapper');
          if (contentWrapper) {
            contentWrapper.appendChild(subtaskWrapper);
          } else {
            row.appendChild(subtaskWrapper);
          }
        }
      });
      // --- Insert empty quote if no tasks ---
      if (taskList.length === 0) {
        const quoteDiv = document.createElement("div");
        quoteDiv.className = "empty-filter";
        quoteDiv.textContent = "No tasks found for this filter.";
        listWrapper.appendChild(quoteDiv);
      }
      return;
    }

    const now = Date.now();
    const cacheTTL = 24 * 60 * 60 * 1000;

    let projects: any[] = [];
    let labels: any[] = [];
    let metadata: { projects: any[], sections: any[], labels: any[] };
    
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

    let tasks: any[] = [];
    const filter = filters[0];
    const taskTimestamp = this.taskCacheTimestamps[filter] || 0;
    const useCache = this.taskCache[filter] && (now - taskTimestamp < cacheTTL);
    
    if (useCache) {
      tasks = this.taskCache[filter];
    } else {
      // PATCH: check if filter is empty or invalid, fallback to all tasks if so
      const query = filter?.trim();
      let tasksResponse;
      if (query) {
        tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, query);
      } else {
        // fallback to all tasks
        tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, {});
      }
      tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
      this.taskCache[filter] = Array.isArray(tasks) ? tasks : [];
      this.taskCacheTimestamps[filter] = now;
    }

    const projectMap = Array.isArray(projects)
      ? Object.fromEntries((projects as Project[]).map((p: Project) => [p.id, p.name]))
      : {};
    const labelMap = Array.isArray(labels)
      ? Object.fromEntries(((labels ?? []) as Label[]).map((l: Label) => [l.id, l.name]))
      : {};
    const labelColorMap = Array.isArray(labels)
      ? Object.fromEntries(((labels ?? []) as Label[]).map((l: Label) => [l.id, l.color]))
      : {};

    const orderKey = `todoistBoardOrder:${filters.join(",")}`;
    const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
    
    const taskList: Task[] = Array.isArray(tasks) ? tasks : [];
    taskList.sort((a: Task, b: Task) => {
      const idxA = savedOrder.indexOf(a.id);
      const idxB = savedOrder.indexOf(b.id);
      return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
             (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
    });

    // --- Group subtasks by parentId for non-preloadData path ---
    const subtasksByParentId: Record<string, Task[]> = {};
    taskList.map((task: Task) => {
      if (task.parentId) {
        if (!subtasksByParentId[task.parentId]) subtasksByParentId[task.parentId] = [];
        subtasksByParentId[task.parentId].push(task);
      }
    });

    // Removed local date comparison due to timezone mismatch issues (see GitHub issue #timezone-bug)
    // If any previous logic filtered tasks based on local date (e.g., new Date(task.due.date)), it is now removed.

    // --- Only render parent tasks and their subtasks, do not filter by local date ---
    taskList.map((task: Task) => {
      // Do not skip tasks based on local date comparison
      if (task.parentId) return; // skip subtasks in top-level loop
      if (task.content?.trim().startsWith("* ")) {
        const clonedTask = { ...task, content: task.content.trim().substring(2) };
        const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
        row.classList.add("non-task-note");
        this.setupTaskDragAndDrop(row, listWrapper, filters);
        listWrapper.appendChild(row);
        return;
      }
      const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
      // Only setup drag-and-drop for parent tasks
      this.setupTaskDragAndDrop(row, listWrapper, filters);
      listWrapper.appendChild(row);

      // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
      let allSubtasks: Task[] = [];
      try {
        allSubtasks = Object.values(this.taskCache).flat().filter((t: Task) => t.parentId === task.id);
      } catch (err) {
        console.error("Error flattening taskCache for subtasks", err);
      }
      const subtasks: Task[] = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
      // --- Render subtasks directly nested inside parent row ---
      if (Array.isArray(subtasks) && subtasks.length > 0) {
        const subtaskWrapper = document.createElement("div");
        subtaskWrapper.className = "subtask-wrapper";
        for (const sub of subtasks) {
          const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
          subRow.classList.add("subtask-row");

          // Clean up subtask UI (remove metadata, chin, description)
          const meta = subRow.querySelector(".task-metadata");
          if (meta) meta.remove();

          const desc = subRow.querySelector(".task-description");
          if (desc) desc.remove();

          const chin = subRow.querySelector(".fixed-chin");
          if (chin) chin.remove();

          subtaskWrapper.appendChild(subRow);
        }
        row.appendChild(subtaskWrapper);
      }
    });
    // --- Insert empty quote if no tasks ---
    if (taskList.length === 0) {
      const quoteDiv = document.createElement("div");
      quoteDiv.className = "empty-filter";
      quoteDiv.textContent = "No tasks found for this filter.";
      listWrapper.appendChild(quoteDiv);
    }

    try {
      if (source && source.trim().startsWith("filter:")) {
        localStorage.setItem("todoistBoardLastFilter", source.trim());
      }
    } catch(e) {}
  }

  // ======================= 🧩 Task Row Creation =======================
  private createTaskRow(
    task: any,
    projectMap: Record<string, string>,
    labelMap: Record<string, string>,
    labelColorMap: Record<string, string>,
    projects: any[],
    apiKey: string,
    listWrapper: HTMLElement,
    filters: string[]
  ): HTMLElement {
    const row = document.createElement("div");
    // --- PATCH: Apply .non-task-note class if original content starts with "* " ---
    if (task.content?.trim().startsWith("* ")) {
      row.classList.add("non-task-note");
    }
    row.classList.add("task");
    row.dataset.id = task.id;
    // PATCH: Set the row id to the task id for later DOM removal
    row.id = task.id;
    // Set project color CSS variable
    row.style.setProperty("--project-color", getProjectHexColor(task, projects));

    // --- PATCH: Add "parent-task" class if task has children (by parentId) ---
    const hasChildren = Object.values(this.taskCache).flat().some((t: any) => t.parentId === task.id);
    if (hasChildren) {
      row.classList.add("parent-task");
    }

    // --- PATCH: Add repeating task icon if task is recurring ---
    const isRepeating = !!task.due?.is_recurring;
    if (isRepeating) {
      const repeatIcon = document.createElement("span");
      repeatIcon.classList.add("repeat-icon");
      setIcon(repeatIcon, "repeat");
      row.appendChild(repeatIcon);
    }

    // --- PATCH: Replace task-inner with scroll wrapper and fixed chin ---
    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "task-scroll-wrapper";

    const taskInner = document.createElement("div");
    taskInner.className = "task-inner";

    const fixedChin = document.createElement("div");
    fixedChin.className = "fixed-chin";

    scrollWrapper.appendChild(taskInner);
    scrollWrapper.appendChild(fixedChin);

    // Determine if this is a non-task note (content starts with '* ')
    const isNote = task.content?.trim().startsWith("* ");

    if (isNote) {
      const noteContent = document.createElement("div");
      noteContent.className = "task-content";
      const titleSpan = document.createElement("span");
      titleSpan.className = "task-title";
      titleSpan.textContent = task.content.trim().substring(2);
      noteContent.appendChild(titleSpan);
      taskInner.appendChild(noteContent);
      row.appendChild(scrollWrapper);
    } else {
      this.setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters);

      const rowCheckbox = this.createPriorityCheckbox(task.priority, async () => {
        if (rowCheckbox.checked) {
          await this.completeTask(task.id);
          const taskRow = document.getElementById(task.id);
          if (taskRow) taskRow.remove();
          await this.savePluginData();
          this.handleQueueCompletion(listWrapper);
        }
      });
      rowCheckbox.classList.add(`priority-${task.priority}`);
      // PATCH: Move checkbox out of .task-inner and into .task before scrollWrapper
      row.appendChild(rowCheckbox);

      row.appendChild(scrollWrapper);

      const left = this.createTaskContent(task, projectMap, labelMap, labelColorMap, projects);
      taskInner.appendChild(left);
      // const deadline = this.createTaskDeadline(task);
      // row.appendChild(deadline);
      // this used to be the old right-hand side deadline, now will in the WHEN row
    }
    return row;
  }
  
  private setupTaskInteractions(
    row: HTMLElement, 
    task: any, 
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

      // --- Subtask expand/collapse logic ---
      if (row.classList.contains("subtask-row")) {
        const alreadyExpanded = row.classList.contains("expanded-subtask");

        document.querySelectorAll(".subtask-row.expanded-subtask").forEach(el => {
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

  private handleTaskSelection(row: HTMLElement, task: any, apiKey: string, event?: Event) {
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
    document.querySelectorAll('.task').forEach(t => {
      t.classList.add('no-transition');
      if (!t.classList.contains('selected-task')) {
        t.classList.add('freeze-transition');
      }
    });

    // Updated deselection logic to allow simultaneous deselect and select transitions
    document.querySelectorAll(".selected-task").forEach(el => {
      if (el !== row) {
        el.classList.add("task-deselecting");
        el.classList.remove("selected-task");

        setTimeout(() => {
          el.classList.remove("task-deselecting");

          const titleSpan = el.querySelector(".task-title") as HTMLElement;
          const rowCheckbox = el.querySelector("input[type='checkbox']") as HTMLElement;
          const metaSpan = el.querySelector(".task-metadata") as HTMLElement;
          const desc = el.querySelector(".task-description");

          if (titleSpan) titleSpan.classList.remove("task-title-selected");
          if (rowCheckbox) rowCheckbox.classList.remove("task-checkbox-selected");
          if (metaSpan) metaSpan.classList.remove("task-meta-selected");
          if (desc) desc.classList.remove("show-description");

          const toolbar = document.getElementById("mini-toolbar");
          if (toolbar) toolbar.remove();
        }, 300);
      }
    });

    // Apply new selection immediately
    row.classList.add("selected-task");

    if (row.classList.contains("selected-task")) {
      this.selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey);
      // Remove transition classes after selecting the new task
      requestAnimationFrame(() => {
        document.querySelectorAll('.task').forEach(t => {
          t.classList.remove('no-transition');
          t.classList.remove('freeze-transition');
        });
      });
    } else {
      this.deselectTask(row);
      // Remove transition classes after frame if deselecting
      requestAnimationFrame(() => {
        document.querySelectorAll('.task').forEach(t => {
          t.classList.remove('no-transition');
          t.classList.remove('freeze-transition');
        });
      });
    }
  }

  // ======================= ✴️ Task Selection Logic =======================
  private selectTask(
    row: HTMLElement, 
    task: any, 
    titleSpan: HTMLElement, 
    rowCheckbox: HTMLElement, 
    metaSpan: HTMLElement,
    apiKey: string
  ) {
    titleSpan.classList.add("task-title-selected");
    rowCheckbox.classList.add("task-checkbox-selected");
    metaSpan.classList.add("task-meta-selected");
    
    row.classList.add("selected-task");
    // Removed code that adds .show-description to .task-description
    
    this.createMiniToolbar(row, task, apiKey);
    // No dynamic transform here; handled by CSS.
  }

  private deselectTask(row: HTMLElement) {
    // row.classList.add("task-deselecting"); // Removed as per instructions

    const toolbar = document.getElementById("mini-toolbar");
    if (toolbar) toolbar.remove();

    setTimeout(() => {
      row.classList.remove("selected-task", "task-deselecting");

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
  private createMiniToolbar(row: HTMLElement, task: any, apiKey: string) {
    const oldWrapper = document.getElementById("mini-toolbar-wrapper");
    if (oldWrapper) oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "mini-toolbar-wrapper";
    wrapper.className = "mini-toolbar-wrapper fixed-chin";

    const chinContainer = document.createElement("div");
    chinContainer.className = "chin-inner";

    // Today button
    const todayBtn = document.createElement("button");
    todayBtn.className = "chin-btn today-btn";
    setIcon(todayBtn, "calendar");
    todayBtn.append("Today");
    todayBtn.setAttribute("data-index", "0");
    todayBtn.onclick = () => this.setTaskToToday(task.id, apiKey, chinContainer, todayBtn);
    // Add date subtitle after SVG icon
    const subtitle = document.createElement("p");
    subtitle.className = "date-subtitle";
    // Show today's date as just the day of the month
    subtitle.textContent = String(new Date().getDate());
    todayBtn.appendChild(subtitle);
    chinContainer.appendChild(todayBtn);

    // Tomorrow button
    const tmrwBtn = document.createElement("button");
    tmrwBtn.className = "chin-btn tomorrow-btn";
    setIcon(tmrwBtn, "sunrise");
    tmrwBtn.append("Tmrw");
    tmrwBtn.setAttribute("data-index", "1");
    tmrwBtn.onclick = () => this.deferTask(task.id, apiKey, chinContainer);
    chinContainer.appendChild(tmrwBtn);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "chin-btn edit-btn";
    setIcon(editBtn, "pencil");
    editBtn.append("Edit");
    editBtn.setAttribute("data-index", "2");
    editBtn.onclick = () => {
      let filters: string[] = [];
      const board = row.closest(".todoist-board");
      if (board && board.hasAttribute("data-current-filter")) {
        filters = [board.getAttribute("data-current-filter")!];
      }
      if (!filters.length) filters = ["today"];
      this.openEditTaskModal(task, row, filters);
    };
    chinContainer.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "chin-btn delete-btn";
    setIcon(deleteBtn, "trash");
    deleteBtn.setAttribute("data-index", "3");
    deleteBtn.onclick = () => this.deleteTask(task.id, apiKey, chinContainer);
    chinContainer.appendChild(deleteBtn);

    wrapper.appendChild(chinContainer);
    row.appendChild(wrapper);

    wrapper.addEventListener("click", (e) => e.stopPropagation());
  }

  // ======================= ✏️ Edit Task Modal =======================
  // --- Edit Task Modal ---
  openEditTaskModal(task: any, row: HTMLElement, filters: string[]) {
    // At the very start, replace task with latest version from localStorage if available
    const currentFilter = filters.join(",");
    const cachedTasksKey = `todoistTasksCache:${currentFilter}`;
    const cachedTasks = JSON.parse(localStorage.getItem(cachedTasksKey) || "[]");
    const latestTask = cachedTasks.find((t: any) => t.id === task.id);
    if (latestTask) task = latestTask;
    // Utility functions with taskmodal- prefix
    const createEl = (tag: string, opts: any = {}) => {
      const el = document.createElement(tag);
      if (opts.cls) el.className = opts.cls;
      if (opts.text) el.textContent = opts.text;
      if (opts.type) (el as any).type = opts.type;
      if (opts.value !== undefined) (el as any).value = opts.value;
      if (opts.attr) for (const k in opts.attr) el.setAttribute(k, opts.attr[k]);
      return el;
    };
    const createDiv = (cls?: string) => {
      if (typeof cls === "string") {
        return createEl("div", { cls });
      }
      return createEl("div");
    };

    // Modal from Obsidian
    let Modal;
    try {
      ({ Modal } = require("obsidian"));
    } catch (e) {
      Modal = (window as any).Modal;
    }
    const modal = new Modal(this.app);
    modal.containerEl.classList.add("todoist-edit-task-modal", "todoist-modal");

    // --- Ensure project and label metadata is loaded before building dropdown ---
    (async () => {
      if (!this.projectCache || this.projectCache.length === 0) {
        const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
      }
      // After preloading filters, update badge count for current filter
      await this.preloadFilters();
      const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
      const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
      if (badge) {
        const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
        badge.textContent = String(cache.length);
      }

      // Outer wrapper
      const wrapper = createDiv("taskmodal-wrapper");

      // Title field
      const titleField = createDiv("taskmodal-title-field");
      const titleLabel = createEl("label", { cls: "taskmodal-label", text: "Task Title" });
      const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: task.content }) as HTMLInputElement;
      titleField.appendChild(titleLabel);
      titleField.appendChild(titleInput);
      wrapper.appendChild(titleField);

      // Description field
      const descField = createDiv("taskmodal-description-field");
      const descLabel = createEl("label", { cls: "taskmodal-label", text: "Description" });
      const descInput = createEl("textarea", { cls: "taskmodal-description-input" }) as HTMLTextAreaElement;
      descInput.value = task.description ?? "";
      descField.appendChild(descLabel);
      descField.appendChild(descInput);
      wrapper.appendChild(descField);

      // Date row
      const dateField = createDiv("taskmodal-date-field");
      const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
      const dateRow = createDiv("taskmodal-date-input-row");
      const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: task.due?.date ?? "" }) as HTMLInputElement;
      const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
      clearDateBtn.title = "Clear Due Date";
      clearDateBtn.onclick = () => { dueInput.value = ""; };
      dateRow.appendChild(dueInput);
      dateRow.appendChild(clearDateBtn);
      dateField.appendChild(dateLabel);
      dateField.appendChild(dateRow);

      // Project select
      const projectField = createDiv("taskmodal-project-field");
      const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
      const projectSelect = createEl("select", { cls: "taskmodal-project-select" }) as HTMLSelectElement;
      const projects = Array.isArray(this.projectCache) ? this.projectCache : [];
      for (const project of projects) {
        const option = createEl("option") as HTMLOptionElement;
        option.value = project.id;
        option.textContent = project.name;
        // Use string comparison for project id selection
        if (String(task.projectId) === String(project.id)) {
          option.selected = true;
        }
        projectSelect.appendChild(option);
      }
      projectField.appendChild(projectLabel);
      projectField.appendChild(projectSelect);

      // --- Group project and date fields into a row ---
      const projectAndDateRow = createDiv("taskmodal-row");
      projectAndDateRow.appendChild(projectField);
      projectAndDateRow.appendChild(dateField);
      wrapper.appendChild(projectAndDateRow);

      // Labels
      const labelField = createDiv("taskmodal-labels-field");
      const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
      const labelList = createDiv("taskmodal-label-list");
      // --- PATCH: Robust label cache handling ---
      const labelListData = Array.isArray(this.labelCache)
        ? this.labelCache
        : Array.isArray((this.labelCache as any)?.results)
          ? (this.labelCache as any).results
          : [];

      labelListData.forEach((label: any) => {
        const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
        const checkbox = createEl("input", { type: "checkbox" }) as HTMLInputElement;
        checkbox.value = label.name;
        checkbox.checked = task.labels.includes(label.name);
        labelCheckbox.appendChild(checkbox);
        labelCheckbox.append(label.name);
        labelList.appendChild(labelCheckbox);
      });
      labelField.appendChild(labelLabel);
      labelField.appendChild(labelList);
      wrapper.appendChild(labelField);

      // Button row
      const buttonRow = createDiv("taskmodal-button-row");
const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel btn-cancel", text: "Cancel", type: "button", attr: { "aria-label": "Cancel", "data-action": "cancel" } });
cancelBtn.onclick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  try { modal.close(); } catch {}
  this.closeAnyModal();
};
const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: "Save", type: "button" });
      saveBtn.onclick = async () => {
        const newTitle = titleInput.value.trim();
        const newDesc = descInput.value.trim();
        const newDue = dueInput.value;
        const newProjectId = projectSelect.value;
        if (!newTitle) return;

        // Save the original projectId and labels before mutating task
        const originalProjectId = task.projectId;
        const originalLabels = [...task.labels];

        // Gather checked labels from custom checkbox list
        const selectedLabels = Array.from(labelList.querySelectorAll("input:checked")).map(cb => (cb as HTMLInputElement).value);

        // Immediately replace the task in cache with edited version (but do NOT mutate task yet)
        const editedTask = {
          ...task,
          content: newTitle,
          description: newDesc,
          due: newDue ? { date: newDue } : null,
          projectId: Number(newProjectId),
          labels: selectedLabels
        };
        // Do NOT mutate task here. (Moved mutation to after fetch.)
        // task.content = editedTask.content;
        // task.description = editedTask.description;
        // task.due = editedTask.due;
        // task.projectId = editedTask.projectId;
        // task.labels = editedTask.labels;

        // Save to localStorage
        const updatedTasks = cachedTasks.map((t: any) => t.id === task.id ? editedTask : t);
        localStorage.setItem(cachedTasksKey, JSON.stringify(updatedTasks));
        localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));

        // Show pulsing orange sync indicator (sync in progress) - DELAYED VERSION
        setTimeout(() => {
          const updatedRow = document.getElementById(task.id);
          if (!updatedRow) {
            console.warn("❌ Could not find row for sync indicator", task.id);
            return;
          }
          const oldIndicator = updatedRow.querySelector(".change-indicator");
          if (oldIndicator) oldIndicator.remove();

          const newIndicator = document.createElement("span");
          newIndicator.className = "change-indicator";
          newIndicator.style.position = "absolute";
          newIndicator.style.bottom = "4px";
          newIndicator.style.right = "4px";
          newIndicator.style.width = "8px";
          newIndicator.style.height = "8px";
          newIndicator.style.borderRadius = "50%";
          newIndicator.style.backgroundColor = "orange";
          newIndicator.style.opacity = "0.8";
          newIndicator.style.zIndex = "10";
          newIndicator.style.animation = "pulse 1s infinite";
          newIndicator.title = "Syncing...";
          updatedRow.style.position = "relative";
          updatedRow.appendChild(newIndicator);
          // if (this.settings?.enableLogs) console.log("✅ Appended sync indicator (delayed)");
        }, 100);

        // Rerender from updated localStorage
        document.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
          const container = el as HTMLElement;
          const source = container.getAttribute("data-current-filter") || "";
          container.innerHTML = "";
          this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
        });
        // Now close the modal after UI and storage updates
        modal.close();

        setTimeout(async () => {
          // --- PATCH: Use conditional update body and POST as per new instructions ---
          const updateBody: any = {};
          if (newTitle !== task.content) updateBody.content = newTitle;
          if (newDesc !== task.description) updateBody.description = newDesc;
          if (newDue !== (task.due?.date ?? "")) {
            if (newDue) updateBody.due_date = newDue;
            else updateBody.due_string = "no date";
          }
          // Removed projectId update from updateBody here
          if (JSON.stringify(selectedLabels) !== JSON.stringify(originalLabels)) {
            updateBody.labels = selectedLabels;
          }

          // --- Ensure at least one accepted field for Todoist API ---
          const requiredFields = ["content", "description", "due_date", "due_string", "labels"];
          const updateKeys = Object.keys(updateBody);
          const hasRequiredField = updateKeys.some(k => requiredFields.includes(k));
          if (!hasRequiredField) {
            updateBody.content = task.content; // Add fallback to satisfy API
          }

          // Log the constructed update body before sending the fetch request
          if (this.settings?.enableLogs) console.log("Sending update to Todoist:", updateBody);

          const result = await fetch(`https://api.todoist.com/rest/v2/tasks/${task.id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.settings.apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updateBody)
          });
          const data = await result.text();
          if (this.settings?.enableLogs) console.log("Todoist update response:", result.status, data);

          // After updating content/description/due/labels, move project if needed
          if (Number(newProjectId) !== Number(originalProjectId)) {
            await fetch("https://api.todoist.com/sync/v9/sync", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.settings.apiKey}`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: new URLSearchParams({
                sync_token: "*",
                resource_types: '["items"]',
                commands: JSON.stringify([
                  {
                    type: "item_move",
                    uuid: crypto.randomUUID(),
                    args: {
                      id: task.id,
                      projectId: Number(newProjectId)
                    }
                  }
                ])
              })
            });
            // PATCH: update project dropdown to reflect new project in case the modal is still open
            const selectedOption = [...projectSelect.options].find(o => o.value === String(newProjectId));
            if (selectedOption) selectedOption.selected = true;
          }

          // --- Now, after the updateBody and fetch, mutate the task object properties ---
          task.content = newTitle;
          task.description = newDesc;
          task.due = newDue ? { date: newDue } : null;
          task.projectId = Number(newProjectId);
          task.labels = selectedLabels;

          await this.savePluginData();

          // PATCH: rerender all code blocks after save
          const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
          markdownEls.forEach((el) => {
            const pre = el.parentElement!;
            const container = document.createElement("div");
            pre.replaceWith(container);
            this.renderTodoistBoard(container, `filter: ${filters.join(",")}`, {}, this.settings.apiKey);
          });

          // --- PATCH: After modal is closed and DOM is updated, refresh metadata and rerender boards ---
          const refreshedMetadata = await this.fetchMetadataFromSync(this.settings.apiKey);
          this.labelCache = refreshedMetadata.labels;
          // Optionally rerender all todoist-board containers with fresh metadata
          document.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
            const container = el as HTMLElement;
            const source = container.getAttribute("data-current-filter") || "";
            container.innerHTML = "";
            this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
          });

          // --- NEW: Sync indicator logic ---
          const updatedIndicator = document.getElementById(task.id)?.querySelector(".change-indicator") as HTMLElement;
          if (result.ok) {
            // --- PATCH: Update localStorage with the edited task after confirmed sync ---
            const tasksKey = `todoistTasksCache:${currentFilter}`;
            const storedTasks = JSON.parse(localStorage.getItem(tasksKey) || "[]");
            const updatedTasksAfterSync = storedTasks.map((t: any) =>
              t.id === task.id
                ? {
                    ...t,
                    content: newTitle,
                    description: newDesc,
                    due: newDue ? { date: newDue } : null,
                    projectId: Number(newProjectId),
                    labels: selectedLabels
                  }
                : t
            );
            localStorage.setItem(tasksKey, JSON.stringify(updatedTasksAfterSync));
            localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
            if (updatedIndicator) {
              updatedIndicator.style.animation = "none";
              updatedIndicator.style.backgroundColor = "limegreen";
              updatedIndicator.title = "Synced";
              setTimeout(() => updatedIndicator.remove(), 1000);
            }
          } else if (updatedIndicator) {
            updatedIndicator.style.animation = "none";
            updatedIndicator.style.backgroundColor = "red";
            updatedIndicator.title = "Failed to sync";
          }
        }, 0);
      };
      buttonRow.appendChild(cancelBtn);
      buttonRow.appendChild(saveBtn);
      wrapper.appendChild(buttonRow);

      modal.contentEl.appendChild(wrapper);
    })();
    modal.open();
    if (!this.projectCache || !this.labelCache) {
  this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
    this.projectCache = Array.isArray(metadata.projects)
      ? metadata.projects
      : Array.isArray((metadata.projects as any)?.results)
        ? (metadata.projects as any).results
        : [];

    this.labelCache = Array.isArray(metadata.labels)
      ? metadata.labels
      : Array.isArray((metadata.labels as any)?.results)
        ? (metadata.labels as any).results
        : [];

    this.projectCacheTimestamp = Date.now();
    this.labelCacheTimestamp = Date.now();

    const projectSelect = modal.contentEl.querySelector(".taskmodal-project-select") as HTMLSelectElement;
    if (projectSelect && Array.isArray(this.projectCache)) {
      projectSelect.innerHTML = "";
      for (const project of this.projectCache) {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        if (project.id === task.projectId) option.selected = true;
        projectSelect.appendChild(option);
      }
    }

    const labelList = modal.contentEl.querySelector(".taskmodal-label-list");
    if (labelList && Array.isArray(this.labelCache)) {
      labelList.innerHTML = "";
      const labelListData = Array.isArray(this.labelCache)
        ? this.labelCache
        : Array.isArray((this.labelCache as any)?.results)
          ? (this.labelCache as any).results
          : [];

      labelListData.forEach((label: any) => {
        const labelCheckbox = document.createElement("label");
        labelCheckbox.className = "taskmodal-label-checkbox";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = label.name;
        checkbox.checked = Array.isArray(task.labels) && task.labels.includes(label.name);
        labelCheckbox.appendChild(checkbox);
        labelCheckbox.append(label.name);
        labelList.appendChild(labelCheckbox);
      });
    }
  });
}
  }

  // ======================= 📆 Quick Actions (Today, Tmrw, Delete) =======================
  private async setTaskToToday(taskId: string, apiKey: string, toolbar: HTMLElement, btn: HTMLElement) {
    if ((btn as any)?._busy) return;

    (btn as any)._busy = true;
    const oldText = btn.innerText;
    btn.innerText = "⏳";

    try {
      const today = new Date();
      const iso = today.toISOString().split("T")[0];

      const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ due_date: iso })
      });

      if (resp.ok) {
        btn.innerText = "🎉";
        setTimeout(() => {
          this.taskCache = {};
          this.taskCacheTimestamps = {};
          const taskRow = document.getElementById(taskId);
          if (taskRow) taskRow.remove();
        }, 900);
      } else {
        btn.innerText = "❌";
        alert("Failed to update task.");
      }
    } catch (err) {
      btn.innerText = "❌";
      alert("Error: " + String(err));
    } finally {
      setTimeout(() => {
        (btn as any)._busy = false;
        btn.innerText = oldText;
      }, 900);
    }
  }

  private async deferTask(taskId: string, apiKey: string, toolbar: HTMLElement) {
    const btn = toolbar.querySelector('.chin-btn[data-index="1"]') as HTMLElement;
    if ((btn as any)._busy) return;
    
    (btn as any)._busy = true;
    const oldText = btn.innerText;
    btn.innerText = "⏳";
    
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const iso = tomorrow.toISOString().split("T")[0];
      
      const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "due_date": iso })
      });
      
      if (resp.ok) {
        btn.innerText = "🎉";
        setTimeout(() => {
          this.taskCache = {};
          this.taskCacheTimestamps = {};
          // PATCH: Remove the task element from the DOM manually
          const taskRow = document.getElementById(taskId);
          if (taskRow) taskRow.remove();
          // Will trigger re-render on next filter click
        }, 900);
      } else {
        btn.innerText = "❌";
        alert("Failed to update task. Try again.");
      }
    } catch (err) {
      btn.innerText = "❌";
      alert("Error updating task: " + String(err));
    } finally {
      setTimeout(() => {
        (btn as any)._busy = false;
        btn.innerText = oldText;
      }, 900);
    }
  }

  private async deleteTask(taskId: string, apiKey: string, toolbar: HTMLElement) {
    if (!confirm("Delete this task? This action cannot be undone.")) return;
    
    const btn = toolbar.querySelector('.chin-btn[data-index="3"]') as HTMLElement;
    if ((btn as any)._busy) return;
    
    (btn as any)._busy = true;
    btn.innerText = "⏳";
    
    try {
      const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      
      if (resp.ok) {
        btn.innerText = "✅";
        setTimeout(() => {
          this.taskCache = {};
          this.taskCacheTimestamps = {};
          // PATCH: Remove the task element from the DOM manually
          const taskRow = document.getElementById(taskId);
          if (taskRow) taskRow.remove();
          // Will trigger re-render on next filter click
        }, 900);
      } else {
        btn.innerText = "❌";
        alert("Failed to delete task.");
      }
    } catch (err) {
      btn.innerText = "❌";
      alert("Error deleting task: " + String(err));
    } finally {
      setTimeout(() => {
        (btn as any)._busy = false;
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
    requestAnimationFrame(() => {
      next.scrollIntoView({ behavior: "smooth", block: "center" });
      requestAnimationFrame(() => {
        next.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      });
    });
  }
}

  // ======================= 🧱 Task Content Building =======================
  private createTaskContent(
    task: any, 
    projectMap: Record<string, string>, 
    labelMap: Record<string, string>, 
    labelColorMap: Record<string, string>,
    projects: any[]
  ): HTMLElement {
    const left = document.createElement("div");
    left.className = "task-content";

    const titleSpan = document.createElement("span");
    titleSpan.innerHTML = "";
MarkdownRenderer.renderMarkdown(task.content, titleSpan, "", this);
    titleSpan.className = "task-title";

    const metaSpan = document.createElement("small");
    metaSpan.className = "task-metadata";

    const pills = this.createTaskPills(task, projectMap, labelMap, labelColorMap, projects);
    pills.forEach(pill => metaSpan.appendChild(pill));

    const descEl = document.createElement("div");
    descEl.className = "task-description";
    if (typeof task.description === "string" && task.description.trim()) {
      descEl.textContent = task.description;
    } else {
      descEl.textContent = " ";
      descEl.classList.add("desc-empty");
    }

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "task-content-wrapper";
contentWrapper.appendChild(titleSpan);

// line 2: WHEN (due | deadline)
const whenRow = document.createElement("div");
whenRow.className = "task-when";

// due inline
let dueDateStr = task?.due?.date as string | undefined;
let dueTimeStr: string | undefined = undefined;
try {
  if (task?.due?.datetime) {
    const _dt = DateTime.fromISO(task.due.datetime);
    if (_dt?.isValid) dueTimeStr = _dt.toFormat("HH:mm");
  }
} catch {}
const dueInline = this.createDueInline(task);
if (dueInline) whenRow.appendChild(dueInline);

// deadline inline
const dlInline = this.createDeadlineInline(task);
if (dlInline) {
  if (whenRow.childNodes.length) {
    const sep = document.createElement("span");
    sep.className = "mid-sep";
    sep.textContent = " | ";
    whenRow.appendChild(sep);
  }
  whenRow.appendChild(dlInline);
}
contentWrapper.appendChild(whenRow);

// line 3: META (# project | @labels)
const metaRow = document.createElement("div");
metaRow.className = "task-meta-compact";

const projInline = this.createProjectPill(task.projectId, projectMap, projects);
if (projInline) metaRow.appendChild(projInline);

const labelsInline = this.createLabelPill(task.labels, labelMap, labelColorMap);
if (labelsInline) {
  if (projInline) {
    const sep2 = document.createElement("span");
    sep2.className = "mid-sep";
    sep2.textContent = " | ";
    metaRow.appendChild(sep2);
  }
  metaRow.appendChild(labelsInline);
}
contentWrapper.appendChild(metaRow);

// description (only visible on selected via CSS you already have)
contentWrapper.appendChild(descEl);

// keep a hidden .task-metadata node so existing code that queries it still works
if (metaSpan) contentWrapper.appendChild(metaSpan);
    
    left.appendChild(contentWrapper);
    return left;
  }

  private createTaskPills(
    task: any, 
    projectMap: Record<string, string>, 
    labelMap: Record<string, string>, 
    labelColorMap: Record<string, string>,
    projects: any[]
  ): HTMLElement[] {
    const pills: HTMLElement[] = [];

// --- DUE PILL (timezone-safe) ---
// --- DUE PILL (timezone-safe, handles all Todoist shapes) ---
const zone = safeZone(getZone(this.settings)); // safeZone you added earlier

let dueDate = task.due?.date;
let dueTime: string | undefined;

let srcDT: DateTime | null = null;

// 1) Standard timed
if (task.due?.datetime) {
  srcDT = DateTime.fromISO(task.due.datetime, { setZone: true });
}
// 2) Timed packed into "date" (has a 'T')
else if (task.due?.date && task.due.date.includes("T")) {
  srcDT = DateTime.fromISO(task.due.date, { setZone: true });
}
// 3) Legacy split date + time
else if ((task as any).due?.time) {
  srcDT = DateTime.fromISO(`${task.due!.date}T${(task as any).due.time}`, { setZone: true });
}

if (srcDT?.isValid) {
  const dt = srcDT.setZone(zone);
  if (dt.hour !== 0 || dt.minute !== 0) {
    dueTime = dt.toFormat(useHour12() ? "h:mm a" : "HH:mm");
  }
  dueDate = dt.toISODate() || dueDate;
}

let duePillEl: HTMLElement | null = this.createDuePill(dueDate, dueTime);
if (duePillEl) pills.push(duePillEl);


// Project pill
const projectPill = this.createProjectPill(task.projectId, projectMap, projects);
if (projectPill) pills.push(projectPill);

// Label pill
const labelPill = this.createLabelPill(task.labels, labelMap, labelColorMap);
if (labelPill) pills.push(labelPill);

return pills.filter(pill => pill.style.display !== "none");
  }
private createDeadlineInline(task: any): HTMLElement | null {
  const d = task?.deadline?.date;
  if (!d) return null;

  const zone =
    this.settings?.timezoneMode === "manual"
      ? this.settings.manualTimezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone;

  let dt = DateTime.fromISO(d, { zone });
if (!dt?.isValid) return null;

const today = DateTime.now().setZone(zone).startOf("day");
const target = dt.startOf("day");
const days = Math.round(target.diff(today, "days").days);

const span = document.createElement("span");
span.className = "deadline-inline";
span.textContent =
  days === 0 ? "🎯 today"
  : days === 1 ? "🎯 in 1 day"
  : days < 0 ? `🎯 ${Math.abs(days)} days ago`
  : `🎯 in ${days} days`;
return span;
}
  // Requires: import { DateTime } from "luxon";
private createDuePill(dueDate: string | undefined, dueTime: string | undefined): HTMLElement | null {
  if (!dueDate) return null;

  const zone = safeZone(
    this.settings?.timezoneMode === "manual"
      ? this.settings.manualTimezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone
  );

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

  const pill = document.createElement("span");
  pill.className = "due-pill";

  const day = this.getDayLabel(dt);
  pill.textContent = hasTime
    ? `${day} @ ${dt.toFormat(useHour12() ? "h:mm a" : "HH:mm")}`
    : day;

  return pill;
}

  // Helper: getDayLabel returns "Today", "Tomorrow", or formatted date
private getDayLabel(dt: DateTime): string {
  if (!dt?.isValid) return "";

  const z = dt.zoneName;
  const today = DateTime.now().setZone(z || "UTC").startOf("day");
  const target = dt.startOf("day");

  if (target.hasSame(today, "day")) return "Today";
  if (target.hasSame(today.plus({ days: 1 }), "day")) return "Tomorrow";
  if (target.hasSame(today.minus({ days: 1 }), "day")) return "Yesterday";

  return dt.toFormat("MMM d");
}

  private createProjectPill(projectId: string, projectMap: Record<string, string>, projects: any[]): HTMLElement | null {
    if (!projectId) return null;

    const projectPill = document.createElement("span");
    projectPill.className = "pill project-pill";
    projectPill.setAttribute("data-type", "project");

    const projName = projectMap[projectId] || "Unknown Project";
    const projectColorId = projects.find((p: any) => p.id === projectId)?.color;
    const projectHexColor = TODOIST_COLORS[projectColorId];

    projectPill.innerHTML = projName === "Inbox"
      ? `<span class="project-hash" style="color:${projectHexColor};">#</span> 📥 Inbox`
      : `<span class="project-hash" style="color:${projectHexColor};">#</span> ${projName}`;

    return projectPill;
  }

  private createLabelPill(labels: number[], labelMap: Record<string, string>, labelColorMap: Record<string, string>): HTMLElement | null {
    if (!labels || labels.length === 0) return null;

    const labelPill = document.createElement("span");
    labelPill.className = "pill label-pill";
    labelPill.setAttribute("data-type", "label");

    labelPill.innerHTML = labels.map((id: number) => {
      const name = labelMap[id] || id;
      const color = labelColorMap[id] || "#9333ea";
      return `<span><span style="color:${color}; font-size: 1.05em;">@ </span>${name}</span>`;
    }).join(`<span class="label-separator">,</span>`);

    return labelPill;
  }

  private createTaskDeadline(task: any): HTMLElement {
    const right = document.createElement("div");
    right.className = "task-deadline";

    const deadline = task.deadline?.date;
    if (!deadline) return right;

    const deadlineWrapper = document.createElement("div");
    deadlineWrapper.className = "deadline-wrapper";

    const deadlineLabel = document.createElement("div");
    deadlineLabel.textContent = "🎯 deadline";
    deadlineLabel.className = "deadline-label";

    const deadlinePill = document.createElement("div");
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

  // ======================= 🖱️ Drag & Drop =======================
  private setupTaskDragAndDrop(row: HTMLElement, listWrapper: HTMLElement, filters: string[]) {
    let lastTap = 0;

    row.onpointerdown = (ev: PointerEvent) => {
      // PATCH: Ignore pointerdown if it's on the mini-toolbar/fixed-chin
      if ((ev.target as HTMLElement)?.closest(".fixed-chin")) return;
      // if (this.settings?.enableLogs) console.log("🔽 pointerdown", ev.pointerType, ev.clientX, ev.clientY);
      const tapNow = Date.now();
      if (tapNow - lastTap < 300) return;

      if ((ev.target as HTMLElement).closest('input[type="checkbox"]')) {
        return;
      }

      const isTouch = ev.pointerType === "touch" || ev.pointerType === "pen";
      const startX = ev.clientX;
      const startY = ev.clientY;
      let longPressTimer: number | null = null;
      let dragging = false;
      let pid = ev.pointerId;

      // NEW:
const beginDrag = (e?: PointerEvent) => {
  // if (this.settings?.enableLogs) console.log("🏁 beginDrag");
  if (dragging) return;
  // if (this.settings?.enableLogs) console.log("🎯 drag initialized");
  dragging = true;
const listView = listWrapper.closest(".list-view");
if (listView) {
  listView.classList.add("drag-scroll-block");
  (listView as HTMLElement).style.touchAction = "none";
}
  // NOW prevent default since we're starting a drag
  if (e && e.cancelable) {
    e.preventDefault();
    e.stopPropagation();
  }
  

  // NOW set these drag properties
  row.style.touchAction = "none";
  document.body.classList.add("drag-disable");
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.height = '100%';

        // PATCH: Prevent select on iOS during drag
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
        
        listWrapper.style.touchAction = 'none';
        // NEW (reuse the existing listView variable):
if (listView) {
  (listView as HTMLElement).style.touchAction = "none";
  (listView as HTMLElement).style.overflow = "hidden";
}
        // PATCH: Also block touchAction on .list-view
        if (listWrapper.closest(".list-view")) {
          (listWrapper.closest(".list-view") as HTMLElement).style.touchAction = "none";
        }
        document.body.style.overflow = 'hidden'; // Prevent page scroll too
        if (e) e.preventDefault();
        window.getSelection()?.removeAllRanges();
        row.classList.add("dragging-row");
        // PATCH: Add classes to block drag/scroll globally
        document.body.classList.add("drag-disable");
        listWrapper.classList.add("drag-scroll-block");
        // PATCH: block scroll in list-view while dragging
        if (listView) {
          listView.classList.add("drag-scroll-block");
          (listView as HTMLElement).style.touchAction = "none";
        }
          const obsidianContainers = [
          document.querySelector('.workspace-leaf-content'),
          document.querySelector('.markdown-preview-view'),
          document.querySelector('.cm-editor'),
          document.querySelector('.view-content')
        ];
        obsidianContainers.forEach(container => {
    if (container) {
      const el = container as HTMLElement;
      el.style.touchAction = 'none';
      el.style.overflow = 'hidden';
      // Store original values to restore later
      el.dataset.originalTouchAction = el.style.touchAction;
      el.dataset.originalOverflow = el.style.overflow;
    }
  });
  if (e) e.preventDefault();
  if (e) e.stopPropagation();
  window.getSelection()?.removeAllRanges();
  row.classList.add("dragging-row");
  
  // Add global drag classes
  document.body.classList.add("drag-disable");
  listWrapper.classList.add("drag-scroll-block");
  if (listView) {
    listView.classList.add("drag-scroll-block");
  }
        // if (this.settings?.enableLogs) console.log("📦 Placeholder inserted");

        if (navigator.vibrate) {
          navigator.vibrate([30, 20, 30]);
        }

        const placeholder = row.cloneNode(true) as HTMLDivElement;
        placeholder.id = "todoist-placeholder";
        placeholder.className = "task-placeholder";

        const rowRect = row.getBoundingClientRect();
        const offsetY = startY - rowRect.top;

        listWrapper.insertBefore(placeholder, row);

        const moveWhileDragging = (e: PointerEvent) => {
          // if (this.settings?.enableLogs) console.log("📍 pointermove during drag", e.clientY);
          if (e.pointerId !== pid) return;
              e.preventDefault();
              e.stopPropagation();

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
          // if (this.settings?.enableLogs) console.log("✅ finishDrag");
          if (e.pointerId !== pid) return;

          row.releasePointerCapture(pid);
          row.removeEventListener("pointermove", moveWhileDragging);
          row.removeEventListener("pointerup", finishDrag);
          row.removeEventListener("pointercancel", finishDrag);
          row.removeEventListener("lostpointercapture", finishDrag);

          row.classList.remove("dragging-row");
          // PATCH: unblock scroll in list-view after dragging
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.height = '';
          document.body.style.webkitUserSelect = '';
          document.body.style.userSelect = '';
          // PATCH: unblock scroll in list-view after dragging
          
          if (listView) listView.classList.remove("drag-scroll-block");
          if (listView) (listView as HTMLElement).style.touchAction = "";
          listWrapper.style.touchAction = '';
          if (listView) {
          (listView as HTMLElement).style.touchAction = "";
          (listView as HTMLElement).style.overflow = "";
          listView.classList.remove("drag-scroll-block");
    }
     const obsidianContainers = [
      document.querySelector('.workspace-leaf-content'),
      document.querySelector('.markdown-preview-view'),
      document.querySelector('.cm-editor'),
      document.querySelector('.view-content')
    ];
    obsidianContainers.forEach(container => {
            if (container) {
              const el = container as HTMLElement;
              el.style.touchAction = el.dataset.originalTouchAction || '';
              el.style.overflow = el.dataset.originalOverflow || '';
              delete el.dataset.originalTouchAction;
              delete el.dataset.originalOverflow;
            }
          });
      
          listWrapper.insertBefore(row, placeholder);
          placeholder.remove();
          // if (this.settings?.enableLogs) console.log("📤 Drag completed and placeholder removed");
      
          // PATCH: Also restore touchAction on .list-view after drag
          if (listWrapper.closest(".list-view")) {
            (listWrapper.closest(".list-view") as HTMLElement).style.touchAction = "";
          }
          document.body.style.overflow = '';
          // PATCH: Restore iOS select after drag
          document.body.style.webkitUserSelect = '';
          row.style.touchAction = '';
          // PATCH: Remove drag-disable and drag-scroll-block classes
          document.body.classList.remove("drag-disable");
          listWrapper.classList.remove("drag-scroll-block");
          row.style.touchAction = '';
          document.body.classList.remove("drag-disable");
          listWrapper.classList.remove("drag-scroll-block");
          const newOrder = Array.from(listWrapper.children)
            .map(c => c.getAttribute("data-id"))
            .filter(id => id);
          localStorage.setItem(`todoistBoardOrder:${filters.join(",")}`, JSON.stringify(newOrder));
      
          this.savePluginData();
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
          // if (this.settings?.enableLogs) console.log("👣 onTouchMove", e.clientX, e.clientY);
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > moveThreshold || dy > moveThreshold) {
            moved = true;
            cleanup();
          }
        };

        const cleanup = () => {
          // if (this.settings?.enableLogs) console.log("🧹 Cleanup triggered");
          if (longPressTimer !== null) clearTimeout(longPressTimer);
          row.removeEventListener('pointermove', onTouchMove);
          row.removeEventListener('pointerup', cleanup);
          row.removeEventListener('pointercancel', cleanup);
          // Remove drag-scroll-block from .list-view after drag/touch cleanup
          const listView = listWrapper.closest(".list-view");
          if (listView) {
            listView.classList.remove("drag-scroll-block");
          }
          if (listView) (listView as HTMLElement).style.touchAction = "";
          row.style.touchAction = "";
          // PATCH: Remove drag-disable and drag-scroll-block classes
          document.body.classList.remove("drag-disable");
          listWrapper.classList.remove("drag-scroll-block");
        };

        // PATCH: passive: false for pointermove
        row.addEventListener('pointermove', onTouchMove, { passive: true });
        row.addEventListener('pointerup', cleanup, { passive: true });
        row.addEventListener('pointercancel', cleanup, { passive: true });

        longPressTimer = window.setTimeout(() => {
          // if (this.settings?.enableLogs) console.log("⏳ Long press timer fired");
          if (!moved) {
             if (ev.cancelable) ev.preventDefault();
            beginDrag(ev);
          }
        }, 150);
      } else if (ev.pointerType === "mouse") {
        let hasDragged = false;
        const moveCheck = (e: PointerEvent) => {
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > 5 || dy > 5) {
            hasDragged = true;
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
      // if (this.settings?.enableLogs) console.log("⚠️ pointercancel triggered");
      window.getSelection()?.removeAllRanges();
    });
  }

  private setupGlobalEventListeners() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      // Updated logic: if inside .fixed-chin, do nothing
      if (target.closest(".fixed-chin")) return;
      if (!target.closest(".task-inner")) {
        this.clearSelectedTaskHighlight();
      }
    });
      // Cancel click inside modal
  document.addEventListener('click', (ev) => {
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
  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && document.querySelector('.todoist-modal')) {
      ev.preventDefault();
      this.closeAnyModal();
    }
  });
  }

  clearSelectedTaskHighlight(): void {
    document.querySelectorAll(".selected-task").forEach((el) => {
      el.classList.remove("selected-task");
      void (el as HTMLElement).offsetWidth; // force reflow

      setTimeout(() => {
        const toolbar = el.querySelector("#mini-toolbar-wrapper");
        if (toolbar) toolbar.remove();
      }, 0); // delay toolbar removal until next frame
    });
  }


  createPriorityCheckbox(priority: number, onChange: () => void): HTMLInputElement {
    const priorityColors: Record<number, string> = {
      4: "#d1453b",  // P1 - red
      3: "#eb8909",  // P2 - orange
      2: "#246fe0",  // P3 - blue
      1: "#808080",  // P4 - grey
    };
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todoist-checkbox";
    
    const rowPrioColor = priorityColors[priority] || "#999";
    checkbox.style.borderColor = rowPrioColor;
    checkbox.style.background = `${rowPrioColor}0D`;

    // Prevent task selection when clicking checkbox
    checkbox.addEventListener("click", async (e) => {
      e.stopPropagation(); // Prevents selecting the task when checking
    });
    checkbox.addEventListener("change", async () => {
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
        rowEl.style.transition = "opacity 0.2s ease-out";
        rowEl.style.opacity = "0.4";
        setTimeout(() => {
          // Optionally remove from DOM after 300ms
          if (rowEl.parentElement) rowEl.parentElement.removeChild(rowEl);
        }, 300);
        setTimeout(() => rowEl.classList.remove("task-checked-anim"), 200);
      }
    });
    return checkbox;
  }

  public updateQueueView(active: boolean, listWrapper: HTMLElement): void {
    const rows = Array.from(listWrapper.children) as HTMLDivElement[];
    
    rows.forEach((r, i) => {
      const titleSpan = r.querySelector(".task-title") as HTMLElement;
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

// --- Inject task description show/hide CSS ---
const descStyle = document.createElement('style');
descStyle.textContent = `
.task-description {
  display: none;
  /* Optional for animation:
  opacity: 0;
  max-height: 0;
  transition: opacity 0.2s, max-height 0.2s;
  */
}
.selected-task .task-description,
.task-description.show-description {
  display: block;
  /* Optional for animation:
  opacity: 1;
  max-height: 200px;
  */
}
.desc-empty {
  color: #999;
  font-style: italic;
}
`;
if (!document.head.querySelector('style[data-todoist-board-desc-css]')) {
  descStyle.setAttribute('data-todoist-board-desc-css', 'true');
  document.head.appendChild(descStyle);
}


// ======================= ⚙️ Settings Tab =======================
class TodoistBoardSettingTab extends PluginSettingTab {
  plugin: TodoistBoardPlugin;
  constructor(app: App, plugin: TodoistBoardPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // Access plugin settings as TodoistBoardPluginSettings
    const pluginSettings = this.plugin.settings as TodoistBoardSettings;

    containerEl.createEl("h2", { text: "Todoist Board Settings" });
    new Setting(containerEl)
      .setName("🔑 Todoist API Key")
      .setDesc("Enter your Todoist API key to enable the plugin.")
      .addText((text) => {
        text
          .setPlaceholder("API Key")
          .setValue(pluginSettings.apiKey);

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.style.marginLeft = "8px";

        const indicator = document.createElement("span");
        indicator.style.marginLeft = "8px";
        indicator.style.fontWeight = "bold";

        submitBtn.onclick = async () => {
          indicator.textContent = "⏳";
          try {
            const res = await fetch("https://api.todoist.com/sync/v9/sync", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${text.inputEl.value}`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: new URLSearchParams({
                sync_token: "*",
                resource_types: JSON.stringify(["projects"])
              })
            });
            if (!res.ok) throw new Error("Invalid");
            pluginSettings.apiKey = text.inputEl.value;
            indicator.textContent = "✅";
            await this.plugin.savePluginData();
          } catch {
            indicator.textContent = "❌";
          }
        };

        text.inputEl.parentElement?.appendChild(submitBtn);
        text.inputEl.parentElement?.appendChild(indicator);
      });

    // --- Support My Work Button ---
    new Setting(containerEl)
      .setName("👯‍♀️ Support My Work")
      .setDesc("If you like how this plugin is shaping up, please consider supporting my work by buying me a coffee or TEN!")
      .addButton((button) => {
        button.setButtonText("☕ Coffee Season");
        button.buttonEl.style.backgroundColor = "var(--interactive-accent)";
        button.buttonEl.style.color = "white";
        button.onClick(() => {
          window.open("https://ko-fi.com/jamiedaghaim", "_blank");
        });
      });

    // --- Timezone Mode Settings ---
    new Setting(containerEl)
      .setName("Timezone Mode")
      .setDesc("Choose how timezone is determined for your tasks.")
      .addDropdown(drop =>
        drop
          .addOption("auto", "Auto (Use device timezone)")
          .addOption("manual", "Manual")
          .setValue(pluginSettings.timezoneMode)
          .onChange(async (value: string) => {
            pluginSettings.timezoneMode = value as "auto" | "manual";
            await this.plugin.saveSettings();
            this.display();
          }));

    // Manual Timezone dropdown (replaces previous code with improved version)
    if (pluginSettings.timezoneMode === "manual") {
      new Setting(containerEl)
        .setName("Manual Timezone")
        .setDesc("Overrides system timezone if 'manual' mode is selected above")
        .addDropdown(dropdown => {
          const commonTimezones = [
            "UTC", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
            "Africa/Tripoli", "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg",
            "Africa/Nairobi", "Africa/Casablanca", "Africa/Accra",
            "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
            "America/Sao_Paulo", "America/Mexico_City",
            "Asia/Tokyo", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
            "Asia/Seoul", "Asia/Bangkok", "Asia/Kolkata", "Asia/Dubai", "Asia/Jerusalem",
            "Australia/Sydney", "Australia/Perth", "Pacific/Auckland"
          ];

          for (const tz of commonTimezones) {
            dropdown.addOption(tz, tz);
          }

          dropdown.setValue(this.plugin.settings.manualTimezone);
          dropdown.onChange(async (value) => {
            this.plugin.settings.manualTimezone = value;
            await this.plugin.saveSettings();
            new Notice("Timezone saved. Restart Obsidian to apply.");
          });
        });
    }
  }
  }