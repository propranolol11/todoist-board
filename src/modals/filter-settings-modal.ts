import { App, Modal, Notice, setIcon } from "obsidian";
import { clearEl } from "../dom";
import type { TodoistBoardSettings } from "../types";

type ToolbarFilter = {
  icon: string;
  title: string;
  filter: string;
  color?: string;
  isDefault?: boolean;
};

export interface FilterSettingsModalOptions {
  app: App;
  settings: TodoistBoardSettings;
  onSave: () => Promise<void>;
  onClearCache: () => void;
  onResetFilterIndex: () => void;
  onRerenderBoards: () => void;
  onRerenderCodeBlocks: () => void;
}

const FILTER_ICON_COLORS = [
  "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#339AF0",
  "#22B8CF", "#20C997", "#51CF66", "#94D82D", "#FCC419", "#FF922B",
  "#FF6B00", "#FFD43B", "#A9E34B", "#69DB7C", "#38D9A9", "#4DABF7",
  "#748FFC", "#9775FA", "#DA77F2", "#F783AC", "#FF8787", "#FF9F40",
];

const OBSIDIAN_ICONS = [
  "check", "calendar", "star", "heart", "search", "plus", "trash", "pencil", "folder", "document",
  "file-plus", "anchor", "zap", "settings", "book-open", "box", "bug", "camera", "cast", "cloud",
  "command", "compass", "database", "download", "eye", "flag", "globe", "image", "key", "layers",
  "link", "list", "lock", "map", "mic", "moon", "music", "pause", "phone", "refresh-cw", "save",
  "scissors", "send", "share", "shield", "shopping-cart", "sliders", "sun", "terminal", "thumbs-up",
  "toggle-left", "trash-2", "trending-up", "upload", "user", "video", "watch", "wifi", "x-circle",
  "alarm-clock", "bell", "briefcase", "clipboard", "coffee", "credit-card", "disc", "dollar-sign",
  "edit-2", "fast-forward", "file-text", "film", "gift", "hand", "home", "inbox", "info", "layout",
  "lightbulb", "list-checks", "loader", "log-in", "log-out", "menu", "message-circle", "navigation",
  "notebook", "package", "palette", "paperclip", "play", "printer", "repeat", "rss", "server", "shopping-bag",
  "sidebar", "smile", "timer", "target", "toggle-right", "swords", "truck", "umbrella", "wallet", "zap-off",
];

export function openFilterSettingsModal(options: FilterSettingsModalOptions) {
  const { app, settings } = options;
  const modal = new Modal(app);
  modal.containerEl.classList.add("settings-modal", "todoist-settings-modal");
  modal.titleEl.setText("Customize toolbar filters");

  if (!settings.filters) settings.filters = [];
  if (settings.filters.length === 0) {
    settings.filters.push({ icon: "star", filter: "today", title: "Today" });
  }

  const renderSettingsUI = () => {
    const container = modal.contentEl;
    clearEl(container);

    const table = container.createEl("table", { cls: "settings-filter-table" });
    const header = table.createEl("thead").createEl("tr");
    ["", "Icon", "Title", "Todoist filter", "Default", ""].forEach((text) => {
      header.createEl("th", { text });
    });

    const tbody = table.createEl("tbody");

    const renderFilterRow = (filter: ToolbarFilter, index: number) => {
      const currentFilter = settings.filters![index] as ToolbarFilter;
      const row = tbody.createEl("tr");
      row.dataset.index = String(index);

      renderDragHandle(row, tbody, index, settings, renderSettingsUI);
      renderIconPicker(row, filter, currentFilter);
      renderTitleInput(row, filter);
      renderFilterInput(row, filter);
      renderDefaultToggle(row, index, filter, settings, renderSettingsUI);
      renderDeleteButton(row, index, settings, renderSettingsUI);
    };

    settings.filters!.forEach((filter, index) => renderFilterRow(filter as ToolbarFilter, index));

    const footer = container.createEl("div", { cls: "settings-filter-footer" });
    const addRow = footer.createEl("div", { cls: "settings-action-row" });
    const addButton = addRow.createEl("button", { cls: "settings-add-filter-btn" });
    const addIcon = addButton.createSpan();
    setIcon(addIcon, "plus");
    addButton.append("Add Filter");
    addButton.onclick = () => {
      const newFilter = { icon: "help-circle", title: "", filter: "" };
      settings.filters!.push(newFilter);
      renderSettingsUI();
    };

    const saveRow = footer.createEl("div", { cls: "settings-save-row" });
    const saveButton = saveRow.createEl("button", { cls: "settings-save-btn", text: "Save" });
    saveButton.onclick = async () => {
      readFilterInputs(modal, settings);
      if (!settings.filters!.some((filter) => filter.isDefault)) {
        settings.filters![0].isDefault = true;
      }
      settings.filters = [...settings.filters!];

      await options.onSave();
      options.onResetFilterIndex();
      app.workspace.trigger("markdown-preview-rendered");
      options.onRerenderBoards();

      modal.close();
      window.setTimeout(() => options.onRerenderCodeBlocks(), 100);
    };

    const clearCacheButton = saveRow.createEl("button");
    clearCacheButton.addClass("clear-cache-btn");
    const clearCacheIcon = clearCacheButton.createSpan();
    clearCacheIcon.addClass("tb-mr-6");
    setIcon(clearCacheIcon, "x-circle");
    clearCacheButton.append("Clear Cache");
    clearCacheButton.onclick = () => {
      options.onClearCache();
      new Notice("Todoist task cache cleared. Plugin will re-fetch data.");
    };

    modal.containerEl.addEventListener("mousedown", (event: MouseEvent) => {
      modal.containerEl.querySelectorAll(".icon-picker-wrapper.visible").forEach((element) => {
        const trigger = element.previousElementSibling;
        if (!element.contains(event.target as Node) && !trigger?.contains(event.target as Node)) {
          element.classList.remove("visible");
        }
      });
    });
  };

  renderSettingsUI();
  modal.open();
}

