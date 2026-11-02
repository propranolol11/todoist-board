import { prepareFuzzySearch } from "obsidian";

export interface WikilinkQuery {
  start: number;
  end: number;
  query: string;
  suffix: string;
}

export interface NoteSuggestion {
  name: string;
  path: string;
  linktext: string;
  alias?: string;
}

export function getWikilinkQuery(value: string, cursor: number, selectionEnd = cursor): WikilinkQuery | null {
  if (cursor !== selectionEnd) return null;
  const before = value.slice(0, cursor);
  const start = before.lastIndexOf("[[");
  if (start < 0) return null;
  const escapes = /\\*$/.exec(before.slice(0, start))![0].length;
  if (escapes % 2 || before[start - 1] === "!") return null;
  const query = before.slice(start + 2);
  if (/[\r\n[\]#|]/.test(query)) return null;

  // Do not offer notes inside code examples in a description.
  let fence = "";
  let inline = "";
  for (const line of before.slice(0, start).split("\n")) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker && !inline) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = "";
    } else if (!fence) {
      for (const match of line.matchAll(/\\.|`+/g)) {
        if (match[0][0] !== "`") continue;
        if (!inline) inline = match[0];
        else if (inline === match[0]) inline = "";
      }
    }
  }
  if (fence || inline) return null;

  const close = value.indexOf("]]", cursor);
  const remaining = close < 0 ? "" : value.slice(cursor, close);
  const hasClose = close >= 0 && !/[\r\n[\]]/.test(remaining);
  return {
    start,
    end: hasClose ? close + 2 : cursor + (value[cursor] === "]" ? 1 : 0),
    query,
    suffix: hasClose ? /[#|].*$/.exec(remaining)?.[0] ?? "" : "",
  };
}

export function rankNoteSuggestions(notes: NoteSuggestion[], query: string, limit = 20): NoteSuggestion[] {
  const normalized = query.trim().toLocaleLowerCase();
  const search = prepareFuzzySearch(normalized);
  return notes.flatMap((note) => {
    if (!normalized && note.alias) return [];
    const label = note.alias ?? note.name;
    const match = normalized ? search(label) ?? (note.alias ? null : search(note.path)) : { score: 0 };
    if (!match) return [];
    const lower = label.toLocaleLowerCase();
    const priority = lower === normalized ? 2 : lower.startsWith(normalized) ? 1 : 0;
    return [{ note, priority, score: match.score }];
  }).sort((a, b) => b.priority - a.priority || b.score - a.score
    || (a.note.alias ?? a.note.name).localeCompare(b.note.alias ?? b.note.name)
    || a.note.path.localeCompare(b.note.path))
    .slice(0, limit).map(({ note }) => note);
}

export function completeWikilink(value: string, query: WikilinkQuery, note: NoteSuggestion): { value: string; cursor: number } {
  const alias = note.alias && !query.suffix.includes("|") ? `|${note.alias}` : "";
  const link = `[[${note.linktext}${query.suffix}${alias}]]`;
  return {
    value: value.slice(0, query.start) + link + value.slice(query.end),
    cursor: query.start + link.length,
  };
}
