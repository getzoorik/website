import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TurningMark } from "@/components/brand/turning-mark";

/**
 * The turning mark, as the mocks draw it: the glow, then the art.
 * jsdom applies no sheet, so the size, the place and the turn are measured in a
 * browser; this file holds the markup to the mock's.
 */
const markOf = (props: Parameters<typeof TurningMark>[0] = {}) =>
  render(<TurningMark {...props} />).container;

describe("the turning mark", () => {
  it("is the glow, then the art, both hidden from assistive tech", () => {
    const mark = markOf();
    const [glow, art] = [...mark.children];
    expect(mark.children).toHaveLength(2);
    expect(glow!.tagName).toBe("DIV");
    expect(glow).toHaveAttribute("class", "zk-glow");
    expect(glow).toHaveAttribute("aria-hidden", "true");
    expect(glow!.childNodes).toHaveLength(0);
    expect(art!.tagName.toLowerCase()).toBe("svg");
    expect(art).toHaveAttribute("class", "zk-art");
    expect(art).toHaveAttribute("aria-hidden", "true");
    expect(art).toHaveAttribute("focusable", "false");
    expect(art).toHaveAttribute("viewBox", "0 0 512 512");
  });

  it("draws the 2.0 mark in bone: ten outer squares at .26, five inner at .42, the core at .14", () => {
    const art = markOf().querySelector("svg")!;
    /* The mock's art: every element carries its own opacity and fill. */
    const squares = [...art.querySelectorAll(":scope > rect")];
    expect(squares).toHaveLength(15);
    const [outer, inner] = [squares.slice(0, 10), squares.slice(10)];
    for (const [ring, opacity, sides] of [
      [outer, ".26", ["42.0", "50.0"]],
      [inner, ".42", ["34.0"]],
    ] as const) {
      for (const square of ring) {
        expect(square).toHaveAttribute("fill", "#FAF7F3");
        expect(square).toHaveAttribute("opacity", opacity);
        expect(sides).toContain(square.getAttribute("width"));
        expect(square.getAttribute("height")).toBe(square.getAttribute("width"));
      }
    }
    /* Spot checks, written as the mock writes them. */
    expect(outer[0]).toHaveAttribute("x", "235.00");
    expect(outer[0]).toHaveAttribute("transform", "rotate(-45.00 256.00 46.00)");
    expect(inner[4]).toHaveAttribute("x", "376.39");
    expect(inner[4]).toHaveAttribute("transform", "rotate(-333.00 393.39 211.36)");

    const core = art.querySelector(":scope > circle")!;
    expect(core).toHaveAttribute("cx", "256");
    expect(core).toHaveAttribute("cy", "256");
    expect(core).toHaveAttribute("r", "104");
    expect(core).toHaveAttribute("fill", "#FAF7F3");
    expect(core).toHaveAttribute("opacity", ".14");
    /* One colour: the accent and the old lilac are gone from the art. */
    expect(art.outerHTML).not.toMatch(/#3B5BF5|#8E98EB/i);
  });

  it("takes its classes from the surface: the /login panel's are art and glow", () => {
    const mark = markOf({ className: "art", glowClassName: "glow" });
    expect(mark.firstElementChild).toHaveAttribute("class", "glow");
    expect(mark.lastElementChild).toHaveAttribute("class", "art");
  });
});
