import { requestUrl } from "obsidian";
import type { ActionResult, Label, Project, Task, TodoistMetadata, TodoistSection, TodoistTask } from "./types";

export interface TodoistServiceOptions {
  getCachedTasks?: (filterKey: string) => TodoistTask[];
}

export interface TodoistPageOptions {
  cursor?: string | null;
  limit?: number;
}

export interface TodoistTaskFetchResult {
  results: TodoistTask[];
  source: "remote" | "cache" | "empty";
  nextCursor?: string | null;
  hasMore?: boolean;
}

export interface AddTaskArgs {
  content: string;
  description?: string;
  projectId?: string;
  project_id?: string;
  sectionId?: string;
  section_id?: string;
  parentId?: string;
  parent_id?: string;
  labels?: string[];
  priority?: number;
  dueString?: string;
  due_string?: string;
  dueDate?: string;
  due_date?: string;
  dueDatetime?: string;
  due_datetime?: string;
  dueLang?: string;
  due_lang?: string;
  assigneeId?: number | string | null;
  assignee_id?: number | string | null;
  duration?: number | null;
  durationUnit?: string | null;
  duration_unit?: string | null;
  deadlineDate?: string | null;
  deadline_date?: string | null;
  order?: number | null;
}

export interface TodoistApiShim {
  getTasksByFilter(args: { query: string }): Promise<TodoistTask[]>;
  getProjects(): Promise<Project[]>;
  getSections(args: { projectId: string }): Promise<TodoistSection[]>;
  getLabels(): Promise<Label[]>;
  addTask(args: AddTaskArgs): Promise<TodoistTask>;
  updateTask(taskId: string, args: Record<string, any>): Promise<ActionResult<TodoistTask | null>>;
  getTask(taskId: string): Promise<Task>;
  getProject(projectId: string): Promise<Project>;
  closeTask(taskId: string): Promise<ActionResult>;
  moveTasks(taskIds: string[], args: { projectId: string }): Promise<unknown>;
}

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: Record<string, any>;
};

const API_BASE = "https://api.todoist.com/api/v1";

interface PaginatedResponse<T> {
  results?: T[];
  next_cursor?: string | null;
  nextCursor?: string | null;
}

