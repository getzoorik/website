import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/careers" }));

import CareersRoute from "@/app/careers/page";

/**
 * /careers's motion, which jsdom cannot run on its own (it has no
 * IntersectionObserver): the values' autoplay (`CareersValues`) and the page's
 * island (`CareersMotion`), driven by an observer the test moves by hand and
 * by fake timers. The markup and the picker's clicks and keys are in
 * `careers-page.test.tsx`.
 */

/** An observer the test moves by hand, found by the options it was made with. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestIntersectionObserver.all.push(this);
  }

  /** The one made with this threshold: .4 the picker, .35 the films, .6 the line, .18 the reveal. */
  static at(threshold: number): TestIntersectionObserver {
    const found = TestIntersectionObserver.all.find((io) => io.options.threshold === threshold);
    if (!found) throw new Error(`no observer at threshold ${threshold}`);
    return found;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}

  private report(isIntersecting: boolean, targets: Element[]): void {
    act(() => {
      this.callback(
        targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      );
    });
  }

  enter(...targets: Element[]): void {
    this.report(true, targets);
  }

  leave(...targets: Element[]): void {
    this.report(false, targets);
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

let play: ReturnType<typeof vi.spyOn>;
let pause: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
});

function careersPage() {
  reduceMotion(false);
  const { container } = render(<CareersRoute />);
  const pick = container.querySelector<HTMLElement>(".cr-pick")!;
  const open = () =>
    [...pick.querySelectorAll('[role="tab"]')].findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true",
    );
  return { container, pick, open };
}

describe("the values' autoplay", () => {
  it("opens the next value every seven seconds while the picker is in view, its underline filling", () => {
    const { pick, open } = careersPage();
    expect(pick.style.getPropertyValue("--auto")).toBe("7000ms");
    wait(14000);
    expect(open()).toBe(0);

    TestIntersectionObserver.at(0.4).enter(pick);
    expect(pick).toHaveClass("is-auto");
    wait(6999);
    expect(open()).toBe(0);
    wait(1);
    expect(open()).toBe(1);
    expect(pick.querySelector("#val-results")).toHaveClass("is-in");
    wait(7000);
    expect(open()).toBe(2);
    /* The autoplay never takes focus. */
    expect(pick.contains(document.activeElement)).toBe(false);
  });

  it("rests out of view, holds under the pointer and plays on when it leaves", () => {
    const { pick, open } = careersPage();
    const io = TestIntersectionObserver.at(0.4);
    io.enter(pick);
    io.leave(pick);
    expect(pick).not.toHaveClass("is-auto");
    wait(14000);
    expect(open()).toBe(0);

    io.enter(pick);
    fireEvent.mouseEnter(pick);
    expect(pick).not.toHaveClass("is-auto");
    wait(14000);
    expect(open()).toBe(0);
    fireEvent.mouseLeave(pick);
    expect(pick).toHaveClass("is-auto");
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
      (pick: HTMLElement) => fireEvent.focusIn(pick.querySelector("#tab-collaboration")!),
    ],
    [
      "a click on a hero letter",
      (pick: HTMLElement) =>
        fireEvent.click(pick.ownerDocument.querySelector('.cr-ht[data-go="diversity"]')!),
    ],
  ])("stops for good after %s", (_, touch) => {
    const { pick, open } = careersPage();
    const io = TestIntersectionObserver.at(0.4);
    io.enter(pick);
    touch(pick);
    const chosen = open();
    expect(pick).not.toHaveClass("is-auto");
    wait(21000);
    io.leave(pick);
    io.enter(pick);
    fireEvent.mouseEnter(pick);
    fireEvent.mouseLeave(pick);
    wait(21000);
    expect(open()).toBe(chosen);
    expect(pick).not.toHaveClass("is-auto");
  });

  it("never plays under reduced motion", () => {
    reduceMotion(true);
    const { container } = render(<CareersRoute />);
    expect(TestIntersectionObserver.all.some((io) => io.options.threshold === 0.4)).toBe(false);
    wait(21000);
    expect(container.querySelector("#tab-collaboration")).toHaveAttribute("aria-selected", "true");
    expect(container.querySelector(".cr-pick")).not.toHaveClass("is-auto");
  });
});

describe("the page's motion", () => {
  it("brings each section in the first time it is in view", () => {
    const { container } = careersPage();
    const reveal = TestIntersectionObserver.all.find((io) => io.options.threshold === 0.18)!;
    expect(reveal.options.rootMargin).toBe("0px 0px -6% 0px");
    const habit = container.querySelector(".cr-wk.rv")!;
    expect(habit).not.toHaveClass("is-in");
    reveal.enter(habit);
    expect(habit).toHaveClass("is-in");
  });

  it("walks a light across the hero's letters until one is hovered", () => {
    const { container } = careersPage();
    const letters = [...container.querySelectorAll(".cr-ht")];
    const lit = () => letters.findIndex((letter) => letter.classList.contains("is-lit"));
    expect(lit()).toBe(-1);
    wait(1600);
    expect(lit()).toBe(0);
    wait(1600);
    expect(lit()).toBe(1);
    fireEvent.mouseEnter(letters[4]!);
    expect(lit()).toBe(-1);
    wait(4800);
    expect(lit()).toBe(-1);
    fireEvent.mouseLeave(letters[4]!);
    wait(1600);
    expect(lit()).toBe(2);
  });

  it("plays each film while it is in view and pauses it when it leaves", () => {
    const { container } = careersPage();
    const [coral] = [...container.querySelectorAll("video")];
    const films = TestIntersectionObserver.at(0.35);
    films.enter(coral!);
    expect(play).toHaveBeenCalledTimes(1);
    films.leave(coral!);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it("draws the hiring line once it is in view", () => {
    const { container } = careersPage();
    const line = container.querySelector(".cr-line")!;
    expect(line).not.toHaveClass("is-on");
    TestIntersectionObserver.at(0.6).enter(line);
    expect(line).toHaveClass("is-on");
  });

  it("places everything at rest under reduced motion: no reveal to wait for, no light, no film", () => {
    reduceMotion(true);
    const { container } = render(<CareersRoute />);
    const entering = [...container.querySelectorAll(".cr-main .rv")];
    expect(entering.length).toBeGreaterThan(10);
    for (const el of entering) expect(el).toHaveClass("is-in");
    expect(TestIntersectionObserver.all.some((io) => io.options.threshold === 0.35)).toBe(false);
    wait(4800);
    expect(container.querySelector(".cr-ht.is-lit")).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });
});
