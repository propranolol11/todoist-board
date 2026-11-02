import test from "node:test";
import assert from "node:assert/strict";
import TodoistBoardPlugin from "../main.ts";
import { TaskSheetModal } from "../src/modals/task-sheet-modal.ts";
import { normalizeSettings } from "../src/settings.ts";
import type { Command, TFile } from "obsidian";

test("the active-note command is available for notes and opens a task with an unambiguous wikilink", async () => {
  const plugin = new TodoistBoardPlugin() as any;
  const commands: Command[] = [];
  let activeFile: Pick<TFile, "extension" | "path"> | null = { extension: "md", path: "Projects/Beliefs.md" };
  const opened: unknown[][] = [];
  plugin.app = {
    workspace: { getActiveFile: () => activeFile },
    metadataCache: {
      fileToLinktext(file: TFile, sourcePath: string, omitExtension: boolean) {
        assert.equal(sourcePath, "");
        assert.equal(omitExtension, true);
        return file.path.replace(/\.md$/, "");
      },
    },
  };
  plugin.registerView = () => {};
  plugin.addCommand = (command: Command) => commands.push(command);
  const stopStartup = new Error("Stop after command registration");
  plugin.loadSettings = async () => { throw stopStartup; };
  plugin.openAddTaskModal = (...args: unknown[]) => { opened.push(args); };
  await assert.rejects(plugin.onload(), (error) => error === stopStartup);

  const command = commands.find((candidate) => candidate.id === "add-task-from-active-note")!;
  assert.equal(command.name, "Add task linked to active note");
  assert.equal(command.checkCallback!(true), true);
  assert.deepEqual(opened, []);
  assert.equal(command.checkCallback!(false), true);
  assert.deepEqual(opened, [[undefined, "[[Projects/Beliefs]]"]]);

  activeFile = { extension: "md", path: "Notes/研究 & Plans.md" };
  command.checkCallback!(false);
  assert.deepEqual(opened[1], [undefined, "[[Notes/研究 & Plans]]"]);
  for (const file of [null, { extension: "canvas", path: "Map.canvas" }, { extension: "pdf", path: "File.pdf" }]) {
    activeFile = file;
    assert.equal(command.checkCallback!(true), false);
    assert.equal(command.checkCallback!(false), false);
  }
  assert.equal(opened.length, 2);
});

test("the new task keeps the note description during metadata loading and sends it only on submit", async () => {
  const plugin = new TodoistBoardPlugin() as any;
  plugin.settings = normalizeSettings({});
  plugin.ensureRefactoredRuntime = () => {};
  plugin.app = { workspace: { trigger() {} } };
  const added: unknown[] = [];
  plugin.taskActions = { addTask: async (args: unknown) => { added.push(args); } };
  plugin.preloadFilters = async () => {};
  plugin.fetchMetadataFromSync = async () => ({
    projects: [{ id: "inbox", name: "Inbox" }], labels: [{ id: "label", name: "Work" }],
  });
  const timers: Array<() => void> = [];
  const previousWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", {
    configurable: true, value: { setTimeout: (callback: () => void) => { timers.push(callback); return timers.length; } },
  });
  const originalOpen = TaskSheetModal.prototype.open;
  const originalSetForm = TaskSheetModal.prototype.setForm;
  let hydrated: any;
  TaskSheetModal.prototype.open = () => {};
  TaskSheetModal.prototype.setForm = (options, flags) => { hydrated = { options, flags }; };
  try {
    await plugin.openAddTaskModal(undefined, "[[Projects/Beliefs]]");
    const modal = plugin.activeTaskModal;
    assert.equal(modal.options.fields.title, "");
    assert.equal(modal.options.fields.description, "[[Projects/Beliefs]]");
    assert.deepEqual(added, []);
    // The first timeout focuses the title; the second hydrates projects/labels.
    timers[1]();
    await Promise.resolve();
    assert.equal(hydrated.options.fields.description, "[[Projects/Beliefs]]");
    assert.equal(hydrated.flags.preserveInput, true);
    await modal.options.onSubmit({
      ...modal.options.fields, title: "Review beliefs", projectId: "inbox", labels: [],
    });
    assert.equal((added[0] as { description: string }).description, "[[Projects/Beliefs]]");
    await plugin.openAddTaskModal();
    assert.equal(plugin.activeTaskModal.options.fields.description, "");
  } finally {
    TaskSheetModal.prototype.open = originalOpen;
    TaskSheetModal.prototype.setForm = originalSetForm;
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});
