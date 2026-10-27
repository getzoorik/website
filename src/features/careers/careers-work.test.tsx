import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { careers } from "@/content/careers";
import { CareersWork } from "@/features/careers/careers-work";

/**
 * How we work: four outlined cards, each its drawing and its title, the habit's
 * sentence as the card's name for a screen reader; the four drawings as the
 * mock draws them, with Confluence's and GitHub's marks; and the island that
 * runs each card's loop only while the card is on screen (jsdom has no
 * IntersectionObserver, so the test moves one by hand).
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** An observer the test moves by hand. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];
  readonly targets: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestIntersectionObserver.all.push(this);
  }

  observe(target: Element): void {
    this.targets.push(target);
  }
  unobserve(): void {}
  disconnect(): void {
    this.disconnected = true;
  }

  report(isIntersecting: boolean, ...targets: Element[]): void {
    act(() => {
      this.callback(
        targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      );
    });
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  TestIntersectionObserver.all = [];
});

const work = () => render(<CareersWork />).container.querySelector("section")!;

describe("How we work", () => {
  it("is its own address, named by its heading, with no lede", () => {
    const section = work();
    expect(section).toHaveAttribute("id", "how-we-work");
    expect(section).toHaveClass("sec");
    expect(section).not.toHaveClass("sec-band");
    expect(section).toHaveAttribute("aria-labelledby", "how-we-work-h");
    const head = section.querySelector(".wrap > .sec-head")!;
    expect(text(head.querySelector("h2#how-we-work-h"))).toBe("How we work");
    expect(head.querySelector("p")).toBeNull();
  });

  it("draws each habit as one card: its drawing and its title, the sentence its name, word for word", () => {
    const cards = [...work().querySelectorAll(".cq-work > figure.cq-wk")];
    expect(
      cards.map((card) => [
        card.getAttribute("aria-label"),
        text(card.querySelector("figcaption")),
      ]),
    ).toEqual([
      ["Remote first. Work from where you work best.", "Remote first"],
      ["Written down. Plans and decisions live in writing.", "Written down"],
      ["Asynchronous by default. Most work needs no meeting.", "Asynchronous by default"],
      ["Results, not hours. What shipped, not when you were online.", "Results, not hours"],
    ]);
    for (const card of cards) {
      expect(card).toHaveAttribute("role", "img");
      /* The title is read once, in the card's name. */
      expect(card.querySelector("figcaption")).toHaveAttribute("aria-hidden", "true");
      expect(card.querySelector(":scope > svg.il")).toHaveAttribute("aria-hidden", "true");
      /* The sentence is not printed. */
      expect(card.querySelector("p")).toBeNull();
    }
    expect(cards.map((card) => card.querySelector("svg.il")!.classList[1])).toEqual([
      "il-w-globe",
      "il-w-doc",
      "il-w-clock",
      "il-w-target",
    ]);
  });

  it("prints only the content's words", () => {
    const section = work();
    for (const habit of careers.work.habits) {
      expect(section.textContent).toContain(habit.title);
      expect(section.textContent).not.toContain(habit.body);
    }
  });

  it("draws three clocks in three time zones, with two messages travelling between them", () => {
    const globe = work().querySelector(".il-w-globe")!;
    const clocks = [...globe.querySelectorAll(".w-clk")];
    expect(clocks).toHaveLength(3);
    expect(
      clocks.map((clock) =>
        (clock.querySelector(".w-h") as SVGElement).style.getPropertyValue("--hr"),
      ),
    ).toEqual(["0deg", "150deg", "270deg"]);
    for (const clock of clocks) expect(clock.querySelector(".w-m")).not.toBeNull();
    expect(globe.querySelectorAll(".w-pkt")).toHaveLength(2);
  });

  it("writes a page from Confluence and GitHub, and merges a branch of two commits under GitHub's mark", () => {
    const section = work();
    const doc = section.querySelector(".il-w-doc")!;
    const tiles = [...doc.querySelectorAll(".w-tile")].map((tile) =>
      tile.nextElementSibling!.querySelector("path")!,
    );
    expect(tiles).toHaveLength(2);
    expect(tiles[0]!.getAttribute("d")).toMatch(/^M\.87 18\.257/);
    expect(tiles[1]!.getAttribute("d")).toMatch(/^M12 \.297/);
    expect(doc.querySelectorAll(".w-ln")).toHaveLength(4);
    expect(doc.querySelector(".w-ok")).not.toBeNull();

    const merge = section.querySelector(".il-w-target")!;
    expect(merge.querySelector(".w-tile + g path")!.getAttribute("d")).toBe(
      tiles[1]!.getAttribute("d"),
    );
    expect(merge.querySelectorAll(".mg-c")).toHaveLength(2);
    expect(merge.querySelector(".mg-br")).toHaveAttribute("pathLength", "1");
    expect(merge.querySelector(".mg-ok")).not.toBeNull();

    const day = section.querySelector(".il-w-clock")!;
    expect(day.querySelectorAll(".as-m")).toHaveLength(3);
    expect(day.querySelector(".as-now")).not.toBeNull();
  });

  it("runs each card's loop only while a quarter of it is on screen", () => {
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container, unmount } = render(<CareersWork />);
    const cards = [...container.querySelectorAll(".cq-wk")];
    const watch = TestIntersectionObserver.all[0]!;
    expect(watch.options.threshold).toBe(0.25);
    expect(watch.targets).toEqual(cards);
    expect(cards.filter((card) => card.classList.contains("is-on"))).toHaveLength(0);

    watch.report(true, cards[0]!, cards[1]!);
    expect(cards.map((card) => card.classList.contains("is-on"))).toEqual([
      true,
      true,
      false,
      false,
    ]);
    watch.report(false, cards[0]!);
    watch.report(true, cards[3]!);
    expect(cards.map((card) => card.classList.contains("is-on"))).toEqual([
      false,
      true,
      false,
      true,
    ]);

    unmount();
    expect(watch.disconnected).toBe(true);
  });

  it("simply runs the loops where there is no observer", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const cards = [...render(<CareersWork />).container.querySelectorAll(".cq-wk")];
    expect(cards.every((card) => card.classList.contains("is-on"))).toBe(true);
  });

  it("puts every drawing at its end state when scripting is off", () => {
    const style = render(<CareersWork />).container.querySelector("section > noscript")!.innerHTML;
    expect(style).toContain(".cq-wk .il *{animation:none!important}");
    expect(style).toContain(".cq-wk .il-w-doc .w-ln");
    expect(style).toContain("stroke-dashoffset:0");
    expect(style).toContain(".cq-wk .il-w-clock .as-m,.cq-wk .il-w-target .mg-c{opacity:1}");
  });
});
