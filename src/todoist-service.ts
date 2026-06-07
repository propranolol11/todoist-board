import { requestUrl } from "obsidian";
import type { ActionResult, Label, Project, Task, TodoistDue, TodoistMetadata, TodoistSection, TodoistTask } from "./types";

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
  updateTask(taskId: string, args: Record<string, unknown>): Promise<ActionResult<TodoistTask | null>>;
  getTask(taskId: string): Promise<Task>;
  getProject(projectId: string): Promise<Project>;
  closeTask(taskId: string): Promise<ActionResult>;
  moveTasks(taskIds: string[], args: { projectId: string }): Promise<unknown>;
}

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: Record<string, unknown>;
};

const API_BASE = "https://api.todoist.com/api/v1";

interface PaginatedResponse<T> {
  results?: T[];
  next_cursor?: string | null;
  nextCursor?: string | null;
}

type TodoistPayload = Record<string, unknown>;

function asRecord(value: unknown): TodoistPayload {
  return value !== null && typeof value === "object" ? value as TodoistPayload : {};
}

function firstPresent(...values: unknown[]): unknown {
  return values.find((value) => value !== undefined && value !== null);
}

function stringValue(...values: unknown[]): string | undefined {
  const value = firstPresent(...values);
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : undefined;
}

function nullableStringValue(...values: unknown[]): string | null {
  const value = firstPresent(...values);
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : null;
}

