import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandLogo, BrandMark } from "@/components/brand/brand-mark";

/**
 * The Zoorik logo, brand 2.0: the lockup and the mark alone.
 * jsdom applies no sheet, so the motion is read from nav.css in globals.test.ts
 * and watched in a browser; this file holds the drawing: the mark's three
 * groups the sheet moves, the 2.0 geometry, one colour, and the word in
 * outlines.
 */

/** The mark's groups and squares, as any render of it draws them. */
function markOf(root: Element) {
  const turn = root.querySelector(":scope > g.zl-t")!;
  return {
    turn,
    parts: [...turn.children].map((part) => part.getAttribute("class") ?? part.tagName),
    outer: [...turn.querySelectorAll(":scope > g.zl-o > rect")],
    inner: [...turn.querySelectorAll(":scope > g.zl-i > rect")],
    core: turn.querySelector(":scope > circle")!,
  };
}

describe("the Zoorik mark, 2.0", () => {
  it("is the turn, holding the outer ring, the inner ring and the core", () => {
    const { parts } = markOf(render(<BrandMark />).container.querySelector("svg")!);
    expect(parts).toEqual(["zl-o", "zl-i", "circle"]);
  });

  it("draws ten outer squares, 42 or 50 by turns, five inner squares of 34, and a core of 104", () => {
    const { outer, inner, core } = markOf(render(<BrandMark />).container.querySelector("svg")!);
    /* The lone squares, on the spokes with no inner square, are the 50s. */
    expect(outer.map((square) => square.getAttribute("width"))).toEqual([
      "42.0",
      "50.0",
      "42.0",
      "50.0",
      "42.0",
      "50.0",
      "42.0",
      "50.0",
      "42.0",
      "50.0",
    ]);
    expect(inner.map((square) => square.getAttribute("width"))).toEqual(Array(5).fill("34.0"));
    for (const square of [...outer, ...inner]) {
      expect(square.getAttribute("height")).toBe(square.getAttribute("width"));
    }
    expect(core).toHaveAttribute("r", "104");
  });

  it("paints in one colour, the ground's: no accent core, no literal ink", () => {
    for (const element of [<BrandMark key="mark" />, <BrandLogo key="logo" />]) {
      const svg = render(element).container.querySelector("svg")!;
      const fills = new Set(
        [...svg.querySelectorAll("[fill]")].map((el) => el.getAttribute("fill")),
      );
      expect(fills).toEqual(new Set(["currentColor"]));
    }
  });

  it("is the mark alone in the box the lockup gives it, hidden from assistive tech", () => {
    const mark = render(<BrandMark />).container.querySelector("svg")!;
    expect(mark).toHaveAttribute("class", "zl-mark");
    expect(mark).toHaveAttribute("viewBox", "16.302 16.302 479.397 479.397");
    expect(mark).toHaveAttribute("overflow", "visible");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("focusable", "false");
  });
});

describe("the Zoorik lockup, 2.0", () => {
  it("is the mark, then the word in six outlined glyphs, hidden from assistive tech", () => {
    const logo = render(<BrandLogo />).container.querySelector("svg")!;
    expect(logo).toHaveAttribute("class", "brand-logo");
    expect(logo).toHaveAttribute("viewBox", "-1.180 -56.424 431.363 107.604");
    expect(logo).toHaveAttribute("aria-hidden", "true");
    expect(logo).toHaveAttribute("focusable", "false");
    const [mark, word] = [...logo.children];
    expect(mark!.tagName.toLowerCase()).toBe("svg");
    expect(mark).toHaveAttribute("viewBox", "16.302 16.302 479.397 479.397");
    expect(mark).toHaveAttribute("overflow", "visible");
    expect(markOf(mark!).parts).toEqual(["zl-o", "zl-i", "circle"]);
    /* "zoorik", no font needed: one path per glyph, and no text node anywhere. */
    expect(word!.querySelectorAll(":scope > path")).toHaveLength(6);
    expect(logo.textContent).toBe("");
  });
});
