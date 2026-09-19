import { App, Modal, setIcon } from "obsidian";
import { TODOIST_COLORS, TODOIST_COLORS_NUM } from "../constants";
import { clearEl } from "../dom";
import type { AddTaskModalSettings, Label, Project } from "../types";

export interface TaskModalFields {
  title?: string;
  description?: string;
  due?: string;
  repeats?: string;
  deadline?: string;
  priority?: number;
  projectId?: string;
  labels?: string[];
}

export interface TaskModalSubmitData {
  title: string;
  description: string;
  due: string;
  repeats: string;
  deadline: string;
  priority: number;
  projectId: string;
  labels: string[];
}

export class TaskModalFieldError extends Error {
  readonly field: keyof TaskModalSubmitData;

  constructor(field: keyof TaskModalSubmitData, message: string) {
    super(message);
    this.name = "TaskModalFieldError";
    this.field = field;
  }
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
  submitInBackground?: boolean;
}

export class TaskSheetModal extends Modal {
  private options: TaskSheetModalOptions;
  private opened = false;
  private titleInput: HTMLInputElement | null = null;
  private lastTextInput: HTMLInputElement | HTMLTextAreaElement | null = null;
  private viewportCleanup: (() => void) | null = null;
  private readFormData: (() => TaskModalSubmitData) | null = null;
  private initialFormData: TaskModalSubmitData | null = null;
  private submitting = false;
  private pendingFormRender = false;
  private fieldErrors: Partial<Record<keyof TaskModalSubmitData, string>> = {};

  constructor(app: App, options: TaskSheetModalOptions) {
    super(app);
    this.options = options;
  }

  onOpen() {
    this.opened = true;
    this.containerEl.classList.add("todoist-edit-task-modal", "todoist-task-sheet-modal");
    this.installViewportTracking();
    this.renderForm();
    window.setTimeout(() => {
      const invalidInput = this.contentEl.querySelector<HTMLInputElement>("[aria-invalid='true']");
      if (invalidInput) this.focusTextInput(invalidInput);
      else this.focusTitle();
    }, 10);
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
    this.lastTextInput = null;
    this.readFormData = null;
    this.initialFormData = null;
    this.pendingFormRender = false;
    this.fieldErrors = {};
  }

  setLoading(title = this.options.title) {
    this.options = { ...this.options, title };
    if (!this.opened) return;
    this.setTitle(title);
    clearEl(this.contentEl);
    this.readFormData = null;
    this.initialFormData = null;
    this.contentEl.appendChild(this.createSkeleton());
  }

  setForm(options: Partial<TaskSheetModalOptions>, { preserveInput = false } = {}) {
    const current = preserveInput ? this.readFormData?.() : null;
    const focused = preserveInput ? this.getActiveTextInput() : null;
    const focusedClass = [
      "taskmodal-title-input", "taskmodal-description-input", "taskmodal-repeats-input", "taskmodal-label-search",
    ].find((className) => focused?.classList.contains(className));
    const selection = focused ? [focused.selectionStart, focused.selectionEnd] as const : null;
    const changedFields = current && this.initialFormData
      ? Object.fromEntries(Object.entries(current).filter(([key, value]) =>
        JSON.stringify(value) !== JSON.stringify(this.initialFormData?.[key as keyof TaskModalSubmitData]),
      ))
      : {};
    this.options = {
      ...this.options,
      ...options,
      fields: { ...(options.fields ?? this.options.fields), ...changedFields },
    };
    if (this.opened) {
      if (this.submitting) this.pendingFormRender = true;
      else {
        this.renderForm();
        const target = focusedClass
          ? this.contentEl.querySelector<HTMLInputElement | HTMLTextAreaElement>(`.${focusedClass}`)
          : null;
        if (target) {
          const datePopover = target.closest(".taskmodal-date-popover");
          if (datePopover) {
            datePopover.classList.add("is-open");
            const anchor = datePopover.closest(".taskmodal-date-anchor");
            anchor?.classList.add("is-open");
            anchor?.querySelector(".taskmodal-chip[aria-expanded]")?.setAttribute("aria-expanded", "true");
          }
          target.closest(".taskmodal-label-anchor")?.classList.add("is-open");
          this.focusTextInput(target);
          if (selection) target.setSelectionRange(selection[0], selection[1]);
        }
      }
    }
  }

