import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/cloud-cost-tools.css", "utf8");
const page = readFileSync("src/app/cloud-cost-optimization-library/page.tsx", "utf8");

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
 * Cloud cost optimization tools' sheet (`cloud-cost-tools.css`). The App Router keeps a visited page's sheet in the
 * document, so a rule here that reached past this page would restyle another one, and only on the second page view.
 */
describe("the tools sheet", () => {
  it("names one of the page's own `tl-` classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(20);
    const stray = found.filter((s) => !/\.tl(?:-[\w-]+)?(?![\w-])/.test(s));
    expect(
      stray,
      `selector(s) in cloud-cost-tools.css without a tl- class: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("is loaded after Learn's sheet and /community's, whose rules it draws with and sets apart", () => {
    const learn = page.indexOf('import "@/styles/learn.css";');
    const community = page.indexOf('import "@/styles/community.css";');
    expect(learn).toBeGreaterThan(-1);
    expect(community).toBeGreaterThan(learn);
    expect(page.indexOf('import "@/styles/cloud-cost-tools.css";')).toBeGreaterThan(community);
  });

  it("draws how a tool acts as the mock's dot, undoing the alternatives pages' chip inside the tile", () => {
    expect(css).toContain(
      ".tl-meta .mk-acts{display:inline-flex;align-items:center;gap:8px;padding:0;border:0;border-radius:0;background:none;font-weight:inherit;color:var(--text);white-space:nowrap}",
    );
    for (const rule of [
      ".tl-meta .mk-auto::before{border-color:var(--good);background:var(--good)}",
      ".tl-meta .mk-mix::before{border-color:var(--warn);background:var(--warn)}",
    ])
      expect(css).toContain(rule);
  });

  it("lays Compare Coral and Amoeba two by two, one column on a phone", () => {
    expect(css).toContain(".dt-grid.tl-2x2{grid-template-columns:repeat(2,minmax(0,1fr))}");
    expect(css).toContain(
      "@media(max-width:760px){.dt-grid.tl-2x2{grid-template-columns:minmax(0,1fr)}}",
    );
  });

  it("moves nothing, and leaves the shared tokens, the fonts and the page-wide [hidden] rule alone", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/animation|transition|@keyframes/);
    expect(rules).not.toMatch(/:root|--sans\s*:|--code\s*:/);
    expect(rules).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css)).not.toContain("[hidden]");
  });
});
