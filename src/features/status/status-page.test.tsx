import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/status",
}));

import Status, { metadata } from "@/app/status/page";
import { statusUpdated } from "@/content/status";

/** `/status`: the metadata, the overall line, both products' rows, and what a static page must never print. */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const page = () => render(<Status />).container;

describe("/status", () => {
  it("is titled and canonicalised at its address", () => {
    expect(metadata.title).toBe("Status");
    expect(metadata.alternates?.canonical).toBe("/status");
  });

  it("opens on the h1, then the overall line and the day it was updated", () => {
    const root = page();
    expect(text(root.querySelector("h1"))).toBe("Zoorik status");
    expect(text(root.querySelector(".st-all h2"))).toBe("All systems operational");
    expect(text(root.querySelector(".st-all .doc-updated"))).toBe(statusUpdated);
  });

  it("lists each product's console and features, every one in words and operational", () => {
    const root = page();
    const rows = (id: string) =>
      [...root.querySelectorAll(`section[aria-labelledby="${id}-h"] li`)].map((row) =>
        [...row.children].map(text),
      );
    expect(rows("coral").map(([name]) => name)).toEqual([
      "Console",
      "Cost monitoring",
      "Recommendations",
      "Workload optimization",
      "Node optimization",
      "Rebalancing",
      "Live migration",
    ]);
    expect(rows("amoeba").map(([name]) => name)).toEqual([
      "Console",
      "Monitoring",
      "Savings insights",
      "Rightsizing",
    ]);
    expect(new Set([...rows("coral"), ...rows("amoeba")].map(([, state]) => state))).toEqual(
      new Set(["Operational"]),
    );
  });

  it("gives a way to report a problem", () => {
    expect(page().querySelector('.st-help a[href^="mailto:founders@zoorik.com"]')).not.toBeNull();
  });

  it("prints no measured figure: a static page has none", () => {
    expect(text(page().querySelector(".st-col"))).not.toMatch(/%|uptime|\bms\b|incident/i);
  });
});
