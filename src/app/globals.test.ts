import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The site's one cascade: the order `globals.css` imports its sheets in, and the
 * few lines where the port of the site system differs from its mock.
 *
 * 🔴 NEITHER SHOWS UP ANYWHERE ELSE. A sheet that moves in the import list
 * resolves its specificity ties the other way, and the page changes with nothing
 * in the diff to say so (documents.css ahead of the main sheet grows every
 * utility hero 51px). A re-port of a mock sheet that drops one of the edits below
 * looks like a clean copy. jsdom applies no cascade, so this file reads the sheets.
 */

const STYLES = "src/styles";
const css = (file: string): string =>
  readFileSync(join(STYLES, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** The `@import` targets of globals.css, in order, as sheet names. */
const imports = (): string[] =>
  [...css("../app/globals.css").matchAll(/@import\s+"([^"]+)";/g)].map(([, target]) =>
    target!.replace(/^\.\.\/styles\//, "").replace(/\.css$/, ""),
  );

/**
 * The mocks' order: the <head> blocks, the main sheet, site-system, nav-kit, the
 * pages' own blocks, the 404 last.
 */
const ORDER = [
  "tailwindcss",
  "products",
  "assess",
  "product-page",
  "tokens",
  "sections",
  "nav",
  "hero",
  "elastic",
  "how-it-works",
  "footer",
  "motion",
  "site-system",
  "nav-menus",
  /* the product pages' tour (<style id="pp-film"> and "pp-tour"), last in the mocks' <head> after nav-kit */
  "product-tour",
  "documents",
  "privacy",
  /* the numbered rows (<style id="guide-rows">), after privacy-page as in the guides, /terms and /security */
  "doc-rows",
  "engines",
  "home",
  /* the home page's motion pass (<style id="home-motion">), split by part, the entrance last */
  "home-films",
  "case-band",
  "home-offers",
  "home-motion",
  "not-found",
];

describe("globals.css", () => {
  it("imports only known sheets, in the mocks' order", () => {
    const found = imports();
    expect(found.filter((name) => !ORDER.includes(name))).toEqual([]);
    expect(found).toEqual(ORDER.filter((name) => found.includes(name)));
  });

  it("has a slot for every sheet the pages fill, and every slot has its file", () => {
    const found = imports();
    const slots = ["site-system", "nav-menus", "documents", "privacy", "engines", "home"];
    expect(slots.filter((name) => !found.includes(name))).toEqual([]);
    for (const name of found.filter((n) => n !== "tailwindcss")) {
      expect(existsSync(join(STYLES, `${name}.css`)), name).toBe(true);
    }
    expect(found[0]).toBe("tailwindcss");
    expect(found.at(-1)).toBe("not-found");
  });

  it("leaves the two page sheets to their pages", () => {
    /* Next loads a page's own CSS after this file, which is where the mocks put
       them; imported here, they would load ahead of the site system. */
    expect(imports()).not.toContain("assessment");
    expect(imports()).not.toContain("login");
  });
});

describe("the site system's port", () => {
  const sheet = css("site-system.css");

  it("paints only the site footer, never /login's", () => {
    expect(sheet).toMatch(/footer\.site-foot\{padding:56px 0 32px;/);
  });

  it("drops the bar's legal link, which the shell no longer draws", () => {
    expect(sheet).not.toMatch(/\.foot-legal/);
  });

  it("keeps an external-link arrow on its line in running text", () => {
    expect(sheet).toMatch(/\.ext\{[^}]*display:inline[;}]/);
  });

  it("gives back what Tailwind's preflight takes from plain lists and small", () => {
    expect(sheet).toMatch(
      /:where\(main ul:not\(\[class\]\),main ol:not\(\[class\]\)\)\{list-style:revert;margin-block:revert;padding-inline-start:revert\}/,
    );
    expect(sheet).toMatch(/(^|\})\s*small\{font-size:smaller\}/);
  });
});

describe("the header menus' port", () => {
  const sheet = css("nav-menus.css");

  it("flips the menu labels' ink in one frame, as the links beside them", () => {
    const rules = [...sheet.matchAll(/([^{}]*\.nv-btn[^{}]*)\{([^}]*)\}/g)];
    expect(rules.length).toBeGreaterThan(3);
    for (const [, selector, body] of rules) {
      if (/\.nv-chev/.test(selector!)) continue;
      expect(body, selector).not.toMatch(/transition/);
    }
  });

  it("rings a focused menu row in the accent, even over the dark hero", () => {
    expect(sheet).toMatch(/\.nv-menu\{--z-focus:var\(--accent\);/);
  });

  it("keeps a current drawer chip in the accent when it is the last in its row", () => {
    /* `.nav-drop .nd-row a:last-child` ties the current-chip rule and comes later;
       without this line the last chip, current, loses its accent border and ink. */
    expect(sheet).toMatch(
      /\.nav-drop \.nd-row a\[aria-current="page"\]:last-child\{border-color:var\(--accent\);color:var\(--accent\)\}/,
    );
    expect(sheet.lastIndexOf(":last-child{border-color")).toBeGreaterThan(
      sheet.indexOf(".nav-drop .nd-row a:last-child"),
    );
  });
});

describe("the turning mark's rules", () => {
  const sheet = css("site-system.css");

  it("turns only for a reader who has not asked for less motion", () => {
    expect(sheet).toMatch(
      /@media\(prefers-reduced-motion:no-preference\)\{\.hero \.zk-art\{animation:zkTurn 48s linear infinite;will-change:rotate\}\}/,
    );
    /* Declared nowhere else: under reduced motion there is no animation to stop. */
    expect(sheet.match(/animation:zkTurn/g)).toHaveLength(1);
  });

  it("is centred by negative margins, never a translate, which rotate would orbit", () => {
    const rules = [...sheet.matchAll(/([^{}]*\.zk-(?:art|glow)[^{}]*)\{([^}]*)\}/g)];
    expect(rules.length).toBeGreaterThan(2);
    for (const [, selector, body] of rules) {
      expect(body, selector).not.toMatch(/transform|translate/);
    }
    expect(sheet).toMatch(/\.hero \.zk-art\{[^}]*margin-top:calc\(var\(--art\) \/ -2\)/);
  });
});

