import { App, Notice, Plugin, PluginSettingTab, Setting, setIcon } from "obsidian";
import { COMMON_TIMEZONES } from "./settings";
import type { AddTaskModalSettings, ChinBarSettings, ContextMenuSettings, TodoistBoardSettings } from "./types";

type SettingsTabId = "getting-started" | "preferences" | "advanced" | "support";
type SettingsFocusTarget = "add-task-modal";

export interface TodoistSettingsPlugin {
  settings: TodoistBoardSettings;
  saveSettings(): Promise<void>;
  savePluginData(): Promise<void>;
  validateTodoistApiKey(apiKey: string): Promise<boolean>;
}

export class TodoistBoardSettingTab extends PluginSettingTab {
  private activeTab: SettingsTabId = "getting-started";
  private pendingFocusTarget: SettingsFocusTarget | null = null;

  constructor(app: App, readonly plugin: Plugin & TodoistSettingsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("todoist-board-settings-tab");

    const pluginSettings = this.plugin.settings;
    const shell = containerEl.createDiv({ cls: "todoist-settings-shell" });
    const tabList = shell.createDiv({ cls: "todoist-settings-tabs" });
    const content = shell.createDiv({ cls: "todoist-settings-panel" });

    const tabs: Array<{ id: SettingsTabId; label: string; icon: string }> = [
      { id: "getting-started", label: "Start", icon: "sparkles" },
      { id: "preferences", label: "Preferences", icon: "mouse-pointer-click" },
      { id: "advanced", label: "Advanced", icon: "sliders-horizontal" },
      { id: "support", label: "Support", icon: "heart" },
    ];

    tabs.forEach((tab) => {
      const button = tabList.createEl("button", { cls: "todoist-settings-tab", type: "button" });
      const icon = button.createSpan({ cls: "todoist-settings-tab-icon" });
      setIcon(icon, tab.icon);
      button.createSpan({ text: tab.label });
      const selected = this.activeTab === tab.id;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.onclick = () => {
        this.activeTab = tab.id;
        this.display();
      };
    });

    if (this.activeTab === "getting-started") {
      this.renderGettingStarted(content, pluginSettings);
    } else if (this.activeTab === "preferences") {
      this.renderPreferences(content, pluginSettings);
    } else if (this.activeTab === "advanced") {
      this.renderAdvanced(content, pluginSettings);
    } else {
      this.renderSupport(content);
    }
  }

  public openPreferencesAddTaskModalSection() {
    this.activeTab = "preferences";
    this.pendingFocusTarget = "add-task-modal";
    this.display();
  }

  private renderGettingStarted(container: HTMLElement, pluginSettings: TodoistBoardSettings) {
    this.renderPanelHeader(
      container,
      "Start",
      "Connect Todoist.",
    );

    const authCard = container.createDiv({ cls: "todoist-settings-card todoist-settings-auth-card" });
    new Setting(authCard)
      .setName("API token")
      .setDesc("Stored locally in this vault.")
      .addText((text) => {
        text
          .setPlaceholder("Paste API token")
          .setValue(pluginSettings.apiKey);
        text.inputEl.type = "password";

        const submitBtn = authCard.ownerDocument.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.classList.add("todoist-settings-submit-token");

        const indicator = authCard.ownerDocument.createElement("span");
        indicator.classList.add("todoist-settings-token-status");

        submitBtn.onclick = async () => {
          indicator.textContent = "Checking...";
          try {
            const valid = await this.plugin.validateTodoistApiKey(text.inputEl.value);
            if (!valid) throw new Error("Invalid");
            pluginSettings.apiKey = text.inputEl.value;
            indicator.textContent = "Saved";
            await this.plugin.savePluginData();
          } catch {
            indicator.textContent = "Invalid token";
          }
        };

        text.inputEl.parentElement?.appendChild(submitBtn);
        text.inputEl.parentElement?.appendChild(indicator);
      });

    const authLinks = authCard.createDiv({ cls: "todoist-settings-link-row" });
    this.createExternalLink(
      authLinks,
      "Todoist integrations",
      "https://todoist.com/app/settings/integrations",
      "external-link",
    );
    this.createExternalLink(
      authLinks,
      "Token help",
      "https://www.todoist.com/help/articles/8048880904476",
      "help-circle",
    );

    const nextSection = container.createDiv({ cls: "todoist-settings-card todoist-settings-next" });
    this.renderHeading(nextSection, "Next", "todoist-settings-card-title");
    const nextList = nextSection.createEl("ul", { cls: "todoist-settings-next-list" });
    nextList.createEl("li", { text: "Command palette: Open Todoist Board" });
    const codeItem = nextList.createEl("li");
    codeItem.appendText("Embed: ");
    codeItem.createEl("code", { text: "Filter: today" });
    const repoItem = nextList.createEl("li");
    repoItem.appendText("Filters: ");
    this.createExternalLink(repoItem, "GitHub", "https://github.com/propranolol11/todoist-board", "github");
  }

