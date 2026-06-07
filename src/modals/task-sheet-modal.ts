import { App, Modal, setIcon } from "obsidian";
import { TODOIST_COLORS, TODOIST_COLORS_NUM } from "../constants";
import { clearEl } from "../dom";
import type { Label, Project } from "../types";

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
    const ownerDocument = this.containerEl.ownerDocument;
    const wrapper = ownerDocument.createElement("div");
    wrapper.className = "taskmodal-wrapper";

    const formatDueText = (value: string) => {
      if (!value) return "Due date";
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
    }) as HTMLInputElement;
    titleInput.placeholder = "Task name";
    this.titleInput = titleInput;

    const descriptionField = wrapper.createDiv({ cls: "taskmodal-description-field" });
    const descriptionInput = descriptionField.createEl("textarea", {
      cls: "taskmodal-description-input",
    }) as HTMLTextAreaElement;
    descriptionInput.placeholder = "Description";
    descriptionInput.value = fields.description ?? "";

    const chipRow = wrapper.createDiv({ cls: "taskmodal-chip-row" });

    const dueInput = chipRow.createEl("input", {
      cls: "taskmodal-date-input taskmodal-date-chip-native",
      type: "date",
      value: fields.due ?? "",
    }) as HTMLInputElement;

    const dueChip = chipRow.createEl("button", { cls: "taskmodal-chip taskmodal-date-chip" }) as HTMLButtonElement;
    dueChip.type = "button";
    const dueIcon = dueChip.createSpan({ cls: "taskmodal-chip-icon" });
    setIcon(dueIcon, "calendar");
    const dueText = dueChip.createSpan({ cls: "taskmodal-chip-text" });
    const dueClear = dueChip.createSpan({ cls: "taskmodal-chip-clear" });
    setIcon(dueClear, "x");

    const syncDueChip = () => {
      dueText.textContent = formatDueText(dueInput.value);
      dueChip.classList.toggle("has-value", !!dueInput.value);
      dueChip.setAttribute("aria-label", dueInput.value ? `Due ${dueText.textContent}` : "Set due date");
    };

    dueChip.onclick = () => {
      const showPicker = (dueInput as HTMLInputElement & { showPicker?: () => void }).showPicker;
      if (typeof showPicker === "function") {
        showPicker.call(dueInput);
      } else {
        dueInput.focus();
        dueInput.click();
      }
    };
    dueClear.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dueInput.value = "";
      syncDueChip();
    };
    dueInput.addEventListener("change", syncDueChip);
    syncDueChip();

    const deadlineInput = chipRow.createEl("input", {
      cls: "taskmodal-date-input taskmodal-deadline-chip-native",
      type: "date",
      value: fields.deadline ?? "",
    }) as HTMLInputElement;

    const deadlineChip = chipRow.createEl("button", { cls: "taskmodal-chip taskmodal-deadline-chip" }) as HTMLButtonElement;
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

    deadlineChip.onclick = () => {
      const showPicker = (deadlineInput as HTMLInputElement & { showPicker?: () => void }).showPicker;
      if (typeof showPicker === "function") {
        showPicker.call(deadlineInput);
      } else {
        deadlineInput.focus();
        deadlineInput.click();
      }
    };
    deadlineClear.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      deadlineInput.value = "";
      syncDeadlineChip();
    };
    deadlineInput.addEventListener("change", syncDeadlineChip);
    syncDeadlineChip();

    const priorityField = chipRow.createDiv({ cls: "taskmodal-priority-field" });
    const priorityIcon = priorityField.createSpan({ cls: "taskmodal-chip-icon taskmodal-priority-icon" });
    setIcon(priorityIcon, "flag");
    const prioritySelect = priorityField.createEl("select", { cls: "taskmodal-priority-select" }) as HTMLSelectElement;
    [
      { value: "1", label: "Priority" },
      { value: "4", label: "P1" },
      { value: "3", label: "P2" },
      { value: "2", label: "P3" },
    ].forEach((optionData) => {
      const option = ownerDocument.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      if (String(fields.priority ?? 1) === optionData.value) option.selected = true;
      prioritySelect.appendChild(option);
    });
    priorityField.setAttribute("data-priority", String(fields.priority ?? 1));
    prioritySelect.addEventListener("change", () => {
      priorityField.setAttribute("data-priority", prioritySelect.value);
      prioritySelect.setAttribute("aria-label", priorityLabel(Number(prioritySelect.value)));
    });
    prioritySelect.setAttribute("aria-label", priorityLabel(Number(prioritySelect.value)));

    const labelAnchor = chipRow.createDiv({ cls: "taskmodal-label-anchor" });
    const labelButton = labelAnchor.createEl("button", { cls: "taskmodal-chip taskmodal-label-chip" }) as HTMLButtonElement;
    labelButton.type = "button";
    const labelButtonIcon = labelButton.createSpan({ cls: "taskmodal-chip-icon" });
    setIcon(labelButtonIcon, "tag");
    const labelButtonText = labelButton.createSpan({ cls: "taskmodal-chip-text" });

    const labelPopover = labelAnchor.createDiv({ cls: "taskmodal-label-popover" });
    const labelSearch = labelPopover.createEl("input", {
      cls: "taskmodal-label-search",
      type: "text",
      placeholder: "Type a label",
    }) as HTMLInputElement;
    const labelList = labelPopover.createDiv({ cls: "taskmodal-label-list" });

    const syncLabelChip = () => {
      const checked = Array.from(labelList.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked"));
      labelButtonText.textContent = checked.length ? `Labels ${checked.length}` : "Labels";
      labelButton.classList.toggle("has-value", checked.length > 0);
    };

    for (const label of Array.isArray(labels) ? labels : []) {
      const labelCheckbox = labelList.createEl("label", { cls: "taskmodal-label-option" });
      const checkbox = labelCheckbox.createEl("input", { type: "checkbox" }) as HTMLInputElement;
      checkbox.value = label.name;
      checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
      labelCheckbox.classList.toggle("is-selected", checkbox.checked);
      const labelIcon = labelCheckbox.createSpan({ cls: "taskmodal-label-option-icon" });
      labelIcon.style.setProperty("--taskmodal-label-color", labelColor(label));
      setIcon(labelIcon, "tag");
      labelCheckbox.createSpan({ cls: "taskmodal-label-option-name", text: label.name });
      const checkIcon = labelCheckbox.createSpan({ cls: "taskmodal-label-option-check" });
      setIcon(checkIcon, "check");
      checkbox.addEventListener("change", () => {
        labelCheckbox.classList.toggle("is-selected", checkbox.checked);
        syncLabelChip();
      });
    }
    syncLabelChip();

    labelButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      labelAnchor.classList.toggle("is-open");
      if (labelAnchor.classList.contains("is-open")) {
        window.setTimeout(() => labelSearch.focus(), 0);
      }
    };
    labelPopover.addEventListener("click", (event) => event.stopPropagation());
    labelSearch.addEventListener("input", () => {
      const query = labelSearch.value.trim().toLowerCase();
      labelList.querySelectorAll<HTMLElement>(".taskmodal-label-option").forEach((option) => {
        const name = option.querySelector<HTMLElement>(".taskmodal-label-option-name")?.textContent || "";
        option.classList.toggle("tb-hidden", !!query && !name.toLowerCase().includes(query));
      });
    });

    wrapper.addEventListener("click", (event) => {
      if (!(event.target as HTMLElement).closest(".taskmodal-label-anchor")) {
        labelAnchor.classList.remove("is-open");
      }
    });

    const footerRow = wrapper.createDiv({ cls: "taskmodal-footer-row" });
    const projectField = footerRow.createDiv({ cls: "taskmodal-project-field" });
    const projectIcon = projectField.createSpan({ cls: "taskmodal-footer-icon" });
    setIcon(projectIcon, "inbox");
    const projectVisible = projectField.createDiv({ cls: "taskmodal-project-visible" });
    const projectName = projectVisible.createSpan({ cls: "taskmodal-project-name" });
    const projectChevron = projectVisible.createSpan({ cls: "taskmodal-project-chevron" });
    setIcon(projectChevron, "chevron-down");
    const projectSelect = projectField.createEl("select", { cls: "taskmodal-project-select" }) as HTMLSelectElement;
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
      projectName.textContent = selectedName || "Inbox";
      projectIcon.classList.toggle("tb-hidden", selectedName.trim().toLowerCase() !== "inbox");
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
