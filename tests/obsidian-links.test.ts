import test from "node:test";
import assert from "node:assert/strict";
import { __resetRequestUrl, __setRequestUrl, MarkdownRenderer } from "obsidian";
import { getWikilinkRanges, obsidianUrisToWikilinks, obsidianUriToLinktext, wikilinksToObsidianUris } from "../src/obsidian-links.ts";
import { TodoistService } from "../src/todoist-service.ts";
import { renderTaskMarkdown } from "../src/task-rendering.ts";

const context = {
  vaultName: "My vault",
  resolveFile: (name: string) => name === "Note Name" ? "Notes/Note Name.md" : undefined,
};
const noteUri = "obsidian://open?vault=My%20vault&file=Notes%2FNote%20Name.md";

test("editable link ranges resolve by file path and preserve exact positions with aliases and subpaths", () => {
  const text = "📝 [[Note Name]] then [[Folder/研究.md#Heading|alias]] and [[missing#^block]]";
  const ranges = getWikilinkRanges(text);
  assert.deepEqual(ranges.map((range) => range.linkpath), ["Note Name", "Folder/研究.md", "missing"]);
  assert.deepEqual(ranges.map((range) => text.slice(range.start, range.end)),
    ["[[Note Name]]", "[[Folder/研究.md#Heading|alias]]", "[[missing#^block]]"]);
  assert.equal(ranges[0].start, text.indexOf("[[Note Name]]"));
});

test("editor highlighting skips literals, incomplete links and file-less subpaths", () => {
  for (const text of ["\\[[escaped]]", "`[[code]]`", "```md\n[[code]]\n```", "![[embed]]", "[[#Heading]]",
    "[[incomplete", "[label [[note]]](https://example.com)", "    [[code]]"]) {
    assert.deepEqual(getWikilinkRanges(text), [], text);
  }
  assert.equal(getWikilinkRanges("[[repeat]] [[repeat]]").length, 2);
});

test("description wikilinks resolve note paths and preserve aliases, headings and blocks", () => {
  assert.equal(wikilinksToObsidianUris("Read [[Note Name]].", context), `Read [Note Name](${noteUri}).`);
  assert.equal(wikilinksToObsidianUris("[[Note Name#Plan|the plan]]", context), `[the plan](${noteUri}%23Plan)`);
  assert.equal(wikilinksToObsidianUris("[[Note Name#^todo]]", context), `[Note Name#^todo](${noteUri}%23%5Etodo)`);
  assert.equal(wikilinksToObsidianUris("[[Missing note]]"), "[Missing note](obsidian://open?file=Missing%20note)");
  const special = wikilinksToObsidianUris("[[研究/A & B (draft)?#C|read [this]]]", context);
  assert.equal(special, "[[研究/A & B (draft)?#C|read [this]]]"); // malformed wikilink
  assert.equal(wikilinksToObsidianUris("[[研究/A & B (draft)?#C|read *this*]]", context),
    "[read \\*this\\*](obsidian://open?vault=My%20vault&file=%E7%A0%94%E7%A9%B6%2FA%20%26%20B%20%28draft%29%3F%23C)");
});

test("conversion preserves code, escaped links, embeds, existing Markdown links and ordinary text", () => {
  const examples = [
    "Plain text\nwith line breaks", "", "[[unclosed", "[[]]", "[[#Heading]]",
    "`[[Note Name]]`", "``code ` [[Note Name]]``", "\\[[Note Name]]", "![[Note Name]]",
    "```md\n[[Note Name]]\n```", "~~~~\n[[Note Name]]\n~~~\nstill code\n~~~~",
    "```\n[[Note Name]]", "    [[Note Name]]\n", "\t[[Note Name]]",
    "[existing](https://example.com/[[Note Name]])", "[label [[Note Name]]](https://example.com)",
    "[reference [[Note Name]]][id]", `[Note Name](${noteUri})`,
  ];
  for (const value of examples) assert.equal(wikilinksToObsidianUris(value, context), value, value);
  const converted = wikilinksToObsidianUris("[[Note Name]] and [[Other|alias]]", context);
  assert.equal(wikilinksToObsidianUris(converted, context), converted);
  assert.equal(wikilinksToObsidianUris("`[[literal]]` then [[Note Name]]", context),
    `\`[[literal]]\` then [Note Name](${noteUri})`);
});

test("URI links returning from Todoist navigate natively only in the matching vault", () => {
  assert.equal(obsidianUriToLinktext(`${noteUri}%23Plan`, "My vault"), "Notes/Note Name.md#Plan");
  assert.equal(obsidianUriToLinktext("obsidian://open?file=Note%20Name", "My vault"), "Note Name");
  for (const uri of [noteUri, "obsidian://new?file=Note", "https://example.com", "bad URL",
    "obsidian://open?path=%2Ftmp%2Fnote&file=Note", "obsidian://open?vault=Other"]) {
    assert.equal(obsidianUriToLinktext(uri, "Other vault"), undefined);
  }
});