  private renderAdvanced(container: HTMLElement, pluginSettings: TodoistBoardSettings) {
    this.renderPanelHeader(
      container,
      "Advanced",
      "Tune logging and date handling for this vault.",
    );

    const advancedCard = container.createDiv({ cls: "todoist-settings-card" });
    new Setting(advancedCard)
      .setName("Console logging")
      .setDesc("Print debug output of Todoist Board to the developer console.")
      .addToggle((toggle) => {
        toggle
          .setValue(!!this.plugin.settings.enableLogs)
          .onChange(async (value) => {
            this.plugin.settings.enableLogs = value;
            await this.plugin.saveSettings();
            new Notice(value ? "Console logging: ON" : "Console logging: OFF", 1500);
          });
      });

    new Setting(advancedCard)
      .setName("Timezone mode")
      .setDesc("Choose how timezone is determined for your tasks.")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", "Auto (use device timezone)")
          .addOption("manual", "Manual")
          .setValue(pluginSettings.timezoneMode)
          .onChange(async (value: string) => {
            pluginSettings.timezoneMode = value as "auto" | "manual";
            await this.plugin.saveSettings();
            this.display();
          }),
      );

    if (pluginSettings.timezoneMode === "manual") {
      new Setting(advancedCard)
        .setName("Manual timezone")
        .setDesc("Overrides system timezone if 'manual' mode is selected above")
        .addDropdown((dropdown) => {
          for (const timezone of COMMON_TIMEZONES) dropdown.addOption(timezone, timezone);
          dropdown.setValue(this.plugin.settings.manualTimezone);
          dropdown.onChange(async (value) => {
            this.plugin.settings.manualTimezone = value;
            await this.plugin.saveSettings();
            new Notice("Timezone saved. Restart Obsidian to apply.");
          });
        });
    }
  }

  private renderPreferences(container: HTMLElement, pluginSettings: TodoistBoardSettings) {
    this.renderPanelHeader(
      container,
      "Preferences",
      "Choose which task controls are shown throughout Todoist Board.",
    );

    const contextMenuSection = container.createDiv({ cls: "settings-context-preview-section" });
    this.renderHeading(contextMenuSection, "Context menu actions", "settings-context-preview-title");
    contextMenuSection.createEl("p", {
      cls: "settings-context-preview-desc",
      text: "Choose which actions appear in the task right-click menu.",
    });

    const actions: Array<{ key: keyof ContextMenuSettings; label: string; icon: string }> = [
      { key: "scheduleToday", label: "Schedule today", icon: "calendar" },
      { key: "scheduleTomorrow", label: "Schedule tomorrow", icon: "calendar-clock" },
      { key: "setPriority", label: "Set priority", icon: "flag" },
      { key: "editTask", label: "Edit task", icon: "pencil" },
      { key: "deleteTask", label: "Delete task", icon: "trash-2" },
      { key: "openInTodoist", label: "Open in Todoist", icon: "external-link" },
    ];

    const previewMenu = contextMenuSection.createDiv({ cls: "settings-context-menu-preview" });
    const ensureContextMenuActions = (): ContextMenuSettings => {
      if (!pluginSettings.contextMenuActions) {
        pluginSettings.contextMenuActions = {} as ContextMenuSettings;
      }
      return pluginSettings.contextMenuActions;
    };
    const actionIsEnabled = (key: keyof ContextMenuSettings): boolean =>
      pluginSettings.contextMenuActions?.[key] ?? true;

    actions.forEach((action) => {
      const menuItem = previewMenu.createDiv({ cls: "settings-context-menu-item" });
      const menuItemMain = menuItem.createDiv({ cls: "settings-context-menu-item-main" });
      const menuIcon = menuItemMain.createSpan({ cls: "settings-context-menu-icon" });
      setIcon(menuIcon, action.icon);
      menuItemMain.createSpan({ cls: "settings-context-menu-label", text: action.label });

      const visibilityButton = menuItem.createEl("button", {
        cls: "settings-context-menu-visibility",
        type: "button",
      });

      const syncVisibilityButton = () => {
        const enabled = actionIsEnabled(action.key);
        menuItem.classList.toggle("is-disabled", !enabled);
        while (visibilityButton.firstChild) {
          visibilityButton.removeChild(visibilityButton.firstChild);
        }
        setIcon(visibilityButton, enabled ? "eye" : "eye-off");
        visibilityButton.setAttribute("aria-pressed", String(enabled));
        visibilityButton.setAttribute("aria-label", `${enabled ? "Hide" : "Show"} ${action.label}`);
        visibilityButton.title = enabled ? "Shown in menu" : "Hidden from menu";
      };

      syncVisibilityButton();
      visibilityButton.addEventListener("click", () => {
        void (async () => {
        const contextMenuActions = ensureContextMenuActions();
        contextMenuActions[action.key] = !actionIsEnabled(action.key);
        syncVisibilityButton();
        await this.plugin.saveSettings();
        })();
      });
    });

    const chinBarSection = container.createDiv({ cls: "settings-chin-preview-section" });
    this.renderHeading(chinBarSection, "Chin bar actions", "settings-context-preview-title");
    chinBarSection.createEl("p", {
      cls: "settings-context-preview-desc",
      text: "Tap actions to show or hide them in the selected-task toolbar.",
    });

    const chinActions: Array<{ key: keyof ChinBarSettings; label: string; icon: string }> = [
      { key: "scheduleToday", label: "Today", icon: "calendar" },
      { key: "scheduleTomorrow", label: "Tmrw", icon: "sunrise" },
      { key: "editTask", label: "Edit", icon: "pencil" },
      { key: "hideTask", label: "Hide", icon: "eye" },
      { key: "setPriority", label: "Priority", icon: "flag" },
      { key: "setDeadline", label: "Deadline", icon: "target" },
      { key: "deleteTask", label: "Delete", icon: "trash-2" },
      { key: "openInTodoist", label: "Open", icon: "external-link" },
    ];
    const previewChin = chinBarSection.createDiv({ cls: "settings-chin-preview" });
    const ensureChinBarActions = (): ChinBarSettings => {
      if (!pluginSettings.chinBarActions) {
        pluginSettings.chinBarActions = {} as ChinBarSettings;
      }
      return pluginSettings.chinBarActions;
    };
    const chinActionIsEnabled = (key: keyof ChinBarSettings): boolean =>
      pluginSettings.chinBarActions?.[key] ?? false;

    chinActions.forEach((action) => {
      const actionButton = previewChin.createEl("button", {
        cls: "settings-chin-action",
        type: "button",
      });
      const icon = actionButton.createSpan({ cls: "settings-chin-action-icon" });
      setIcon(icon, action.icon);
      actionButton.createSpan({ text: action.label });

      const syncActionButton = () => {
        const enabled = chinActionIsEnabled(action.key);
        actionButton.classList.toggle("is-enabled", enabled);
        actionButton.setAttribute("aria-pressed", String(enabled));
        actionButton.setAttribute("aria-label", `${enabled ? "Hide" : "Show"} ${action.label}`);
      };

      syncActionButton();
      actionButton.addEventListener("click", () => {
        void (async () => {
        const chinBarActions = ensureChinBarActions();
        chinBarActions[action.key] = !chinActionIsEnabled(action.key);
        syncActionButton();
        await this.plugin.saveSettings();
        })();
      });
    });

    const addTaskSection = container.createDiv({ cls: "settings-chin-preview-section" });
    addTaskSection.dataset.settingsSection = "add-task-modal";
    this.renderHeading(addTaskSection, "Add task modal", "settings-context-preview-title");
    addTaskSection.createEl("p", {
      cls: "settings-context-preview-desc",
      text: "User friendly controls for showing or hiding optional fields in the Add Task modal.",
    });

    const addTaskActions: Array<{ key: keyof AddTaskModalSettings; label: string; icon: string }> = [
      { key: "dueDate", label: "Date", icon: "calendar" },
      { key: "deadline", label: "Deadline", icon: "target" },
      { key: "priority", label: "Priority", icon: "flag" },
      { key: "project", label: "Project", icon: "inbox" },
      { key: "labels", label: "Labels", icon: "tag" },
    ];
    const previewAddTask = addTaskSection.createDiv({ cls: "settings-chin-preview settings-add-task-preview" });
    const ensureAddTaskModal = (): AddTaskModalSettings => {
      if (!pluginSettings.addTaskModal) {
        pluginSettings.addTaskModal = {} as AddTaskModalSettings;
      }
      return pluginSettings.addTaskModal;
    };
    const addTaskControlIsEnabled = (key: keyof AddTaskModalSettings): boolean =>
      pluginSettings.addTaskModal?.[key] ?? true;

    addTaskActions.forEach((action) => {
      const actionButton = previewAddTask.createEl("button", {
        cls: "settings-chin-action",
        type: "button",
      });
      const icon = actionButton.createSpan({ cls: "settings-chin-action-icon" });
      setIcon(icon, action.icon);
      actionButton.createSpan({ text: action.label });

      const syncActionButton = () => {
        const enabled = addTaskControlIsEnabled(action.key);
        actionButton.classList.toggle("is-enabled", enabled);
        actionButton.setAttribute("aria-pressed", String(enabled));
        actionButton.setAttribute("aria-label", `${enabled ? "Hide" : "Show"} ${action.label}`);
      };

      syncActionButton();
      actionButton.addEventListener("click", () => {
        void (async () => {
        const addTaskModal = ensureAddTaskModal();
        addTaskModal[action.key] = !addTaskControlIsEnabled(action.key);
        syncActionButton();
        await this.plugin.saveSettings();
        })();
      });
    });

    this.focusSectionIfPending("add-task-modal", addTaskSection);
  }

  private focusSectionIfPending(target: SettingsFocusTarget, element: HTMLElement) {
    if (this.pendingFocusTarget !== target) return;
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ block: "start", behavior: "smooth" });
      element.classList.add("is-settings-focus-target");
      window.setTimeout(() => {
        element.classList.remove("is-settings-focus-target");
      }, 1400);
    });
    this.pendingFocusTarget = null;
  }

  private renderSupport(container: HTMLElement) {
    this.renderPanelHeader(
      container,
      "Support",
      "Useful links and ways to support the plugin.",
    );

    const supportCard = container.createDiv({ cls: "todoist-settings-card todoist-settings-support-card" });
    this.renderHeading(supportCard, "Support my work", "todoist-settings-card-title");
    supportCard.createEl("p", {
      text: "If Todoist Board is helping your workflow, you can support ongoing development.",
      cls: "todoist-settings-card-desc",
    });
    const coffeeButton = supportCard.createEl("button", {
      cls: "todoist-settings-primary-link",
      text: "Coffee season",
      type: "button",
    });
    coffeeButton.onclick = () => window.open("https://ko-fi.com/jamiedaghaim", "_blank");

    const repoCard = container.createDiv({ cls: "todoist-settings-card" });
    this.renderHeading(repoCard, "Project links", "todoist-settings-card-title");
    repoCard.createEl("p", {
      text: "Report issues, browse examples, and follow release notes on GitHub.",
      cls: "todoist-settings-card-desc",
    });
    this.createExternalLink(repoCard, "Open GitHub repo", "https://github.com/propranolol11/todoist-board", "external-link");
  }

  private renderPanelHeader(container: HTMLElement, title: string, description: string) {
    const header = container.createDiv({ cls: "todoist-settings-panel-header" });
    this.renderHeading(header, title, "todoist-settings-panel-title");
    header.createEl("p", { text: description, cls: "todoist-settings-panel-desc" });
  }

  private renderHeading(container: HTMLElement, title: string, titleClass: string) {
    const heading = new Setting(container)
      .setName(title)
      .setHeading();
    heading.settingEl.addClass("todoist-settings-heading");
    heading.nameEl.addClass(titleClass);
    return heading;
  }

  private renderTipCard(
    container: HTMLElement,
    title: string,
    description: string,
    iconName: string,
    code?: string,
  ) {
    const card = container.createDiv({ cls: "todoist-settings-tip-card" });
    const icon = card.createSpan({ cls: "todoist-settings-tip-icon" });
    setIcon(icon, iconName);
    this.renderHeading(card, title, "todoist-settings-card-title");
    card.createEl("p", { text: description, cls: "todoist-settings-card-desc" });
    if (code) {
      const pre = card.createEl("pre", { cls: "todoist-settings-code-example" });
      pre.createEl("code", { text: code });
    }
  }

  private createExternalLink(container: HTMLElement, label: string, href: string, iconName: string) {
    const link = container.createEl("a", { cls: "todoist-settings-link", href });
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    const icon = link.createSpan({ cls: "todoist-settings-link-icon" });
    setIcon(icon, iconName);
    link.createSpan({ text: label });
    return link;
  }
}
