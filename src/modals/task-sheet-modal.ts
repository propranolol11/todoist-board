import { App, Modal, setIcon } from "obsidian";
import { TODOIST_COLORS, TODOIST_COLORS_NUM } from "../constants";
import { clearEl } from "../dom";
import type { AddTaskModalSettings, Label, Project } from "../types";

export interface TaskModalFields {
  title?: string;
  description?: string;
  due?: string;
  deadline?: string;
  priority?: number;
  projectId?: string;
  labels?: string[];
}

export interface TaskModalSubmitData {
  title: string;
  description: string;
  due: string;
  deadline: string;
  priority: number;
  projectId: string;
  labels: string[];
}

export interface TaskSheetModalOptions {
  title: string;
  fields: TaskModalFields;
  submitLabel: string;
  projects: Project[];
  labels: Label[];
  visibleFields?: Partial<AddTaskModalSettings>;
  onOpenSettings?: () => void;
  onSubmit: (data: TaskModalSubmitData) => Promise<void> | void;
}

export class TaskSheetModal extends Modal {
  private options: TaskSheetModalOptions;
  private opened = false;
  private titleInput: HTMLInputElement | null = null;
  private lastTextInput: HTMLInputElement | HTMLTextAreaElement | null = null;
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
    this.containerEl.classList.remove("is-keyboard-open");
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

  private rememberTextInput(input: HTMLInputElement | HTMLTextAreaElement) {
    this.lastTextInput = input;
    input.addEventListener("focus", () => {
      this.lastTextInput = input;
    });
  }

