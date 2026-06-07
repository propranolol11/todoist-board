import type { App } from "obsidian";
import type { SortMode, TaskStoreSnapshot, TodoistMetadata, TodoistTask } from "./types";
import { TodoistBoardStorage } from "./storage";

export class StorageRepository {
  private readonly storage: TodoistBoardStorage;
  private readonly app?: App;

  constructor(storage: TodoistBoardStorage, app?: App) {
    this.storage = storage;
    this.app = app;
  }

  private get vaultName(): string {
    try {
      return this.app?.vault?.getName?.() || "default";
    } catch {
      return "default";
    }
  }

  loadTaskSnapshot(filterKeys: string[] = []): TaskStoreSnapshot {
    return this.storage.loadTaskSnapshot(filterKeys);
  }

  saveTaskSnapshot(snapshot: TaskStoreSnapshot) {
    this.storage.saveTaskSnapshot(snapshot);
  }

  loadMetadata(): TodoistMetadata {
    return this.storage.loadMetadata();
  }

  saveMetadata(metadata: TodoistMetadata, timestamp = Date.now()) {
    this.storage.saveMetadata(metadata, timestamp);
  }

  getSortMode(filterKey: string): SortMode {
    return this.storage.getSortMode(filterKey);
  }

  setSortMode(filterKey: string, mode: string) {
    this.storage.setSortMode(filterKey, mode);
  }

  getInlineCompact(path: string, filterKey: string): boolean {
    return this.storage.getInlineCompact(path, filterKey);
  }

  setInlineCompact(path: string, filterKey: string, on: boolean) {
    this.storage.setInlineCompact(path, filterKey, on);
  }

  getHiddenSet(): Set<string> {
    return this.storage.getHiddenSet(this.vaultName);
  }

  saveHiddenSet(ids: Set<string>) {
    this.storage.saveHiddenSet(ids, this.vaultName);
  }

  getManualOrder(filterKey: string): string[] {
    return this.storage.getManualOrder(filterKey);
  }

  setManualOrder(filterKey: string, ids: string[]) {
    this.storage.setManualOrder(filterKey, ids);
  }

  loadTaskCache(filterKey: string): TodoistTask[] {
    return this.storage.loadTaskCache(filterKey);
  }

  getTaskCacheTimestamp(filterKey: string): number {
    return this.storage.getTaskCacheTimestamp(filterKey);
  }

  saveTaskCache(filterKey: string, tasks: TodoistTask[], timestamp = Date.now()) {
    this.storage.saveTaskCache(filterKey, tasks, timestamp);
  }
}