function renderDragHandle(
  row: HTMLTableRowElement,
  tbody: HTMLTableSectionElement,
  index: number,
  settings: TodoistBoardSettings,
  rerender: () => void,
) {
  const dragCell = row.createEl("td", { cls: "settings-drag-cell" });
  const dragHandle = dragCell.createEl("button", { cls: "settings-drag-handle" });
  dragHandle.type = "button";
  dragHandle.draggable = true;
  dragHandle.setAttribute("aria-label", "Drag to reorder filter");
  setIcon(dragHandle, "grip-vertical");

  dragHandle.addEventListener("dragstart", (event: DragEvent) => {
    event.dataTransfer?.setData("text/plain", String(index));
    event.dataTransfer?.setDragImage(row, 16, 16);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    row.classList.add("is-dragging");
  });
  dragHandle.addEventListener("dragend", () => {
    row.classList.remove("is-dragging");
    tbody.querySelectorAll(".is-drag-over").forEach((element) => element.classList.remove("is-drag-over"));
  });
  row.addEventListener("dragover", (event: DragEvent) => {
    event.preventDefault();
    row.classList.add("is-drag-over");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  });
  row.addEventListener("dragleave", () => row.classList.remove("is-drag-over"));
  row.addEventListener("drop", (event: DragEvent) => {
    event.preventDefault();
    row.classList.remove("is-drag-over");
    const from = Number(event.dataTransfer?.getData("text/plain"));
    const to = index;
    if (!Number.isInteger(from) || from === to) return;
    const [moved] = settings.filters!.splice(from, 1);
    settings.filters!.splice(to, 0, moved);
    rerender();
  });
}

function renderIconPicker(row: HTMLTableRowElement, filter: ToolbarFilter, currentFilter: ToolbarFilter) {
  const iconCell = row.createEl("td");
  const iconTrigger = iconCell.createDiv({ cls: "icon-trigger" });
  clearEl(iconTrigger);
  setIcon(iconTrigger, filter.icon || "star");

  const iconPicker = iconCell.createDiv({ cls: "icon-picker-wrapper" });
  const colorRow = iconPicker.createDiv({ cls: "icon-color-row" });

  FILTER_ICON_COLORS.forEach((color) => {
    const swatch = colorRow.createDiv({ cls: "icon-color-swatch" });
    swatch.style.background = color;
    swatch.onclick = () => {
      iconTrigger.querySelector("svg")?.setAttribute("stroke", color);
      currentFilter.color = color;
    };
  });

  const customColor = row.ownerDocument.createElement("input");
  customColor.type = "color";
  customColor.className = "icon-color-picker custom-color-swatch";
  customColor.oninput = () => {
    iconTrigger.querySelector("svg")?.setAttribute("stroke", customColor.value);
    currentFilter.color = customColor.value;
  };
  colorRow.appendChild(customColor);

  OBSIDIAN_ICONS.forEach((iconName) => {
    const iconButton = iconPicker.createSpan({ cls: "icon-grid-btn" });
    setIcon(iconButton, iconName);
    iconButton.title = iconName;
    if (filter.icon === iconName) iconButton.classList.add("selected");

    iconButton.onclick = (event) => {
      event.preventDefault();
      currentFilter.icon = iconName;
      clearEl(iconTrigger);
      setIcon(iconTrigger, iconName);
      iconPicker.classList.remove("visible");
      iconPicker.querySelectorAll<HTMLElement>(".icon-grid-btn").forEach((button) => button.classList.remove("selected"));
      iconButton.classList.add("selected");
    };
  });

  iconTrigger.onclick = (event: MouseEvent) => {
    event.stopPropagation();
    row.ownerDocument.querySelectorAll(".icon-picker-wrapper.visible").forEach((element) => {
      if (element !== iconPicker) element.classList.remove("visible");
    });
    iconPicker.classList.toggle("visible");
    if (iconPicker.classList.contains("visible")) {
      positionIconPicker(iconTrigger, iconPicker);
    }
  };
}