  private keepKeyboardOnPointerDown(element: HTMLElement) {
    element.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.lastTextInput?.focus();
    });
  }

  private restoreTextFocus(delay = 0) {
    const input = this.lastTextInput;
    if (!input) return;
    window.setTimeout(() => input.focus(), delay);
  }

  private openDatePicker(input: HTMLInputElement) {
    const dateInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof dateInput.showPicker === "function") {
      try {
        dateInput.showPicker();
        this.restoreTextFocus();
        return;
      } catch {
        // Fall back to a normal click for hosts that expose but reject showPicker.
      }
    }
    input.click();
    this.restoreTextFocus();
    this.restoreTextFocus(250);
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
    const delayedSync = () => {
      ownerWindow.setTimeout(sync, 80);
    };

    sync();
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);
    ownerWindow.addEventListener("resize", sync);
    ownerWindow.addEventListener("orientationchange", sync);
    this.contentEl.addEventListener("focusin", sync);
    this.contentEl.addEventListener("focusout", delayedSync);

    this.viewportCleanup = () => {
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
      ownerWindow.removeEventListener("resize", sync);
      ownerWindow.removeEventListener("orientationchange", sync);
      this.contentEl.removeEventListener("focusin", sync);
      this.contentEl.removeEventListener("focusout", delayedSync);
    };
  }

  private syncViewportSize() {
    const ownerWindow = this.containerEl.ownerDocument.defaultView ?? window;
    const viewport = ownerWindow.visualViewport;
    const viewportHeightRaw = viewport?.height ?? ownerWindow.innerHeight;
    const viewportTop = viewport?.offsetTop ?? 0;
    const visualKeyboardOffset = Math.max(0, ownerWindow.innerHeight - viewportHeightRaw - viewportTop);
    const shouldUseKeyboardFallback = this.isMobileTextEntryFocused(ownerWindow) && visualKeyboardOffset < 80;
    const fallbackKeyboardOffset = shouldUseKeyboardFallback
      ? Math.round(ownerWindow.innerHeight * 0.42)
      : 0;
    const keyboardOffset = Math.max(visualKeyboardOffset, fallbackKeyboardOffset);
    const viewportHeight = Math.max(240, ownerWindow.innerHeight - keyboardOffset);

    this.containerEl.classList.toggle("is-keyboard-open", keyboardOffset > 0);
    this.containerEl.style.setProperty("--todoist-task-sheet-viewport-height", `${viewportHeight}px`);
    this.containerEl.style.setProperty("--todoist-task-sheet-keyboard-offset", `${keyboardOffset}px`);
  }

  private scrollFocusedFieldIntoView() {
    const focused = this.containerEl.ownerDocument.activeElement;
    if (!(focused instanceof HTMLElement) || !this.contentEl.contains(focused)) return;
    focused.scrollIntoView({ block: "center", inline: "nearest" });
  }

  private isMobileTextEntryFocused(ownerWindow: Window): boolean {
    const focused = this.containerEl.ownerDocument.activeElement;
    if (!(focused instanceof HTMLElement) || !this.contentEl.contains(focused)) return false;

    const isEditable = focused.instanceOf(HTMLTextAreaElement)
      || focused.isContentEditable
      || (focused.instanceOf(HTMLInputElement) && ![
        "button",
        "checkbox",
        "color",
        "date",
        "file",
        "hidden",
        "image",
        "radio",
        "range",
        "reset",
        "submit",
        "time",
      ].includes(focused.type));
    if (!isEditable) return false;

    return ownerWindow.matchMedia("(pointer: coarse), (max-width: 700px)").matches;
  }

  private createSkeleton(): HTMLElement {
    const ownerDocument = this.containerEl.ownerDocument;
    const wrapper = ownerDocument.createElement("div");
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
    const visibleFields: AddTaskModalSettings = {
      dueDate: true,
      deadline: true,
      priority: true,
      project: true,
      labels: true,
      ...(this.options.visibleFields || {}),
    };
    const ownerDocument = this.containerEl.ownerDocument;
    const wrapper = ownerDocument.createElement("div");
    wrapper.className = "taskmodal-wrapper";

    const formatDueText = (value: string) => {
      if (!value) return "Date";
      const today = new Date();
      const todayIso = today.toISOString().slice(0, 10);
      if (value === todayIso) return "Today";
      const parsed = new Date(`${value}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return value;
      return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    };

    const formatDeadlineText = (value: string) => {
      if (!value) return "Deadline";
      return formatDueText(value);
    };

    const priorityLabel = (priority: number) => {
      const safePriority = Number(priority) || 1;
      if (safePriority === 4) return "P1";
      if (safePriority === 3) return "P2";
      if (safePriority === 2) return "P3";
      return "Priority";
    };

    const labelColor = (label: Label) => {
      const raw = label.color;
      if (typeof raw === "number") return TODOIST_COLORS_NUM[raw] || "#e44332";
      if (typeof raw === "string") return TODOIST_COLORS[raw] || raw || "#e44332";
      return "#e44332";
    };

    const titleField = wrapper.createDiv({ cls: "taskmodal-title-field" });
    const titleInput = titleField.createEl("input", {
      cls: "taskmodal-title-input",
      type: "text",
      value: fields.title ?? "",
    });
    titleInput.placeholder = "Task name";
    this.titleInput = titleInput;
    this.rememberTextInput(titleInput);

    const descriptionField = wrapper.createDiv({ cls: "taskmodal-description-field" });
    const descriptionInput = descriptionField.createEl("textarea", {
      cls: "taskmodal-description-input",
    });
    descriptionInput.placeholder = "Description";
    descriptionInput.value = fields.description ?? "";
    this.rememberTextInput(descriptionInput);

    const chipRow = wrapper.createDiv({ cls: "taskmodal-chip-row" });

    const dueAnchor = visibleFields.dueDate
      ? chipRow.createDiv({ cls: "taskmodal-date-anchor" })
      : ownerDocument.createElement("div");
    const dueInput = dueAnchor.createEl("input", {
      cls: "taskmodal-date-input taskmodal-date-chip-native",
      type: "date",
      value: fields.due ?? "",
    });

    if (visibleFields.dueDate) {
      const dueChip = dueAnchor.createEl("button", { cls: "taskmodal-chip taskmodal-date-chip" });
      dueChip.type = "button";
      const dueIcon = dueChip.createSpan({ cls: "taskmodal-chip-icon" });
      setIcon(dueIcon, "calendar");
      const dueText = dueChip.createSpan({ cls: "taskmodal-chip-text" });
      const dueClear = dueChip.createSpan({ cls: "taskmodal-chip-clear" });
      setIcon(dueClear, "x");

      const syncDueChip = () => {
        dueText.textContent = formatDueText(dueInput.value);
        dueChip.classList.toggle("has-value", !!dueInput.value);
        dueChip.setAttribute("aria-label", dueInput.value ? `Date ${dueText.textContent}` : "Set date");
      };

      this.keepKeyboardOnPointerDown(dueChip);
      dueChip.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openDatePicker(dueInput);
      };
      dueClear.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        dueInput.value = "";
        syncDueChip();
        this.lastTextInput?.focus();
      };
      this.keepKeyboardOnPointerDown(dueClear);
      dueInput.addEventListener("change", syncDueChip);
      syncDueChip();
    }

    const deadlineAnchor = visibleFields.deadline
      ? chipRow.createDiv({ cls: "taskmodal-date-anchor" })
      : ownerDocument.createElement("div");
    const deadlineInput = deadlineAnchor.createEl("input", {
      cls: "taskmodal-date-input taskmodal-deadline-chip-native",
      type: "date",
      value: fields.deadline ?? "",
    });

    if (visibleFields.deadline) {
      const deadlineChip = deadlineAnchor.createEl("button", { cls: "taskmodal-chip taskmodal-deadline-chip" });
      deadlineChip.type = "button";
      const deadlineIcon = deadlineChip.createSpan({ cls: "taskmodal-chip-icon" });
      setIcon(deadlineIcon, "target");
      const deadlineText = deadlineChip.createSpan({ cls: "taskmodal-chip-text" });
      const deadlineClear = deadlineChip.createSpan({ cls: "taskmodal-chip-clear" });
      setIcon(deadlineClear, "x");

      const syncDeadlineChip = () => {
        deadlineText.textContent = formatDeadlineText(deadlineInput.value);
        deadlineChip.classList.toggle("has-value", !!deadlineInput.value);
        deadlineChip.setAttribute("aria-label", deadlineInput.value ? `Deadline ${deadlineText.textContent}` : "Set deadline");
      };

      this.keepKeyboardOnPointerDown(deadlineChip);
      deadlineChip.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openDatePicker(deadlineInput);
      };
      deadlineClear.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        deadlineInput.value = "";
        syncDeadlineChip();
        this.lastTextInput?.focus();
      };
      this.keepKeyboardOnPointerDown(deadlineClear);
      deadlineInput.addEventListener("change", syncDeadlineChip);
      syncDeadlineChip();
    }

    const priorityField = visibleFields.priority
      ? chipRow.createDiv({ cls: "taskmodal-priority-field" })
      : ownerDocument.createElement("div");
    if (visibleFields.priority) {
      const priorityIcon = priorityField.createSpan({ cls: "taskmodal-chip-icon taskmodal-priority-icon" });
      setIcon(priorityIcon, "flag");
    }
    const priorityButton = visibleFields.priority
      ? priorityField.createEl("button", { cls: "taskmodal-priority-button" })
      : ownerDocument.createElement("button");
    priorityButton.type = "button";
    const prioritySelect = priorityField.createEl("input", { cls: "taskmodal-priority-value", type: "hidden" });
    const priorityMenu = visibleFields.priority
      ? priorityField.createDiv({ cls: "taskmodal-priority-menu" })
      : ownerDocument.createElement("div");
    [
      { value: "1", label: "Priority" },
      { value: "4", label: "P1" },
      { value: "3", label: "P2" },
      { value: "2", label: "P3" },
    ].forEach((optionData) => {
      const option = priorityMenu.createEl("button", { cls: "taskmodal-priority-option", text: optionData.label });
      option.type = "button";
      option.dataset.value = optionData.value;
      this.keepKeyboardOnPointerDown(option);
      option.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        prioritySelect.value = optionData.value;
        priorityField.setAttribute("data-priority", prioritySelect.value);
        priorityButton.textContent = priorityLabel(Number(prioritySelect.value));
        priorityButton.setAttribute("aria-label", priorityLabel(Number(prioritySelect.value)));
        priorityMenu.classList.remove("is-open");
        this.lastTextInput?.focus();
      };
    });
    priorityField.setAttribute("data-priority", String(fields.priority ?? 1));
    prioritySelect.value = String(fields.priority ?? 1);
    if (visibleFields.priority) {
      priorityButton.textContent = priorityLabel(Number(prioritySelect.value));
      priorityButton.setAttribute("aria-label", priorityLabel(Number(prioritySelect.value)));
      this.keepKeyboardOnPointerDown(priorityButton);
      priorityButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        priorityMenu.classList.toggle("is-open");
        this.lastTextInput?.focus();
      };
    }

    const labelAnchor = visibleFields.labels
      ? chipRow.createDiv({ cls: "taskmodal-label-anchor" })
      : ownerDocument.createElement("div");
    const labelButton = visibleFields.labels
      ? labelAnchor.createEl("button", { cls: "taskmodal-chip taskmodal-label-chip" })
      : ownerDocument.createElement("button");
    labelButton.type = "button";
    if (visibleFields.labels) {
      this.keepKeyboardOnPointerDown(labelButton);
    }
    let labelButtonText: HTMLElement | null = null;
    if (visibleFields.labels) {
      const labelButtonIcon = labelButton.createSpan({ cls: "taskmodal-chip-icon" });
      setIcon(labelButtonIcon, "tag");
      labelButtonText = labelButton.createSpan({ cls: "taskmodal-chip-text" });
    }

    const labelPopover = visibleFields.labels
      ? labelAnchor.createDiv({ cls: "taskmodal-label-popover" })
      : ownerDocument.createElement("div");
    const labelSearch = visibleFields.labels
      ? labelPopover.createEl("input", {
        cls: "taskmodal-label-search",
        type: "text",
        placeholder: "Type a label",
      })
      : ownerDocument.createElement("input");
    const labelList = visibleFields.labels
      ? labelPopover.createDiv({ cls: "taskmodal-label-list" })
      : ownerDocument.createElement("div");
    if (visibleFields.labels) {
      this.rememberTextInput(labelSearch);
    }

    const syncLabelChip = () => {
      const checked = Array.from(labelList.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked"));
      if (labelButtonText) labelButtonText.textContent = checked.length ? `Labels ${checked.length}` : "Labels";
      labelButton.classList.toggle("has-value", checked.length > 0);
    };

    for (const label of Array.isArray(labels) ? labels : []) {
      const labelCheckbox = labelList.createEl("label", { cls: "taskmodal-label-option" });
      const checkbox = labelCheckbox.createEl("input", { type: "checkbox" });
      checkbox.value = label.name;
      checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
      labelCheckbox.classList.toggle("is-selected", checkbox.checked);
      this.keepKeyboardOnPointerDown(labelCheckbox);
      const labelIcon = labelCheckbox.createSpan({ cls: "taskmodal-label-option-icon" });
      labelIcon.style.setProperty("--taskmodal-label-color", labelColor(label));
      setIcon(labelIcon, "tag");
      labelCheckbox.createSpan({ cls: "taskmodal-label-option-name", text: label.name });
      const checkIcon = labelCheckbox.createSpan({ cls: "taskmodal-label-option-check" });
      setIcon(checkIcon, "check");
      const syncLabelOption = () => {
        labelCheckbox.classList.toggle("is-selected", checkbox.checked);
        syncLabelChip();
        this.restoreTextFocus();
      };
      labelCheckbox.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        checkbox.checked = !checkbox.checked;
        syncLabelOption();
      };
      checkbox.addEventListener("change", () => {
        syncLabelOption();
      });
    }
    syncLabelChip();

    if (visibleFields.labels) {
      labelButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        labelAnchor.classList.toggle("is-open");
        this.lastTextInput?.focus();
      };
      labelPopover.addEventListener("click", (event) => event.stopPropagation());
      labelSearch.addEventListener("input", () => {
        const query = labelSearch.value.trim().toLowerCase();
        labelList.querySelectorAll<HTMLElement>(".taskmodal-label-option").forEach((option) => {
          const name = option.querySelector<HTMLElement>(".taskmodal-label-option-name")?.textContent || "";
          option.classList.toggle("tb-hidden", !!query && !name.toLowerCase().includes(query));
        });
      });
    }

    if (this.options.onOpenSettings) {
      const settingsButton = chipRow.createEl("button", {
        cls: "taskmodal-chip taskmodal-more-settings-button",
        text: "...",
        type: "button",
      });
      settingsButton.setAttribute("aria-label", "Edit add task modal fields");
      settingsButton.title = "Edit add task modal fields";
      this.keepKeyboardOnPointerDown(settingsButton);
      settingsButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.options.onOpenSettings?.();
      };
    }

    wrapper.addEventListener("click", (event) => {
      if (!(event.target as HTMLElement).closest(".taskmodal-label-anchor")) {
        labelAnchor.classList.remove("is-open");
      }
      if (!(event.target as HTMLElement).closest(".taskmodal-priority-field")) {
        priorityMenu.classList.remove("is-open");
      }
    });

    const footerRow = wrapper.createDiv({ cls: "taskmodal-footer-row" });
    const projectField = visibleFields.project
      ? footerRow.createDiv({ cls: "taskmodal-project-field" })
      : ownerDocument.createElement("div");
    let projectIcon: HTMLElement | null = null;
    let projectName: HTMLElement | null = null;
    if (visibleFields.project) {
      projectIcon = projectField.createSpan({ cls: "taskmodal-footer-icon" });
      setIcon(projectIcon, "inbox");
      const projectVisible = projectField.createDiv({ cls: "taskmodal-project-visible" });
      projectName = projectVisible.createSpan({ cls: "taskmodal-project-name" });
      const projectChevron = projectVisible.createSpan({ cls: "taskmodal-project-chevron" });
      setIcon(projectChevron, "chevron-down");
    }
    const projectSelect = projectField.createEl("select", { cls: "taskmodal-project-select" });
    for (const project of Array.isArray(projects) ? projects : []) {
      const option = ownerDocument.createElement("option");
      option.value = String(project.id);
      option.textContent = project.name;
      if (fields.projectId && String(project.id) === String(fields.projectId)) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    }
    const syncProjectChrome = () => {
      const selectedName = projectSelect.selectedOptions[0]?.textContent || "";
      if (projectName) projectName.textContent = selectedName || "Inbox";
      projectIcon?.classList.toggle("tb-hidden", selectedName.trim().toLowerCase() !== "inbox");
    };
    projectSelect.addEventListener("change", syncProjectChrome);
    syncProjectChrome();

    const buttonRow = footerRow.createDiv({ cls: "taskmodal-button-row" });
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
        deadline: deadlineInput.value,
        priority: Number(prioritySelect.value) || 1,
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
