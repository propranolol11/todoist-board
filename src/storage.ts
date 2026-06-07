import type { App } from "obsidian";
import type { Label, Project, SortMode, TaskStoreSnapshot, TodoistMetadata, TodoistTask } from "./types";
import { normalizeSortMode } from "./sort";

const V2_PREFIX = "todoistBoard:v2";
const fallbackStore = new Map<string, unknown>();

export function readJSON<T>(key: string, fallback: T): T {
  return (fallbackStore.has(key) ? fallbackStore.get(key) : fallback) as T;
}

export function writeJSON(key: string, value: unknown) {
  fallbackStore.set(key, value);
}

const hiddenKey = (): string => {
  return "todoistHiddenTasks:default";
};

const inlineCompactKey = (path: string, filterKey: string) => {
  return `todoistInlineCompact:${path || "__unknown__"}:${String(filterKey)}`;
};

export const getHiddenSet = (): Set<string> => {
  return new Set(readJSON<string[]>(hiddenKey(), []));
};

export const saveHiddenSet = (tasks: Set<string>) => {
  writeJSON(hiddenKey(), Array.from(tasks));
};

export const getInlineCompact = (path: string, filterKey: string): boolean => {
  return !!readJSON<boolean>(inlineCompactKey(path, filterKey), false);
};

export const setInlineCompact = (path: string, filterKey: string, on: boolean) => {
  try {
    writeJSON(inlineCompactKey(path, filterKey), !!on);
  } catch {
    // Ignore inline preference write failures; the view can fall back to defaults.
  }
};

export const getCountForFilter = (filterKey: string, memCache: Record<string, TodoistTask[]>): number => {
  const key = String(filterKey);
  const ids = readJSON<string[]>(`todoistFilterIndex:${key}`, []);
  if (Array.isArray(ids) && ids.length) return ids.length;

  const mem = memCache[key];
  if (Array.isArray(mem)) return mem.length;

  const list = readJSON<TodoistTask[]>(`todoistTasksCache:${key}`, []);
  return Array.isArray(list) ? list.length : 0;
};

export class TodoistBoardStorage {
  private readonly app?: App;
  private readonly prefix: string;

  constructor(appOrPrefix?: App | string, prefix = V2_PREFIX) {
    if (typeof appOrPrefix === "string") {
      this.prefix = appOrPrefix;
    } else {
      this.app = appOrPrefix;
      this.prefix = prefix;
    }
  }

  private key(name: string): string {
    return `${this.prefix}:${name}`;
  }

  private loadValue<T>(key: string, fallback: T): T {
    try {
      const value: unknown = this.app?.loadLocalStorage(key);
      if (value !== null && value !== undefined) return value as T;
    } catch {
      // Fall back to the in-memory store for tests or blocked storage.
    }

    return readJSON(key, fallback);
  }

  private loadString(key: string, fallback = ""): string {
    try {
      const value: unknown = this.app?.loadLocalStorage(key);
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
    } catch {
      // Fall back to the in-memory store for tests or blocked storage.
    }

    return String(readJSON(key, fallback));
  }

  private saveValue(key: string, value: unknown) {
    try {
      if (this.app) {
        this.app.saveLocalStorage(key, value);
        return;
      }
    } catch {
      // Fall back to the in-memory store for tests or blocked storage.
    }

    writeJSON(key, value);
  }

  private saveString(key: string, value: string) {
    try {
      if (this.app) {
        this.app.saveLocalStorage(key, value);
        return;
      }
    } catch {
      // Fall back to the in-memory store for tests or blocked storage.
    }

    writeJSON(key, value);
  }

  loadTaskSnapshot(filterKeys: string[] = []): TaskStoreSnapshot {
    const snapshot = this.loadValue<TaskStoreSnapshot>(this.key("tasks"), {
      tasksById: {},
      filterIndex: {},
      taskCache: {},
      timestamps: {},
    });

    if (Object.keys(snapshot.tasksById || {}).length > 0) {
      return this.normalizeSnapshot(snapshot);
    }

    return this.loadLegacyTaskSnapshot(filterKeys);
  }

