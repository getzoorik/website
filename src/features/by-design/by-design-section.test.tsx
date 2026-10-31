import { readFileSync } from "node:fs";

import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { byDesignCards } from "@/content/by-design";

import { ByDesignSection } from "./by-design-section";

/**
 * "Cloud cost optimization, without the risk": four drawings, each captioned
 * by its title, looping only while the band is on screen (`why_visuals.py`).
 */

/** An observer the test moves by hand; every one made is kept, as the cards' reveals make their own. */
class TestIntersectionObserver {
  static made: TestIntersectionObserver[] = [];
  readonly targets: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    TestIntersectionObserver.made.push(this);
  }

  observe(target: Element): void {
    this.targets.push(target);
  }
  unobserve(): void {}
  disconnect(): void {
    this.disconnected = true;
  }

  report(isIntersecting: boolean): void {
    this.callback(
      this.targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  TestIntersectionObserver.made = [];
});

const band = (container: HTMLElement) => container.querySelector<HTMLElement>("section#why")!;

describe("without the risk", () => {
  it("links its heading's first words to the cloud cost pillar, inside the line mask's inner span", () => {
    const section = band(render(<ByDesignSection />).container);
    const h2 = section.querySelector(".sec-head h2")!;
    expect(h2.textContent).toBe("Cloud cost optimization, without the risk");
    const link = h2.querySelector(":scope > span.lm > span > a")!;
    expect(link.textContent).toBe("Cloud cost optimization");
    expect(link).toHaveAttribute("href", "/cloud-cost-optimization");
    expect(link).not.toHaveAttribute("class");
    expect(h2.querySelectorAll("a")).toHaveLength(1);
  });

  it("is four cards, each a drawing named by its sentence, then its title", () => {
    const section = band(render(<ByDesignSection />).container);
    expect(section).toHaveClass("sec", "sec-band");
    expect(section.querySelector(".wrap > .pls.wv")).not.toBeNull();
    const cards = [...section.querySelectorAll(".pls.wv > article.pl.rise")];
    expect(cards).toHaveLength(4);
    cards.forEach((card, index) => {
      const { title, description } = byDesignCards[index]!;
      expect([...card.children].map((el) => `${el.tagName.toLowerCase()}.${el.className}`)).toEqual(
        ["figure.wv-fig", "h3."],
      );
      const figure = card.querySelector("figure")!;
      expect(figure).toHaveAttribute("role", "img");
      expect(figure).toHaveAttribute("aria-label", description);
      expect(card.querySelector("h3")!.textContent).toBe(title);
    });
    /* The four sentences, word for word: they left the screen, not the page. */
    expect(cards.map((card) => card.querySelector("figure")!.getAttribute("aria-label"))).toEqual([
      "Pay for what your workloads use, not what was provisioned for the peak.",
      "Nodes drain one at a time. A disk leaves the pool only when it is empty.",
      "No code changes. Resizes happen while you keep serving.",
      "You decide what each product manages, and see every change it makes.",
    ]);
    expect(cards.map((card) => card.querySelector("h3")!.textContent)).toEqual([
      "Reduce cloud cost",
      "Drains nodes safely, one at a time",
      "No code changes, no downtime",
      "Full control and visibility",
    ]);
    expect(section.querySelector("p")).toBeNull();
  });

  it("draws each on one 280×150 canvas, hidden from the ear, with words but no figure", () => {
    const section = band(render(<ByDesignSection />).container);
    const drawings = [...section.querySelectorAll(".wv-fig > svg.wv-svg")];
    expect(drawings).toHaveLength(4);
    for (const svg of drawings) {
      expect(svg).toHaveAttribute("viewBox", "0 0 280 150");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    }
    expect(
      drawings.map((svg) => [...svg.querySelectorAll("text")].map((t) => t.textContent)),
    ).toEqual([["Provisioned", "Used"], [], ["Live traffic", "Disk"], ["Coral", "Amoeba"]]);
    /* A shape may be illustrative; a number may not. */
    expect(section.querySelector(".pls")!.textContent).not.toMatch(/\d/);
    /* The products' names on the switches stay out of translation. */
    for (const text of drawings[3]!.querySelectorAll("text")) {
      expect(text).toHaveAttribute("translate", "no");
    }
  });

  it("draws what each promise shows", () => {
    const section = band(render(<ByDesignSection />).container);
    const [use, drain, resize, control] = [...section.querySelectorAll(".wv-svg")];
    /* The provisioned line over the hatched room moves; the use under it does not. */
    expect(use!.querySelector(".wv-prov > rect")).toHaveAttribute("fill", "url(#wv-hatch)");
    expect(use!.querySelectorAll(".wv-use, .wv-use-l")).toHaveLength(2);
    /* Four nodes: three, two, the cordoned one, three; its two pods move one at a time. */
    expect(drain!.querySelectorAll(".wv-node")).toHaveLength(4);
    expect(drain!.querySelectorAll(".wv-pod:not(.wv-c1):not(.wv-c2)")).toHaveLength(8);
    expect(drain!.querySelector(".wv-nodeC > .wv-cord")).not.toBeNull();
    expect(drain!.querySelectorAll(".wv-c1, .wv-c2")).toHaveLength(2);
    /* Forty ticks of traffic, 8 apart, over a disk that resizes. */
    const ticks = [...resize!.querySelectorAll(".wv-flow > .wv-tick")];
    expect(ticks).toHaveLength(40);
    expect(ticks.slice(0, 7).map((t) => [t.getAttribute("x"), t.getAttribute("height")])).toEqual([
      ["8", "10"],
      ["16", "16"],
      ["24", "12"],
      ["32", "18"],
      ["40", "9"],
      ["48", "14"],
      ["56", "10"],
    ]);
    expect(resize!.querySelector(".wv-cap")).not.toBeNull();
    /* A switch per product, each with its mark at 14px; then three checked entries. */
    const marks = [...control!.querySelectorAll(":scope > svg")];
    expect(
      marks.map((m) => [m.getAttribute("y"), m.getAttribute("width"), m.getAttribute("height")]),
    ).toEqual([
      ["12", "14", "14"],
      ["40", "14", "14"],
    ]);
    expect(marks.map((m) => m.firstElementChild!.getAttribute("viewBox"))).toEqual([
      "0 0 48 48",
      "8 7 87 87",
    ]);
    expect(control!.querySelectorAll(".wv-track")).toHaveLength(2);
    expect(control!.querySelectorAll(".wv-log")).toHaveLength(3);
  });

  it("names its patterns and clips once in the document, and uses each", () => {
    const { container } = render(<ByDesignSection />);
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids).toEqual(["why", "wv-hatch", "wv-clip1", "wv-clip3"]);
    const html = container.innerHTML;
    for (const id of ["wv-hatch", "wv-clip1", "wv-clip3"]) expect(html).toContain(`url(#${id})`);
  });

  it("runs the loops while the band is on screen, and pauses them once it has gone", () => {
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container, unmount } = render(<ByDesignSection />);
    const section = band(container);
    const watching = TestIntersectionObserver.made.filter((io) => io.targets.includes(section));
    expect(watching).toHaveLength(1);
    const watch = watching[0]!;
    /* The mock's threshold, on the band itself. */
    expect(watch.options).toEqual({ threshold: 0.15 });
    expect(watch.targets).toEqual([section]);
    expect(section).not.toHaveClass("wv-run");
    act(() => watch.report(true));
    expect(section).toHaveClass("wv-run");
    act(() => watch.report(false));
    expect(section).not.toHaveClass("wv-run");
    unmount();
    expect(watch.disconnected).toBe(true);
  });

  it("runs the loops where there is no observer to wait for", () => {
    /* jsdom has none: the branch an old browser takes. */
    const section = band(render(<ByDesignSection />).container);
    expect(section).toHaveClass("wv-run");
  });

  it("holds each drawing's after state without scripting, as under reduced motion", () => {
    const section = band(render(<ByDesignSection />).container);
    const noscript = section.querySelector(":scope > noscript")!;
    const sheet = readFileSync("src/styles/home.css", "utf8");
    const reduced = sheet.slice(sheet.lastIndexOf("@media (prefers-reduced-motion:reduce){"));
    /* The same after state, rule for rule. */
    for (const rule of [
      "#why .wv-svg *{animation:none!important}",
      ".wv-prov{transform:translateY(24px)}",
      ".wv-nodeC{opacity:.28}",
      ".wv-c1,.wv-c2{transform:translate(-68px,20px)}",
      ".wv-cap{transform:scaleX(.66)}",
      ".wv-sw{fill:var(--accent)}",
      ".wv-swk{transform:translateX(16px)}",
    ]) {
      expect(reduced, rule).toContain(rule);
      expect(noscript.innerHTML, rule).toContain(rule);
    }
    /* Paused until the band is seen, and 8s loops but the traffic's 2.4s. */
    expect(sheet).toContain("#why .wv-svg *{animation-play-state:paused}");
    expect(sheet).toContain("#why.wv-run .wv-svg *{animation-play-state:running}");
    const durations = [...sheet.matchAll(/animation:(?:wv\w+ )?([\d.]+)s/g)].map((m) => m[1]);
    expect(new Set(durations)).toEqual(new Set(["8", "2.4"]));
  });
});
