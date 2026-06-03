import type { TaskStoreSnapshot, TodoistTask } from "./types";
import { TodoistBoardStorage } from "./storage";

export interface UpsertOptions {
  preferExisting?: boolean;
}

export class TaskStore {
  private snapshot: TaskStoreSnapshot = {
    tasksById: {},
    filterIndex: {},
    taskCache: {},
    timestamps: {},
  };

  constructor(private readonly storage: TodoistBoardStorage) {}

  hydrate(filterKeys: string[] = []) {
    this.snapshot = this.storage.loadTaskSnapshot(filterKeys);
  }

  get tasksById() {
    return this.snapshot.tasksById;
  }

  get filterIndex() {
    return this.snapshot.filterIndex;
  }

  get taskCache() {
    return this.snapshot.taskCache;
  }

  get timestamps() {
    return this.snapshot.timestamps;
  }

  getSnapshot(): TaskStoreSnapshot {
    return this.snapshot;
  }

  upsert(filterKey: string, tasks: TodoistTask[], options: UpsertOptions = {}) {
    const key = String(filterKey);
    const previousIds = Array.isArray(this.snapshot.filterIndex[key])
      ? this.snapshot.filterIndex[key].slice()
      : [];
    const ids: string[] = [];
    const normalizedTasks: TodoistTask[] = [];

    for (const task of Array.isArray(tasks) ? tasks : []) {
      const id = String(task?.id ?? "");
      if (!id) continue;
      if (!(options.preferExisting && this.snapshot.tasksById[id])) {
        this.snapshot.tasksById[id] = task;
      }
      ids.push(id);
      normalizedTasks.push(this.snapshot.tasksById[id]);
    }

    this.snapshot.filterIndex[key] = ids;
    this.snapshot.taskCache[key] = normalizedTasks;
    this.snapshot.timestamps[key] = Date.now();
    this.persist();

    const changed = previousIds.length !== ids.length || previousIds.some((id, index) => id !== ids[index]);
    return { changed, ids };
  }

  removeEverywhere(taskId: string) {
    const id = String(taskId);
    delete this.snapshot.tasksById[id];
    for (const filterKey of Object.keys(this.snapshot.filterIndex)) {
      const ids = (this.snapshot.filterIndex[filterKey] || []).filter((taskIdValue) => taskIdValue !== id);
      this.snapshot.filterIndex[filterKey] = ids;
      this.snapshot.taskCache[filterKey] = ids
        .map((taskIdValue) => this.snapshot.tasksById[taskIdValue])
        .filter(Boolean);
      this.snapshot.timestamps[filterKey] = Date.now();
    }
    this.persist();
  }

  getViewTasks(filterKey: string): TodoistTask[] {
    const key = String(filterKey);
    const ids = this.snapshot.filterIndex[key] || [];
    if (ids.length) {
      return ids.map((id) => this.snapshot.tasksById[id]).filter(Boolean);
    }
    const cached = this.snapshot.taskCache[key] || [];
    if (cached.length) {
      this.upsert(key, cached, { preferExisting: true });
      return cached;
    }
    return [];
  }

  getCount(filterKey: string): number {
    const key = String(filterKey);
    const ids = this.snapshot.filterIndex[key];
    if (Array.isArray(ids) && ids.length) return ids.length;
    const cached = this.snapshot.taskCache[key];
    return Array.isArray(cached) ? cached.length : 0;
  }

  persist() {
    this.storage.saveTaskSnapshot(this.snapshot);
    this.storage.saveLegacyTaskStore(this.snapshot.tasksById);
    for (const filterKey of Object.keys(this.snapshot.filterIndex)) {
      const ids = this.snapshot.filterIndex[filterKey] || [];
      const tasks = ids.map((id) => this.snapshot.tasksById[id]).filter(Boolean);
      this.storage.saveLegacyFilterCache(filterKey, tasks, ids, this.snapshot.timestamps[filterKey] || Date.now());
    }
  }
}
