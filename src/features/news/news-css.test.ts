import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/news.css", "utf8");

/**
 * Selectors from the sheet, comments removed: each rule's own, inside an at-rule too (a rule's selector is what
 * follows the last "{" before its body), and never a keyframe's `from`, `to` or percentage.
 */
function selectors(sheet: string): string[] {
  const bare = sheet.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    if (chunk.indexOf("{") === -1) continue;
    const head = chunk.slice(0, chunk.lastIndexOf("{"));
    const prelude = head.slice(head.lastIndexOf("{") + 1).trim();
    if (!prelude || prelude.startsWith("@") || /^(from|to|\d+%)$/.test(prelude)) continue;
    for (const part of prelude.split(",")) if (part.trim()) out.push(part.trim());
  }
  return out;
}

/**
 * The /news sheet shares one cascade with every page (the App Router keeps a visited route's sheet), so it may reach
 * only what /news draws: every selector names one of the page's own classes, `nw-`, `nz-` or `nr-`, and never a class
 * another sheet owns (product-page.css's bare `.nw`, the articles' `nw-nb`, `nw-links` and `nw-tbl`).
 */
describe("the news sheet", () => {
  it("reaches only the page's own classes", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(60);
    const stray = found.filter((s) => !/\.n[wzr]-[\w-]+/.test(s));
    expect(
      stray,
      `selector(s) in news.css without an nw-/nz-/nr- class: ${stray.join(", ")}`,
    ).toEqual([]);
    expect(found.filter((s) => /\.nw(?![\w-])|\.nw-(?:nb|links|tbl)\b/.test(s))).toEqual([]);
    /* The first rule inside a media query counts too. */
    expect(found).toContain(".nz-grid");
    expect(found).toContain(".nw-sub");
  });

  it("leaves the shared tokens, the fonts and the page-wide [hidden] rule alone", () => {
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    expect(css).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css).filter((s) => s.includes(":root"))).toEqual([]);
    expect(selectors(css)).not.toContain("[hidden]");
  });

  it("takes the site's arrow's margin off where the mock's arrows have none", () => {
    expect(css).toContain(".nz-cta .ext,.nw-alt .ext,.nw-fl .ext{margin-left:0}");
    /* The Radar titles' arrow keeps `.ext`'s inline display, its margin set by the mock's own rule. */
    expect(css).toContain(
      ".nr-t svg{width:12px;height:12px;margin-left:4px;color:var(--muted);vertical-align:-1px}",
    );
  });

  it("turns the radar's sweep once, and only when the reader allows motion", () => {
    expect(css).toContain(
      "@media(prefers-reduced-motion:no-preference){.nr-sweep{animation:nr-sweep 2.4s var(--ease) 1 both}@keyframes nr-sweep{from{transform:rotate(-120deg);opacity:0}to{transform:rotate(0);opacity:1}}}",
    );
    /* No other animation or transition anywhere in the sheet. */
    expect(css.match(/animation:/g)).toHaveLength(1);
    expect(css).not.toMatch(/transition:/);
  });
});