function normalizeApiToken(apiKey: string): string {
  return String(apiKey || "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

function createCommandUuid(): string {
  try {
    return window.crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function toTodoistUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function normalizeDue(due: any) {
  if (!due || typeof due !== "object") return due ?? null;
  return {
    ...due,
    isRecurring: due.isRecurring ?? due.is_recurring,
    is_recurring: due.is_recurring ?? due.isRecurring,
  };
}

function normalizeTask(task: any): TodoistTask {
  return {
    ...task,
    id: String(task?.id ?? ""),
    content: String(task?.content ?? ""),
    url: task?.url ?? (task?.id ? `https://app.todoist.com/app/task/${task.id}` : undefined),
    projectId: task?.projectId ?? task?.project_id,
    sectionId: task?.sectionId ?? task?.section_id ?? null,
    parentId: task?.parentId ?? task?.parent_id ?? null,
    commentCount: task?.commentCount ?? task?.comment_count,
    creatorId: task?.creatorId ?? task?.creator_id,
    addedByUid: task?.addedByUid ?? task?.added_by_uid,
    assignedByUid: task?.assignedByUid ?? task?.assigned_by_uid,
    responsibleUid: task?.responsibleUid ?? task?.responsible_uid,
    assigneeId: task?.assigneeId ?? task?.assignee_id ?? null,
    assignerId: task?.assignerId ?? task?.assigner_id ?? null,
    createdAt: task?.createdAt ?? task?.created_at,
    addedAt: task?.addedAt ?? task?.added_at,
    updatedAt: task?.updatedAt ?? task?.updated_at,
    completedAt: task?.completedAt ?? task?.completed_at,
    completedByUid: task?.completedByUid ?? task?.completed_by_uid,
    isCompleted: task?.isCompleted ?? task?.is_completed,
    isDeleted: task?.isDeleted ?? task?.is_deleted,
    isCollapsed: task?.isCollapsed ?? task?.is_collapsed,
    childOrder: task?.childOrder ?? task?.child_order,
    dayOrder: task?.dayOrder ?? task?.day_order,
    noteCount: task?.noteCount ?? task?.note_count,
    due: normalizeDue(task?.due),
  };
}

function normalizeProject(project: any): Project {
  return {
    ...project,
    id: String(project?.id ?? ""),
    name: String(project?.name ?? ""),
    parentId: project?.parentId ?? project?.parent_id ?? null,
    commentCount: project?.commentCount ?? project?.comment_count,
    isShared: project?.isShared ?? project?.is_shared,
    isFavorite: project?.isFavorite ?? project?.is_favorite,
    isInboxProject: project?.isInboxProject ?? project?.is_inbox_project ?? project?.inbox_project,
    isTeamInbox: project?.isTeamInbox ?? project?.is_team_inbox,
    isArchived: project?.isArchived ?? project?.is_archived,
    isDeleted: project?.isDeleted ?? project?.is_deleted,
    isCollapsed: project?.isCollapsed ?? project?.is_collapsed,
    canAssignTasks: project?.canAssignTasks ?? project?.can_assign_tasks,
    canComment: project?.canComment ?? project?.can_comment,
    childOrder: project?.childOrder ?? project?.child_order,
    defaultOrder: project?.defaultOrder ?? project?.default_order,
    createdAt: project?.createdAt ?? project?.created_at,
    updatedAt: project?.updatedAt ?? project?.updated_at,
    viewStyle: project?.viewStyle ?? project?.view_style,
  };
}

function normalizeLabel(label: any): Label {
  return {
    ...label,
    id: String(label?.id ?? ""),
    name: String(label?.name ?? ""),
    isFavorite: label?.isFavorite ?? label?.is_favorite,
  };
}

function normalizeSection(section: any): TodoistSection {
  return {
    ...section,
    id: String(section?.id ?? ""),
    name: String(section?.name ?? ""),
    projectId: section?.projectId ?? section?.project_id,
    sectionOrder: section?.sectionOrder ?? section?.section_order,
    isCollapsed: section?.isCollapsed ?? section?.is_collapsed,
    isArchived: section?.isArchived ?? section?.is_archived,
    isDeleted: section?.isDeleted ?? section?.is_deleted,
    addedAt: section?.addedAt ?? section?.added_at,
    updatedAt: section?.updatedAt ?? section?.updated_at,
    archivedAt: section?.archivedAt ?? section?.archived_at,
  };
}

function toRestTaskPayload(args: Record<string, any>): Record<string, any> {
  const payload: Record<string, any> = {};
  const copy = (from: string, to: string = from) => {
    if (args[from] !== undefined) payload[to] = args[from];
  };

  copy("content");
  copy("description");
  copy("labels");
  copy("priority");
  copy("projectId", "project_id");
  copy("project_id");
  copy("sectionId", "section_id");
  copy("section_id");
  copy("parentId", "parent_id");
  copy("parent_id");
  copy("dueString", "due_string");
  copy("due_string");
  copy("dueDate", "due_date");
  copy("due_date");
  copy("dueDatetime", "due_datetime");
  copy("due_datetime");
  copy("dueLang", "due_lang");
  copy("due_lang");
  copy("assigneeId", "assignee_id");
  copy("assignee_id");
  copy("duration");
  copy("durationUnit", "duration_unit");
  copy("duration_unit");
  copy("deadlineDate", "deadline_date");
  copy("deadline_date");
  copy("order");
  copy("childOrder", "child_order");
  copy("child_order");
  copy("isCollapsed", "is_collapsed");
  copy("is_collapsed");
  copy("dayOrder", "day_order");
  copy("day_order");
  return payload;
}

function toSyncTaskArgs(taskId: string, args: Record<string, any>): Record<string, any> {
  const payload = toRestTaskPayload(args);
  const syncArgs: Record<string, any> = { id: String(taskId) };

  const copy = (from: string, to: string = from) => {
    if (payload[from] !== undefined) syncArgs[to] = payload[from];
  };

  copy("content");
  copy("description");
  copy("labels");
  copy("priority");
  copy("duration");
  copy("duration_unit");
  copy("child_order");
  copy("is_collapsed");
  copy("day_order");

  if (payload.due_string !== undefined) {
    syncArgs.due = payload.due_string === null ? null : { string: payload.due_string };
  } else if (payload.due_date !== undefined) {
    syncArgs.due = payload.due_date === null ? null : { date: payload.due_date };
  } else if (payload.due_datetime !== undefined) {
    syncArgs.due = payload.due_datetime === null ? null : { date: payload.due_datetime };
  }
  if (payload.due_lang !== undefined && syncArgs.due) syncArgs.due.lang = payload.due_lang;

  if (payload.deadline_date !== undefined) {
    syncArgs.deadline = payload.deadline_date === null ? null : { date: payload.deadline_date };
  }

  return syncArgs;
}

export class TodoistService {
  private apiKey: string;

  constructor(apiKey: string, private readonly options: TodoistServiceOptions = {}) {
    this.apiKey = normalizeApiToken(apiKey);
  }

  setApiKey(apiKey: string) {
    this.apiKey = normalizeApiToken(apiKey);
  }

  getApi(): TodoistApiShim {
    return {
      getTasksByFilter: ({ query }) => this.fetchFilteredTasks(query).then((result) => result.results),
      getProjects: () => this.getProjects(),
      getSections: ({ projectId }) => this.getSections(projectId),
      getLabels: () => this.getLabels(),
      addTask: (args) => this.addTask(args),
      updateTask: (taskId, args) => this.updateTask(taskId, args),
      getTask: (taskId) => this.getTask(taskId),
      getProject: (projectId) => this.getProject(projectId),
      closeTask: (taskId) => this.completeTask(taskId),
      moveTasks: async (taskIds, args) => {
        if (!taskIds.length) return null;
        return this.moveTask(taskIds[0], args.projectId);
      },
    };
  }

  async fetchFilteredTasks(filterKey: string, options: TodoistPageOptions = {}): Promise<TodoistTaskFetchResult> {
    const key = String(filterKey || "today");
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return { results: this.getCachedTasks(key), source: "cache" as const };
    }

    try {
      const response = await this.requestPaginatedPage<any>("/tasks/filter", {
        query: {
          query: key,
          limit: options.limit ?? 100,
          cursor: options.cursor ?? undefined,
        },
      });
      return {
        results: response.results.map(normalizeTask),
        source: "remote" as const,
        nextCursor: response.nextCursor,
        hasMore: Boolean(response.nextCursor),
      };
    } catch {
      const cached = this.getCachedTasks(key);
      return { results: cached, source: cached.length ? "cache" as const : "empty" as const };
    }
  }

  async fetchMetadata(): Promise<TodoistMetadata> {
    try {
      const projects = await this.getProjects();
      let sections: TodoistSection[] = [];
      if (projects.length) {
        const grouped = await Promise.all(
          projects.map(async (project) => {
            try {
              return await this.getSections(project.id);
            } catch {
              return [];
            }
          }),
        );
        sections = grouped.flat();
      }

      const labels = await this.getLabels();
      return { projects, sections, labels };
    } catch {
      return { projects: [], sections: [], labels: [] };
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await requestUrl({
        url: `${API_BASE}/sync`,
        method: "POST",
        headers: {
          Authorization: this.authHeader(apiKey),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          sync_token: "*",
          resource_types: JSON.stringify(["projects"]),
        }).toString(),
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async getProjects(): Promise<Project[]> {
    const projects = await this.requestPage<any>("/projects");
    return projects.map(normalizeProject);
  }

  async getSections(projectId: string): Promise<TodoistSection[]> {
    const sections = await this.requestPage<any>("/sections", { query: { project_id: projectId } });
    return sections.map(normalizeSection);
  }

  async getLabels(): Promise<Label[]> {
    const labels = await this.requestPage<any>("/labels");
    return labels.map(normalizeLabel);
  }

  async addTask(args: AddTaskArgs): Promise<TodoistTask> {
    const task = await this.request<any>("/tasks", { method: "POST", body: toRestTaskPayload(args) });
    return normalizeTask(task);
  }

  async updateTask(taskId: string, args: Record<string, any>): Promise<ActionResult<TodoistTask | null>> {
    try {
      const response = await this.request<any>(`/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "POST",
        body: toRestTaskPayload(args),
      });
      return { ok: true, data: response ? normalizeTask(response) : null };
    } catch (error) {
      await this.syncUpdateTask(taskId, args);
      return { ok: true, data: null, error };
    }
  }

  async getTask(taskId: string): Promise<Task> {
    return normalizeTask(await this.request<any>(`/tasks/${encodeURIComponent(String(taskId))}`));
  }

  async getProject(projectId: string): Promise<Project> {
    return normalizeProject(await this.request<any>(`/projects/${encodeURIComponent(String(projectId))}`));
  }

  async completeTask(taskId: string): Promise<ActionResult> {
    await this.request<void>(`/tasks/${encodeURIComponent(String(taskId))}/close`, { method: "POST" });
    return { ok: true };
  }

  async moveTask(taskId: string, projectId: string) {
    return this.moveTaskREST(taskId, { project_id: String(projectId) });
  }

  async moveTaskREST(
    taskId: string,
    payload: { project_id?: string | null; section_id?: string | null; parent_id?: string | null },
  ) {
    const response = await requestUrl({
      url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}/move`,
      method: "POST",
      headers: {
        Authorization: this.authHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`[Todoist Board] moveTaskREST failed ${response.status}: ${response.text}`);
    }
    const raw = response.text || "";
    return raw ? normalizeTask(JSON.parse(raw)) : null;
  }

  async scheduleTask(taskId: string, dueStringOrDate: { due_string?: string; due_date?: string }) {
    return this.syncUpdateTask(taskId, dueStringOrDate);
  }

  async updatePriority(taskId: string, priority: number) {
    return this.syncUpdateTask(taskId, { priority });
  }

  async deleteTask(taskId: string) {
    return requestUrl({
      url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}`,
      method: "DELETE",
      headers: {
        Authorization: this.authHeader(),
      },
    });
  }

  async postRestTask(taskId: string, body: Record<string, any>) {
    return requestUrl({
      url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}`,
      method: "POST",
      headers: {
        Authorization: this.authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toRestTaskPayload(body)),
    });
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await requestUrl({
      url: toTodoistUrl(path, options.query),
      method: options.method || "GET",
      headers: {
        Authorization: this.authHeader(),
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`[Todoist Board] Todoist request failed ${response.status}: ${response.text}`);
    }
    const raw = response.text || "";
    return raw ? JSON.parse(raw) as T : undefined as T;
  }

  private async requestPage<T>(path: string, options: RequestOptions = {}): Promise<T[]> {
    const results: T[] = [];
    let cursor: string | null | undefined = undefined;

    do {
      const query: RequestOptions["query"] = {
        ...options.query,
        limit: options.query?.limit ?? 200,
        cursor,
      };
      const response: PaginatedResponse<T> | T[] = await this.request<PaginatedResponse<T> | T[]>(path, {
        ...options,
        query,
      });

      if (Array.isArray(response)) {
        results.push(...response);
        return results;
      }

      results.push(...(Array.isArray(response?.results) ? response.results : []));
      cursor = response?.next_cursor ?? response?.nextCursor ?? null;
    } while (cursor);

    return results;
  }

  private async requestPaginatedPage<T>(path: string, options: RequestOptions = {}) {
    const response = await this.request<PaginatedResponse<T> | T[]>(path, options);
    if (Array.isArray(response)) {
      return { results: response, nextCursor: null };
    }
    return {
      results: Array.isArray(response?.results) ? response.results : [],
      nextCursor: response?.next_cursor ?? response?.nextCursor ?? null,
    };
  }

  private async syncUpdateTask(taskId: string, args: Record<string, any>) {
    const uuid = createCommandUuid();
    const response = await this.syncCommand({
      type: "item_update",
      uuid,
      args: toSyncTaskArgs(taskId, args),
    });
    const status = response?.sync_status?.[uuid];
    if (status && status !== "ok") {
      throw new Error(`[Todoist Board] Todoist sync item_update failed: ${JSON.stringify(status)}`);
    }
    return { status: 200, text: JSON.stringify(response), json: response };
  }

  private async syncCommand(command: Record<string, any>) {
    const response = await requestUrl({
      url: `${API_BASE}/sync`,
      method: "POST",
      headers: {
        Authorization: this.authHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        commands: JSON.stringify([command]),
      }).toString(),
    });
    const raw = response.text || "";
    return raw ? JSON.parse(raw) : {};
  }

  private authHeader(apiKey = this.apiKey): string {
    return `Bearer ${normalizeApiToken(apiKey)}`;
  }

  private getCachedTasks(filterKey: string): TodoistTask[] {
    try {
      return this.options.getCachedTasks?.(filterKey) || [];
    } catch {
      return [];
    }
  }
}
