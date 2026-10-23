import { act, fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OfferingTour } from "./offering-tour";

/**
 * The rows taking turns. jsdom has no layout, so the reader's view is the
 * observer's to say (`scroll`), and the clock is faked down to the animation
 * frame, which the turn runs on.
 */

const observers: Array<(isIntersecting: boolean) => void> = [];

class TestIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(element: Element): void {
    observers.push((isIntersecting) =>
      this.callback(
        [{ target: element, isIntersecting } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      ),
    );
  }

  unobserve(): void {}
  disconnect(): void {}
}

function scroll(isIntersecting: boolean): void {
  act(() => observers.forEach((fire) => fire(isIntersecting)));
}

function wait(ms: number): void {
  act(() => void vi.advanceTimersByTime(ms));
}

function setReducedMotion(reduced: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

const IDS = ["monitoring", "recommendations", "workload-optimization", "node-optimization"];

/** The column as `ProductAbout` draws it: a heading, the list, and a link to a row elsewhere. */
function renderTour() {
  const view = render(
    <>
      <a href="#workload-optimization">Workload optimization</a>
      <div id="what">
        <h2>What Coral does?</h2>
        <OfferingTour>
          {IDS.map((id) => (
            <li id={id} className="has-i" key={id}>
              <div>
                <h3>{id}</h3>
                <span className="tour-line">The line.</span>
              </div>
            </li>
          ))}
        </OfferingTour>
      </div>
    </>,
  );
  const rows = [...view.container.querySelectorAll<HTMLLIElement>("li.has-i")];
  return { ...view, rows };
}

const selected = (rows: HTMLLIElement[]): string[] =>
  rows.filter((row) => row.getAttribute("aria-selected") === "true").map((row) => row.id);

describe("OfferingTour", () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    setReducedMotion(false);
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "performance",
        "Date",
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("is a plain list with scripting off: every row and its line, nothing selected", () => {
    const html = renderToStaticMarkup(
      <OfferingTour>
        <li id="monitoring" className="has-i">
          <span className="tour-line">The line.</span>
        </li>
      </OfferingTour>,
    );
    expect(html).toBe(
      '<ul class="flist" role="list"><li id="monitoring" class="has-i"><span class="tour-line">The line.</span></li></ul>',
    );
  });

  it("makes the list a vertical tablist with the first row shown", () => {
    const { rows } = renderTour();
    const list = rows[0]!.parentElement!;
    expect(list).toHaveAttribute("role", "tablist");
    expect(list).toHaveAttribute("aria-orientation", "vertical");
    expect(rows.map((row) => row.getAttribute("role"))).toEqual(IDS.map(() => "tab"));
    expect(selected(rows)).toEqual(["monitoring"]);
    expect(rows.map((row) => row.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it("reads each row for 4.8s while in view, then the next, and wraps", () => {
    const { rows } = renderTour();
    scroll(true);
    wait(4700);
    expect(selected(rows)).toEqual(["monitoring"]);
    wait(200);
    expect(selected(rows)).toEqual(["recommendations"]);
    wait(4800 * 3);
    expect(selected(rows)).toEqual(["monitoring"]);
  });

  it("stands still out of view, and goes on from where it stood", () => {
    const { rows } = renderTour();
    scroll(true);
    wait(2400);
    scroll(false);
    wait(10_000);
    expect(selected(rows)).toEqual(["monitoring"]);
    /* Half its time was read; the other half is left. */
    scroll(true);
    wait(2300);
    expect(selected(rows)).toEqual(["monitoring"]);
    wait(200);
    expect(selected(rows)).toEqual(["recommendations"]);
  });

  it("shows a hovered row after 220ms and pauses until the pointer leaves", () => {
    const { rows } = renderTour();
    scroll(true);
    fireEvent.mouseEnter(rows[2]!);
    wait(200);
    expect(selected(rows)).toEqual(["monitoring"]);
    wait(40);
    expect(selected(rows)).toEqual(["workload-optimization"]);
    wait(10_000);
    expect(selected(rows)).toEqual(["workload-optimization"]);
    fireEvent.mouseLeave(rows[2]!);
    wait(4900);
    expect(selected(rows)).toEqual(["node-optimization"]);
  });

  it("holds a clicked row", () => {
    const { rows } = renderTour();
    scroll(true);
    fireEvent.click(rows[1]!);
    expect(selected(rows)).toEqual(["recommendations"]);
    wait(20_000);
    expect(selected(rows)).toEqual(["recommendations"]);
  });

  it("moves with the arrows, wrapping, focus with it, and holds the row it lands on", () => {
    const { rows } = renderTour();
    scroll(true);
    act(() => rows[0]!.focus());
    fireEvent.keyDown(rows[0]!, { key: "ArrowDown" });
    expect(selected(rows)).toEqual(["recommendations"]);
    expect(document.activeElement).toBe(rows[1]);
    fireEvent.keyDown(rows[1]!, { key: "ArrowRight" });
    expect(selected(rows)).toEqual(["workload-optimization"]);
    fireEvent.keyDown(rows[2]!, { key: "ArrowUp" });
    fireEvent.keyDown(rows[1]!, { key: "ArrowLeft" });
    fireEvent.keyDown(rows[0]!, { key: "ArrowUp" });
    expect(selected(rows)).toEqual(["node-optimization"]);
    expect(document.activeElement).toBe(rows[3]);
    expect(rows.map((row) => row.tabIndex)).toEqual([-1, -1, -1, 0]);
    wait(20_000);
    expect(selected(rows)).toEqual(["node-optimization"]);
  });

  it("holds a row on Space or Enter, without scrolling the page", () => {
    const { rows } = renderTour();
    scroll(true);
    /* fireEvent returns false when the handler prevented the default. */
    expect(fireEvent.keyDown(rows[2]!, { key: " " })).toBe(false);
    expect(selected(rows)).toEqual(["workload-optimization"]);
    expect(fireEvent.keyDown(rows[1]!, { key: "Enter" })).toBe(false);
    expect(selected(rows)).toEqual(["recommendations"]);
    expect(fireEvent.keyDown(rows[1]!, { key: "Tab" })).toBe(true);
    wait(20_000);
    expect(selected(rows)).toEqual(["recommendations"]);
  });

  it("holds the row a link jumps to, and the row a hash names", () => {
    const { rows, getByText } = renderTour();
    scroll(true);
    fireEvent.click(getByText("Workload optimization"));
    wait(0);
    expect(selected(rows)).toEqual(["workload-optimization"]);
    wait(20_000);
    expect(selected(rows)).toEqual(["workload-optimization"]);

    act(() => {
      window.history.replaceState(null, "", "#node-optimization");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(selected(rows)).toEqual(["node-optimization"]);
    window.history.replaceState(null, "", window.location.pathname);
  });

  it("turns nothing under reduced motion, and still answers a click", () => {
    setReducedMotion(true);
    const { rows } = renderTour();
    expect(observers).toHaveLength(0);
    wait(20_000);
    expect(selected(rows)).toEqual(["monitoring"]);
    fireEvent.click(rows[3]!);
    expect(selected(rows)).toEqual(["node-optimization"]);
  });

  it("lets go of the page when it unmounts: no listener, no frame, no timer left", () => {
    const { unmount } = renderTour();
    scroll(true);
    const fromDocument = vi.spyOn(document, "removeEventListener");
    const fromWindow = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(fromDocument).toHaveBeenCalledWith("click", expect.any(Function));
    expect(fromWindow).toHaveBeenCalledWith("hashchange", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });
});
