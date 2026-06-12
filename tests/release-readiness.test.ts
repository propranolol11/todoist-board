import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { __resetRequestUrl, __setRequestUrl } from "obsidian";
import { resolveFilterFromSource, sourceOrDefault } from "../src/filters.ts";
import { startTaskPolling } from "../src/polling.ts";
import { sortTasksLikeTodoist } from "../src/sort.ts";
import { TodoistBoardStorage, writeJSON } from "../src/storage.ts";
import { TaskStore } from "../src/task-store.ts";
import { getSubtasksForParent, TaskHierarchy } from "../src/task-hierarchy.ts";
import {
  isTodoistRequestError,
  normalizeTask,
  TodoistService,
  toRestTaskPayload,
  toSyncTaskArgs,
} from "../src/todoist-service.ts";
import type { TodoistBoardSettings, TodoistTask } from "../src/types.ts";

class MemoryStorage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  getItem(key: string) {
    return this.values.get(String(key)) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(String(key), String(value));
  }

  removeItem(key: string) {
    this.values.delete(String(key));
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  clear() {
    this.values.clear();
  }
}

const settings: TodoistBoardSettings = {
  apiKey: "",
  filters: [
    { title: "Today", filter: "today", icon: "star" },
    { title: "Work", filter: "#work", icon: "briefcase", isDefault: true },
  ],
  timezoneMode: "auto",
  manualTimezone: "Europe/London",
};

test.beforeEach(() => {
  __resetRequestUrl();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new MemoryStorage(),
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: true },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      crypto: { randomUUID: () => "cmd-1" },
      addEventListener() {},
      removeEventListener() {},
      setInterval,
      clearInterval,
      setTimeout,
      clearTimeout,
    },
  });
});

test("filter source parsing preserves explicit filters and falls back to defaults", () => {
  assert.equal(resolveFilterFromSource("filter: p1 & today", null, settings), "p1 & today");
  assert.equal(resolveFilterFromSource("", null, settings), "#work");
  assert.equal(resolveFilterFromSource("", "overdue", settings), "overdue");
  assert.equal(sourceOrDefault("filter: today\ntoolbar: false", settings.filters!), "filter: today");
});

test("sorting keeps manual order and ranks due dates before undated tasks", () => {
  const tasks: TodoistTask[] = [
    { id: "3", content: "No date", priority: 1 },
    { id: "2", content: "Later", priority: 4, due: { date: "2026-06-09" } },
    { id: "1", content: "Sooner", priority: 1, due: { date: "2026-06-08" } },
  ];

  assert.deepEqual(sortTasksLikeTodoist(tasks, "Manual", "Europe/London").map((task) => task.id), ["3", "2", "1"]);
  assert.deepEqual(sortTasksLikeTodoist(tasks, "Due Date", "Europe/London").map((task) => task.id), ["1", "2", "3"]);
  assert.deepEqual(sortTasksLikeTodoist(tasks, "Priority", "Europe/London").map((task) => task.id), ["2", "1", "3"]);
});

test("task hierarchy merges visible and cached children, dedupes them, and preserves collapse state", () => {
  const visible: TodoistTask[] = [
    { id: "parent", content: "Parent" },
    { id: "child-b", content: "Beta", parentId: "parent", childOrder: 2 },
  ];
  const taskStore = {
    "child-a": { id: "child-a", content: "Alpha", parentId: "parent", childOrder: 1 },
    "other": { id: "other", content: "Other", parentId: "elsewhere" },
  };
  const taskCache = {
    today: [
      { id: "child-b", content: "Beta duplicate", parentId: "parent", childOrder: 2 },
      { id: "child-c", content: "Gamma", parent_id: "parent", child_order: 3 } as TodoistTask,
    ],
  };

  assert.deepEqual(
    getSubtasksForParent({ parentId: "parent", visibleTasks: visible, taskStore, taskCache }).map((task) => task.id),
    ["child-a", "child-b", "child-c"],
  );

  const hierarchy = new TaskHierarchy();
  assert.equal(hierarchy.isCollapsed("parent"), false);
  hierarchy.setCollapsed("parent", true);
  assert.equal(hierarchy.isCollapsed("parent"), true);
  hierarchy.setCollapsed("parent", false);
  assert.equal(hierarchy.isCollapsed("parent"), false);
});

