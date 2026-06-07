import type { ActionResult, Project, Task, TodoistTask } from "./types";
import type { AddTaskArgs, TodoistService } from "./todoist-service";

export class TaskActions {
  private readonly todoistService: TodoistService;

  constructor(todoistService: TodoistService) {
    this.todoistService = todoistService;
  }

  addTask(args: AddTaskArgs): Promise<TodoistTask> {
    return this.todoistService.addTask(args);
  }

  completeTask(taskId: string): Promise<ActionResult> {
    return this.todoistService.completeTask(taskId);
  }

  deleteTask(taskId: string) {
    return this.todoistService.deleteTask(taskId);
  }

  deferTaskToTomorrow(taskId: string) {
    return this.todoistService.scheduleTask(taskId, { due_string: "tomorrow" });
  }

  getProject(projectId: string): Promise<Project> {
    return this.todoistService.getProject(projectId);
  }

  getTask(taskId: string): Promise<Task> {
    return this.todoistService.getTask(taskId);
  }

  moveTask(taskId: string, projectId: string) {
    return this.todoistService.moveTask(taskId, projectId);
  }

  moveTaskREST(
    taskId: string,
    payload: { project_id?: string | null; section_id?: string | null; parent_id?: string | null },
  ) {
    return this.todoistService.moveTaskREST(taskId, payload);
  }

  scheduleTask(taskId: string, dueStringOrDate: { due_string?: string; due_date?: string }) {
    return this.todoistService.scheduleTask(taskId, dueStringOrDate);
  }

  scheduleTaskToday(taskId: string) {
    return this.scheduleTask(taskId, { due_string: "today" });
  }

  updatePriority(taskId: string, priority: number) {
    return this.todoistService.updatePriority(taskId, priority);
  }

  updateTask(taskId: string, args: Record<string, unknown>) {
    return this.todoistService.updateTask(taskId, args);
  }
}