  focusTitle(select = false) {
    this.titleInput?.focus();
    if (select) this.titleInput?.select();
  }

  private rememberTextInput(input: HTMLInputElement | HTMLTextAreaElement) {
    if (!this.lastTextInput) this.lastTextInput = input;
    input.addEventListener("focus", () => {
      this.lastTextInput = input;
    });
  }

  private getActiveTextInput(): HTMLInputElement | HTMLTextAreaElement | null {
    const focused = this.containerEl.ownerDocument.activeElement;
    if (!(focused instanceof HTMLElement) || !this.contentEl.contains(focused)) return null;
    if (focused.instanceOf(HTMLTextAreaElement)) return focused;
    if (!focused.instanceOf(HTMLInputElement)) return null;
    if ([
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
    ].includes(focused.type)) {
      return null;
    }
    return focused;
  }

  private isKeyboardTarget(input: HTMLInputElement | HTMLTextAreaElement | null): input is HTMLInputElement | HTMLTextAreaElement {
    if (!input || !this.contentEl.contains(input) || input.disabled) return false;
    const labelPopover = input.closest(".taskmodal-label-popover");
    if (labelPopover && !labelPopover.closest(".taskmodal-label-anchor.is-open")) return false;
    const datePopover = input.closest(".taskmodal-date-popover");
    if (datePopover && !datePopover.classList.contains("is-open")) return false;
    return true;
  }

  private getKeyboardTarget(): HTMLInputElement | HTMLTextAreaElement | null {
    const activeInput = this.getActiveTextInput();
    if (this.isKeyboardTarget(activeInput)) return activeInput;
    if (this.isKeyboardTarget(this.lastTextInput)) return this.lastTextInput;
    if (this.isKeyboardTarget(this.titleInput)) return this.titleInput;
    return null;
  }

  private focusTextInput(input: HTMLInputElement | HTMLTextAreaElement) {
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
  }

  private restoreTextFocus(delay = 0) {
    const input = this.getKeyboardTarget();
    if (!input) return;
    if (delay <= 0) {
      this.focusTextInput(input);
      return;
    }
    window.setTimeout(() => this.focusTextInput(input), delay);
  }

