import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/design-partners" }));

import DesignPartnersRoute from "@/app/design-partners/page";

/**
 * /design-partners's motion: the programs' island (`ProgramsMotion`, the mock's `PV_JS`), which jsdom cannot run on
 * its own (it has no IntersectionObserver). Each of the two navy panels plays once, the first time a quarter of it is
 * in view: the offer's diamonds turn in one after another, and the journey's line draws under its four steps. Under
 * reduced motion and without an observer they are marked played at once; without scripting the two <noscript> styles
 * draw them at rest.
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

const panels = (container: HTMLElement) => [
  container.querySelector("#offer .pv-anim")!,
  container.querySelector("#how .pv-anim")!,
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
});

describe("/design-partners's panels", () => {
  it("each play once, the first time a quarter of it is in view", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<DesignPartnersRoute />);
    const [offer, how] = panels(container);
    const io = TestIntersectionObserver.all[0]!;
    expect(io.options.threshold).toBe(0.25);
    expect([...io.observed]).toEqual([offer, how]);

    io.report(true, offer!);
    expect(offer).toHaveClass("is-on");
    expect(how).not.toHaveClass("is-on");
    io.report(false, how!);
    expect(how).not.toHaveClass("is-on");
    io.report(true, how!);
    expect(how).toHaveClass("is-on");
    /* Played: no longer watched, so leaving and coming back plays nothing again. */
    expect(io.observed.size).toBe(0);
  });

  it("are drawn at rest at once under reduced motion, watching nothing", () => {
    reduceMotion(true);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<DesignPartnersRoute />);
    for (const panel of panels(container)) expect(panel).toHaveClass("is-on");
    expect(TestIntersectionObserver.all).toEqual([]);
  });

  it("play at once in a browser without IntersectionObserver", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<DesignPartnersRoute />);
    for (const panel of panels(container)) expect(panel).toHaveClass("is-on");
  });

  it("are drawn at rest with scripting off: the journey by the programs' style, the diamonds by the page's", () => {
    reduceMotion(false);
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const { container } = render(<DesignPartnersRoute />);
    const fallback = [...container.querySelectorAll("main noscript")]
      .map((n) => n.innerHTML)
      .join("");
    expect(fallback).toContain(
      ".pv-main .pv-anim .pv-step{opacity:1;transform:none;transition:none}",
    );
    expect(fallback).toContain(
      ".dp-main .pv-anim .dp-slots i{opacity:1;transform:rotate(45deg) scale(.72);transition:none}",
    );
  });
});
