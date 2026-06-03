import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { COMMON_TIMEZONES } from "./settings";
import type { ContextMenuSettings, TodoistBoardSettings } from "./types";

export interface TodoistSettingsPlugin {
  settings: TodoistBoardSettings;
  saveSettings(): Promise<void>;
  savePluginData(): Promise<void>;
  validateTodoistApiKey(apiKey: string): Promise<boolean>;
}

export class TodoistBoardSettingTab extends PluginSettingTab {
  constructor(app: App, readonly plugin: Plugin & TodoistSettingsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    const pluginSettings = this.plugin.settings;

    new Setting(containerEl)
      .setName("🔑 Todoist API key")
      .setDesc("Enter your Todoist API key to enable the plugin.")
      .addText((text) => {
        text
          .setPlaceholder("API key")
          .setValue(pluginSettings.apiKey);

        const submitBtn = activeDocument.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.classList.add("tb-ml-8");

        const indicator = activeDocument.createElement("span");
        indicator.classList.add("tb-ml-8", "tb-bold");

        submitBtn.onclick = async () => {
          indicator.textContent = "⏳";
          try {
            const valid = await this.plugin.validateTodoistApiKey(text.inputEl.value);
            if (!valid) throw new Error("Invalid");
            pluginSettings.apiKey = text.inputEl.value;
            indicator.textContent = "✅";
            await this.plugin.savePluginData();
          } catch {
            indicator.textContent = "❌";
          }
        };

        text.inputEl.parentElement?.appendChild(submitBtn);
        text.inputEl.parentElement?.appendChild(indicator);
      });

    new Setting(containerEl)
      .setName("👯‍♀️ support my work")
      .setDesc("If you like how this plugin is shaping up, please consider supporting my work by buying me a coffee or ten!")
      .addButton((button) => {
        button.setButtonText("☕ Coffee season");
        button.buttonEl.classList.add("tb-cta");
        button.onClick(() => {
          window.open("https://ko-fi.com/jamiedaghaim", "_blank");
        });
      });

    new Setting(containerEl)
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

    new Setting(containerEl)
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
      new Setting(containerEl)
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

    new Setting(containerEl)
      .setName("Context menu actions")
      .setDesc("Select which actions appear in the right-click context menu for tasks.")
      .setHeading();

    const actions = [
      { key: "scheduleToday", label: "Schedule today" },
      { key: "scheduleTomorrow", label: "Schedule tomorrow" },
      { key: "setPriority", label: "Set priority" },
      { key: "editTask", label: "Edit task" },
      { key: "deleteTask", label: "Delete task" },
      { key: "openInTodoist", label: "Open in Todoist" },
    ];

    actions.forEach((action) => {
      new Setting(containerEl)
        .setName(action.label)
        .addToggle((toggle) =>
          toggle
            .setValue(pluginSettings.contextMenuActions?.[action.key as keyof ContextMenuSettings] ?? true)
            .onChange(async (value) => {
              if (!pluginSettings.contextMenuActions) {
                pluginSettings.contextMenuActions = {} as ContextMenuSettings;
              }
              (pluginSettings.contextMenuActions as any)[action.key] = value;
              await this.plugin.saveSettings();
            }),
        );
    });
  }
}
