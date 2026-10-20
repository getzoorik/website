import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomeMotion } from "./home-motion";

/** An observer the test moves by hand: `enter` reports its targets in view, in one callback. */
class TestIntersectionObserver {
  static entrances: TestIntersectionObserver | undefined;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    /* The entrances' observer is the one with a margin; the films' has thresholds. */
    if (options?.rootMargin) TestIntersectionObserver.entrances = this;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}

  enter(...targets: Element[]): void {
    this.callback(
      targets.map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.entrances = undefined;
});

describe("the home page's motion pass", () => {
  it("brings every entering element in at once where there is no observer to wait for", () => {
    /* jsdom has no IntersectionObserver: the branch a browser without one takes, and the reduced-motion one. */
    const { container } = render(
      <>
        <div className="mo-r" />
        <figure className="mo-film mo-r" />
        <HomeMotion />
      </>,
    );
    const entering = [...container.querySelectorAll(".mo-r")];
    expect(entering).toHaveLength(2);
    for (const el of entering) expect(el).toHaveClass("is-in");
  });

  it("times a list's rows from the first one in, as the mock times What we offer's from its one start", () => {
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const now = vi.spyOn(performance, "now");
    const { container } = render(
      <>
        <div className="mo-r" />
        <ul data-mo-clock="">
          <li className="mo-r" />
          <li className="mo-r" />
          <li className="mo-r" />
        </ul>
        <HomeMotion />
      </>,
    );
    const side = container.querySelector("div.mo-r")!;
    const rows = [...container.querySelectorAll<HTMLElement>("li.mo-r")];
    const late = (el: Element) => (el as HTMLElement).style.getPropertyValue("--late");
    const entrances = TestIntersectionObserver.entrances!;

    /* Outside a clock: in, with nothing to make up. */
    now.mockReturnValue(1000);
    entrances.enter(side);
    expect(side).toHaveClass("is-in");
    expect(late(side)).toBe("");

    /* The first two come in together: the clock starts, and both are on time, so they keep the
       stagger between them. */
    now.mockReturnValue(1200);
    entrances.enter(rows[0]!, rows[1]!);
    expect(rows.map(late)).toEqual(["0ms", "0ms", ""]);
    expect(rows[2]).not.toHaveClass("is-in");

    /* The last comes in 300ms after the first: that much comes off its turn. */
    now.mockReturnValue(1500.4);
    entrances.enter(rows[2]!);
    expect(rows.map(late)).toEqual(["0ms", "0ms", "300ms"]);
    for (const row of rows) expect(row).toHaveClass("is-in");
  });

  it("puts everything in its end state when scripting is off", () => {
    const html = renderToStaticMarkup(<HomeMotion />);
    const css = /^<noscript><style>(.*)<\/style><\/noscript>$/.exec(html)?.[1] ?? "";
    const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(([, selectors, body]) => ({
      selectors: selectors!.split(",").map((s) => s.trim()),
      body: body!,
    }));
    const bodyOf = (selector: string) =>
      rules.find((rule) => rule.selectors.includes(selector))?.body ?? "";
    /* Every start state the pass's sheets hide something in: the entrance, the film, the case
       study's bars, and What we offer's entrance, bands and rolling figures. */
    expect(rules.flatMap((rule) => rule.selectors).sort()).toEqual(
      [
        ".mo-r",
        ".mo-film.mo-r",
        ".mo-b",
        ".mo-b b",
        ".ofx .ofx-in",
        ".ofx-track i",
        ".od-d::before",
      ].sort(),
    );
    for (const rule of rules) expect(rule.body).toContain("transition:none");
    /* What fades in is shown, where it would have come to rest. */
    for (const selector of [".mo-r", ".mo-film.mo-r", ".mo-b", ".mo-b b", ".ofx .ofx-in"]) {
      expect(bodyOf(selector), selector).toContain("opacity:1");
      expect(bodyOf(selector), selector).toContain("transform:none");
    }
    /* What is drawn is drawn whole: the bands at full length, each digit's strip at the digit
       (its second pass, as the sheet rolls it, home-offers.css). */
    expect(bodyOf(".ofx-track i")).toContain("transform:none");
    expect(bodyOf(".od-d::before")).toContain("transform:translateY(calc(var(--v) * -1em))");
  });
});
