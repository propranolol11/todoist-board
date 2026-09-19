import test from "node:test";
import assert from "node:assert/strict";
import { __setRequireApiVersion } from "obsidian";
import { TodoistBoardSettingTab } from "../src/settings-tab.ts";
import { normalizeSettings } from "../src/settings.ts";
import type { Setting, SettingDefinitionRender, SettingGroup } from "obsidian";

function makeTab() {
  const saves = { settings: 0, token: 0, validation: 0 };
  const plugin = {
    settings: normalizeSettings({ apiKey: "existing-token" }),
    async saveSettings() { saves.settings += 1; },
    async savePluginData() { saves.token += 1; },
    async validateTodoistApiKey(value: string) {
      saves.validation += 1;
      return value === "valid-token";
    },
  };
  const tab = new TodoistBoardSettingTab({} as never, plugin as never);
  tab.containerEl = { addClass() {} } as unknown as HTMLElement;
  return { tab, plugin, saves };
}

function hostDefinition(tab: TodoistBoardSettingTab): SettingDefinitionRender {
  const definitions = tab.getSettingDefinitions();
  assert.equal(definitions.length, 1);
  const definition = definitions[0];
  assert.ok("render" in definition && definition.render);
  return definition as SettingDefinitionRender;
}

function fakeTokenSetting() {
  const input = { value: "", type: "" };
  const buttons: Array<{ textContent: string; onclick?: () => Promise<void> }> = [];
  const indicators: Array<{ textContent: string }> = [];
  const control = {
    inputEl: input,
    setValue(value: string) { input.value = value; return this; },
    setPlaceholder() { return this; },
  };
  const row = {
    controlEl: {
      createEl(_tag: string, options: { text: string }) {
        const button = { textContent: options.text };
        buttons.push(button);
        return button;
      },
      createSpan() {
        const indicator = { textContent: "" };
        indicators.push(indicator);
        return indicator;
      },
    },
    addText(callback: (value: typeof control) => void) { callback(control); return this; },
  };
  return { row: row as unknown as Setting, buttons, indicators, input };
}

test("settings search indexes the tabbed interface without replacing it", () => {
  const { tab, saves } = makeTab();
  const definition = hostDefinition(tab);
  assert.equal(definition.name, "Todoist Board settings");
  for (const term of ["API token", "Tab badges", "Context menu", "Chin bar", "Repeats", "Timezone mode", "Support"]) {
    assert.ok(definition.aliases?.includes(term), `${term} should be searchable`);
  }
  assert.deepEqual(saves, { settings: 0, token: 0, validation: 0 });
});

test("the native settings definition renders the existing tabbed settings host", () => {
  const { tab } = makeTab();
  const definition = hostDefinition(tab);
  const classes: string[] = [];
  const settingEl = {
    empty() {},
    addClass(value: string) { classes.push(value); },
  } as unknown as HTMLElement;
  let renderedIn: HTMLElement | null = null;
  (tab as unknown as { renderLegacySettings: (host: HTMLElement) => void }).renderLegacySettings = (host) => {
    renderedIn = host;
  };
  definition.render({ settingEl } as Setting, {} as SettingGroup);
  assert.equal(renderedIn, settingEl);
  assert.deepEqual(classes, ["todoist-settings-tabbed-host"]);
});

test("legacy settings gain the repeats field through normalization", () => {
  const { plugin } = makeTab();
  const legacyFields = { ...plugin.settings.addTaskModal };
  delete legacyFields.repeats;
  plugin.settings = normalizeSettings({
    addTaskModal: legacyFields as NonNullable<typeof plugin.settings.addTaskModal>,
  });
  assert.equal(plugin.settings.addTaskModal?.repeats, true);
});

test("token control masks input, rejects invalid tokens, and uses secure persistence", async () => {
  const { tab, plugin, saves } = makeTab();
  const setting = fakeTokenSetting();
  (tab as unknown as { renderApiTokenSetting: (row: Setting) => void }).renderApiTokenSetting(setting.row);
  assert.equal(setting.input.type, "password");
  assert.equal(setting.input.value, "existing-token");

  setting.input.value = "invalid-token";
  await setting.buttons[0].onclick?.();
  assert.equal(plugin.settings.apiKey, "existing-token");
  assert.equal(setting.indicators[0].textContent, "Invalid token");
  assert.equal(saves.token, 0);

  setting.input.value = "valid-token";
  await setting.buttons[0].onclick?.();
  assert.equal(plugin.settings.apiKey, "valid-token");
  assert.equal(setting.indicators[0].textContent, "Saved securely");
  assert.equal(saves.token, 1);
  assert.equal(saves.settings, 0);
});

test("add-task settings shortcut updates the native host or legacy renderer by app version", () => {
  const { tab } = makeTab();
  let native = 0;
  let legacy = 0;
  tab.update = () => { native += 1; };
  (tab as unknown as { renderLegacySettings: () => void }).renderLegacySettings = () => { legacy += 1; };
  try {
    __setRequireApiVersion(true);
    tab.openPreferencesAddTaskModalSection();
    assert.deepEqual({ native, legacy }, { native: 1, legacy: 0 });
    __setRequireApiVersion(false);
    tab.openPreferencesAddTaskModalSection();
    assert.deepEqual({ native, legacy }, { native: 1, legacy: 1 });
  } finally {
    __setRequireApiVersion(false);
  }
});
