import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CareersHire } from "@/features/careers/careers-hire";

/**
 * How we hire: six steps under one hairline, each its icon, its number, how it
 * happens as a pill, its name and one line, with no step in the accent; and the
 * marker that walks the steps every 1.6s while they are on screen, driven by an
 * observer the test moves by hand and by fake timers.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** An observer the test moves by hand. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];
  readonly targets: Element[] = [];

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
  disconnect(): void {}

  report(isIntersecting: boolean): void {
    act(() => {
      this.callback(
        this.targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      );
    });
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

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
});

function hire(reduce = false) {
  reduceMotion(reduce);
  const section = render(<CareersHire />).container.querySelector("section")!;
  const steps = [...section.querySelectorAll<HTMLElement>("ol.cq-steps > li")];
  const at = () => steps.findIndex((step) => step.classList.contains("is-at"));
  const lit = () => steps.filter((step) => step.classList.contains("is-at")).length;
  const marker = () =>
    section.querySelector<HTMLElement>(".cq-track")!.style.getPropertyValue("--at");
  return { section, steps, at, lit, marker };
}

describe("How we hire", () => {
  it("is its own address on the band, named by its heading, with its lede", () => {
    const { section } = hire();
    expect(section).toHaveAttribute("id", "how-we-hire");
    expect(section).toHaveClass("sec", "sec-band", "cq-band");
    expect(section).toHaveAttribute("aria-labelledby", "how-we-hire-h");
    expect(text(section.querySelector(".sec-head > h2#how-we-hire-h"))).toBe("How we hire");
    expect(text(section.querySelector(".sec-head > p"))).toBe("Six steps, all remote.");
  });

  it("lists the six steps under one hairline: number, mode, name and one line each", () => {
    const { section, steps } = hire();
    const box = section.querySelector(".wrap > .cq-hire")!;
    expect(box.firstElementChild).toHaveClass("cq-track");
    expect(box.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(box.querySelector(".cq-track > i")).not.toBeNull();
    expect(
      steps.map((step) => [
        text(step.querySelector(".cq-n")),
        text(step.querySelector(".cq-mode")),
        text(step.querySelector("h3")),
        text(step.querySelector("h3 + p")),
      ]),
    ).toEqual([
      ["01", "In writing", "Apply", "Your CV and something you are proud of."],
      ["02", "Video call", "Intro call", "The role, and how we work."],
      ["03", "Video call", "Skills interview", "Real systems, or your own work."],
      ["04", "Video call", "Values interview", "One question per value."],
      ["05", "Video call", "Meet the founders", "Questions both ways."],
      ["06", "In writing", "Offer", "References, then the offer in writing."],
    ]);
    /* Nothing follows the steps. */
    expect(box.lastElementChild).toBe(section.querySelector("ol.cq-steps"));
  });

  it("gives each step its own icon, and its mode the document or the camera", () => {
    const { steps } = hire();
    const icons = steps.map((step) => step.querySelector(":scope > .cq-hi")!);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon.querySelector("svg")).toHaveAttribute("stroke-width", "1.7");
    }
    expect(new Set(icons.map((icon) => icon.innerHTML)).size).toBe(6);
    const modes = steps.map((step) => step.querySelector(".cq-mode > svg")!);
    for (const mode of modes) expect(mode).toHaveAttribute("aria-hidden", "true");
    /* "In writing" draws Apply's document; "Video call" the intro call's camera. */
    expect(modes[0]!.innerHTML).toBe(icons[0]!.querySelector("svg")!.innerHTML);
    expect(modes[5]!.innerHTML).toBe(modes[0]!.innerHTML);
    for (const n of [1, 2, 3, 4]) {
      expect(modes[n]!.innerHTML).toBe(icons[1]!.querySelector("svg")!.innerHTML);
    }
  });

  it("lights the first step in the markup", () => {
    const { at, lit, marker } = hire();
    expect(at()).toBe(0);
    expect(lit()).toBe(1);
    expect(marker()).toBe("");
  });

  it("walks the marker one step every 1.6s while the steps are in view, and round again", () => {
    const { section, at, lit, marker } = hire();
    const watch = TestIntersectionObserver.all[0]!;
    expect(watch.options.threshold).toBe(0.3);
    expect(watch.targets).toEqual([section.querySelector(".cq-hire")]);

    wait(4800);
    expect(at()).toBe(0);
    watch.report(true);
    wait(1599);
    expect(at()).toBe(0);
    wait(1);
    expect([at(), lit(), marker()]).toEqual([1, 1, "1"]);
    wait(1600 * 4);
    expect([at(), marker()]).toEqual([5, "5"]);
    wait(1600);
    expect([at(), marker()]).toEqual([0, "0"]);
  });

  it("rests where it was while the steps are out of view, and walks on from there", () => {
    const { at } = hire();
    const watch = TestIntersectionObserver.all[0]!;
    watch.report(true);
    wait(3200);
    expect(at()).toBe(2);
    watch.report(false);
    wait(16000);
    expect(at()).toBe(2);
    watch.report(true);
    wait(1600);
    expect(at()).toBe(3);
  });

  it("never walks under reduced motion", () => {
    const { at } = hire(true);
    expect(TestIntersectionObserver.all).toHaveLength(0);
    wait(16000);
    expect(at()).toBe(0);
  });
});