test("task store hydrates legacy cache and writes an authoritative snapshot", () => {
  writeJSON("todoistTasksCache:today", [{ id: "1", content: "Cached" }]);
  writeJSON("todoistTasksCacheTimestamp:today", "123");

  const storage = new TodoistBoardStorage("test");
  const store = new TaskStore(storage);
  store.hydrate(["today"]);

  assert.deepEqual(store.getViewTasks("today").map((task) => task.id), ["1"]);
  store.upsert("today", [{ id: "2", content: "Fresh" }]);
  assert.deepEqual(store.getViewTasks("today").map((task) => task.id), ["2"]);
  assert.equal(storage.loadTaskSnapshot(["today"]).tasksById["2"].content, "Fresh");

  store.clearFilter("today");
  const clearedSnapshot = storage.loadTaskSnapshot(["today"]);
  assert.deepEqual(store.getViewTasks("today"), []);
  assert.deepEqual(clearedSnapshot.filterIndex.today, undefined);
  assert.deepEqual(clearedSnapshot.taskCache.today, undefined);
});

test("todoist normalization and payload helpers preserve API field mappings", () => {
  const normalized = normalizeTask({
    id: 42,
    content: "Ship",
    project_id: "project",
    parent_id: "parent",
    child_order: 7,
    due: { is_recurring: true },
  });

  assert.equal(normalized.id, "42");
  assert.equal(normalized.projectId, "project");
  assert.equal(normalized.parentId, "parent");
  assert.equal(normalized.childOrder, 7);
  assert.equal(normalized.due?.isRecurring, true);

  assert.deepEqual(
    toRestTaskPayload({ projectId: "project", dueDate: "2026-06-08", labels: ["work"] }),
    { project_id: "project", labels: ["work"], due_date: "2026-06-08" },
  );

  assert.deepEqual(
    toSyncTaskArgs("42", { content: "Ship", dueString: "no date", deadlineDate: null }),
    { id: "42", content: "Ship", due: { string: "no date" }, deadline: null },
  );
});

test("todoist service throws structured errors for REST failures", async () => {
  __setRequestUrl(async () => ({ status: 401, text: "bad token" }));
  const service = new TodoistService("token");

  await assert.rejects(
    () => service.getProjects(),
    (error: unknown) => isTodoistRequestError(error)
      && error.status === 401
      && error.endpoint === "/projects",
  );
});

test("todoist service does not cache-fallback HTTP filter errors", async () => {
  __setRequestUrl(async () => ({ status: 400, text: "bad filter" }));
  const service = new TodoistService("token", {
    getCachedTasks: () => [{ id: "cached", content: "Cached" }],
  });

  await assert.rejects(
    () => service.fetchFilteredTasks("bad filter"),
    (error: unknown) => isTodoistRequestError(error)
      && error.status === 400
      && error.endpoint === "/tasks/filter",
  );
});

test("todoist service uses cache for offline filter fetches", async () => {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: false },
  });
  __setRequestUrl(async () => {
    throw new Error("request should not run while offline");
  });
  const service = new TodoistService("token", {
    getCachedTasks: () => [{ id: "cached", content: "Cached" }],
  });

  const result = await service.fetchFilteredTasks("today");

  assert.equal(result.source, "cache");
  assert.deepEqual(result.results.map((task) => task.id), ["cached"]);
});

