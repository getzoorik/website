import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/referrals" }));

import PartnersRoute from "@/app/partners/page";
import ReferralsRoute from "@/app/referrals/page";

/**
 * The programs' motion (`ProgramsMotion`, the mock's `PV_JS`), which jsdom cannot run on its own (it has no
 * IntersectionObserver): each navy panel plays once, the first time a quarter of it is in view; under reduced motion
 * and without an observer it is marked played at once; without scripting the <noscript> style draws it at rest.
 */

/** An observer the test moves by hand. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];
  readonly observed = new Set<Element>();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestIntersectionObserver.all.push(this);
  }

  observe(target: Element): void {
    this.observed.add(target);
  }
  unobserve(target: Element): void {
    this.observed.delete(target);
  }
  disconnect(): void {
    this.observed.clear();
  }

  report(isIntersecting: boolean, target: Element): void {
    act(() => {
      this.callback(
        [{ target, isIntersecting } as IntersectionObserverEntry],
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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
});

describe.each([
  ["/referrals", ReferralsRoute],
  ["/partners", PartnersRoute],
])("%s's panel", (_, Route) => {
  it("plays once, the first time a quarter of it is in view", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<Route />);
    const panel = container.querySelector(".pv-main .pv-anim")!;
    const io = TestIntersectionObserver.all[0]!;
    expect(io.options.threshold).toBe(0.25);
    expect(io.observed.has(panel)).toBe(true);
    expect(panel).not.toHaveClass("is-on");

    io.report(false, panel);
    expect(panel).not.toHaveClass("is-on");
    io.report(true, panel);
    expect(panel).toHaveClass("is-on");
    /* Played: no longer watched, so leaving and coming back plays nothing again. */
    expect(io.observed.has(panel)).toBe(false);
  });

  it("is drawn at rest at once under reduced motion, watching nothing", () => {
    reduceMotion(true);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<Route />);
    expect(container.querySelector(".pv-anim")).toHaveClass("is-on");
    expect(TestIntersectionObserver.all).toEqual([]);
  });

  it("plays at once in a browser without IntersectionObserver", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<Route />);
    expect(container.querySelector(".pv-anim")).toHaveClass("is-on");
  });

  it("draws every panel at rest with scripting off", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<Route />);
    const fallback = container.querySelector("main noscript")!.innerHTML;
    expect(fallback).toContain(
      ".pv-main .pv-anim .pv-step{opacity:1;transform:none;transition:none}",
    );
    expect(fallback).toContain(
      ".pv-main .pv-anim .pv-line b,.pv-main .pv-anim .pv-track i{transform:none;transition:none}",
    );
  });
});
