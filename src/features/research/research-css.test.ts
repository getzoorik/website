import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/research.css", "utf8");

/** Selectors from the sheet, comments removed. */
function selectors(sheet: string): string[] {
  const bare = sheet.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    if (chunk.indexOf("{") === -1) continue;
    const head = chunk.slice(0, chunk.lastIndexOf("{"));
    const prelude = head.slice(head.lastIndexOf("{") + 1).trim();
    if (!prelude || prelude.startsWith("@")) continue;
    for (const part of prelude.split(",")) if (part.trim()) out.push(part.trim());
  }
  return out;
}

/**
 * The research page's sheet. The App Router keeps a visited page's sheet in the document, so every rule starts at
 * the page's own section, `#papers`: the Docs hub's groups and the Read more tiles elsewhere keep their own rules.
 */
describe("the research sheet", () => {
  it("starts every selector at the page's own section", () => {
    const found = selectors(css);
    expect(found).toHaveLength(6);
    expect(found.filter((s) => !s.startsWith("#papers "))).toEqual([]);
  });

  it("leaves the shared tokens and the fonts alone", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/--sans\s*:|--code\s*:|"Inter"|IBM Plex Mono|:root/);
  });
});
