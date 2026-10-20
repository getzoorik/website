import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/value-lab.css", "utf8");

/** Selectors from the sheet, comments removed: each rule's own, inside an at-rule too. */
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
 * Value Lab's sheet (`value-lab.css`). The App Router keeps a visited page's sheet in the document, so a rule here
 * that reached past this page would restyle another one, and only on the second page view.
 */
describe("the Value Lab sheet", () => {
  it("names one of Value Lab's own `vl-` classes in every selector", () => {
    const found = selectors(css);
    expect(found.length).toBeGreaterThan(15);
    const stray = found.filter((s) => !/\.vl-[\w-]+/.test(s));
    expect(stray, `selector(s) in value-lab.css without a vl- class: ${stray.join(", ")}`).toEqual(
      [],
    );
  });

  it("stills the pulse beside Saved so far under reduced motion", () => {
    expect(css).toContain(
      "@media(prefers-reduced-motion:reduce){.vl-sig::before,.vl-sig::after{animation:none;opacity:0}}",
    );
  });

  it("carries no rule for the client studies' tiles until the first one is listed", () => {
    expect(css).not.toMatch(/\.vl-(dt|who|pct|save|key|left|logo)\b/);
  });
});
