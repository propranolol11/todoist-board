import { App, Modal, setIcon } from "obsidian";
import { clearEl } from "../dom";
import type { Label, Project } from "../types";

export interface TaskModalFields {
  title?: string;
  description?: string;
  due?: string;
  projectId?: string;
  labels?: string[];
}

export interface TaskModalSubmitData {
  title: string;
  description: string;
  due: string;
  projectId: string;
  labels: string[];
}

export interface TaskSheetModalOptions {
  title: string;
  fields: TaskModalFields;
  submitLabel: string;
  projects: Project[];
  labels: Label[];
  onSubmit: (data: TaskModalSubmitData) => Promise<void> | void;
}

export class TaskSheetModal extends Modal {
  private options: TaskSheetModalOptions;
  private opened = false;
  private titleInput: HTMLInputElement | null = null;
  private viewportCleanup: (() => void) | null = null;

  constructor(app: App, options: TaskSheetModalOptions) {
    super(app);
    this.options = options;
  }

  onOpen() {
    this.opened = true;
    this.containerEl.classList.add("todoist-edit-task-modal", "todoist-task-sheet-modal");
    this.installViewportTracking();
    this.renderForm();
    window.setTimeout(() => this.focusTitle(), 10);
  }

  onClose() {
    this.opened = false;
    this.viewportCleanup?.();
    this.viewportCleanup = null;
    this.containerEl.style.removeProperty("--todoist-task-sheet-keyboard-offset");
    this.containerEl.style.removeProperty("--todoist-task-sheet-viewport-height");
    clearEl(this.contentEl);
    this.titleInput = null;
  }

  setLoading(title = this.options.title) {
    this.options = { ...this.options, title };
    if (!this.opened) return;
    this.setTitle(title);
    clearEl(this.contentEl);
    this.contentEl.appendChild(this.createSkeleton());
  }

  setForm(options: Partial<TaskSheetModalOptions>) {
    this.options = { ...this.options, ...options };
    if (this.opened) {
      this.renderForm();
    }
  }

  focusTitle(select = false) {
    this.titleInput?.focus();
    if (select) this.titleInput?.select();
  }

  private renderForm() {
    this.setTitle(this.options.title);
    clearEl(this.contentEl);
    this.contentEl.appendChild(this.createForm());
    this.syncViewportSize();
  }

  private installViewportTracking() {
    this.viewportCleanup?.();

    const ownerWindow = this.containerEl.ownerDocument.defaultView ?? window;
    const viewport = ownerWindow.visualViewport;
    const sync = () => {
      this.syncViewportSize();
      ownerWindow.requestAnimationFrame(() => this.scrollFocusedFieldIntoView());
    };

    sync();
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);
    ownerWindow.addEventListener("resize", sync);
    ownerWindow.addEventListener("orientationchange", sync);
    this.contentEl.addEventListener("focusin", sync);

