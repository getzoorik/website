import { describe, expect, it } from "vitest";

import { isoDay } from "./content-date";

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