  saveTaskSnapshot(snapshot: TaskStoreSnapshot) {
    this.saveValue(this.key("tasks"), this.normalizeSnapshot(snapshot));
  }

  loadLegacyTaskSnapshot(filterKeys: string[] = []): TaskStoreSnapshot {
    const tasksById = this.loadValue<Record<string, TodoistTask>>("todoistTaskStore", {});
    const filterIndex: Record<string, string[]> = {};
    const taskCache: Record<string, TodoistTask[]> = {};
    const timestamps: Record<string, number> = {};

    for (const filterKey of filterKeys) {
      const ids = this.loadValue<string[]>(`todoistFilterIndex:${filterKey}`, []);
      const cached = this.loadValue<TodoistTask[]>(`todoistTasksCache:${filterKey}`, []);
      const timestamp = Number(this.loadString(`todoistTasksCacheTimestamp:${filterKey}`, "0"));

      if (ids.length) filterIndex[filterKey] = ids.map(String);
      if (Array.isArray(cached) && cached.length) {
        taskCache[filterKey] = cached;
        filterIndex[filterKey] = cached.map((task) => String(task?.id ?? "")).filter(Boolean);
        for (const task of cached) {
          const id = String(task?.id ?? "");
          if (id && !tasksById[id]) tasksById[id] = task;
        }
      }
      if (timestamp) timestamps[filterKey] = timestamp;
    }

    return this.normalizeSnapshot({ tasksById, filterIndex, taskCache, timestamps });
  }

  saveLegacyFilterCache(filterKey: string, tasks: TodoistTask[], ids: string[], timestamp = Date.now()) {
    const snapshot = this.loadTaskSnapshot([filterKey]);
    snapshot.filterIndex[filterKey] = ids.map(String);
    snapshot.taskCache[filterKey] = Array.isArray(tasks) ? tasks : [];
    snapshot.timestamps[filterKey] = timestamp;
    for (const task of Array.isArray(tasks) ? tasks : []) {
      const id = String(task?.id ?? "");
      if (id) snapshot.tasksById[id] = task;
    }
    this.saveTaskSnapshot(snapshot);
  }

  saveLegacyTaskStore(tasksById: Record<string, TodoistTask>) {
    const snapshot = this.loadTaskSnapshot();
    snapshot.tasksById = { ...snapshot.tasksById, ...tasksById };
    this.saveTaskSnapshot(snapshot);
  }

  loadMetadata(): TodoistMetadata {
    const metadata = this.loadValue<TodoistMetadata>(this.key("metadata"), {
      projects: [],
      sections: [],
      labels: [],
    });
    if (metadata.projects.length || metadata.labels.length) {
      return {
        projects: metadata.projects || [],
        sections: metadata.sections || [],
        labels: metadata.labels || [],
      };
    }
    return {
      projects: this.loadValue<Project[]>("todoistProjectsCache", []),
      sections: [],
      labels: this.loadValue<Label[]>("todoistLabelsCache", []),
    };
  }

  saveMetadata(metadata: TodoistMetadata, timestamp = Date.now()) {
    this.saveValue(this.key("metadata"), metadata);
    this.saveString(this.key("metadataTimestamp"), String(timestamp));
  }

  getMetadataTimestamp(): number {
    return Number(
      this.loadString(this.key("metadataTimestamp"))
        || this.loadString("todoistProjectsCacheTimestamp")
        || "0",
    );
  }

  getSortMode(filterKey: string): SortMode {
    return normalizeSortMode(
      this.loadString(this.key(`sort:${filterKey}`))
        || this.loadString(`todoistSortMode:${filterKey}`),
    );
  }

  setSortMode(filterKey: string, mode: string) {
    const normalized = normalizeSortMode(mode);
    this.saveString(this.key(`sort:${filterKey}`), normalized);
  }

  getInlineCompact(path: string, filterKey: string): boolean {
    const legacyKey = `todoistInlineCompact:${path || "__unknown__"}:${String(filterKey)}`;
    return Boolean(this.loadValue<boolean>(this.key(`inlineCompact:${path || "__unknown__"}:${filterKey}`), readJSON(legacyKey, false)));
  }

