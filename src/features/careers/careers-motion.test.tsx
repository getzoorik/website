import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/careers" }));

import CareersRoute from "@/app/careers/page";

/**
 * The island of /careers's frame (`CareersMotion`), which jsdom cannot run on
 * its own (it has no IntersectionObserver): the hero's rings turn only while
 * on screen, and each product's film plays while 35% of it is in view. The
 * page's other islands (the values, the drawings, the hiring steps) are tested
 * beside them; the observer here finds the one that watches a given element.
 */

/** An observer the test moves by hand, found by what it watches. */
class TestIntersectionObserver {
  static all: TestIntersectionObserver[] = [];
  readonly watched = new Set<Element>();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestIntersectionObserver.all.push(this);
  }

  /** The one observer watching `target`; it is an error for none, or two, to watch it. */
  static watching(target: Element): TestIntersectionObserver {
    const found = TestIntersectionObserver.all.filter((io) => io.watched.has(target));
    if (found.length !== 1) throw new Error(`${found.length} observers watch this element`);
    return found[0]!;
  }

  observe(target: Element): void {
    this.watched.add(target);
  }
  unobserve(target: Element): void {
    this.watched.delete(target);
  }
  disconnect(): void {
    this.watched.clear();
  }

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

let play: ReturnType<typeof vi.spyOn>;
let pause: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  TestIntersectionObserver.all = [];
});

function careersPage(reduce = false) {
  reduceMotion(reduce);
  const { container } = render(<CareersRoute />);
  return {
    container,
    orbit: container.querySelector(".cq-orbit")!,
    films: [...container.querySelectorAll<HTMLVideoElement>(".cq-vid video")],
  };
}

describe("the hero's rings", () => {
  it("turn only while the figure is on screen", () => {
    const { orbit } = careersPage();
    expect(orbit).not.toHaveClass("is-on");
    const watch = TestIntersectionObserver.watching(orbit);
    watch.enter(orbit);
    expect(orbit).toHaveClass("is-on");
    watch.leave(orbit);
    expect(orbit).not.toHaveClass("is-on");
  });

  it("simply turn where there is no observer", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { orbit } = careersPage();
    expect(orbit).toHaveClass("is-on");
  });
});

describe("the products' films", () => {
  it("play while 35% of each is in view, and pause when it leaves", () => {
    const { films } = careersPage();
    expect(films).toHaveLength(2);
    const [coral, amoeba] = films as [HTMLVideoElement, HTMLVideoElement];
    const watch = TestIntersectionObserver.watching(coral);
    expect(watch.options.threshold).toBe(0.35);
    expect(TestIntersectionObserver.watching(amoeba)).toBe(watch);
    expect(play).not.toHaveBeenCalled();

    watch.enter(coral);
    expect(play).toHaveBeenCalledTimes(1);
    expect(play.mock.contexts[0]).toBe(coral);
    watch.leave(coral);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(pause.mock.contexts[0]).toBe(coral);
  });

  it("stay on their posters under reduced motion, while the rings' watch goes on (the sheet holds them)", () => {
    const { films, orbit } = careersPage(true);
    for (const film of films) {
      expect(TestIntersectionObserver.all.some((io) => io.watched.has(film))).toBe(false);
    }
    expect(play).not.toHaveBeenCalled();
    TestIntersectionObserver.watching(orbit).enter(orbit);
    expect(orbit).toHaveClass("is-on");
  });

  it("stay on their posters where there is no observer", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    careersPage();
    expect(play).not.toHaveBeenCalled();
  });
});

describe("the island", () => {
  it("draws nothing of its own: nothing is hidden before it runs, so it needs no <noscript> style", () => {
    const { container } = careersPage();
    expect(container.querySelector("main > noscript")).toBeNull();
  });

  it("lets go of its observers when the page goes", () => {
    reduceMotion(false);
    const { container, unmount } = render(<CareersRoute />);
    const orbit = container.querySelector(".cq-orbit")!;
    const [coral] = [...container.querySelectorAll(".cq-vid video")];
    const turn = TestIntersectionObserver.watching(orbit);
    const films = TestIntersectionObserver.watching(coral!);
    unmount();
    expect(turn.watched.size).toBe(0);
    expect(films.watched.size).toBe(0);
  });
});
