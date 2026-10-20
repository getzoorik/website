import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(join("src/styles", "about.css"), "utf8");

/** Selectors from the sheet, with comments and at-rule preludes removed (as `programs-css.test.ts` reads them). */
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

/** The declarations of the first rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const at = bare.indexOf(`${selector}{`);
  expect(at, `no rule for ${selector}`).toBeGreaterThan(-1);
  return bare.slice(at + selector.length + 1, bare.indexOf("}", at));
}

/**
 * /about's sheet (`about.css`): the mock's /about block, with its Milestones and "Zoorik on the web" blocks. The App
 * Router keeps a visited page's sheet in the document, so a rule here that reached past /about
 * would restyle another page, and only on the second page view.
 */
describe("/about's sheet", () => {
  it("names one of the page's own classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(40);
    const stray = found.filter((s) => !/\.ab-/.test(s));
    expect(stray, `selector(s) in about.css without an ab- class: ${stray.join(", ")}`).toEqual([]);
  });

  it("draws the milestones as the mock does: the gradient line, the navy dot in its ring, the date in code", () => {
    expect(rule(".ab-ms::before")).toContain("background:linear-gradient(180deg,#5FE3B5,#8095F9)");
    expect(rule(".ab-ms li::before")).toContain("background:#050B3D;border:3px solid #5FE3B5");
    expect(rule(".ab-ms time")).toContain("font:500 .8125rem/1.4 var(--code)");
    /* Phones: the line and the dots move to the left edge, the date over the title. */
    expect(css).toContain(
      "@media(max-width:760px){.ab-wl{grid-template-columns:repeat(2,minmax(0,1fr))}.ab-ms::before{left:6px}",
    );
  });

  it("sizes the dot as the mock's reset does, 20px across, where the preflight would make it 14px", () => {
    /* Tailwind's preflight puts border-box on every ::before; the mock's `*` reset leaves pseudo-elements alone. */
    expect(rule(".ab-ms li::before")).toContain("width:14px;height:14px");
    expect(css).toMatch(/\.ab-ms li::before\{box-sizing:content-box\}/);
    /* The repo rule comes after the ported one, so it wins. */
    expect(css.lastIndexOf(".ab-ms li::before{box-sizing:content-box}")).toBeGreaterThan(
      css.indexOf(".ab-ms li::before{content:"),
    );
  });

  it("lays the six profiles out six, three, then two to a row", () => {
    expect(rule(".ab-wl")).toContain("grid-template-columns:repeat(6,minmax(0,1fr))");
    expect(css).toContain(
      "@media(max-width:1000px){.ab-wl{grid-template-columns:repeat(3,minmax(0,1fr))}}",
    );
    expect(rule(".ab-web")).toBe("grid-column:1 / -1");
  });

  it("leaves the shared tokens and the self-hosted faces alone, and moves nothing", () => {
    /* --sans and --code resolve to next/font's hashed family names; a literal family matches nothing. */
    expect(css).not.toMatch(/--sans\s*:/);
    expect(css).not.toMatch(/--code\s*:/);
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/"Inter"|IBM Plex Mono/);
    expect(rules).not.toMatch(/:root/);
    expect(rules).not.toMatch(/animation|@keyframes|opacity:0[;}]/);
  });
});
