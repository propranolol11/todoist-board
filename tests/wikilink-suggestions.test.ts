import test from "node:test";
import assert from "node:assert/strict";
import { completeWikilink, getWikilinkQuery, rankNoteSuggestions } from "../src/wikilink-suggestions.ts";
import type { NoteSuggestion } from "../src/wikilink-suggestions.ts";

const note: NoteSuggestion = { name: "Plan", path: "Work/Plan.md", linktext: "Work/Plan" };

test("wikilink suggestions trigger at the caret in titles and multiline descriptions", () => {
  assert.deepEqual(getWikilinkQuery("Read [[", 7), { start: 5, end: 7, query: "", suffix: "" });
  const text = "First line\nSee [[Work/Pl";
  assert.equal(getWikilinkQuery(text, text.length)?.query, "Work/Pl");
  const second = "[[Done]] then [[Pl";
  assert.equal(getWikilinkQuery(second, second.length)?.query, "Pl");
  assert.ok(getWikilinkQuery("\\\\[[Pl", 6));
});

test("suggestions stay out of closed links, code, aliases, subpaths and selections", () => {
  for (const text of ["ordinary text", "[[Done]]", "[[Note#Heading", "[[Note|Alias", "\\[[Pl", "![[Pl",
    "`code [[Pl", "``code ` [[Pl", "```md\n[[Pl", "~~~~\n[[Pl", "[[multi\nline"]) {
    assert.equal(getWikilinkQuery(text, text.length), null, text);
  }
  assert.equal(getWikilinkQuery("[[Pl", 4, 2), null);
  for (const text of ["`code` [[Pl", "```\ncode\n```\n[[Pl", "~~~~\ncode\n~~~~\n[[Pl"]) {
    assert.ok(getWikilinkQuery(text, text.length), text);
  }
});

test("completion replaces only the current link and leaves the caret after its closing brackets", () => {
  const text = "Please read [[Pl and call Sam";
  const query = getWikilinkQuery(text, "Please read [[Pl".length)!;
  const completion = completeWikilink(text, query, note);
  assert.deepEqual(completion, { value: "Please read [[Work/Plan]] and call Sam", cursor: 25 });
  for (const ending of ["", "]", "]]"]) {
    const value = `[[Pl${ending}`;
    assert.equal(completeWikilink(value, getWikilinkQuery(value, 4)!, note).value, "[[Work/Plan]]");
  }
  const middle = "Before [[Planet]] after";
  assert.equal(completeWikilink(middle, getWikilinkQuery(middle, 11)!, note).value,
    "Before [[Work/Plan]] after");
});

test("completion preserves existing headings and display text, and inserts selected aliases", () => {
  for (const suffix of ["#Next steps", "#^test-block", "|my plan", "#Heading|my plan"]) {
    const value = `[[Pl${suffix}]] rest`;
    assert.equal(completeWikilink(value, getWikilinkQuery(value, 4)!, note).value, `[[Work/Plan${suffix}]] rest`);
  }
  const alias = { ...note, alias: "Roadmap" };
  const value = "Read [[Road";
  assert.equal(completeWikilink(value, getWikilinkQuery(value, value.length)!, alias).value,
    "Read [[Work/Plan|Roadmap]]");
  const existing = "[[Road#Heading|keep me]]";
  assert.equal(completeWikilink(existing, getWikilinkQuery(existing, 6)!, alias).value,
    "[[Work/Plan#Heading|keep me]]");
});

test("search matches names, aliases and folder paths while keeping duplicate notes distinct", () => {
  const other = { name: "Plan", path: "Personal/Plan.md", linktext: "Personal/Plan" };
  const alias = { ...note, alias: "Roadmap" };
  const notes = [note, other, alias, { name: "Planning", path: "Planning.md", linktext: "Planning" }];
  assert.deepEqual(rankNoteSuggestions(notes, "Plan").slice(0, 2).map((result) => result.path),
    ["Personal/Plan.md", "Work/Plan.md"]);
  assert.equal(rankNoteSuggestions(notes, "roadmap")[0], alias);
  assert.equal(rankNoteSuggestions(notes, "Work/")[0].path, "Work/Plan.md");
  assert.equal(rankNoteSuggestions(notes, "not found").length, 0);
  assert.equal(rankNoteSuggestions(notes, "", 2).length, 2);
});
