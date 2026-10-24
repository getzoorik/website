import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { careers } from "@/content/careers";
import { CareersValues } from "@/features/careers/careers-values";

/**
 * Our values (option A): the picker's markup, its tabs, the autoplay, the
 * drawings' trigger and the values' addresses. jsdom has no
 * IntersectionObserver, so the test moves one by hand, with fake timers.
 */

/** An observer the test moves by hand, found by the threshold it was made with. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestIntersectionObserver.all.push(this);
  }

  /** .4 the autoplay, .25 the drawings. */
  static at(threshold: number): TestIntersectionObserver {
    const found = TestIntersectionObserver.all.find((io) => io.options.threshold === threshold);
    if (!found) throw new Error(`no observer at threshold ${threshold}`);
    return found;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}

  private report(isIntersecting: boolean, target: Element): void {
    act(() => {
      this.callback(
        [{ target, isIntersecting } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    });
  }

  enter(target: Element): void {
    this.report(true, target);
  }

  leave(target: Element): void {
    this.report(false, target);
  }
}

const reduceMotion = (reduce: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: reduce && query.includes("reduce"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );

const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, " ").trim() ?? "";
const { list } = careers.values;

let scrolled: Element[];

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  scrolled = [];
  /* jsdom does not lay out, so it has no scrollIntoView. */
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolled.push(this);
  };
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
  window.history.replaceState(null, "", "/");
});

function values(reduce = false) {
  reduceMotion(reduce);
  const { container } = render(<CareersValues />);
  const section = container.querySelector<HTMLElement>("section#values")!;
  const pick = section.querySelector<HTMLElement>(".cq-pick")!;
  const tabs = () => [...pick.querySelectorAll<HTMLElement>('[role="tab"]')];
  const open = () => tabs().findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  const shown = () =>
    [...pick.querySelectorAll('[role="tabpanel"]')].findIndex((p) => !p.hasAttribute("hidden"));
  return { container, section, pick, tabs, open, shown };
}

describe("Our values", () => {
  it("is its own band, headed by its title alone", () => {
    const { section } = values();
    expect(section).toHaveClass("sec", "sec-band", "cq-band");
    expect(section).toHaveAttribute("aria-labelledby", "values-h");
    expect(text(section.querySelector(".sec-head"))).toBe("Our values");
    expect(section.querySelector(".sec-head > p")).toBeNull();
  });

  it("draws six tabs, letter and name, the first chosen and alone in the tab order", () => {
    const { pick, tabs } = values();
    expect(pick.querySelector('[role="tablist"]')).toHaveAttribute("aria-label", "Our six values");
    expect(
      tabs().map((tab) => [text(tab.querySelector(".cq-tl")), text(tab.querySelector(".cq-tn"))]),
    ).toEqual([
      ["C", "Collaboration"],
      ["R", "Results for customers"],
      ["E", "Efficiency"],
      ["D", "Diversity, inclusion and belonging"],
      ["I", "Iteration"],
      ["T", "Transparency"],
    ]);
    for (const tab of tabs())
      expect(tab.querySelector(".cq-tl")).toHaveAttribute("aria-hidden", "true");
    expect(tabs().map((tab) => tab.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
      "false",
      "false",
      "false",
      "false",
    ]);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1, -1, -1]);
  });

  it("gives each value one panel: its drawing, name, meaning, question and behaviours, and no way on", () => {
    const { pick } = values();
    const panels = [...pick.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true, true, true, true, true]);
    panels.forEach((panel, i) => {
      const value = list[i]!;
      expect(panel).toHaveAttribute("id", `val-${value.id}`);
      expect(panel).toHaveAttribute("aria-labelledby", `tab-${value.id}`);
      expect(pick.querySelector(`#tab-${value.id}`)).toHaveAttribute(
        "aria-controls",
        `val-${value.id}`,
      );
      expect([...panel.querySelector(".cq-pl")!.children].map((el) => el.className)).toEqual([
        "cq-il",
        "",
        "cq-mean",
        "cq-ask",
      ]);
      const drawing = panel.querySelector(".cq-il > svg")!;
      expect(drawing).toHaveClass("il", `il-${value.id}`);
      expect(drawing).toHaveAttribute("viewBox", "0 0 200 110");
      expect(drawing).toHaveAttribute("aria-hidden", "true");
      expect(text(panel.querySelector(".cq-pl > h3"))).toBe(value.name);
      expect(text(panel.querySelector(".cq-mean"))).toBe(value.meaning);
      expect(text(panel.querySelector(".cq-ask > span"))).toBe("We ask");
      expect(text(panel.querySelector(".cq-ask"))).toBe(`We ask“${value.question}”`);
      /* Each behaviour is its name alone: the bullet is the sheet's. */
      const behaviours = [...panel.querySelectorAll(".cq-beh > li")];
      expect(behaviours.map((li) => text(li))).toEqual(value.behaviours);
      for (const li of behaviours) expect(li.children).toHaveLength(0);
      /* No Previous/Next bar. */
      expect(panel.querySelector("button, a")).toBeNull();
    });
    expect(panels.map((panel) => text(panel.querySelector(".cq-mean")))).toEqual([
      "We get further together than alone.",
      "We reduce our customers’ cloud bills without breaking anything.",
      "We spend time and money on what matters, and we do it once.",
      "Good ideas come from everywhere.",
      "Small steps add up faster than big plans.",
      "We share by default. It builds trust.",
    ]);
  });

  it("moves between values by click, by the arrow keys, Home and End, and replays the panel it opens", () => {
    const { pick, tabs, open, shown } = values();
    fireEvent.click(tabs()[2]!);
    expect([open(), shown()]).toEqual([2, 2]);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, -1, 0, -1, -1, -1]);
    expect(pick.querySelector("#val-efficiency")).toHaveClass("is-in");

    fireEvent.keyDown(tabs()[2]!, { key: "ArrowRight" });
    expect([open(), shown()]).toEqual([3, 3]);
    expect(document.activeElement).toBe(tabs()[3]);
    fireEvent.keyDown(tabs()[3]!, { key: "End" });
    expect(open()).toBe(5);
    fireEvent.keyDown(tabs()[5]!, { key: "ArrowRight" });
    expect(open()).toBe(0);
    fireEvent.keyDown(tabs()[0]!, { key: "ArrowLeft" });
    expect(open()).toBe(5);
    fireEvent.keyDown(tabs()[5]!, { key: "Home" });
    expect([open(), shown()]).toEqual([0, 0]);
    expect(document.activeElement).toBe(tabs()[0]);
  });
});

