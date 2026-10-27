import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SavedSoFar, dollars } from "./saved-so-far";

/**
 * Value Lab's "Saved so far" figure: the real figure in the page as drawn, then one count up from $0.00 once loaded,
 * and none under reduced motion.
 */

const reduced = (matches: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: matches && query.includes("reduce"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SavedSoFar", () => {
  it("prints the figure as the hub does: dollars and cents, with thousands grouped", () => {
    expect(dollars(213.89)).toBe("$213.89");
    expect(dollars(0)).toBe("$0.00");
    expect(dollars(2566.68)).toBe("$2,566.68");
  });

  it("draws the real figure in the page, so a reader without scripting reads it", () => {
    expect(renderToString(<SavedSoFar value={213.89} />)).toBe("<b>$213.89</b>");
  });

  it("shows the figure at once under reduced motion", () => {
    reduced(true);
    const frame = vi.spyOn(window, "requestAnimationFrame");
    const { container } = render(<SavedSoFar value={213.89} />);
    expect(container.textContent).toBe("$213.89");
    expect(frame).not.toHaveBeenCalled();
  });

  it("counts up once from $0.00 to the figure in 1.2s, easing out", () => {
    reduced(false);
    const queue: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
      queue.push(step);
      return queue.length;
    });
    const { container } = render(<SavedSoFar value={213.89} />);
    expect(container.textContent).toBe("$0.00");
    const at = (time: number) => act(() => queue.shift()!(time));
    at(1000);
    expect(container.textContent).toBe("$0.00");
    at(1600);
    /* Halfway in time, seven eighths of the way in value: 1 − (1 − 0.5)³. */
    expect(container.textContent).toBe(dollars(213.89 * 0.875));
    at(2200);
    expect(container.textContent).toBe("$213.89");
    expect(queue).toHaveLength(0);
  });
});
