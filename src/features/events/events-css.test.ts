import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/events.css", "utf8");

/** Selectors from the sheet, with comments and at-rule preludes removed. */
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
 * The /events sheet shares one cascade with every page (the App Router keeps a visited route's sheet), so it may
 * reach only what /events draws: every selector names one of the page's own classes, `ev-`, `evb-` or `evc`.
 */
describe("the events sheet", () => {
  it("reaches only the page's own classes", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(50);
    const stray = found.filter((s) => !/\.ev(-|b-|c-|c\b)/.test(s));
    expect(
      stray,
      `selector(s) in events.css without an ev-/evb-/evc class: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("leaves the shared tokens and the page-wide [hidden] rule alone", () => {
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    expect(css).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css)).not.toContain("[hidden]");
  });

  it("stills the page's transitions under reduced motion", () => {
    expect(css).toMatch(
      /@media\(prefers-reduced-motion:reduce\)\{\.ev-chev,\.evc,\.ev-chips button\{transition:none\}\}/,
    );
  });
});