function numberValue(...values: unknown[]): number | undefined {
  const value = firstPresent(...values);
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function booleanValue(...values: unknown[]): boolean | undefined {
  const value = firstPresent(...values);
  return typeof value === "boolean" ? value : undefined;
}

function stringArrayValue(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.map(String) : undefined;
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

export function normalizeDue(due: unknown): TodoistDue | null {
  if (!due || typeof due !== "object") return null;
  const record = asRecord(due);
  return {
    ...record,
    date: stringValue(record.date),
    datetime: stringValue(record.datetime),
    string: stringValue(record.string),
    timezone: stringValue(record.timezone),
    lang: stringValue(record.lang),
    time: stringValue(record.time),
    isRecurring: booleanValue(record.isRecurring, record.is_recurring),
    is_recurring: booleanValue(record.is_recurring, record.isRecurring),
  };
}

export function normalizeTask(task: unknown): TodoistTask {
  const record = asRecord(task);
  const id = stringValue(record.id) ?? "";
  return {
    ...record,
    id,
    content: stringValue(record.content) ?? "",
    description: stringValue(record.description),
    url: stringValue(record.url) ?? (id ? `https://app.todoist.com/app/task/${id}` : undefined),
    projectId: stringValue(record.projectId, record.project_id),
    sectionId: nullableStringValue(record.sectionId, record.section_id),
    parentId: nullableStringValue(record.parentId, record.parent_id),
    labels: stringArrayValue(record.labels),
    priority: numberValue(record.priority),
    commentCount: numberValue(record.commentCount, record.comment_count),
    creatorId: stringValue(record.creatorId, record.creator_id),
    addedByUid: stringValue(record.addedByUid, record.added_by_uid),
    assignedByUid: stringValue(record.assignedByUid, record.assigned_by_uid),
    responsibleUid: nullableStringValue(record.responsibleUid, record.responsible_uid),
    assigneeId: nullableStringValue(record.assigneeId, record.assignee_id),
    assignerId: nullableStringValue(record.assignerId, record.assigner_id),
    createdAt: stringValue(record.createdAt, record.created_at),
    addedAt: stringValue(record.addedAt, record.added_at),
    updatedAt: stringValue(record.updatedAt, record.updated_at),
    completedAt: nullableStringValue(record.completedAt, record.completed_at),
    completedByUid: nullableStringValue(record.completedByUid, record.completed_by_uid),
    isCompleted: booleanValue(record.isCompleted, record.is_completed),
    isDeleted: booleanValue(record.isDeleted, record.is_deleted),
    isCollapsed: booleanValue(record.isCollapsed, record.is_collapsed),
    childOrder: numberValue(record.childOrder, record.child_order),
    dayOrder: numberValue(record.dayOrder, record.day_order),
    noteCount: numberValue(record.noteCount, record.note_count),
    due: normalizeDue(record.due),
    deadline: asRecord(record.deadline),
  };
}

export function normalizeProject(project: unknown): Project {
  const record = asRecord(project);
  return {
    ...record,
    id: stringValue(record.id) ?? "",
    name: stringValue(record.name) ?? "",
    color: stringValue(record.color) ?? numberValue(record.color),
    parentId: nullableStringValue(record.parentId, record.parent_id),
    commentCount: numberValue(record.commentCount, record.comment_count),
    isShared: booleanValue(record.isShared, record.is_shared),
    isFavorite: booleanValue(record.isFavorite, record.is_favorite),
    isInboxProject: booleanValue(record.isInboxProject, record.is_inbox_project, record.inbox_project),
    isTeamInbox: booleanValue(record.isTeamInbox, record.is_team_inbox),
    isArchived: booleanValue(record.isArchived, record.is_archived),
    isDeleted: booleanValue(record.isDeleted, record.is_deleted),
    isCollapsed: booleanValue(record.isCollapsed, record.is_collapsed),
    canAssignTasks: booleanValue(record.canAssignTasks, record.can_assign_tasks),
    canComment: booleanValue(record.canComment, record.can_comment),
    childOrder: numberValue(record.childOrder, record.child_order),
    defaultOrder: numberValue(record.defaultOrder, record.default_order),
    createdAt: stringValue(record.createdAt, record.created_at),
    updatedAt: stringValue(record.updatedAt, record.updated_at),
    viewStyle: stringValue(record.viewStyle, record.view_style),
    url: stringValue(record.url),
  };
}

export function normalizeLabel(label: unknown): Label {
  const record = asRecord(label);
  return {
    ...record,
    id: stringValue(record.id) ?? "",
    name: stringValue(record.name) ?? "",
    color: stringValue(record.color) ?? numberValue(record.color),
    order: numberValue(record.order),
    isFavorite: booleanValue(record.isFavorite, record.is_favorite),
  };
}

export function normalizeSection(section: unknown): TodoistSection {
  const record = asRecord(section);
  return {
    ...record,
    id: stringValue(record.id) ?? "",
    name: stringValue(record.name) ?? "",
    projectId: stringValue(record.projectId, record.project_id),
    order: numberValue(record.order),
    sectionOrder: numberValue(record.sectionOrder, record.section_order),
    isCollapsed: booleanValue(record.isCollapsed, record.is_collapsed),
    isArchived: booleanValue(record.isArchived, record.is_archived),
    isDeleted: booleanValue(record.isDeleted, record.is_deleted),
    addedAt: stringValue(record.addedAt, record.added_at),
    updatedAt: stringValue(record.updatedAt, record.updated_at),
    archivedAt: nullableStringValue(record.archivedAt, record.archived_at),
  };
}

export function toRestTaskPayload(args: Partial<AddTaskArgs> | Record<string, unknown>): Record<string, unknown> {
  const source = asRecord(args);
  const payload: Record<string, unknown> = {};
  const copy = (from: string, to: string = from) => {
    if (source[from] !== undefined) payload[to] = source[from];
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

export function toSyncTaskArgs(taskId: string, args: Partial<AddTaskArgs> | Record<string, unknown>): Record<string, unknown> {
  const payload = toRestTaskPayload(args);
  const syncArgs: Record<string, unknown> = { id: String(taskId) };

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
  if (payload.due_lang !== undefined && syncArgs.due && typeof syncArgs.due === "object") {
    (syncArgs.due as Record<string, unknown>).lang = payload.due_lang;
  }

  if (payload.deadline_date !== undefined) {
    syncArgs.deadline = payload.deadline_date === null ? null : { date: payload.deadline_date };
  }

  return syncArgs;
}

export class TodoistService {
  private apiKey: string;
  private readonly options: TodoistServiceOptions;

  constructor(apiKey: string, options: TodoistServiceOptions = {}) {
    this.apiKey = normalizeApiToken(apiKey);
    this.options = options;
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
      const response = await this.requestPaginatedPage<unknown>("/tasks/filter", {
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
    const projects = await this.requestPage<unknown>("/projects");
    return projects.map(normalizeProject);
  }

  async getSections(projectId: string): Promise<TodoistSection[]> {
    const sections = await this.requestPage<unknown>("/sections", { query: { project_id: projectId } });
    return sections.map(normalizeSection);
  }

  async getLabels(): Promise<Label[]> {
    const labels = await this.requestPage<unknown>("/labels");
    return labels.map(normalizeLabel);
  }

  async addTask(args: AddTaskArgs): Promise<TodoistTask> {
    const task = await this.request<unknown>("/tasks", { method: "POST", body: toRestTaskPayload(args) });
    return normalizeTask(task);
  }

  async updateTask(taskId: string, args: Record<string, unknown>): Promise<ActionResult<TodoistTask | null>> {
    try {
      const response = await this.request<unknown>(`/tasks/${encodeURIComponent(String(taskId))}`, {
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
    return normalizeTask(await this.request<unknown>(`/tasks/${encodeURIComponent(String(taskId))}`));
  }

  async getProject(projectId: string): Promise<Project> {
    return normalizeProject(await this.request<unknown>(`/projects/${encodeURIComponent(String(projectId))}`));
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

  async postRestTask(taskId: string, body: Record<string, unknown>) {
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

  private async syncUpdateTask(taskId: string, args: Record<string, unknown>) {
    const uuid = createCommandUuid();
    const response = await this.syncCommand({
      type: "item_update",
      uuid,
      args: toSyncTaskArgs(taskId, args),
    });
    const syncStatus = asRecord(response.sync_status);
    const status = syncStatus[uuid];
    if (status && status !== "ok") {
      throw new Error(`[Todoist Board] Todoist sync item_update failed: ${JSON.stringify(status)}`);
    }
    return { status: 200, text: JSON.stringify(response), json: response };
  }

  private async syncCommand(command: Record<string, unknown>): Promise<Record<string, unknown>> {
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
    return raw ? asRecord(JSON.parse(raw)) : {};
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
