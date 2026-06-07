import type { TodoistTask } from "./types";

export function getTaskId(task: unknown): string {
  return String((task as TodoistTask | undefined)?.id ?? "");
}

export function getTaskParentId(task: unknown): string {
  const candidate = task as (TodoistTask & { parent_id?: string | null }) | undefined;
  return String(candidate?.parentId ?? candidate?.parent_id ?? "");
}

export function compareSubtasks(a: TodoistTask, b: TodoistTask): number {
  const orderFor = (task: TodoistTask) => {
    const raw = task.childOrder ?? task.child_order ?? task.order ?? task.dayOrder ?? task.day_order;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
  };

  const orderDiff = orderFor(a) - orderFor(b);
  if (orderDiff) return orderDiff;

  const alpha = String(a.content || "").localeCompare(String(b.content || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
  if (alpha) return alpha;

  return getTaskId(a).localeCompare(getTaskId(b));
}

export function collectKnownTasks(
  taskStore: Record<string, TodoistTask> = {},
  taskCache: Record<string, TodoistTask[]> = {},
): TodoistTask[] {
  const byId = new Map<string, TodoistTask>();
  const add = (task: TodoistTask | undefined) => {
    const id = getTaskId(task);
    if (id && task) byId.set(id, task);
  };

  Object.values(taskStore || {}).forEach(add);

  try {
    Object.values(taskCache || {}).flat().forEach(add);
  } catch {
    // Ignore malformed legacy caches.
  }

  return Array.from(byId.values());
}

export function getSubtasksForParent(args: {
  parentId: string;
  visibleTasks: TodoistTask[];
  taskStore?: Record<string, TodoistTask>;
  taskCache?: Record<string, TodoistTask[]>;
}): TodoistTask[] {
  const parentKey = String(args.parentId || "");
  if (!parentKey) return [];

  const byId = new Map<string, TodoistTask>();
  const addIfChild = (task: TodoistTask | undefined) => {
    const id = getTaskId(task);
    if (!task || !id || id === parentKey) return;
    if (getTaskParentId(task) === parentKey) byId.set(id, task);
  };

  args.visibleTasks.forEach(addIfChild);
  collectKnownTasks(args.taskStore, args.taskCache).forEach(addIfChild);

  return Array.from(byId.values()).sort(compareSubtasks);
}

export class TaskHierarchy {
  readonly collapsedParentIds = new Set<string>();

  getSubtasksForParent(
    parentId: string,
    visibleTasks: TodoistTask[],
    taskStore?: Record<string, TodoistTask>,
    taskCache?: Record<string, TodoistTask[]>,
  ): TodoistTask[] {
    return getSubtasksForParent({ parentId, visibleTasks, taskStore, taskCache });
  }

  isCollapsed(parentId: string): boolean {
    return this.collapsedParentIds.has(String(parentId || ""));
  }

  setCollapsed(parentId: string, collapsed: boolean) {
    const id = String(parentId || "");
    if (!id) return;
    if (collapsed) this.collapsedParentIds.add(id);
    else this.collapsedParentIds.delete(id);
  }
}
