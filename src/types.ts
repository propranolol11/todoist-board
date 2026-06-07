export interface TodoistDue {
  date?: string;
  datetime?: string;
  string?: string;
  isRecurring?: boolean;
  is_recurring?: boolean;
  timezone?: string;
  lang?: string;
  time?: string;
  [key: string]: unknown;
}

export interface TodoistDeadline {
  date?: string;
  datetime?: string;
  [key: string]: unknown;
}

export interface TodoistTask {
  id: string;
  content: string;
  description?: string;
  projectId?: string;
  sectionId?: string | null;
  parentId?: string | null;
  order?: number;
  labels?: string[];
  priority?: number;
  due?: TodoistDue | null;
  deadline?: TodoistDeadline | null;
  url?: string;
  commentCount?: number;
  creatorId?: string;
  addedByUid?: string;
  assignedByUid?: string;
  responsibleUid?: string | null;
  assigneeId?: string | null;
  assignerId?: string | null;
  createdAt?: string;
  addedAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
  completedByUid?: string | null;
  isCompleted?: boolean;
  isDeleted?: boolean;
  isCollapsed?: boolean;
  childOrder?: number;
  dayOrder?: number;
  noteCount?: number;
  [key: string]: unknown;
}

export type Task = TodoistTask;

export interface Project {
  id: string;
  name: string;
  color?: string | number;
  parentId?: string | null;
  order?: number;
  commentCount?: number;
  isShared?: boolean;
  isFavorite?: boolean;
  isInboxProject?: boolean;
  isTeamInbox?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  isCollapsed?: boolean;
  canAssignTasks?: boolean;
  canComment?: boolean;
  childOrder?: number;
  defaultOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  viewStyle?: string;
  url?: string;
  [key: string]: unknown;
}

export interface Label {
  id: string;
  name: string;
  color?: string | number;
  order?: number;
  isFavorite?: boolean;
  [key: string]: unknown;
}

export interface TodoistSection {
  id: string;
  name: string;
  projectId?: string;
  order?: number;
  sectionOrder?: number;
  isCollapsed?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  addedAt?: string;
  updatedAt?: string;
  archivedAt?: string | null;
  [key: string]: unknown;
}

export type GetSectionsResponse = TodoistSection;

export type SortMode = "Due Date" | "Priority" | "Alphabetical" | "Manual";

export interface Filter {
  title: string;
  filter: string;
  icon: string;
  color?: string;
  isDefault?: boolean;
}

export interface ContextMenuSettings {
  scheduleToday: boolean;
  scheduleTomorrow: boolean;
  setPriority: boolean;
  editTask: boolean;
  deleteTask: boolean;
  openInTodoist: boolean;
}

export interface ChinBarSettings {
  scheduleToday: boolean;
  scheduleTomorrow: boolean;
  editTask: boolean;
  hideTask: boolean;
  deleteTask: boolean;
  setPriority: boolean;
  setDeadline: boolean;
  openInTodoist: boolean;
}

export interface TodoistBoardSettings {
  apiKey: string;
  filters?: Filter[];
  compactMode?: boolean;
  useOAuth?: boolean;
  defaultFilter?: string;
  currentFilter?: string;
  timezoneMode: "auto" | "manual";
  manualTimezone: string;
  debug?: boolean;
  enableLogs?: boolean;
  contextMenuActions?: ContextMenuSettings;
  chinBarActions?: ChinBarSettings;
}

export interface TodoistMetadata {
  projects: Project[];
  sections: GetSectionsResponse[];
  labels: Label[];
}

export interface TaskFetchResult {
  results: TodoistTask[];
  source: "remote" | "cache" | "empty";
}

export interface RenderInput {
  mode: SortMode;
  viewTasks: TodoistTask[];
  projects: Project[];
  labels: Label[];
}

export interface TaskStoreSnapshot {
  tasksById: Record<string, TodoistTask>;
  filterIndex: Record<string, string[]>;
  taskCache: Record<string, TodoistTask[]>;
  timestamps: Record<string, number>;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: unknown;
}
