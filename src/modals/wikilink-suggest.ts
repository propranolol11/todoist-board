import { Component, parseFrontMatterAliases, Scope } from "obsidian";
import type { App } from "obsidian";
import { completeWikilink, getWikilinkQuery, rankNoteSuggestions } from "../wikilink-suggestions";
import type { NoteSuggestion, WikilinkQuery } from "../wikilink-suggestions";

type TextInput = HTMLInputElement | HTMLTextAreaElement;
let nextSuggestId = 0;

/** A shared popup for the task sheet's input and textarea, with focus kept in the field. */
export class WikilinkSuggest extends Component {
  private readonly app: App;
  private readonly inputs: TextInput[];
  private readonly popupHost: HTMLElement;
  private readonly scope: Scope;
  private readonly id = `todoist-wikilinks-${++nextSuggestId}`;
  private input: TextInput | null = null;
  private query: WikilinkQuery | null = null;
  private popup: HTMLElement | null = null;
  private notes: NoteSuggestion[] | null = null;
  private suggestions: NoteSuggestion[] = [];
  private selected = 0;
  private queryKey = "";
  private dismissedKey = "";
  private composing = false;
  private touchingPopup = false;

  constructor(app: App, parentScope: Scope, inputs: TextInput[], popupHost: HTMLElement) {
    super();
    this.app = app;
    this.inputs = inputs;
    this.popupHost = popupHost;
    this.scope = new Scope(parentScope);
    for (const key of ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"]) {
      this.scope.register([], key, (event) => {
        if (this.composing || event.isComposing) return;
        event.stopPropagation();
        if (key === "Escape") this.close(true);
        else if (key === "Enter" || key === "Tab") this.choose(this.selected);
        else this.select(this.selected + (key === "ArrowDown" ? 1 : -1));
        return false;
      });
    }
  }

