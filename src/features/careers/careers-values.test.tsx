import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { careers } from "@/content/careers";
import { CareersValues } from "@/features/careers/careers-values";

/**
 * Our values (option A): the picker's markup, its tabs, each value's scene,
 * the autoplay, the scenes' trigger and the values' addresses. jsdom has no
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

  /** .4 the autoplay, .25 the scenes. */
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
const sheet = (name: string) => readFileSync(join(process.cwd(), "src/styles", name), "utf8");
const { list } = careers.values;

/** What each scene shows, for the ear: the proposal's labels (`scenes/build_<key>.py`), word for word. */
const SCENE_LABELS = [
  "Four people stand round a table, each holding a block, and in the middle of their shared plan four blocks like theirs hold up one warm block.",
  "A teammate shows a cheering customer their bill, a stack now half its old height, while another teammate checks the servers behind them, still running with their green lights on.",
  "Two people push heavy boxes up their lanes while a third, between them, rolls a sphere and is well ahead.",
  "Six different people stand in an arc round a glowing tile, and one by one each raises a hand to add to it.",
  "A stair of small blocks rises to the right: one teammate walks up it, another at the top holds the next block over its dashed place, and a third points to it from the floor.",
  "A large magnifying glass lies on the floor with a page clearly visible through its lens, and four people stand round it looking in while one points at a marked line.",
];

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

  it("gives each value one panel: its scene, then its name, meaning and behaviours, and no question and no way on", () => {
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
      /* The scene first, so a phone's one column puts it on top. */
      expect([...panel.children].map((el) => el.className)).toEqual(["cq-scene", "cq-pr"]);
      expect([...panel.querySelector(".cq-pr")!.children].map((el) => el.tagName)).toEqual([
        "H3",
        "P",
        "UL",
      ]);
      expect(text(panel.querySelector(".cq-pr > h3"))).toBe(value.name);
      expect(text(panel.querySelector(".cq-pr > p.cq-mean"))).toBe(value.meaning);
      /* No question: the "We ask" line is gone (owner, 25 Oct 2026). */
      expect(panel.querySelector(".cq-ask")).toBeNull();
      expect(panel.textContent).not.toMatch(/We ask/);
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

  it("draws each value's own scene, which names itself for the ear", () => {
    const { pick } = values();
    const scenes = [...pick.querySelectorAll('[role="tabpanel"] > .cq-scene')].map(
      (box) => box.firstElementChild!,
    );
    expect(scenes).toHaveLength(6);
    scenes.forEach((scene, i) => {
      const value = list[i]!;
      expect(scene.tagName.toLowerCase()).toBe("svg");
      expect(scene.parentElement!.children).toHaveLength(1);
      expect(scene.getAttribute("class")).toBe(`sc sc-${value.id}`);
      expect(scene).toHaveAttribute("viewBox", "0 0 480 270");
      expect(scene).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
      expect(scene).toHaveAttribute("role", "img");
    });
    expect(scenes.map((scene) => scene.getAttribute("aria-label"))).toEqual(SCENE_LABELS);
    /* Each scene is drawn once, so the ids inside it (its gradients) are unique within the picker; across the whole
       page, `careers-page.test.tsx` holds every id unique. */
    const ids = [...pick.querySelectorAll(".cq-scene [id]")].map((el) => el.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
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

describe("the values' scenes", () => {
  it("play only while a quarter of the picker is in view", () => {
    const { pick } = values();
    expect(pick).not.toHaveClass("is-on");
    const io = TestIntersectionObserver.at(0.25);
    io.enter(pick);
    expect(pick).toHaveClass("is-on");
    io.leave(pick);
    expect(pick).not.toHaveClass("is-on");
  });

  it("hold their still frame under reduced motion: the sheet stops them, wherever the picker is", () => {
    const { pick } = values(true);
    expect(pick).toHaveClass("is-on");
    expect(sheet("careers-scenes.css")).toContain(
      "@media (prefers-reduced-motion:reduce){.sc *{animation:none!important;transition:none!important}}",
    );
  });

  it("hold the same still frame without scripting as under reduced motion", () => {
    const { section } = values();
    const reduced = sheet("careers-scenes.css").match(
      /@media \(prefers-reduced-motion:reduce\)\{(.*)\}\n/,
    )![1]!;
    const style = section.querySelector("noscript")!.innerHTML.replace(/<\/?style>/g, "");
    const layout =
      ".cq-pick .cq-tabs{display:none}@layer base{.cq-pick .cq-panel[hidden]{display:grid!important}}";
    expect(style.startsWith(layout)).toBe(true);
    expect(style.slice(layout.length)).toBe(reduced);
  });

  it("wait, paused, while the picker is off screen: the last rule outranks each scene's own loop", () => {
    const scenes = sheet("careers-scenes.css");
    expect(
      scenes.trimEnd().endsWith(".cq-pick:not(.is-on) .sc *{animation-play-state:paused}"),
    ).toBe(true);
    /* The kit's shared rules once, then each scene's own, under its class. */
    expect(scenes.match(/^\.sc\{/gm)).toHaveLength(1);
    for (const value of list) expect(scenes).toContain(`.sc-${value.id} `);
    expect(scenes).not.toMatch(
      /^\.sc-(?!collaboration|results|efficiency|diversity|iteration|transparency)/m,
    );
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