describe("the Zoorik logo's motion (brand 2.0)", () => {
  const sheet = css("nav.css");

  it("turns the rings opposite ways, 72deg in 9.8s each, round a still core and a still word", () => {
    expect(sheet).toMatch(/@keyframes zlO\{to\{transform:rotate\(72deg\)\}\}/);
    expect(sheet).toMatch(/@keyframes zlI\{to\{transform:rotate\(-72deg\)\}\}/);
    const motion = sheet.match(
      /@media \(prefers-reduced-motion:no-preference\)\{([\s\S]*?)\n\}/,
    )![1]!;
    /* About the canvas centre in the mark's own box: the lone squares make any other origin drift. */
    expect(motion).toMatch(
      /\.brand-logo \.zl-o,\.brand-logo \.zl-i,\.zl-mark \.zl-o,\.zl-mark \.zl-i\{transform-box:view-box;transform-origin:256px 256px\}/,
    );
    /* Each ring names its keyframes in the shorthand: the build's minifier turns a nameless one into `none`. */
    expect(motion).toMatch(
      /\.brand-logo \.zl-o,\.zl-mark \.zl-o\{animation:zlO 9\.8s linear infinite\}/,
    );
    expect(motion).toMatch(
      /\.brand-logo \.zl-i,\.zl-mark \.zl-i\{animation:zlI 9\.8s linear infinite\}/,
    );
    expect(motion).not.toMatch(/animation:\d/);
    /* Only the rings move: no rule animates the turn group, the core or the word. */
    expect(sheet).not.toMatch(/zlT|\.zl-t[^{]*\{[^}]*animation/);
    /* The old motion and the old mark's rules are gone with them. */
    expect(sheet).not.toMatch(/scale\(\.9|zmOuter|zmInner|\.brand-mark/);
  });

  it("sizes the bar from one variable: 88px, 80px on phones", () => {
    expect(sheet).toMatch(/:root\{--nav-h:88px\}/);
    expect(sheet).toMatch(/@media\(max-width:760px\)\{:root\{--nav-h:80px\}\}/);
    expect(sheet).toMatch(/\.nav-in\{[^}]*height:var\(--nav-h\)/);
    for (const file of [
      "nav.css",
      "hero.css",
      "documents.css",
      "site-system.css",
      "assess.css",
      "privacy.css",
    ]) {
      expect(css(file), file).not.toMatch(
        /calc\(80px \+|top:80px;|height:80px|scroll-margin-top:(88|104)px/,
      );
    }
  });

  it("moves only for a reader who has not asked for less motion", () => {
    const query = "@media (prefers-reduced-motion:no-preference){";
    const at = sheet.indexOf(query);
    expect(at).toBeGreaterThan(-1);
    const outside = sheet.slice(0, at) + sheet.slice(sheet.indexOf("}\n}", at));
    expect(outside).not.toMatch(/animation/);
  });
});

describe("print", () => {
  it("prints the page's text without the bar, the skip link, the mark, the closing row or the footer", () => {
    expect(css("site-system.css")).toMatch(
      /@media print\{\.skip,\.nav,\.hero \.zk-art,\.hero \.zk-glow,#assess,footer\.site-foot\{display:none\}\}/,
    );
  });
});

describe("the closing row's rules", () => {
  it("settles no card: the reading pass has no zSettle", () => {
    const sheet = css("engines.css");
    expect(sheet).not.toMatch(/zSettle/);
    expect(sheet).not.toMatch(/\.as-card\.rise\.set/);
  });

  it("keeps in assess.css only what the site system does not carry", () => {
    const sheet = css("assess.css");
    /* The row's look is the site system's: no grid, card, heading or button of its own. */
    expect(sheet).not.toMatch(/\.as-(grid|card|mini|h)\b|\.cta-go|box-shadow|radial-gradient/);
    expect(sheet).toMatch(/(^|\})\s*\.as-cal\{scroll-margin-top:calc\(var\(--nav-h\) \+ 8px\)\}/);
    expect(sheet).toMatch(
      /section\[tabindex="-1"\]:focus,\.as-cal\[tabindex="-1"\]:focus\{outline:none\}/,
    );
  });
});

describe("What we offer's port", () => {
  const sheet = css("home-offers.css");

  it("plays from each element's own .is-in, as HomeMotion marks it, never the mock's .is-on", () => {
    expect(sheet).not.toMatch(/\.is-on/);
    expect(sheet).toMatch(/\.ofx \.ofx-in\.is-in\{opacity:1;transform:none\}/);
    expect(sheet).toMatch(/\.ofx-row\.is-in \.ofx-track i\{transform:none\}/);
    expect(sheet).toMatch(
      /\.ofx-row\.is-in \.od-d::before\{transform:translateY\(calc\(var\(--v\) \* -1em\)\)\}/,
    );
  });

  it("writes the entrance at a weight .mo-r, loaded after it, cannot take its timing from", () => {
    expect(sheet).toMatch(
      /\.ofx \.ofx-in\{opacity:0;transform:translateY\(14px\);transition:opacity \.7s var\(--ease\) var\(--d0,0ms\),transform \.7s var\(--ease\) var\(--d0,0ms\)\}/,
    );
    expect(sheet).not.toMatch(/(^|\})\s*\.ofx-in\{/);
    expect(imports().indexOf("home-motion")).toBeGreaterThan(imports().indexOf("home-offers"));
  });

  it("draws each digit's strip as generated content: 0 to 9 twice over, rolled as the mock rolls it", () => {
    const strip = /\.od-d::before\{content:"([^"]*)";/.exec(sheet)?.[1] ?? "";
    expect(strip.split("\\A ")).toEqual("01234567890123456789".split(""));
    expect(sheet).toMatch(
      /transition:transform 1\.5s var\(--ease\) calc\(var\(--d0,0ms\) \+ var\(--k\) \* 90ms\)/,
    );
    expect(sheet).not.toMatch(/\.od-s/);
  });

  it("sets the digits in a line, so a copy of a figure reads as printed, never a character a line", () => {
    expect(sheet).not.toMatch(/\.od-r\{display:inline-flex/);
    expect(sheet).toMatch(/\.od-r\{display:inline\}/);
    expect(sheet).toMatch(/\.od\{white-space:nowrap\}/);
    expect(sheet).toMatch(/\.od-d,\.od-x\{vertical-align:bottom\}/);
  });

  it("is in its end state at once under reduced motion, from the sheet alone", () => {
    expect(sheet).toMatch(
      /@media \(prefers-reduced-motion:reduce\)\{\.ofx \*\{transition:none!important\}\}/,
    );
    const reduced = sheet.slice(sheet.lastIndexOf("@media (prefers-reduced-motion:reduce){"));
    expect(reduced).toMatch(/\.ofx \.ofx-in\{opacity:1;transform:none\}/);
    expect(reduced).toMatch(/\.ofx-track i\{transform:none\}/);
    expect(reduced).toMatch(
      /\.od-d::before\{transform:translateY\(calc\(var\(--v\) \* -1em\)\);transition:none\}/,
    );
  });

  it("keeps the mock's one start for the rows: how late a row came in comes off its stagger", () => {
    const mock = sheet.indexOf(".ofx-row{--d0:calc(var(--i) * 260ms);");
    const repo = sheet.indexOf(".ofx-row{--d0:max(0ms,calc(var(--i) * 260ms - var(--late,0ms)))}");
    expect(mock).toBeGreaterThan(-1);
    /* After the mock's rule, at its weight, so it is the one that holds. */
    expect(repo).toBeGreaterThan(mock);
  });

  it("sets the h3s as the mock's <p>, and rings focus on the navy card in the dark grounds' colour", () => {
    expect(sheet).toMatch(/\.ofx-h,\.ofx-free-l\{letter-spacing:normal;text-wrap:wrap\}/);
    expect(sheet).toMatch(/\.ofx-free-l\{line-height:inherit\}/);
    expect(sheet).toMatch(/\.ofx-free\{--z-focus:var\(--accent-dark\)\}/);
  });

  it("leaves nothing of the four cards it replaced in any sheet", () => {
    for (const name of imports().filter((n) => n !== "tailwindcss")) {
      expect(css(`${name}.css`), name).not.toMatch(/\.mo-of|\.mo-meter/);
    }
  });
});
