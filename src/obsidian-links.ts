export interface ObsidianLinkContext {
  vaultName?: string;
  resolveFile?: (linkpath: string) => string | undefined;
}

/** Only handle this vault's open links locally; other vaults use the URI handler. */
export function obsidianUriToLinktext(uri: string, vaultName: string): string | undefined {
  try {
    const url = new URL(uri);
    if (url.protocol !== "obsidian:" || url.hostname !== "open" || url.searchParams.has("path")) return;
    const vault = url.searchParams.get("vault");
    if (vault && vault !== vaultName) return;
    return url.searchParams.get("file") || undefined;
  } catch {
    return;
  }
}

function encodeUriValue(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

// Skip existing Markdown links, including balanced brackets/parentheses, so a
// wikilink-looking label or URL is never rewritten inside another link.
function markdownLinkEnd(text: string, start: number): number {
  let depth = 0;
  let index = start;
  for (; index < text.length; index++) {
    if (text[index] === "\\") { index++; continue; }
    if (text[index] === "[") depth++;
    if (text[index] === "]" && --depth === 0) break;
  }
  const opener = text[index + 1];
  if (depth !== 0 || (opener !== "(" && opener !== "[")) return start;
  const closer = opener === "(" ? ")" : "]";
  depth = 1;
  for (index += 2; index < text.length; index++) {
    if (text[index] === "\\") { index++; continue; }
    if (text[index] === opener) depth++;
    if (text[index] === closer && --depth === 0) return index + 1;
  }
  return start;
}

function mapProseLinks(text: string, handlers: {
  wiki?: (source: string, inner: string, start: number) => string;
  markdown?: (source: string) => string;
}): string {
  let result = "";
  let index = 0;
  while (index < text.length) {
    const rest = text.slice(index);
    let end = index;
    if (index === 0 || text[index - 1] === "\n") {
      const fence = /^ {0,3}(`{3,}|~{3,})[^\n]*(?:\n|$)/.exec(rest);
      if (fence) {
        const closing = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}[ \\t]*(?:\\r?\\n|$)`, "m");
        const afterOpening = rest.slice(fence[0].length);
        const match = closing.exec(afterOpening);
        end = match ? index + fence[0].length + match.index + match[0].length : text.length;
      } else if (/^(?: {4}|\t)/.test(rest)) {
        const newline = text.indexOf("\n", index);
        end = newline < 0 ? text.length : newline + 1;
      }
    }
    if (end === index && text[index] === "\\") end = Math.min(index + 2, text.length);
    if (end === index && text[index] === "`") {
      const ticks = /^`+/.exec(rest)![0];
      const runs = /`+/g;
      runs.lastIndex = index + ticks.length;
      let match: RegExpExecArray | null;
      while ((match = runs.exec(text))) {
        if (match[0].length === ticks.length) { end = runs.lastIndex; break; }
      }
      if (end === index) end = index + ticks.length;
    }
    if (end === index && rest.startsWith("![[")) {
      const close = text.indexOf("]]", index + 3);
      if (close >= 0) end = close + 2;
    }
    if (end > index) {
      result += text.slice(index, end);
      index = end;
      continue;
    }
    const wiki = /^\[\[([^\r\n[\]]+)\]\]/.exec(rest);
    if (wiki) {
      result += handlers.wiki?.(wiki[0], wiki[1], index) ?? wiki[0];
      index += wiki[0].length;
      continue;
    }
    if (text[index] === "[") {
      end = markdownLinkEnd(text, index);
      if (end > index) {
        const source = text.slice(index, end);
        result += handlers.markdown?.(source) ?? source;
        index = end;
        continue;
      }
    }
    result += text[index++];
  }
  return result;
}

export interface WikilinkRange {
  start: number;
  end: number;
  linkpath: string;
}

/** Locate editable links without treating code examples or escaped text as links. */
export function getWikilinkRanges(text: string): WikilinkRange[] {
  const ranges: WikilinkRange[] = [];
  mapProseLinks(text, { wiki: (source, inner, start) => {
    const linkpath = inner.split("|", 1)[0].trim().split("#", 1)[0];
    if (linkpath) ranges.push({ start, end: start + source.length, linkpath });
    return source;
  } });
  return ranges;
}

/** Convert prose wikilinks at the API boundary, leaving code and existing links intact. */
export function wikilinksToObsidianUris(text: string, context: ObsidianLinkContext = {}): string {
  return mapProseLinks(text, { wiki: (source, inner) => {
    const [rawTarget, ...alias] = inner.split("|");
    const target = rawTarget.trim();
    const hash = target.indexOf("#");
    const file = hash < 0 ? target : target.slice(0, hash);
    const subpath = hash < 0 ? "" : target.slice(hash);
    if (!file) return source;
    const path = (context.resolveFile?.(file) ?? file) + subpath;
    const vault = context.vaultName ? `vault=${encodeUriValue(context.vaultName)}&` : "";
    const label = (alias.length ? alias.join("|").trim() : target).replace(/[\\`*[\]_]/g, "\\$&");
    return `[${label}](obsidian://open?${vault}file=${encodeUriValue(path)})`;
  } });
}

/** Keep the task editor readable after URI links return from Todoist. */
export function obsidianUrisToWikilinks(text: string, vaultName: string, shortenTarget?: (target: string) => string): string {
  return mapProseLinks(text, { markdown: (source) => {
    const match = /^\[((?:\\.|[^\]\\])*)\]\((obsidian:\/\/open\?[^\s)]+)\)$/.exec(source);
    if (!match) return source;
    const uri = new URL(match[2]);
    if (uri.hash || Array.from(uri.searchParams.keys()).some((key) => key !== "vault" && key !== "file")) return source;
    const target = obsidianUriToLinktext(match[2], vaultName);
    if (!target) return source;
    const linktext = shortenTarget?.(target) ?? target.replace(/\.md(?=#|$)/, "");
    const label = match[1].replace(/\\([\\`*[\]_])/g, "$1");
    // Some valid Markdown labels cannot be represented by wikilink syntax.
    if (/[\r\n[\]|]/.test(linktext) || /[\r\n[\]|]/.test(label)) return source;
    return `[[${linktext}${label === linktext ? "" : `|${label}`}]]`;
  } });
}
