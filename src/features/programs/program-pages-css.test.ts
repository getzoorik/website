import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/program-pages.css", "utf8");

/** Selectors from the sheet, comments removed: each rule's own, inside an at-rule too. */
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
 * The three program pages' sheet (`program-pages.css`). The App Router keeps a visited page's sheet in the document,
 * so a rule here that reached past these pages would restyle another one, and only on the second page view.
 */
describe("the program pages' sheet", () => {
  it("names one of the pages' own `cp-` classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(60);
    const stray = found.filter((s) => !/\.cp-[\w-]+/.test(s));
    expect(
      stray,
      `selector(s) in program-pages.css without a cp- class: ${stray.join(", ")}`,
    ).toEqual([]);
    /* The first rule inside a media query counts too. */
    expect(found).toContain(".dt-grid.cp-3");
  });

  it("gives each page its own element: the slots, the steps, the commands, the chain, the ranges", () => {
    for (const own of [".cp-slots", ".cp-steps", ".cp-cmd", ".cp-chain", ".cp-rg", ".cp-buyrow"]) {
      expect(selectors(css)).toContain(own);
    }
  });

  it("moves nothing: no animation and no transition of its own", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/animation|transition|@keyframes/);
  });

  it("leaves the shared tokens and the self-hosted faces alone", () => {
    /* --sans and --code resolve to next/font's hashed family names; a literal family matches nothing. */
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/--sans\s*:/);
    expect(rules).not.toMatch(/--code\s*:/);
    expect(rules).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(rules).not.toMatch(/:root/);
  });
});