describe("the values' autoplay", () => {
  it("opens the next value every seven seconds while the picker is in view, never taking focus", () => {
    const { pick, open } = values();
    wait(14000);
    expect(open()).toBe(0);

    TestIntersectionObserver.at(0.4).enter(pick);
    wait(6999);
    expect(open()).toBe(0);
    wait(1);
    expect(open()).toBe(1);
    expect(pick.querySelector("#val-results")).toHaveClass("is-in");
    wait(7000);
    expect(open()).toBe(2);
    expect(pick.contains(document.activeElement)).toBe(false);
  });

  it("rests out of view, holds under the pointer and plays on when it leaves", () => {
    const { pick, open } = values();
    const io = TestIntersectionObserver.at(0.4);
    io.enter(pick);
    io.leave(pick);
    wait(14000);
    expect(open()).toBe(0);

    fireEvent.mouseEnter(pick);
    io.enter(pick);
    wait(14000);
    expect(open()).toBe(0);
    fireEvent.mouseLeave(pick);
    wait(7000);
    expect(open()).toBe(1);
  });

  it.each([
    [
      "a click inside it",
      (pick: HTMLElement) => fireEvent.click(pick.querySelector("#tab-efficiency")!),
    ],
    [
      "a key inside it",
      (pick: HTMLElement) =>
        fireEvent.keyDown(pick.querySelector("#tab-collaboration")!, { key: "Shift" }),
    ],
    [
      "focus moving into it",
      (pick: HTMLElement) => fireEvent.focusIn(pick.querySelector("#val-collaboration")!),
    ],
  ])("stops for good after %s", (_, touch) => {
    const { pick, open } = values();
    const io = TestIntersectionObserver.at(0.4);
    io.enter(pick);
    touch(pick);
    const chosen = open();
    wait(21000);
    io.leave(pick);
    io.enter(pick);
    fireEvent.mouseEnter(pick);
    fireEvent.mouseLeave(pick);
    wait(21000);
    expect(open()).toBe(chosen);
  });

  it("never plays under reduced motion", () => {
    const { open } = values(true);
    expect(TestIntersectionObserver.all).toHaveLength(0);
    wait(21000);
    expect(open()).toBe(0);
  });
});

describe("the values' drawings", () => {
  it("play only while a quarter of the picker is in view", () => {
    const { pick } = values();
    expect(pick).not.toHaveClass("is-on");
    const io = TestIntersectionObserver.at(0.25);
    io.enter(pick);
    expect(pick).toHaveClass("is-on");
    io.leave(pick);
    expect(pick).not.toHaveClass("is-on");
  });

  it("hold their end state under reduced motion", () => {
    const { pick } = values(true);
    expect(pick).toHaveClass("is-on");
  });

  it("hold the same end state without scripting as under reduced motion", () => {
    const { section } = values();
    const sheet = readFileSync(join(process.cwd(), "src/styles/careers-values.css"), "utf8");
    const reduced = sheet
      .slice(sheet.indexOf("@media (prefers-reduced-motion:reduce){"))
      .replace(/\s*\n\s*/g, "");
    const style = section.querySelector("noscript")!.innerHTML.replace(/<\/?style>/g, "");
    const layout = [
      ".cq-pick .cq-tabs{display:none",
      "@layer base{.cq-pick .cq-panel[hidden]{display:grid!important",
    ];
    const rules = style.split("}").filter((rule) => rule && !layout.includes(rule));
    expect(rules.length).toBeGreaterThan(5);
    for (const rule of rules) expect(reduced).toContain(`${rule}}`);
  });

  it("show every value without scripting, and not the tabs, which would do nothing", () => {
    const { section } = values();
    const style = section.querySelector("noscript")!.innerHTML;
    expect(style).toContain(".cq-pick .cq-tabs{display:none}");
    expect(style).toContain("@layer base{.cq-pick .cq-panel[hidden]{display:grid!important}}");
  });
});

describe("a value's address", () => {
  it("opens the value the hash names on arrival, brings the section into view and stops the autoplay", () => {
    window.history.replaceState(null, "", "/careers#val-iteration");
    const { section, pick, open, shown } = values();
    expect([open(), shown()]).toEqual([4, 4]);
    expect(scrolled).toEqual([section]);
    TestIntersectionObserver.at(0.4).enter(pick);
    wait(21000);
    expect(open()).toBe(4);
  });

  it("opens a value when the hash changes to its panel or its tab", () => {
    const { open } = values();
    window.history.replaceState(null, "", "/careers#tab-transparency");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(open()).toBe(5);
    window.history.replaceState(null, "", "/careers#val-results");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(open()).toBe(1);
  });

  it("leaves the picker alone for any other hash", () => {
    window.history.replaceState(null, "", "/careers#how-we-work");
    const { open } = values();
    expect(open()).toBe(0);
    expect(scrolled).toEqual([]);
  });
});
