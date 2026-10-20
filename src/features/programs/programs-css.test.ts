import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(join("src/styles", "programs.css"), "utf8");

/** Selectors from the sheet, with comments and at-rule preludes removed (as `login-css.test.ts` reads them). */
function selectors(sheet: string): string[] {
  const bare = sheet.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    if (chunk.indexOf("{") === -1) continue;
    const head = chunk.slice(0, chunk.indexOf("{"));
    for (const part of head.split(",")) {
      const s = part
        .trim()
        .replace(/^[\s\S]*\{/, "")
        .trim();
      if (!s || s.startsWith("@")) continue;
      out.push(s);
    }
  }
  return out;
}

/**
 * The programs' close, links and hero buttons (`programs.css`), which /marketplaces draws. The App Router keeps a
 * visited page's sheet in the document, so a rule here that reached past it would restyle another page, and only on
 * the second page view.
 */
describe("the programs' sheet", () => {
  it("names one of its own `pv-` classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(10);
    /* `pv-` is this sheet's alone; `.pv-main` is the page's <main>. */
    const stray = found.filter((s) => !/\.pv-/.test(s));
    expect(stray, `selector(s) in programs.css without a pv- class: ${stray.join(", ")}`).toEqual(
      [],
    );
  });

  it("opens the mock's page-wide hero rule on `:where(.pv-main)`, keeping its specificity the mock's", () => {
    /* `.hero-cta` is every hero's, and /brand-assets draws the same buttons: scoped, never page-wide. */
    const hero = selectors(css).filter((s) => /hero-cta/.test(s));
    expect(hero).toEqual([":where(.pv-main) .hero-cta .btn"]);
  });

  it("keeps no rule of the program pages, which have their own sheet", () => {
    expect(css).not.toMatch(
      /\.(pv-(panel|journey|step|term|who|proof|case|report|ranges|track|wcard|kit)|pg-soon|cp-)/,
    );
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
