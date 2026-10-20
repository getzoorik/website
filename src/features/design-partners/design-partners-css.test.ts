import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/design-partners.css", "utf8");

/** Selectors from the sheet, with comments and at-rule preludes removed (as `programs-css.test.ts` reads them). */
function selectors(sheet: string): string[] {
  const bare = sheet.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    if (chunk.indexOf("{") === -1) continue;
    for (const part of chunk.slice(0, chunk.indexOf("{")).split(",")) {
      const s = part
        .trim()
        .replace(/^[\s\S]*\{/, "")
        .trim();
      if (s && !s.startsWith("@")) out.push(s);
    }
  }
  return out;
}

/**
 * /design-partners's sheet (`design-partners.css`). The App Router keeps a visited page's sheet in the document, so a
 * rule here that reached past this page would restyle another one, and only on the second page view.
 */
describe("the design partners' sheet", () => {
  it("names one of the page's own classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(25);
    /* `dp-` is this page's alone; `.dp-main` is its <main>. */
    const stray = found.filter((s) => !/\.dp-/.test(s));
    expect(
      stray,
      `selector(s) in design-partners.css without a dp- class: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("opens /brand-assets's list rules on `:where(.dp-main)`, keeping their specificity the mock's", () => {
    /* What we ask borrows `.bk-list` and `.bk-ok`, as the mock does: scoped, never page-wide. */
    const borrowed = selectors(css).filter((s) => /\.bk-/.test(s) && !/\.dp-list/.test(s));
    expect(borrowed).toEqual([
      ":where(.dp-main) .bk-list",
      ":where(.dp-main) .bk-list li",
      ":where(.dp-main) .bk-ok",
      ":where(.dp-main) .bk-ok svg",
    ]);
  });

  it("overrides the programs' and /brand-assets's rules with one class more, so their sheets win in no order", () => {
    /* `.pv-journey`, `.pv-who` (programs.css) and `.bk-list li` (brand-assets.css) are one class; these are two. */
    const found = selectors(css);
    for (const s of [
      ".dp-main .dp-j4",
      ".dp-main .dp-who",
      ".dp-main .dp-get",
      ".dp-main .dp-list li",
    ]) {
      expect(found).toContain(s);
    }
    expect(found.filter((s) => /^\.dp-(j4|who|get)$|^\.dp-list li$/.test(s))).toEqual([]);
  });

  it("moves nothing outside `prefers-reduced-motion: no-preference`", () => {
    /* Under reduced motion the page is static: no rule outside the query hides, offsets or animates anything. */
    const outside = css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/@media\(prefers-reduced-motion:no-preference\)\{[\s\S]*?\n\}/, "");
    expect(outside).not.toMatch(/opacity:0[;}]/);
    expect(outside).not.toMatch(/scale\(\.4\)/);
    expect(outside).not.toMatch(/transition|animation:/);
  });

  it("leaves the shared tokens and the self-hosted faces alone", () => {
    /* --sans and --code resolve to next/font's hashed family names; a literal family matches nothing. */
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(rules).not.toMatch(/:root/);
  });
});
