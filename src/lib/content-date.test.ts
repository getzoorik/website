import { describe, expect, it } from "vitest";

import { isoDay, printedDay, shortDay } from "./content-date";

describe("isoDay", () => {
  it("reads the day each kind of printed line names", () => {
    expect(isoDay("Updated 9 October 2026")).toBe("2026-10-09");
    expect(isoDay("Effective 6 October 2026 · Version 1.0")).toBe("2026-10-06");
    expect(isoDay("12 October 2026")).toBe("2026-10-12");
  });

  it("throws on a line with no whole day, an unknown month, or a day that does not exist", () => {
    expect(() => isoDay("October 2026")).toThrow();
    expect(() => isoDay("Updated 9 Octobre 2026")).toThrow();
    expect(() => isoDay("31 September 2026")).toThrow();
  });
});

describe("printedDay and shortDay", () => {
  it("print an ISO day in full and as a card does, and read back to the same day", () => {
    expect(printedDay("2026-10-09")).toBe("9 October 2026");
    expect(shortDay("2026-10-09")).toBe("9 Oct");
    expect(shortDay("2026-11-22")).toBe("22 Nov");
    expect(isoDay(printedDay("2026-09-30"))).toBe("2026-09-30");
  });

  it("throw on anything that is not a real ISO day", () => {
    for (const bad of ["2026-9-30", "2026-09-31", "9 October 2026", ""]) {
      expect(() => printedDay(bad), bad).toThrow();
      expect(() => shortDay(bad), bad).toThrow();
    }
  });
});
