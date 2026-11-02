let requestUrlImpl = async function requestUrlDefault() {
  throw new Error("requestUrl is not available in pure unit tests");
};
let requiredApiVersionAvailable = false;

export function requireApiVersion() {
  return requiredApiVersionAvailable;
}

export function __setRequireApiVersion(available) {
  requiredApiVersionAvailable = available;
}

export async function requestUrl(...args) {
  return requestUrlImpl(...args);
}

export function __setRequestUrl(fn) {
  requestUrlImpl = fn;
}

export function __resetRequestUrl() {
  requiredApiVersionAvailable = false;
  requestUrlImpl = async function requestUrlDefault() {
    throw new Error("requestUrl is not available in pure unit tests");
  };
}

export class App {}
export class Modal {}
export class Plugin {}
export class PluginSettingTab {}
export class Setting {}
export class ItemView {}
export class Menu {
  addItem() {
    return this;
  }

  addSeparator() {}
  showAtPosition() {}
}
export class MenuItem {}
export class Notice {}
export class MarkdownPostProcessorContext {}
export class MarkdownRenderer {}
export class Component {
  cleanups = [];
  register(callback) { this.cleanups.push(callback); }
  registerEvent(event) { this.cleanups.push(() => event.off?.()); }
  load() { this.onload?.(); }
  unload() {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
    this.onunload?.();
  }
  registerDomEvent(element, type, callback, options) {
    element.addEventListener(type, callback, options);
    this.cleanups.push(() => element.removeEventListener(type, callback, options));
  }
}
export class Scope {
  handlers = new Map();
  register(_modifiers, key, callback) { this.handlers.set(key, callback); }
}
export function parseFrontMatterAliases(frontmatter) {
  const aliases = frontmatter?.aliases ?? frontmatter?.alias;
  if (typeof aliases === "string") return [aliases];
  return Array.isArray(aliases) ? aliases.filter((alias) => typeof alias === "string") : null;
}
// Deterministic subsequence matching for suggestion tests. Production uses
// Obsidian's own fuzzy-search implementation.
export function prepareFuzzySearch(query) {
  return (text) => {
    let index = 0;
    const lower = text.toLocaleLowerCase();
    for (const char of query.toLocaleLowerCase()) {
      const found = lower.indexOf(char, index);
      if (found < 0) return null;
      index = found + 1;
    }
    return { score: -index, matches: [] };
  };
}
export class Keymap {
  static isModEvent(event) {
    return event.metaKey || event.ctrlKey || event.button === 1 ? "tab" : false;
  }
}

export function setIcon() {}
