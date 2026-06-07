import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolveFilterFromSource, sourceOrDefault } from "../src/filters.ts";
import { sortTasksLikeTodoist } from "../src/sort.ts";
import { TodoistBoardStorage, writeJSON } from "../src/storage.ts";
import { TaskStore } from "../src/task-store.ts";
import { getSubtasksForParent, TaskHierarchy } from "../src/task-hierarchy.ts";
import { normalizeTask, toRestTaskPayload, toSyncTaskArgs } from "../src/todoist-service.ts";
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
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new MemoryStorage(),
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