test("create, REST edit, recurrence sync edit and REST fallback all convert titles and descriptions", async () => {
  const bodies: Array<Record<string, unknown>> = [];
  const service = new TodoistService("test-token", { getObsidianLinkContext: () => context });
  Object.defineProperty(globalThis, "window", {
    configurable: true, value: { crypto: { randomUUID: () => "link-command" } },
  });
  let failRest = false;
  __setRequestUrl(async (request: { url: string; body: string }) => {
    if (request.url.endsWith("/sync")) {
      const commands = JSON.parse(new URLSearchParams(request.body).get("commands")!);
      bodies.push(commands[0].args);
      return { status: 200, text: JSON.stringify({ sync_status: { "link-command": "ok" } }) };
    }
    if (failRest) return { status: 500, text: "try sync" };
    bodies.push(JSON.parse(request.body));
    return { status: 200, text: JSON.stringify({ id: "task", content: "Title" }) };
  });
  try {
    const args = { content: "Title [[Note Name]]", description: "Read [[Note Name|the note]]" };
    await service.addTask(args);
    await service.updateTask("task", args);
    await service.updateTask("task", { ...args, due: { string: "every Monday" } });
    failRest = true;
    await service.updateTask("task", args);
    assert.equal(bodies.length, 4);
    for (const body of bodies) {
      assert.equal(body.description, `Read [the note](${noteUri})`);
      assert.equal(body.content, `Title [Note Name](${noteUri})`);
    }
    assert.equal(args.content, "Title [[Note Name]]");
    assert.equal(args.description, "Read [[Note Name|the note]]");
    failRest = false;
    await service.updateTask("task", { priority: 4 });
    assert.equal(Object.hasOwn(bodies.at(-1)!, "description"), false);
    assert.equal(Object.hasOwn(bodies.at(-1)!, "content"), false);
    await service.updateTask("task", { description: "" });
    assert.equal(bodies.at(-1)!.description, "");
  } finally {
    __resetRequestUrl();
  }
});

test("the editor restores readable wikilinks and preserves alias and subpath round trips", () => {
  const shorten = (target: string) => target.replace("Notes/Note Name.md", "Note Name");
  for (const value of ["Testing [[Note Name]]", "[[Note Name|the note]]", "[[Note Name#Plan]]",
    "[[Note Name#^todo|block]]", "[[Note Name]] and [[Other]]"]) {
    const synced = wikilinksToObsidianUris(value, context);
    const editable = obsidianUrisToWikilinks(synced, "My vault", shorten);
    assert.equal(editable, value);
    assert.equal(wikilinksToObsidianUris(editable, context), synced);
  }
  const examples = [
    `[Note Name](${noteUri})`,
    `[note](obsidian://open?vault=Another&file=Note)`,
    `[note](${noteUri}&paneType=window)`,
    `[web](https://example.com)`,
    `\`[note](${noteUri})\``,
    `\`\`\`md\n[note](${noteUri})\n\`\`\``,
  ];
  for (const value of examples.slice(1)) assert.equal(obsidianUrisToWikilinks(value, "My vault", shorten), value);
  const wiki = obsidianUrisToWikilinks(examples[0], "My vault", shorten);
  assert.equal(obsidianUrisToWikilinks(wiki, "My vault", shorten), wiki);
});

test("task Markdown uses native links with modifier keys without triggering row interactions", async () => {
  const listeners = new Map<string, (event: any) => void>();
  const attributes = new Map<string, string>([["href", `${noteUri}%23Plan`], ["target", "_blank"]]);
  const classes = new Set(["external-link"]);
  const link = {
    getAttribute: (key: string) => attributes.get(key),
    setAttribute: (key: string, value: string) => attributes.set(key, value),
    removeAttribute: (key: string) => attributes.delete(key),
    classList: {
      contains: (key: string) => classes.has(key),
      add: (key: string) => classes.add(key),
      remove: (key: string) => classes.delete(key),
    },
  };
  const element = {
    addEventListener(name: string, handler: (event: any) => void, capture: boolean) {
      assert.equal(capture, true);
      listeners.set(name, handler);
    },
    contains: (candidate: unknown) => candidate === link,
    querySelectorAll: () => [link],
  };
  const opened: unknown[][] = [];
  const app = {
    vault: { getName: () => "My vault" },
    workspace: { openLinkText: async (...args: unknown[]) => { opened.push(args); } },
  };
  const previous = MarkdownRenderer.render;
  MarkdownRenderer.render = async (_app, markdown, el, sourcePath, owner) => {
    assert.equal(markdown, "[[Note Name]]");
    assert.equal(el, element);
    assert.equal(sourcePath, "");
    assert.ok(owner);
  };
  try {
    await renderTaskMarkdown(app as never, "[[Note Name]]", element as never, {} as never);
    assert.equal(classes.has("internal-link"), true);
    assert.equal(attributes.has("target"), false);
    const event = (type: string, options = {}) => ({
      type, target: { closest: () => link }, button: 0,
      stopped: false, prevented: false,
      stopPropagation() { this.stopped = true; },
      preventDefault() { this.prevented = true; },
      ...options,
    });
    for (const type of ["pointerdown", "pointerup"]) {
      const e = event(type);
      listeners.get(type)!(e);
      assert.equal(e.stopped, true);
      assert.equal(e.prevented, false);
    }
    for (const options of [{}, { ctrlKey: true }, { button: 1 }]) {
      const e = event(options.button === 1 ? "auxclick" : "click", options);
      listeners.get(e.type)!(e);
      assert.equal(e.stopped, true);
      assert.equal(e.prevented, true);
    }
    assert.deepEqual(opened, [
      ["Notes/Note Name.md#Plan", "", false],
      ["Notes/Note Name.md#Plan", "", "tab"],
      ["Notes/Note Name.md#Plan", "", "tab"],
    ]);
    classes.delete("internal-link");
    const external = event("click");
    listeners.get("click")!(external);
    assert.equal(external.prevented, false);
    assert.equal(opened.length, 3);
    const plain = event("click", { target: { closest: () => null } });
    listeners.get("click")!(plain);
    assert.equal(plain.stopped, false);
  } finally {
    MarkdownRenderer.render = previous;
  }
});
