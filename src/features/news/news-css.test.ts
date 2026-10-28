import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/news.css", "utf8");

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
 * The /news sheet shares one cascade with every page (the App Router keeps a visited route's sheet), so it may reach
 * only what /news draws: every selector names one of the page's own `nw-` classes, and never a class another sheet
 * owns (product-page.css's bare `.nw`, /learn's `nw-list`, the articles' `nw-nb`, `nw-links` and `nw-tbl`).
 */
describe("the news sheet", () => {
  it("names one of the page's own `nw-` classes in every selector", () => {
    const found = selectors(css);
    expect(found).toEqual([
      ".as-card.nw-fc",
      ".nw-fc + .as-cal",
      ".nw-fc",
      ".nw-own",
      ".nw-own-l",
      ".nw-flag",
      ".nw-meta",
      ".nw-fc .nw-meta + .as-h",
      ".nw-sec",
      ".nw-t .dt-a",
      ".nw-t .dt-go",
      ".dt-ic.nw-logo",
      "img.dt-ic.nw-logo",
      ".dt-ic.nw-aws",
      ".nw-mono",
      ".nw-m",
      ".nw-chips",
      ".nw-chips button",
      '.nw-chips button[aria-pressed="true"]',
      ".nw-chips button:focus-visible",
      ".nw-sl",
      ".nw-g + .nw-g",
      ".nw-g[hidden]",
      ".nw-note",
      ".nw-tm",
    ]);
    const stray = found.filter((s) => !/\.nw-[\w-]+/.test(s));
    expect(stray, `selector(s) in news.css without an nw- class: ${stray.join(", ")}`).toEqual([]);
    expect(found.filter((s) => /\.nw(?![\w-])|\.nw-(?:nb|links|tbl|list)\b/.test(s))).toEqual([]);
  });

  it("lays the pair's two cards out as columns with one class more than the site system's card rules", () => {
    expect(css).toContain(
      ".as-card.nw-fc,.nw-fc + .as-cal{grid-row:auto;display:flex;flex-direction:column;align-items:flex-start}",
    );
    expect(css).toContain(".dt-ic.nw-logo{width:28px;height:28px;object-fit:contain}");
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
