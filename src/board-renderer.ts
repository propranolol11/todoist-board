import type { Label, TodoistTask } from "./types";

const HIDE_CHILD_META_SELECTOR =
  ".due-inline, .project-pill, .project-badge, .label-pill, .labels, .task-meta, .meta, .meta-span, .metadata, .task-when, .task-meta-compact";

export function syncDirectTaskDomOrder(listWrapper: HTMLElement, viewTasks: TodoistTask[]) {
  const targetOrder = new Map(viewTasks.map((task, index) => [String(task.id), index]));
  const children = Array.from(listWrapper.children) as HTMLElement[];

  children.forEach((node, index) => {
    const id = String(node.dataset.taskId || viewTasks[index]?.id || "");
    if (!id) return;
    node.classList.add("todoist-card");
    node.dataset.taskId = id;
  });

  children.sort((a, b) => {
    const ai = targetOrder.get(String(a.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
    const bi = targetOrder.get(String(b.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });

  children.forEach((node) => listWrapper.appendChild(node));
}

export function markTaskHierarchyClasses(
  listWrapper: HTMLElement,
  viewTasks: TodoistTask[],
  taskStore: Record<string, TodoistTask>,
) {
  const byId = new Map(viewTasks.map((task) => [String(task.id), task]));
  const childParentIds = new Set(
    Object.values(taskStore || {})
      .filter((task) => task?.parentId)
      .map((task) => String(task.parentId)),
  );
  const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));

  nodes.forEach((node) => {
    const id = String(node.dataset.taskId || "");
    const task = byId.get(id);

    if (task?.parentId) {
      node.classList.add("is-child-task");
      node.querySelectorAll(HIDE_CHILD_META_SELECTOR)
        .forEach((element) => (element as HTMLElement).classList.add("tb-hidden"));
    }

    if (childParentIds.has(id)) {
      node.classList.add("has-children", "parent-task");
    }
  });
}

export function populateLabelPillText(
  listWrapper: HTMLElement,
  viewTasks: TodoistTask[],
  labels: Label[],
) {
  const byId = new Map(viewTasks.map((task) => [String(task.id), task]));
  const nodes = Array.from(listWrapper.querySelectorAll<HTMLElement>("[data-task-id]"));

  nodes.forEach((node) => {
    const id = String(node.dataset.taskId || "");
    const task = byId.get(id);
    const pill = node.querySelector<HTMLElement>("span.pill.label-pill, .pill.label-pill, .label-pill");
    if (!pill) return;

    const taskLabels = Array.isArray(task?.labels) ? task.labels : [];
    const names = taskLabels
      .map((label) => {
        const hit = (labels || []).find(
          (candidate) =>
            String(candidate.id) === String(label) ||
            String(candidate.name) === String(label),
        );
        return String(hit?.name ?? label);
      })
      .filter((name) => name && name.trim().length > 0);

    if (pill.querySelector(".label-part")) {
      pill.classList.toggle("tb-hidden", !names.length);
    } else {
      pill.textContent = names.join(", ");
      pill.classList.toggle("tb-hidden", !names.length);
    }
  });
}