  onload() {
    const document = this.popupHost.ownerDocument;
    const ownerWindow = document.defaultView!;
    this.registerDomEvent(document, "pointerdown", (event) => {
      const target = event.target as Node | null;
      if (this.popup && target && !this.popup.contains(target) && target !== this.input) this.close(true);
    }, true);
    this.registerDomEvent(document, "scroll", (event) => {
      if (event.target !== this.popup) this.positionPopup();
    }, true);
    this.registerDomEvent(ownerWindow, "resize", () => this.positionPopup());
    const viewport = ownerWindow.visualViewport;
    const reposition = () => this.positionPopup();
    viewport?.addEventListener("resize", reposition);
    viewport?.addEventListener("scroll", reposition);
    const observer = new ResizeObserver(reposition);
    for (const input of this.inputs) observer.observe(input);
    const modal = this.popupHost.querySelector(".modal");
    if (modal) observer.observe(modal);
    this.register(() => {
      observer.disconnect();
      viewport?.removeEventListener("resize", reposition);
      viewport?.removeEventListener("scroll", reposition);
    });
    for (const input of this.inputs) {
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "false");
      this.registerDomEvent(input, "input", () => { this.dismissedKey = ""; this.update(input); });
      this.registerDomEvent(input, "focus", () => this.update(input));
      this.registerDomEvent(input, "click", () => { this.dismissedKey = ""; this.update(input); });
      this.registerDomEvent(input, "keyup", () => this.update(input));
      this.registerDomEvent(input, "select", () => this.update(input));
      this.registerDomEvent(input, "blur", () => {
        this.dismissedKey = "";
        // WebKit can blur the field before delivering a suggestion's touchend.
        if (!this.touchingPopup) this.close();
      });
      this.registerDomEvent(input, "compositionstart", () => { this.composing = true; this.close(); });
      this.registerDomEvent(input, "compositionend", () => { this.composing = false; this.update(input); });
    }
  }

  onunload() {
    this.close();
    for (const input of this.inputs) {
      input.removeAttribute("aria-autocomplete");
      input.removeAttribute("aria-expanded");
    }
  }

  private update(input: TextInput) {
    if (this.composing || input.ownerDocument.activeElement !== input) return;
    const key = JSON.stringify([this.inputs.indexOf(input), input.value, input.selectionStart, input.selectionEnd]);
    if (this.input === input && key === this.queryKey) return;
    const query = getWikilinkQuery(input.value, input.selectionStart ?? 0, input.selectionEnd ?? 0);
    if (!query || key === this.dismissedKey) { this.close(); return; }
    if (this.input !== input) this.close();
    this.input = input;
    this.query = query;
    this.queryKey = key;
    this.notes ??= this.app.vault.getMarkdownFiles().flatMap((file) => {
      const note: NoteSuggestion = {
        name: file.basename,
        path: file.path,
        linktext: this.app.metadataCache.fileToLinktext(file, "", true),
      };
      const aliases = parseFrontMatterAliases(this.app.metadataCache.getFileCache(file)?.frontmatter) ?? [];
      return [note, ...Array.from(new Set(aliases)).filter((alias) => alias !== note.name)
        .map((alias) => ({ ...note, alias }))];
    });
    this.suggestions = rankNoteSuggestions(this.notes, query.query);
    if (!this.suggestions.length) { this.close(); return; }
    if (!this.popup) {
      // A sibling of the modal avoids its scroll/overflow clipping and never
      // contributes to the centered modal's size.
      this.popup = this.popupHost.createDiv({ cls: "suggestion-container todoist-wikilink-suggestions" });
      this.popup.id = this.id;
      this.popup.setAttribute("role", "listbox");
      this.popup.setAttribute("aria-label", "Notes");
      for (const type of ["pointerdown", "mousedown"] as const) {
        this.popup.addEventListener(type, (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
      }
      // Keep mobile workspace handlers from dismissing the keyboard. Do not
      // cancel touchstart/touchmove: the suggestions must still scroll natively.
      this.popup.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
      this.app.keymap.pushScope(this.scope);
    }
    this.popup.empty();
    this.suggestions.forEach((note, index) => {
      const item = this.popup!.createDiv({ cls: "suggestion-item" });
      item.id = `${this.id}-${index}`;
      item.setAttribute("role", "option");
      item.createDiv({ cls: "suggestion-title", text: note.alias ?? note.name });
      item.createDiv({ cls: "suggestion-note", text: note.path });
      item.addEventListener("mouseenter", () => this.select(index));
      item.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); this.choose(index); });
      let touch: { id: number; x: number; y: number } | null = null;
      item.addEventListener("touchstart", (event) => {
        const start = event.touches.length === 1 ? event.touches[0] : null;
        touch = start ? { id: start.identifier, x: start.clientX, y: start.clientY } : null;
        this.touchingPopup = true;
      }, { passive: true });
      item.addEventListener("touchmove", (event) => {
        const current = Array.from(event.touches).find((point) => point.identifier === touch?.id);
        if (!current || !touch || Math.hypot(current.clientX - touch.x, current.clientY - touch.y) > 10) touch = null;
      }, { passive: true });
      item.addEventListener("touchend", (event) => {
        // Select before WebKit's synthetic mouse events, which can blur the
        // input or be suppressed altogether when a hover changes the list.
        event.preventDefault();
        event.stopPropagation();
        const end = Array.from(event.changedTouches).find((point) => point.identifier === touch?.id);
        const tapped = touch && end && event.touches.length === 0
          && Math.hypot(end.clientX - touch.x, end.clientY - touch.y) <= 10;
        touch = null;
        this.touchingPopup = false;
        if (tapped) this.choose(index);
        else if (input.ownerDocument.activeElement !== input) this.close();
      }, { passive: false });
      item.addEventListener("touchcancel", (event) => {
        event.stopPropagation();
        touch = null;
        this.touchingPopup = false;
        if (input.ownerDocument.activeElement !== input) this.close();
      }, { passive: true });
    });
    input.setAttribute("aria-controls", this.id);
    input.setAttribute("aria-expanded", "true");
    this.selected = 0;
    this.positionPopup();
  }

  private positionPopup() {
    if (!this.popup || !this.input) return;
    const ownerWindow = this.input.ownerDocument.defaultView!;
    const viewport = ownerWindow.visualViewport;
    const leftEdge = viewport?.offsetLeft ?? 0;
    const topEdge = viewport?.offsetTop ?? 0;
    const viewportWidth = viewport?.width ?? ownerWindow.innerWidth;
    const viewportHeight = viewport?.height ?? ownerWindow.innerHeight;
    const rightEdge = leftEdge + viewportWidth;
    const bottomEdge = topEdge + viewportHeight;
    const rect = this.input.getBoundingClientRect();
    const scroller = this.input.closest(".taskmodal-wrapper")?.getBoundingClientRect();
    if (rect.bottom <= Math.max(topEdge, scroller?.top ?? topEdge)
      || rect.top >= Math.min(bottomEdge, scroller?.bottom ?? bottomEdge)) {
      this.close();
      return;
    }
    const margin = 8;
    const gap = 4;
    const width = Math.min(rect.width, viewportWidth - margin * 2);
    const below = Math.max(0, bottomEdge - rect.bottom - gap - margin);
    const above = Math.max(0, rect.top - topEdge - gap - margin);
    const desiredHeight = Math.min(240, viewportHeight * 0.4);
    const openBelow = below >= Math.min(160, desiredHeight) || below >= above;
    const maxHeight = Math.min(desiredHeight, openBelow ? below : above);
    if (maxHeight < 40) { this.close(); return; }
    this.popup.setCssProps({
      "--todoist-suggest-left": `${Math.max(leftEdge + margin, Math.min(rect.left, rightEdge - width - margin))}px`,
      "--todoist-suggest-width": `${width}px`,
      "--todoist-suggest-height": `${maxHeight}px`,
    });
    const height = this.popup.getBoundingClientRect().height;
    this.popup.setCssProps({
      "--todoist-suggest-top": `${openBelow ? rect.bottom + gap : rect.top - height - gap}px`,
    });
    this.select(this.selected);
  }

  private select(index: number) {
    if (!this.suggestions.length) return;
    this.selected = (index + this.suggestions.length) % this.suggestions.length;
    Array.from(this.popup?.children ?? []).forEach((item, position) => {
      item.classList.toggle("is-selected", position === this.selected);
      item.setAttribute("aria-selected", String(position === this.selected));
    });
    this.input?.setAttribute("aria-activedescendant", `${this.id}-${this.selected}`);
    // Scroll the list itself, without moving the task sheet or the mobile keyboard.
    const item = this.popup?.children[this.selected] as HTMLElement | undefined;
    if (item && this.popup) {
      if (item.offsetTop < this.popup.scrollTop) this.popup.scrollTop = item.offsetTop;
      else if (item.offsetTop + item.offsetHeight > this.popup.scrollTop + this.popup.clientHeight) {
        this.popup.scrollTop = item.offsetTop + item.offsetHeight - this.popup.clientHeight;
      }
    }
  }

  private choose(index: number) {
    const input = this.input;
    const note = this.suggestions[index];
    if (!input || !note || !this.query) return;
    const query = getWikilinkQuery(input.value, input.selectionStart ?? 0, input.selectionEnd ?? 0);
    if (!query) { this.close(); return; }
    const completion = completeWikilink(input.value, query, note);
    this.close();
    input.setRangeText(completion.value.slice(query.start, completion.cursor), query.start, query.end, "end");
    input.focus({ preventScroll: true });
    const EventClass = input.ownerDocument.defaultView!.Event;
    input.dispatchEvent(new EventClass("input", { bubbles: true }));
  }

  private close(dismissed = false) {
    this.touchingPopup = false;
    if (dismissed) this.dismissedKey = this.queryKey;
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
      this.app.keymap.popScope(this.scope);
    }
    this.input?.setAttribute("aria-expanded", "false");
    this.input?.removeAttribute("aria-controls");
    this.input?.removeAttribute("aria-activedescendant");
    this.input = null;
    this.query = null;
    this.queryKey = "";
    this.notes = null;
    this.suggestions = [];
  }
}
