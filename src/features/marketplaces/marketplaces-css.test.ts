import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/marketplaces.css", "utf8");

/**
 * Selectors from the sheet, comments removed: each rule's own, inside an at-rule too (a rule's selector is what
 * follows the last "{" before its body).
 */
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
 * /marketplaces's sheet (`marketplaces.css`). The App Router keeps a visited page's sheet in the document, so a rule
 * here that reached past this page would restyle another one, and only on the second page view.
 */
describe("the marketplaces sheet", () => {
  it("names one of the page's own `mp-` classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(30);
    const stray = found.filter((s) => !/\.mp-[\w-]+/.test(s));
    expect(
      stray,
      `selector(s) in marketplaces.css without an mp- class: ${stray.join(", ")}`,
    ).toEqual([]);
    /* The first rule inside a media query counts too. */
    expect(found).toContain(".mp-grid");
    expect(found).toContain(".mp-buy");
  });

  it("restyles none of the programs' classes, whose sheet the page loads first", () => {
    /* `.pv-go`, `.pv-close` and the rest are programs.css's: this sheet only reaches them inside an mp- class. */
    expect(selectors(css).filter((s) => /^\.pv-/.test(s))).toEqual([]);
  });

  it("takes the site's arrow's margin off where the mock's arrows have none, and lets it shrink as theirs do", () => {
    expect(css).toContain(".mp-go .ext,.mp-acts .ext,.mp-i .ext{margin-left:0;flex:0 1 auto}");
  });

  it("moves nothing: no animation, and no transition of its own", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/animation|transition|@keyframes/);
  });

  it("leaves the shared tokens, the fonts and the page-wide [hidden] rule alone", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/--sans\s*:/);
    expect(rules).not.toMatch(/--code\s*:/);
    expect(rules).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css).filter((s) => s.includes(":root"))).toEqual([]);
    expect(selectors(css)).not.toContain("[hidden]");
  });
});
