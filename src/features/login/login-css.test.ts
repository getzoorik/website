import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const STYLES = "src/styles";

/** Selectors from a sheet, with comments and at-rule preludes removed. */
function selectors(css: string): string[] {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const chunk of bare.split("}")) {
    const head = chunk.slice(0, chunk.indexOf("{"));
    if (chunk.indexOf("{") === -1) continue;
    for (const part of head.split(",")) {
      const s = part
        .trim()
        .replace(/^[\s\S]*\{/, "")
        .trim();
      if (!s || s.startsWith("@")) continue;
      /* A keyframe stop is not a selector: `from`, `to` and `45%` name a moment
         in an animation, not an element on a page. */
      if (/^(from|to|\d+(\.\d+)?%)$/.test(s)) continue;
      out.push(s);
    }
  }
  return out;
}

/**
 * `globals.css` is imported by the ROOT layout, so every sheet in this repo
 * shares ONE cascade with every other — and the App Router leaves a visited
 * route's stylesheet in the document after navigating away from it. Two rules
 * follow from that, and neither is visible in a normal review diff.
 */
describe("the login sheet", () => {
  it("scopes every selector under .login", () => {
    const css = readFileSync(join(STYLES, "login.css"), "utf8");
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(30);

    /* The mock is a standalone document, so its selectors are page-wide and
       generic — `h1`, `main`, `.card`, `.chip`, `.panel`, `.stats`. Ported as
       written, one trip to `/login` and back restyles the home page, and only
       on the second page view. */
    /* The product's rules open on the page's product, `html[data-ap]`, then the scope. */
    const unscoped = found.filter(
      (s) => !s.replace(/^html(:not\()?\[data-ap(="\w+")?\]\)? /, "").startsWith(".login"),
    );
    expect(unscoped, `unscoped selector(s) in login.css: ${unscoped.join(", ")}`).toEqual([]);
  });

  it("leaves the shared tokens alone", () => {
    const css = readFileSync(join(STYLES, "login.css"), "utf8");
    /* 🔴 --sans and --code resolve to next/font's HASHED family names. The
       mock's `:root` block re-declares them with the literal "Inter", which
       matches nothing — the page would render in the system face on every
       machine that does not happen to have Inter installed, including nobody's
       but the author's. */
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
  });

  it("keeps each new-tab arrow on its link's line", () => {
    const css = readFileSync(join(STYLES, "login.css"), "utf8");
    /* Tailwind's preflight makes every svg a block: without this the two arrows
       drop onto lines of their own, and the "New to Zoorik?" line grows from
       24px to 60px at 1440. */
    expect(css).toMatch(/\.login \.ext\{[^}]*display:inline[;}]/);
  });
});

describe("the assessment sheet", () => {
  it("reaches only the assessment's own classes (`as-`, `ax-`, `oc`, `br`)", () => {
    const css = readFileSync(join(STYLES, "assessment.css"), "utf8");
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(60);

    /* Same hazard as the login sheet: this page's sheet must not restyle what
       another page draws. The page has no `.assessment` scope; every rule names
       one of its own classes instead (`ax-`, the What it does band's `oc` and
       its cards' `br`, beside the closing grid's `as-`), its
       own section (`#what-it-does`), or the `data-if-p` copies only this page
       renders. No other page draws these classes. */
    const stray = found.filter(
      (s) => !/\.as-|\.ax-|\.oc\b|\.oc-|\.brs?\b|\.br-|#what-it-does|\[data-if-p=/.test(s),
    );
    expect(
      stray,
      `selector(s) in assessment.css without one of the page's own classes: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("leaves the shared tokens alone", () => {
    const css = readFileSync(join(STYLES, "assessment.css"), "utf8");
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
  });
});

describe("the marketing sheets", () => {
  it("style no bare element that a second page also uses", () => {
    /* `footer{…}` was right while the site had one page. `/login` has a footer
       of its own — three lines of legal text, no band — and the marketing
       rules reached it: a surface-2 ground, 44-64px of block padding, and
       `overflow:hidden` from the watermark layer. Element selectors for a
       SINGLETON COMPONENT are the shape of that bug; `.site-foot` is the fix. */
    const offenders: string[] = [];
    for (const file of readdirSync(STYLES).filter((f) => f.endsWith(".css"))) {
      if (file === "login.css" || file === "assessment.css") continue;
      for (const s of selectors(readFileSync(join(STYLES, file), "utf8"))) {
        /* A bare `footer`, or one qualified only by a pseudo/descendant —
           anything that matches EVERY <footer> in the app. */
        if (/(^|[\s>+~])footer($|[\s>+~:[])/.test(s)) offenders.push(`${file}: ${s}`);
      }
    }
    expect(offenders, `these match every <footer>, including /login's`).toEqual([]);
  });
});