  private keepKeyboardOnPointerDown(element: HTMLElement) {
    if (element.instanceOf(HTMLButtonElement)) {
      element.tabIndex = -1;
    }

    element.addEventListener("focus", () => this.restoreTextFocus());
    element.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.restoreTextFocus();
    });
    element.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.restoreTextFocus();
    });
    element.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      this.restoreTextFocus();
    }, { passive: true });
  }

  private parseDateValue(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
    return date;
  }

  private toDateValue(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private dispatchInputChange(input: HTMLInputElement) {
    const EventCtor = input.ownerDocument.defaultView?.Event ?? Event;
    input.dispatchEvent(new EventCtor("change", { bubbles: true }));
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  private initialCalendarMonth(value: string): Date {
    const selected = this.parseDateValue(value) ?? new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  }

  private closeDatePopovers(except?: HTMLElement) {
    this.contentEl.querySelectorAll<HTMLElement>(".taskmodal-date-popover.is-open").forEach((popover) => {
      if (popover === except) return;
      popover.classList.remove("is-open");
      const anchor = popover.closest(".taskmodal-date-anchor");
      anchor?.classList.remove("is-open");
      anchor?.querySelector(".taskmodal-chip[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
  }

  private openDatePopover(anchor: HTMLElement, popover: HTMLElement, input: HTMLInputElement, monthState: { value: Date }) {
    const willOpen = !popover.classList.contains("is-open");
    this.closeDatePopovers(popover);
    anchor.classList.toggle("is-open", willOpen);
    popover.classList.toggle("is-open", willOpen);
    if (willOpen) {
      monthState.value = this.initialCalendarMonth(input.value);
      this.renderDatePopover(anchor, popover, input, monthState);
    }
    this.restoreTextFocus();
  }

  private renderDatePopover(anchor: HTMLElement, popover: HTMLElement, input: HTMLInputElement, monthState: { value: Date }) {
    clearEl(popover);
    if (!popover.dataset.keyboardGuardInstalled) {
      ["pointerdown", "mousedown", "touchstart", "click"].forEach((eventName) => {
        popover.addEventListener(eventName, (event) => event.stopPropagation());
      });
      popover.dataset.keyboardGuardInstalled = "true";
    }
    const selectedDate = this.parseDateValue(input.value);
    const today = new Date();
    const monthStart = new Date(monthState.value.getFullYear(), monthState.value.getMonth(), 1);
    const firstGridDay = new Date(monthStart);
    firstGridDay.setDate(1 - monthStart.getDay());

    const header = popover.createDiv({ cls: "taskmodal-date-popover-header" });
    const prevButton = header.createEl("button", { cls: "taskmodal-date-nav", type: "button" });
    setIcon(prevButton, "chevron-left");
    header.createDiv({
      cls: "taskmodal-date-month",
      text: monthStart.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    });
    const nextButton = header.createEl("button", { cls: "taskmodal-date-nav", type: "button" });
    setIcon(nextButton, "chevron-right");

    const moveMonth = (offset: number) => {
      monthState.value = new Date(monthState.value.getFullYear(), monthState.value.getMonth() + offset, 1);
      this.renderDatePopover(anchor, popover, input, monthState);
      this.restoreTextFocus();
      this.restoreTextFocus(80);
    };

    [prevButton, nextButton].forEach((button) => this.keepKeyboardOnPointerDown(button));
    prevButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      moveMonth(-1);
    };
    nextButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      moveMonth(1);
    };

    const weekdays = popover.createDiv({ cls: "taskmodal-date-weekdays" });
    ["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
      weekdays.createSpan({ text: day });
    });

    const grid = popover.createDiv({ cls: "taskmodal-date-grid" });
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(firstGridDay);
      date.setDate(firstGridDay.getDate() + index);
      const button = grid.createEl("button", {
        cls: "taskmodal-date-day",
        text: String(date.getDate()),
        type: "button",
      });
      button.classList.toggle("is-muted", date.getMonth() !== monthStart.getMonth());
      button.classList.toggle("is-today", this.sameDay(date, today));
      button.classList.toggle("is-selected", !!selectedDate && this.sameDay(date, selectedDate));
      this.keepKeyboardOnPointerDown(button);
      button.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        input.value = this.toDateValue(date);
        this.dispatchInputChange(input);
        popover.classList.remove("is-open");
        anchor.classList.remove("is-open");
        this.restoreTextFocus();
      };
    }

    const footer = popover.createDiv({ cls: "taskmodal-date-popover-footer" });
    const cancelButton = footer.createEl("button", { cls: "taskmodal-date-cancel", text: "Cancel", type: "button" });
    const todayButton = footer.createEl("button", { cls: "taskmodal-date-today", text: "Today", type: "button" });
    this.keepKeyboardOnPointerDown(cancelButton);
    this.keepKeyboardOnPointerDown(todayButton);
    cancelButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      popover.classList.remove("is-open");
      anchor.classList.remove("is-open");
      this.restoreTextFocus();
    };
    todayButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      input.value = this.toDateValue(new Date());
      this.dispatchInputChange(input);
      popover.classList.remove("is-open");
      anchor.classList.remove("is-open");
      this.restoreTextFocus();
    };
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
    const wrapper = this.containerEl.ownerDocument.adoptNode(createDiv({ cls: "taskmodal-wrapper taskmodal-skeleton" }));

    const title = wrapper.createDiv({ cls: "taskmodal-title-field" });
    title.createDiv({ cls: "taskmodal-skeleton-line taskmodal-skeleton-title" });

    const description = wrapper.createDiv({ cls: "taskmodal-description-field" });
    description.createDiv({ cls: "taskmodal-skeleton-line taskmodal-skeleton-description" });

    const row = wrapper.createDiv({ cls: "taskmodal-row" });
    row.createDiv({ cls: "taskmodal-skeleton-line" });
    row.createDiv({ cls: "taskmodal-skeleton-line" });

    wrapper.createDiv({ cls: "taskmodal-skeleton-line taskmodal-skeleton-labels" });
    return wrapper;
  }

  private createForm(): HTMLElement {
    const { fields, submitLabel, projects, labels } = this.options;
    const visibleFields: AddTaskModalSettings = {
      dueDate: true,
      repeats: true,
      deadline: true,
      priority: true,
      project: true,
      labels: true,
      ...(this.options.visibleFields || {}),
    };
    const ownerDocument = this.containerEl.ownerDocument;
    const wrapper = ownerDocument.adoptNode(createDiv({ cls: "taskmodal-wrapper" }));

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
      : ownerDocument.adoptNode(createDiv());
    const dueInput = dueAnchor.createEl("input", {
      cls: "taskmodal-date-input taskmodal-date-chip-native",
      type: "date",
      value: fields.due ?? "",
    });
    const duePopover = visibleFields.dueDate
      ? dueAnchor.createDiv({ cls: "taskmodal-date-popover" })
      : ownerDocument.adoptNode(createDiv());
    const dueMonthState = { value: this.initialCalendarMonth(fields.due ?? "") };

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
        this.openDatePopover(dueAnchor, duePopover, dueInput, dueMonthState);
      };
      dueClear.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        dueInput.value = "";
        syncDueChip();
        this.restoreTextFocus();
      };
      this.keepKeyboardOnPointerDown(dueClear);
      dueInput.addEventListener("change", syncDueChip);
      syncDueChip();
    }

    const repeatsAnchor = visibleFields.repeats
      ? chipRow.createDiv({ cls: "taskmodal-date-anchor taskmodal-repeats-anchor" })
      : ownerDocument.adoptNode(createDiv());
    const repeatsPopover = repeatsAnchor.createDiv({ cls: "taskmodal-date-popover taskmodal-repeats-popover" });
    const repeatsLabel = repeatsPopover.createEl("label", { cls: "taskmodal-repeats-label" });
    repeatsLabel.createSpan({ text: "Repeats" });
    const repeatsErrorMessage = this.fieldErrors.repeats;
    const repeatsError = repeatsErrorMessage
      ? repeatsLabel.createDiv({ cls: "taskmodal-repeats-error", text: repeatsErrorMessage })
      : null;
    const repeatsInput = repeatsLabel.createEl("input", {
      cls: "taskmodal-label-search taskmodal-repeats-input",
      type: "text",
      value: fields.repeats ?? "",
      placeholder: "every Monday at 9am",
    });
    repeatsInput.autocomplete = "off";
    if (repeatsError) {
      repeatsError.id = "taskmodal-repeats-error";
      repeatsInput.setAttribute("aria-invalid", "true");
      repeatsInput.setAttribute("aria-describedby", repeatsError.id);
    }
    repeatsPopover.createEl("p", {
      cls: "taskmodal-repeats-help",
      text: "Uses Todoist’s natural-language scheduling.",
    });

    if (visibleFields.repeats) {
      this.rememberTextInput(repeatsInput);
      const repeatsChip = repeatsAnchor.createEl("button", {
        cls: "taskmodal-chip taskmodal-repeats-chip",
        type: "button",
      });
      repeatsChip.setAttribute("aria-expanded", "false");
      const repeatsIcon = repeatsChip.createSpan({ cls: "taskmodal-chip-icon" });
      setIcon(repeatsIcon, "repeat");
      const repeatsText = repeatsChip.createSpan({ cls: "taskmodal-chip-text" });
      const repeatsClear = repeatsChip.createSpan({ cls: "taskmodal-chip-clear" });
      repeatsClear.setAttribute("aria-label", "Clear repeats");
      setIcon(repeatsClear, "x");

      const syncRepeatsChip = () => {
        const value = repeatsInput.value.trim();
        repeatsText.textContent = value || "Repeats";
        repeatsChip.classList.toggle("has-value", !!value);
        repeatsChip.setAttribute("aria-label", value ? `Repeats: ${value}` : "Set repeats");
        repeatsChip.title = value || "Set repeats";
      };
      const closeRepeatsPopover = () => {
        repeatsInput.value = repeatsInput.value.trim();
        syncRepeatsChip();
        repeatsPopover.classList.remove("is-open");
        repeatsAnchor.classList.remove("is-open");
        repeatsChip.setAttribute("aria-expanded", "false");
        this.restoreTextFocus();
      };

      this.keepKeyboardOnPointerDown(repeatsChip);
      repeatsChip.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = !repeatsPopover.classList.contains("is-open");
        this.closeDatePopovers();
        repeatsAnchor.classList.toggle("is-open", willOpen);
        repeatsPopover.classList.toggle("is-open", willOpen);
        repeatsChip.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) this.focusTextInput(repeatsInput);
        else this.restoreTextFocus();
      };
      this.keepKeyboardOnPointerDown(repeatsClear);
      repeatsClear.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        repeatsInput.value = "";
        closeRepeatsPopover();
      };
      repeatsInput.addEventListener("input", syncRepeatsChip);
      repeatsInput.addEventListener("input", () => {
        if (!this.fieldErrors.repeats) return;
        delete this.fieldErrors.repeats;
        repeatsError?.remove();
        repeatsInput.removeAttribute("aria-invalid");
        repeatsInput.removeAttribute("aria-describedby");
        repeatsAnchor.classList.remove("has-error");
      });
      repeatsInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
          closeRepeatsPopover();
        }
      });
      ["pointerdown", "mousedown", "touchstart", "click"].forEach((eventName) => {
        repeatsPopover.addEventListener(eventName, (event) => event.stopPropagation());
      });
      const repeatsFooter = repeatsPopover.createDiv({ cls: "taskmodal-date-popover-footer" });
      const repeatsDone = repeatsFooter.createEl("button", {
        cls: "taskmodal-date-today",
        text: "Done",
        type: "button",
      });
      this.keepKeyboardOnPointerDown(repeatsDone);
      repeatsDone.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeRepeatsPopover();
      };
      syncRepeatsChip();
      if (repeatsError) {
        repeatsAnchor.classList.add("has-error", "is-open");
        repeatsPopover.classList.add("is-open");
        repeatsChip.setAttribute("aria-expanded", "true");
      }
    }

    const deadlineAnchor = visibleFields.deadline
      ? chipRow.createDiv({ cls: "taskmodal-date-anchor" })
      : ownerDocument.adoptNode(createDiv());
    const deadlineInput = deadlineAnchor.createEl("input", {
      cls: "taskmodal-date-input taskmodal-deadline-chip-native",
      type: "date",
      value: fields.deadline ?? "",
    });
    const deadlinePopover = visibleFields.deadline
      ? deadlineAnchor.createDiv({ cls: "taskmodal-date-popover taskmodal-date-popover-right" })
      : ownerDocument.adoptNode(createDiv());
    const deadlineMonthState = { value: this.initialCalendarMonth(fields.deadline ?? "") };

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
        this.openDatePopover(deadlineAnchor, deadlinePopover, deadlineInput, deadlineMonthState);
      };
      deadlineClear.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        deadlineInput.value = "";
        syncDeadlineChip();
        this.restoreTextFocus();
      };
      this.keepKeyboardOnPointerDown(deadlineClear);
      deadlineInput.addEventListener("change", syncDeadlineChip);
      syncDeadlineChip();
    }

    const priorityField = visibleFields.priority
      ? chipRow.createDiv({ cls: "taskmodal-priority-field" })
      : ownerDocument.adoptNode(createDiv());
    if (visibleFields.priority) {
      const priorityIcon = priorityField.createSpan({ cls: "taskmodal-chip-icon taskmodal-priority-icon" });
      setIcon(priorityIcon, "flag");
    }
    const priorityButton = visibleFields.priority
      ? priorityField.createEl("button", { cls: "taskmodal-priority-button" })
      : ownerDocument.adoptNode(createEl("button"));
    priorityButton.type = "button";
    const prioritySelect = priorityField.createEl("input", { cls: "taskmodal-priority-value", type: "hidden" });
    const priorityMenu = visibleFields.priority
      ? priorityField.createDiv({ cls: "taskmodal-priority-menu" })
      : ownerDocument.adoptNode(createDiv());
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
        this.restoreTextFocus();
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
        this.restoreTextFocus();
      };
    }

    const labelAnchor = visibleFields.labels
      ? chipRow.createDiv({ cls: "taskmodal-label-anchor" })
      : ownerDocument.adoptNode(createDiv());
    const labelButton = visibleFields.labels
      ? labelAnchor.createEl("button", { cls: "taskmodal-chip taskmodal-label-chip" })
      : ownerDocument.adoptNode(createEl("button"));
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
      : ownerDocument.adoptNode(createDiv());
    const labelSearch = visibleFields.labels
      ? labelPopover.createEl("input", {
        cls: "taskmodal-label-search",
        type: "text",
        placeholder: "Type a label",
      })
      : ownerDocument.adoptNode(createEl("input"));
    const labelList = visibleFields.labels
      ? labelPopover.createDiv({ cls: "taskmodal-label-list" })
      : ownerDocument.adoptNode(createDiv());
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
      const labelFooter = labelPopover.createDiv({ cls: "taskmodal-label-popover-footer" });
      const labelCancelButton = labelFooter.createEl("button", {
        cls: "taskmodal-label-cancel",
        text: "Cancel",
        type: "button",
      });
      this.keepKeyboardOnPointerDown(labelCancelButton);
      labelCancelButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        labelAnchor.classList.remove("is-open");
        this.restoreTextFocus();
      };

      labelButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        labelAnchor.classList.toggle("is-open");
        this.restoreTextFocus();
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
      if (!(event.target as HTMLElement).closest(".taskmodal-date-anchor")) {
        this.closeDatePopovers();
      }
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
      : ownerDocument.adoptNode(createDiv());
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
      const option = projectSelect.createEl("option", {
        value: String(project.id),
        text: project.name,
      });
      if (fields.projectId && String(project.id) === String(fields.projectId)) {
        option.selected = true;
      }
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
    const readFormData = (): TaskModalSubmitData => ({
      title: titleInput.value,
      description: descriptionInput.value,
      due: dueInput.value,
      repeats: repeatsInput.value,
      deadline: deadlineInput.value,
      priority: Number(prioritySelect.value) || 1,
      projectId: projectSelect.value || fields.projectId || "",
      labels: [
        ...(fields.labels ?? []).filter((name) => !labels.some((label) => label.name === name)),
        ...Array.from(labelList.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked"))
          .map((input) => input.value),
      ],
    });
    this.readFormData = readFormData;
    this.initialFormData = readFormData();
    submitButton.onclick = () => {
      if (this.submitting || submitButton.disabled) return;
      const title = titleInput.value.trim();
      if (!title) {
        titleInput.focus();
        return;
      }

      const data = readFormData();
      data.title = title;
      data.description = data.description.trim();
      data.repeats = data.repeats.trim();

      const submitInBackground = this.options.submitInBackground === true;
      this.submitting = true;
      if (submitInBackground) {
        this.options = { ...this.options, fields: data };
        this.close();
      } else {
        submitButton.disabled = true;
        cancelButton.disabled = true;
        submitButton.textContent = "Saving…";
      }
      void (async () => {
        try {
          await this.options.onSubmit(data);
          if (!submitInBackground) this.close();
        } catch (error) {
          if (error instanceof TaskModalFieldError) {
            this.fieldErrors[error.field] = error.message;
          }
          if (submitInBackground && !this.opened) {
            this.options = { ...this.options, fields: data };
            this.open();
          } else if (error instanceof TaskModalFieldError && this.opened) {
            this.setForm({ fields: data }, { preserveInput: true });
          }
        } finally {
          this.submitting = false;
          submitButton.disabled = false;
          cancelButton.disabled = false;
          submitButton.textContent = submitLabel;
          if (this.pendingFormRender && this.opened) {
            this.pendingFormRender = false;
            this.setForm({}, { preserveInput: true });
          }
          if (this.opened) this.restoreTextFocus();
        }
      })();
    };

    wrapper.addEventListener("keydown", (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        submitButton.click();
      }
    });

    return wrapper;
  }
}