    this.viewportCleanup = () => {
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
      ownerWindow.removeEventListener("resize", sync);
      ownerWindow.removeEventListener("orientationchange", sync);
      this.contentEl.removeEventListener("focusin", sync);
    };
  }

  private syncViewportSize() {
    const ownerWindow = this.containerEl.ownerDocument.defaultView ?? window;
    const viewport = ownerWindow.visualViewport;
    const viewportHeight = viewport?.height ?? ownerWindow.innerHeight;
    const viewportTop = viewport?.offsetTop ?? 0;
    const keyboardOffset = Math.max(0, ownerWindow.innerHeight - viewportHeight - viewportTop);

    this.containerEl.style.setProperty("--todoist-task-sheet-viewport-height", `${viewportHeight}px`);
    this.containerEl.style.setProperty("--todoist-task-sheet-keyboard-offset", `${keyboardOffset}px`);
  }

  private scrollFocusedFieldIntoView() {
    const focused = activeDocument.activeElement;
    if (!(focused instanceof HTMLElement) || !this.contentEl.contains(focused)) return;
    focused.scrollIntoView({ block: "center", inline: "nearest" });
  }

  private createSkeleton(): HTMLElement {
    const wrapper = activeDocument.createElement("div");
    wrapper.className = "taskmodal-wrapper taskmodal-skeleton";

    const title = wrapper.createDiv({ cls: "taskmodal-title-field" });
    title.createEl("div", { cls: "taskmodal-skeleton-line taskmodal-skeleton-title" });

    const description = wrapper.createDiv({ cls: "taskmodal-description-field" });
    description.createEl("div", { cls: "taskmodal-skeleton-line taskmodal-skeleton-description" });

    const row = wrapper.createDiv({ cls: "taskmodal-row" });
    row.createEl("div", { cls: "taskmodal-skeleton-line" });
    row.createEl("div", { cls: "taskmodal-skeleton-line" });

    wrapper.createDiv({ cls: "taskmodal-skeleton-line taskmodal-skeleton-labels" });
    return wrapper;
  }

  private createForm(): HTMLElement {
    const { fields, submitLabel, projects, labels } = this.options;
    const wrapper = activeDocument.createElement("div");
    wrapper.className = "taskmodal-wrapper";

    const titleField = wrapper.createDiv({ cls: "taskmodal-title-field" });
    const titleInput = titleField.createEl("input", {
      cls: "taskmodal-title-input",
      type: "text",
      value: fields.title ?? "",
    }) as HTMLInputElement;
    titleInput.placeholder = "Task title";
    this.titleInput = titleInput;

    const descriptionField = wrapper.createDiv({ cls: "taskmodal-description-field" });
    const descriptionInput = descriptionField.createEl("textarea", {
      cls: "taskmodal-description-input",
    }) as HTMLTextAreaElement;
    descriptionInput.placeholder = "Description";
    descriptionInput.value = fields.description ?? "";

    const projectAndDateRow = wrapper.createDiv({ cls: "taskmodal-row" });

    const projectField = projectAndDateRow.createDiv({ cls: "taskmodal-project-field" });
    const projectLabel = projectField.createEl("label", { cls: "taskmodal-project-label" });
    const projectIcon = projectLabel.createSpan({ cls: "taskmodal-label-icon" });
    setIcon(projectIcon, "inbox");
    projectLabel.append("Project");
    const projectControl = projectField.createDiv({ cls: "taskmodal-control taskmodal-project-control" });
    const projectSelect = projectControl.createEl("select", { cls: "taskmodal-project-select" }) as HTMLSelectElement;
    for (const project of Array.isArray(projects) ? projects : []) {
      const option = activeDocument.createElement("option");
      option.value = String(project.id);
      option.textContent = project.name;
      if (fields.projectId && String(project.id) === String(fields.projectId)) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    }

    const dateField = projectAndDateRow.createDiv({ cls: "taskmodal-date-field" });
    const dateLabel = dateField.createEl("label", { cls: "taskmodal-date-label" });
    const dateIcon = dateLabel.createSpan({ cls: "taskmodal-label-icon" });
    setIcon(dateIcon, "calendar");
    dateLabel.append("Due date");
    const dateRow = dateField.createDiv({ cls: "taskmodal-control taskmodal-date-input-row" });
    const dueInput = dateRow.createEl("input", {
      cls: "taskmodal-date-input",
      type: "date",
      value: fields.due ?? "",
    }) as HTMLInputElement;
    dueInput.placeholder = "Due date";

    const clearDateButton = dateRow.createEl("button", { cls: "taskmodal-clear-date" });
    clearDateButton.type = "button";
    clearDateButton.title = "Clear due date";
    clearDateButton.setAttribute("aria-label", "Clear due date");
    setIcon(clearDateButton, "x");
    clearDateButton.onclick = () => {
      dueInput.value = "";
    };

    const labelField = wrapper.createDiv({ cls: "taskmodal-labels-field" });
    const labelsLabel = labelField.createEl("label", { cls: "taskmodal-labels-label" });
    const labelsIcon = labelsLabel.createSpan({ cls: "taskmodal-label-icon" });
    setIcon(labelsIcon, "tag");
    labelsLabel.append("Labels");
    const labelList = labelField.createDiv({ cls: "taskmodal-label-list" });
    for (const label of Array.isArray(labels) ? labels : []) {
      const labelCheckbox = labelList.createEl("label", { cls: "taskmodal-label-checkbox" });
      const checkbox = labelCheckbox.createEl("input", { type: "checkbox" }) as HTMLInputElement;
      checkbox.value = label.name;
      checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
      labelCheckbox.classList.toggle("is-selected", checkbox.checked);
      checkbox.addEventListener("change", () => {
        labelCheckbox.classList.toggle("is-selected", checkbox.checked);
      });
      labelCheckbox.append(label.name);
    }

    const buttonRow = wrapper.createDiv({ cls: "taskmodal-button-row" });
    const cancelButton = buttonRow.createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
    cancelButton.type = "button";
    cancelButton.onclick = () => this.close();

    const submitButton = buttonRow.createEl("button", { cls: "taskmodal-button-save", text: submitLabel });
    submitButton.type = "button";
    submitButton.onclick = () => {
      const title = titleInput.value.trim();
      if (!title) {
        titleInput.focus();
        return;
      }

      const data: TaskModalSubmitData = {
        title,
        description: descriptionInput.value.trim(),
        due: dueInput.value,
        projectId: projectSelect.value,
        labels: Array.from(labelList.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked"))
          .map((input) => input.value),
      };

      this.close();
      window.setTimeout(() => {
        void this.options.onSubmit(data);
      }, 10);
    };

    wrapper.addEventListener("keydown", (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        submitButton.click();
      }
    });

    return wrapper;
  }
}