  setInlineCompact(path: string, filterKey: string, on: boolean) {
    this.saveValue(this.key(`inlineCompact:${path || "__unknown__"}:${filterKey}`), Boolean(on));
  }

  getHiddenSet(vaultName = "default"): Set<string> {
    const legacy = readJSON<string[]>(`todoistHiddenTasks:${vaultName}`, []);
    return new Set(this.loadValue<string[]>(this.key(`hidden:${vaultName}`), legacy));
  }

  saveHiddenSet(ids: Set<string>, vaultName = "default") {
    const values = Array.from(ids);
    this.saveValue(this.key(`hidden:${vaultName}`), values);
  }

  getManualOrder(filterKey: string): string[] {
    return this.loadValue<string[]>(this.key(`order:${filterKey}`), readJSON(`todoistBoardOrder:${filterKey}`, []));
  }

  setManualOrder(filterKey: string, ids: string[]) {
    this.saveValue(this.key(`order:${filterKey}`), ids);
  }

  loadTaskCache(filterKey: string): TodoistTask[] {
    return this.loadTaskSnapshot([filterKey]).taskCache[String(filterKey)] || [];
  }

  getTaskCacheTimestamp(filterKey: string): number {
    return this.loadTaskSnapshot([filterKey]).timestamps[String(filterKey)] || 0;
  }

  saveTaskCache(filterKey: string, tasks: TodoistTask[], timestamp = Date.now()) {
    const ids = (Array.isArray(tasks) ? tasks : [])
      .map((task) => String(task?.id ?? ""))
      .filter(Boolean);
    this.saveLegacyFilterCache(String(filterKey), Array.isArray(tasks) ? tasks : [], ids, timestamp);
  }

  removeTaskCache(filterKey: string) {
    const snapshot = this.loadTaskSnapshot([filterKey]);
    delete snapshot.filterIndex[String(filterKey)];
    delete snapshot.taskCache[String(filterKey)];
    delete snapshot.timestamps[String(filterKey)];
    this.saveTaskSnapshot(snapshot);
  }

  getTimezone(): string {
    return this.loadString("todoistTimezone");
  }

  setTimezone(timezone: string) {
    this.saveString("todoistTimezone", timezone);
  }

  setLastFilter(source: string) {
    this.saveString("todoistBoardLastFilter", source);
  }

  getCountForFilter(filterKey: string, memCache: Record<string, TodoistTask[]> = {}): number {
    const key = String(filterKey);
    const snapshot = this.loadTaskSnapshot([key]);
    const ids = snapshot.filterIndex[key];
    if (Array.isArray(ids) && ids.length) return ids.length;

    const mem = memCache[key];
    if (Array.isArray(mem)) return mem.length;

    const cached = snapshot.taskCache[key];
    return Array.isArray(cached) ? cached.length : 0;
  }

  clearTaskAndMetadataCaches() {
    const prefixes = [
      this.key("tasks"),
      this.key("metadata"),
      "todoistTaskStore",
      "todoistProjectsCache",
      "todoistLabelsCache",
    ];
    for (const key of prefixes) this.remove(key);
    this.remove(this.key("metadataTimestamp"));
    this.saveTaskSnapshot({
      tasksById: {},
      filterIndex: {},
      taskCache: {},
      timestamps: {},
    });
  }

  remove(key: string) {
    try {
      if (this.app) {
        this.app.saveLocalStorage(key, null);
        return;
      }
    } catch {
      // Fall back to the in-memory store for tests or blocked storage.
    }

    fallbackStore.delete(key);
  }

  private normalizeSnapshot(snapshot: TaskStoreSnapshot): TaskStoreSnapshot {
    return {
      tasksById: snapshot.tasksById || {},
      filterIndex: snapshot.filterIndex || {},
      taskCache: snapshot.taskCache || {},
      timestamps: snapshot.timestamps || {},
    };
  }
}
