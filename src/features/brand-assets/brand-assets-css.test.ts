import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SHEET = join("src", "styles", "brand-assets.css");

/** Selectors from a sheet, with comments and at-rule preludes removed (as `login-css.test.ts` reads them). */
function selectors(css: string): string[] {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
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
      if (/^(from|to|\d+(\.\d+)?%)$/.test(s)) continue;
      out.push(s);
    }
  }
  return out;
}

/**
 * The App Router keeps a visited page's stylesheet in the document, so a rule in /brand-assets's sheet that matched
 * another page's markup would restyle that page after one visit here. Every selector names a `bk-` class, which only
 * this page draws, or opens on its <main> (`.bk-main`); the mock's two `.hero-cta .btn` rules open on
 * `:where(.bk-main)`, which scopes them and keeps the mock's specificity.
 */
describe("the brand assets sheet", () => {
  const css = readFileSync(SHEET, "utf8");

  it("reaches only this page's own elements", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(80);
    const stray = found.filter(
      (s) => !/^(\.bk-main |:where\(\.bk-main\) )/.test(s) && !/^\.bk-/.test(s),
    );
    expect(stray, `selector(s) in brand-assets.css outside the page: ${stray.join(", ")}`).toEqual(
      [],
    );
  });

  it("leaves the shared tokens and next/font's families alone", () => {
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    expect(selectors(css).filter((s) => /:root|^html|^body|\*/.test(s))).toEqual([]);
    expect(css).not.toMatch(/"Inter"|'Inter'|IBM Plex Mono/);
  });

  it("draws the retyped word in a serif, the one family named outright", () => {
    expect(css).toMatch(
      /\.bk-x-type span\{font:italic 700 2\.6rem\/1 Georgia,"Times New Roman",serif;/,
    );
  });
});
