import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/compare.css", "utf8");
const page = readFileSync("src/app/compare/page.tsx", "utf8");

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
 * /compare's own sheet (`src/styles/compare.css`) holds only what learn.css, the sheet the hub draws with, lacks. It
 * shares one cascade with every page (the App Router keeps a visited route's sheet), so every selector names the
 * market map's own classes, and it loads after learn.css.
 */
describe("the compare sheet", () => {
  it("reaches only the market map's own classes", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(0);
    for (const selector of found) expect(selector).toMatch(/^\.mk(?:-[\w-]+)?(?:[ .[][^,]*)?$/);
  });

  it("opens every group of the map when scripting is off, and nothing when it is on", () => {
    /* In preflight's own layer: its `[hidden]{display:none!important}` beats any unlayered important rule. */
    expect(css).toContain(
      "@layer base{@media(scripting:none){.mk .mk-panel[hidden]{display:block!important}}}",
    );
    expect(
      css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim()
        .split("\n"),
    ).toHaveLength(1);
  });

  it("is loaded by the hub after learn.css", () => {
    const learn = page.indexOf('import "@/styles/learn.css";');
    expect(learn).toBeGreaterThan(-1);
    expect(page.indexOf('import "@/styles/compare.css";')).toBeGreaterThan(learn);
  });

  it("copies no tokens, no reset and no font names", () => {
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(bare).not.toMatch(/:root|--sans\s*:|--code\s*:/);
    expect(css).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css)).not.toContain("[hidden]");
  });
});