test("todoist sync commands validate HTTP and command status", async () => {
  const service = new TodoistService("token");

  __setRequestUrl(async () => ({ status: 401, text: "bad token" }));
  await assert.rejects(
    () => service.scheduleTask("task", { due_string: "today" }),
    (error: unknown) => isTodoistRequestError(error)
      && error.status === 401
      && error.endpoint === "/sync",
  );

  __setRequestUrl(async () => ({ status: 200, text: JSON.stringify({ sync_status: {} }) }));
  await assert.rejects(
    () => service.scheduleTask("task", { due_string: "today" }),
    /missing command status/,
  );

  __setRequestUrl(async () => ({
    status: 200,
    text: JSON.stringify({ sync_status: { "cmd-1": { error: "invalid", error_code: 42 } } }),
  }));
  await assert.rejects(
    () => service.updatePriority("task", 4),
    /Todoist sync item_update failed/,
  );
});

test("polling skips missing token, offline state, and overlapping runs", async () => {
  let intervalCallback: (() => void) | null = null;
  let fetchCalls = 0;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener() {},
      removeEventListener() {},
      setInterval(fn: () => void) {
        intervalCallback = fn;
        return 1;
      },
      clearInterval() {},
    },
  });
  (globalThis as unknown as { activeDocument: unknown }).activeDocument = {
    visibilityState: "visible",
    querySelectorAll: () => [{ getAttribute: () => "today" }],
  };

  const missingTokenStop = startTaskPolling({
    settings: { apiKey: "" },
    fetchFilteredTasksFromREST: async () => {
      fetchCalls += 1;
      return { results: [], source: "remote" };
    },
    fetchMetadataFromSync: async () => ({ projects: [], sections: [], labels: [] }),
    getViewTasks: () => [],
    upsertTasks() {},
    renderTodoistBoard() {},
    refreshAllInlineBoards() {},
    projectCache: [],
    labelCache: [],
    projectCacheTimestamp: 0,
    labelCacheTimestamp: 0,
  }, 1000);
  intervalCallback?.();
  await Promise.resolve();
  assert.equal(fetchCalls, 0);
  missingTokenStop();

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: false },
  });
  const offlineStop = startTaskPolling({
    settings: { apiKey: "token" },
    fetchFilteredTasksFromREST: async () => {
      fetchCalls += 1;
      return { results: [], source: "remote" };
    },
    fetchMetadataFromSync: async () => ({ projects: [], sections: [], labels: [] }),
    getViewTasks: () => [],
    upsertTasks() {},
    renderTodoistBoard() {},
    refreshAllInlineBoards() {},
    projectCache: [],
    labelCache: [],
    projectCacheTimestamp: 0,
    labelCacheTimestamp: 0,
  }, 1000);
  intervalCallback?.();
  await Promise.resolve();
  assert.equal(fetchCalls, 0);
  offlineStop();

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: true },
  });
  let resolveFetch: ((value: { results: TodoistTask[]; source: "remote" }) => void) | null = null;
  const overlappingStop = startTaskPolling({
    settings: { apiKey: "token" },
    fetchFilteredTasksFromREST: async () => {
      fetchCalls += 1;
      return new Promise((resolve) => {
        resolveFetch = resolve;
      });
    },
    fetchMetadataFromSync: async () => ({ projects: [], sections: [], labels: [] }),
    getViewTasks: () => [],
    upsertTasks() {},
    renderTodoistBoard() {},
    refreshAllInlineBoards() {},
    projectCache: [],
    labelCache: [],
    projectCacheTimestamp: Date.now(),
    labelCacheTimestamp: Date.now(),
  }, 1000);
  intervalCallback?.();
  intervalCallback?.();
  assert.equal(fetchCalls, 1);
  resolveFetch?.({ results: [], source: "remote" });
  await Promise.resolve();
  overlappingStop();
});

