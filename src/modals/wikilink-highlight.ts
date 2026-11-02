import { Component } from "obsidian";
import type { App } from "obsidian";
import { getWikilinkRanges } from "../obsidian-links";

let nextStatusId = 0;

/** Colour a text mirror while preserving native caret, selection, undo and mobile IME. */
export class WikilinkHighlight extends Component {
  private readonly app: App;
  private readonly input: HTMLInputElement | HTMLTextAreaElement;
  private mirror: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private status: HTMLElement | null = null;
  private originalTitle: string | null = null;
  private frame: number | null = null;
  private hasLinks = false;

  constructor(app: App, input: HTMLInputElement | HTMLTextAreaElement) {
    super();
    this.app = app;
    this.input = input;
  }

  onload() {
    const input = this.input;
    const host = input.parentElement!;
    const ownerWindow = input.ownerDocument.defaultView!;
    host.classList.add("taskmodal-link-field");
    this.originalTitle = input.getAttribute("title");
    this.mirror = host.createDiv({ cls: "taskmodal-link-mirror", attr: { "aria-hidden": "true" } });
    this.content = this.mirror.createDiv({ cls: "taskmodal-link-mirror-content" });
    this.status = host.createDiv({ cls: "taskmodal-link-status", attr: { role: "status", "aria-live": "polite" } });
    this.status.id = `todoist-note-status-${++nextStatusId}`;
    input.setAttribute("aria-describedby", [input.getAttribute("aria-describedby"), this.status.id].filter(Boolean).join(" "));
    const refresh = () => this.render();
    this.registerDomEvent(input, "input", refresh);
    this.registerDomEvent(input, "scroll", () => this.syncScroll());
    for (const eventName of ["focus", "keyup", "click", "select", "compositionend"] as const) {
      this.registerDomEvent(input, eventName, () => this.scheduleLayout());
    }
    this.registerDomEvent(ownerWindow, "resize", () => this.scheduleLayout());
    const observer = new ResizeObserver(() => this.layout());
    observer.observe(input);
    this.register(() => observer.disconnect());
    this.registerEvent(this.app.metadataCache.on("resolved", refresh));
    this.registerEvent(this.app.vault.on("create", refresh));
    this.registerEvent(this.app.vault.on("delete", refresh));
    this.registerEvent(this.app.vault.on("rename", refresh));
    this.render();
  }

  onunload() {
    if (this.frame !== null) this.input.ownerDocument.defaultView!.cancelAnimationFrame(this.frame);
    this.frame = null;
    this.input.parentElement?.classList.remove("taskmodal-link-field", "taskmodal-link-ready");
    const descriptions = (this.input.getAttribute("aria-describedby") ?? "").split(" ").filter((id) => id && id !== this.status?.id);
    if (descriptions.length) this.input.setAttribute("aria-describedby", descriptions.join(" "));
    else this.input.removeAttribute("aria-describedby");
    if (this.originalTitle !== null) this.input.setAttribute("title", this.originalTitle);
    else this.input.removeAttribute("title");
    this.mirror?.remove();
    this.status?.remove();
    this.mirror = null;
    this.content = null;
    this.status = null;
  }

  private render() {
    if (!this.content || !this.status) return;
    const text = this.input.value;
    const document = this.input.ownerDocument;
    this.content.empty();
    let end = 0;
    const existing = new Set<string>();
    const missing = new Set<string>();
    const ranges = getWikilinkRanges(text);
    this.hasLinks = ranges.length > 0;
    for (const range of ranges) {
      this.content.appendChild(document.createTextNode(text.slice(end, range.start)));
      const resolved = Boolean(this.app.metadataCache.getFirstLinkpathDest(range.linkpath, ""));
      this.content.createSpan({
        cls: resolved ? "taskmodal-note-link is-resolved" : "taskmodal-note-link is-unresolved",
        text: text.slice(range.start, range.end),
      });
      (resolved ? existing : missing).add(range.linkpath);
      end = range.end;
    }
    this.content.appendChild(document.createTextNode(text.slice(end)));
    // A final newline needs a following line box to match textarea scrolling.
    if (text.endsWith("\n")) this.content.appendChild(document.createTextNode(" "));
    const missingMessage = missing.size ? `Note not found: ${Array.from(missing).join(", ")}.` : "";
    const message = [existing.size ? `Linked notes: ${Array.from(existing).join(", ")}.` : "", missingMessage].filter(Boolean).join(" ");
    if (this.status.textContent !== message) this.status.textContent = message;
    if (missingMessage) this.input.setAttribute("title", missingMessage);
    else if (this.originalTitle !== null) this.input.setAttribute("title", this.originalTitle);
    else this.input.removeAttribute("title");
    this.layout();
    this.scheduleLayout();
  }

  private scheduleLayout() {
    if (this.frame !== null || !this.mirror) return;
    this.frame = this.input.ownerDocument.defaultView!.requestAnimationFrame(() => {
      this.frame = null;
      this.layout();
    });
  }

  private layout() {
    const input = this.input;
    if (!this.hasLinks) { input.parentElement?.classList.remove("taskmodal-link-ready"); return; }
    if (!this.mirror || !this.content || !input.isConnected || !input.clientWidth) return;
    const style = input.ownerDocument.defaultView!.getComputedStyle(input);
    const multiline = input.tagName === "TEXTAREA";
    const topPadding = parseFloat(style.paddingTop) || 0;
    const bottomPadding = parseFloat(style.paddingBottom) || 0;
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    const verticalCenter = multiline ? 0 : Math.max(0, (input.clientHeight - topPadding - bottomPadding - lineHeight) / 2);
    this.mirror.setCssProps({
      "--mirror-left": `${input.offsetLeft + input.clientLeft}px`,
      "--mirror-top": `${input.offsetTop + input.clientTop}px`,
      "--mirror-width": `${input.clientWidth}px`,
      "--mirror-height": `${input.clientHeight}px`,
      "--mirror-font-family": style.fontFamily,
      "--mirror-font-size": style.fontSize,
      "--mirror-font-weight": style.fontWeight,
      "--mirror-font-style": style.fontStyle,
      "--mirror-line-height": `${lineHeight}px`,
      "--mirror-letter-spacing": style.letterSpacing,
      "--mirror-word-spacing": style.wordSpacing,
      "--mirror-text-indent": style.textIndent,
      "--mirror-text-align": style.textAlign,
      "--mirror-text-transform": style.textTransform,
      "--mirror-direction": style.direction,
      "--mirror-tab-size": style.tabSize,
      "--mirror-white-space": multiline ? "pre-wrap" : "pre",
      "--mirror-overflow-wrap": multiline ? "break-word" : "normal",
      "--mirror-padding": `${topPadding + verticalCenter}px ${style.paddingRight} ${bottomPadding}px ${style.paddingLeft}`,
    });
    input.parentElement?.classList.add("taskmodal-link-ready");
    this.syncScroll();
  }

  private syncScroll() {
    this.content?.setCssProps({ "--mirror-scroll": `translate(${-this.input.scrollLeft}px, ${-this.input.scrollTop}px)` });
  }
}
