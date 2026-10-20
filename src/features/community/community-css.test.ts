import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/community.css", "utf8");

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
 * /community's sheet (`community.css`). The App Router keeps a visited page's sheet in the document, so a rule here
 * that reached past this page would restyle another one, and only on the second page view.
 */
describe("the community sheet", () => {
  it("names one of Community's own `cm-` classes in every selector", () => {
    const found = selectors(css);
    expect(found).toEqual([
      ".cm-sub + .cm-sub",
      ".cm-sl",
      ".dt-ic.cm-logo",
      "img.dt-ic.cm-logo",
      ".cm-own",
      ".cm-note",
      ".cm-note a",
    ]);
    const stray = found.filter((s) => !/\.cm-[\w-]+/.test(s));
    expect(stray, `selector(s) in community.css without a cm- class: ${stray.join(", ")}`).toEqual(
      [],
    );
  });

  it("sizes a community's logo over the tile's icon rule with one class more, so either sheet may load last", () => {
    expect(css).toContain(".dt-ic.cm-logo{width:28px;height:28px;object-fit:contain}");
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
