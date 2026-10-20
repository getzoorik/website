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
 * /referrals's and /partners's sheet (`programs.css`). The App Router keeps a visited page's sheet in the document,
 * so a rule here that reached past these two pages would restyle another one, and only on the second page view.
 */
describe("the programs' sheet", () => {
  it("names one of the two pages' own classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(100);
    /* `pv-` is these pages' alone; `.pv-main` is their <main>. */
    const stray = found.filter((s) => !/\.pv-/.test(s));
    expect(stray, `selector(s) in programs.css without a pv- class: ${stray.join(", ")}`).toEqual(
      [],
    );
  });

  it("opens the mock's page-wide hero rules on `:where(.pv-main)`, keeping their specificity the mock's", () => {
    /* `.hero-cta` is every hero's, and /brand-assets draws the same buttons: scoped, never page-wide. */
    const hero = selectors(css).filter((s) => /hero-cta|pg-soon/.test(s));
    expect(hero).toEqual([
      ":where(.pv-main) .hero-cta .btn svg",
      ":where(.pv-main) .hero-cta .btn",
      ":where(.pv-main) .pg-soon",
    ]);
  });

  it("moves nothing outside `prefers-reduced-motion: no-preference`", () => {
    /* Under reduced motion the page is static: no rule outside the query hides, offsets or animates anything. */
    const outside = css.replace(/@media\(prefers-reduced-motion:no-preference\)\{[\s\S]*?\n\}/, "");
    expect(outside).not.toMatch(/opacity:0[;}]/);
    expect(outside).not.toMatch(/scaleX\(0\)/);
    expect(outside).not.toMatch(/animation:/);
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
