import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SHEET = join("src/styles", "case-studies.css");

/** Selectors from a sheet, with comments and at-rule preludes removed (as `login-css.test.ts` reads them). */
function selectors(css: string): string[] {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    const open = chunk.indexOf("{");
    if (open === -1) continue;
    for (const part of chunk.slice(0, open).split(",")) {
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
 * `case-studies.css` is imported by `/case-studies` and the study, and the App
 * Router keeps a visited route's sheet in the document after navigating away.
 * So every rule here names one of the two pages' own classes: `cs-` (the
 * study) or `cx-` (the hub's library). A rule without one restyles whatever
 * page the reader goes to next.
 */
describe("the case studies' sheet", () => {
  const css = readFileSync(SHEET, "utf8");

  it("reaches only the case studies' own classes (`cs-`, `cx-`)", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(150);
    /* The mock's `[hidden]{display:none!important}` is page-wide; here it is the cards' (`.cx-card[hidden]`),
       and the study's numbered h2 rule names the number it holds, not every `.ar-frame` h2. */
    const stray = found.filter((s) => !/\.(cs|cx)-[\w-]/.test(s));
    expect(
      stray,
      `selector(s) in case-studies.css without one of the pages' own classes: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("hides only the cards the filter hides", () => {
    expect(css).toMatch(/\.cx-card\[hidden\]\{display:none!important\}/);
    expect(css).not.toMatch(/(^|[\s,}])\[hidden\]/);
  });

  it("keeps the library still under reduced motion", () => {
    expect(css).toMatch(
      /@media\(prefers-reduced-motion:reduce\)\{\.cx-card,\.cx-read svg,\.cx-next\{transition:none\}\}/,
    );
  });

  it("leaves the shared tokens and the self-hosted faces alone", () => {
    /* --sans and --code are next/font's hashed families: a literal "Inter" or "IBM Plex Mono" matches nothing. */
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    expect(css).not.toMatch(/Inter|IBM Plex Mono/);
  });
});