function positionIconPicker(trigger: HTMLElement, picker: HTMLElement) {
  const ownerWindow = trigger.ownerDocument.defaultView ?? window;
  const viewportWidth = ownerWindow.innerWidth;
  const viewportHeight = ownerWindow.innerHeight;
  const margin = 12;
  const triggerRect = trigger.getBoundingClientRect();

  const pickerWidth = Math.min(270, viewportWidth - margin * 2);
  const pickerHeight = Math.min(340, Math.round(viewportHeight * 0.58));
  const preferredLeft = triggerRect.left;
  const preferredTop = triggerRect.bottom + 8;
  const left = Math.max(margin, Math.min(preferredLeft, viewportWidth - pickerWidth - margin));
  const top = Math.max(margin, Math.min(preferredTop, viewportHeight - pickerHeight - margin));

  picker.style.setProperty("--icon-picker-left", `${left}px`);
  picker.style.setProperty("--icon-picker-top", `${top}px`);
  picker.style.setProperty("--icon-picker-width", `${pickerWidth}px`);
  picker.style.setProperty("--icon-picker-max-height", `${pickerHeight}px`);
}

function renderTitleInput(row: HTMLTableRowElement, filter: ToolbarFilter) {
  const titleCell = row.createEl("td");
  const titleInput = titleCell.createEl("input", { type: "text" });
  titleInput.value = filter.title || "";
  titleInput.oninput = () => {
    filter.title = titleInput.value;
  };
}

function renderFilterInput(row: HTMLTableRowElement, filter: ToolbarFilter) {
  const filterCell = row.createEl("td");
  const filterInput = filterCell.createEl("input", { type: "text" });
  filterInput.value = typeof filter.filter === "string" ? filter.filter : JSON.stringify(filter.filter ?? {});
}

function renderDefaultToggle(
  row: HTMLTableRowElement,
  index: number,
  filter: ToolbarFilter,
  settings: TodoistBoardSettings,
  rerender: () => void,
) {
  const defaultCell = row.createEl("td", { cls: "settings-default-cell" });
  const defaultLabel = defaultCell.createEl("label", { cls: "settings-default-toggle" });
  const defaultInput = defaultLabel.createEl("input", { type: "radio" }) as HTMLInputElement;
  defaultInput.name = "default-filter";
  defaultInput.checked = !!filter.isDefault;
  defaultInput.onchange = () => {
    settings.filters!.forEach((_, filterIndex) => {
      settings.filters![filterIndex].isDefault = filterIndex === index;
    });
    rerender();
  };
  const defaultIcon = defaultLabel.createSpan();
  setIcon(defaultIcon, "check");
}

function renderDeleteButton(
  row: HTMLTableRowElement,
  index: number,
  settings: TodoistBoardSettings,
  rerender: () => void,
) {
  const deleteCell = row.createEl("td");
  const deleteButton = deleteCell.createEl("button");
  setIcon(deleteButton, "trash-2");
  deleteButton.querySelector("svg")?.removeAttribute("fill");
  deleteButton.className = "icon-button";
  deleteButton.setAttribute("aria-label", "Delete filter");
  deleteButton.onclick = () => {
    settings.filters!.splice(index, 1);
    rerender();
  };
}

function readFilterInputs(modal: Modal, settings: TodoistBoardSettings) {
  const filterRows = Array.from(modal.contentEl.querySelectorAll("tbody tr"));
  filterRows.forEach((row, index) => {
    const filterInput = row.querySelector("td:nth-child(4) input");
    if (!filterInput) return;
    const value = (filterInput as HTMLInputElement).value.trim();
    try {
      settings.filters![index].filter = JSON.parse(value);
    } catch {
      settings.filters![index].filter = value;
    }
  });
}
