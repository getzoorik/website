import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/learn.css", "utf8");

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
 * Learn's sheet shares one cascade with every page (the App Router keeps a visited route's sheet), so it may reach only
 * what the pages built on it draw (/learn, /compare and its pages, /community): every selector names one of their own
 * classes. `pp` and `pb` (option B's paths) count bare only, since `pp-` is the privacy policy's; and no `nw` class is
 * Learn's: `nw-` is /news's, and the articles' (`nw-nb`, `nw-links`, `nw-tbl`). `wr` (Watch and read) is not `.wrap`.
 */
const OWN = /\.(?:(?:lv|sj|fx|cm|pt|mk|vp|vx|ap|wr)(?:-[\w-]+)?|pb|pp)(?![\w-])/;

describe("the Learn sheet", () => {
  it("reaches only Learn's own classes", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(200);
    const stray = found.filter((s) => !OWN.test(s));
    expect(stray, `selector(s) in learn.css without a Learn class: ${stray.join(", ")}`).toEqual(
      [],
    );
    expect(css).not.toMatch(/\.pp-|\.pb-/);
    expect(found.filter((s) => /\.nw(?![\w])|\.nw-/.test(s))).toEqual([]);
  });

  it("writes the mock's page-wide hero rule on the Learn hero only", () => {
    expect(css).toContain(".lv-hero .hero-in{position:relative;z-index:2}");
    expect(selectors(css)).not.toContain(".doc-hero .hero-in");
  });

  it("draws Watch and read and More from Zoorik with the mock's own rules, at the head of its second block", () => {
    const v2b = css.indexOf("/* ══ learn-v2b ══ */");
    for (const rule of [
      ".wr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}",
      ".wr-th img{display:block;width:100%;height:auto;aspect-ratio:16/9;transition:transform .6s cubic-bezier(.22,.9,.3,1)}",
      ".wr-film .fx-read{margin-top:6px;color:var(--accent);font-weight:600}",
      ".wr-med{display:flex;flex-direction:column;gap:14px;padding:26px;border-radius:var(--r-card);background:#050B3D;color:#FAF7F3}",
      "@media(max-width:1000px){.wr{grid-template-columns:repeat(2,minmax(0,1fr))}.wr-med{grid-column:1/-1}}",
      "@media(max-width:760px){.wr{grid-template-columns:minmax(0,1fr)}}",
      ".lv-more{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}",
      ".lv-mx{margin-top:auto;padding-top:10px;font:500 .75rem/1.5 var(--code);color:rgba(250,247,243,.55)}",
      ".lv-mc .fx-read{margin-top:6px}",
      /* The mock's narrow width for More from Zoorik, without /community's panels (community.css has those). */
      "@media(max-width:1000px){.lv-more{grid-template-columns:minmax(0,1fr)}}",
    ])
      expect(css.indexOf(rule), rule).toBeGreaterThan(v2b);
    /* In the mock's order: Watch and read, More from Zoorik, then the rules kept from before; /community's block is its
       own sheet's. */
    expect(css.indexOf(".wr{")).toBeLessThan(css.indexOf(".lv-more{"));
    expect(css.indexOf(".lv-more{")).toBeLessThan(css.indexOf(".lv-news{"));
    expect(
      selectors(css).filter((s) => /\.cm-(rd|ch|evs|shape|btn|feed|th|up|acts)/.test(s)),
    ).toEqual([]);
  });

  it("stills the films' hover zoom under reduced motion, as it stills the cards' lift", () => {
    expect(css).toContain(
      "@media(prefers-reduced-motion:reduce){.wr-th img{transition:none}.wr-film:hover .wr-th img{transform:none}}",
    );
  });

  it("keeps every rule of the hub's earlier sections while the pages built on the sheet are built", () => {
    for (const rule of [".lv-news{", ".lv-h3{", ".mk-tabs{", ".cm-ev{", ".cm-list{"])
      expect(css, rule).toContain(rule);
    for (const gone of [".nw-list", ".nw-d", ".nw-b", ".nw-st", ".nw-src", ".nw-note"])
      expect(
        selectors(css).some((s) => s.includes(gone)),
        gone,
      ).toBe(false);
  });

  it("undoes the site-wide rules that would change the mock's result", () => {
    /* Tailwind's preflight zeroes the field's padding and paints its placeholder in half its colour. */
    expect(css).toContain(".lv-search input{padding:1px 2px}");
    expect(css).toContain(".lv-search input::placeholder{color:#757575}");
  });

  it("leaves the shared tokens and the page-wide [hidden] rule alone", () => {
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    expect(css).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(selectors(css)).not.toContain("[hidden]");
  });

  it("stills the cards' transitions under reduced motion", () => {
    expect(css).toMatch(
      /@media\(prefers-reduced-motion:reduce\)\{\.lv-card,\.sj,\.fx-read svg\{transition:none\}a\.lv-card:hover\{transform:none\}\}/,
    );
  });
});