test("polling fetches metadata once per changed cycle", async () => {
  let intervalCallback: (() => void) | null = null;
  let metadataCalls = 0;
  let renderCalls = 0;
  let inlineRefreshes = 0;
  const tasksByFilter: Record<string, TodoistTask[]> = { today: [] };
  const boards = [
    { getAttribute: () => "today" },
    { getAttribute: () => "today" },
  ];

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener() {},
      removeEventListener() {},
      setInterval(fn: () => void) {
        intervalCallback = fn;
        return 1;
      },
      clearInterval() {},
    },
  });
  (globalThis as unknown as { activeDocument: unknown }).activeDocument = {
    visibilityState: "visible",
    querySelectorAll: (selector: string) => selector === ".todoist-board.plugin-view"
      ? boards
      : [{ getAttribute: () => "today" }],
  };

  const stop = startTaskPolling({
    settings: { apiKey: "token" },
    fetchFilteredTasksFromREST: async () => ({
      results: [{ id: "1", content: "Fresh" }],
      source: "remote",
    }),
    fetchMetadataFromSync: async () => {
      metadataCalls += 1;
      return { projects: [{ id: "p", name: "Project" }], sections: [], labels: [] };
    },
    getViewTasks: (filter) => tasksByFilter[filter] || [],
    upsertTasks: (filter, tasks) => {
      tasksByFilter[filter] = tasks;
    },
    renderTodoistBoard: () => {
      renderCalls += 1;
    },
    refreshAllInlineBoards: () => {
      inlineRefreshes += 1;
    },
    projectCache: [],
    labelCache: [],
    projectCacheTimestamp: 0,
    labelCacheTimestamp: 0,
  }, 1000);

  intervalCallback?.();
  await Promise.resolve();
  await Promise.resolve();

  assert.equal(metadataCalls, 1);
  assert.equal(renderCalls, 2);
  assert.equal(inlineRefreshes, 1);
  stop();
});

test("plugin lifecycle registers global listeners once and leaves board containers owned by Obsidian", async () => {
  const { default: TodoistBoardPlugin } = await import("../main.ts");
  const plugin = new TodoistBoardPlugin();
  let registered = 0;
  const removed: string[] = [];

  (plugin as unknown as {
    app: unknown;
    registerDomEvent: () => void;
  }).app = { workspace: { containerEl: {} } };
  (plugin as unknown as { registerDomEvent: () => void }).registerDomEvent = () => {
    registered += 1;
  };
  (globalThis as unknown as { activeDocument: unknown }).activeDocument = {
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { classList: { remove() {}, toggle() {} } },
    removeEventListener() {},
  };

  (plugin as unknown as { setupGlobalEventListeners: () => void }).setupGlobalEventListeners();
  (plugin as unknown as { setupGlobalEventListeners: () => void }).setupGlobalEventListeners();
  assert.equal(registered, 3);

  const board = { remove: () => removed.push("board") };
  const dropdown = { remove: () => removed.push("dropdown") };
  const toolbar = { remove: () => removed.push("toolbar") };
  const pluginUi = { remove: () => removed.push("plugin-ui") };
  (globalThis as unknown as { activeDocument: unknown }).activeDocument = {
    querySelector: () => null,
    querySelectorAll: (selector: string) => {
      if (selector === ".todoist-board") return [board];
      if (selector === ".menu-dropdown-wrapper") return [dropdown];
      if (selector === "#mini-toolbar-wrapper") return [toolbar];
      if (selector === ".todoist-plugin-ui") return [pluginUi];
      return [];
    },
    body: { classList: { remove() {}, toggle() {} } },
    removeEventListener() {},
  };

  (plugin as unknown as { onunload: () => void }).onunload();
  assert.deepEqual(removed.sort(), ["dropdown", "plugin-ui", "toolbar"]);
});

test("community release metadata is internally consistent", () => {
  for (const file of ["README.md", "LICENSE", "manifest.json", "package.json"]) {
    assert.equal(existsSync(file), true, `${file} must exist at the repo root`);
  }

  const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));

  assert.equal(manifest.id, "todoist-board");
  assert.equal(manifest.name, "Todoist Board");
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.isDesktopOnly, false);

  const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  assert.equal(trackedFiles.includes("main.js"), false, "main.js should be attached to releases, not committed");
});
