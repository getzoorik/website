import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { routes, unbuiltPages } from "@/config/site";
import { builtColumns, footerColumns, footerPlan } from "@/content/footer";
import { FooterSection } from "@/features/footer/footer-section";

/**
 * The footer's plan against the pages that exist: a planned page's line is
 * drawn once the page is built, and never before. Building a page and taking it
 * off `unbuiltPages` is all it takes (a Works with line waits for the other
 * five); the first check below fails until both are done.
 */

/** Every page.tsx under src/app, as its route. */
function pageRoutes(dir = "src/app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pageRoutes(path, `${base}/${name}`);
    return name === "page.tsx" ? [base === "" ? "/" : base] : [];
  });
}

const own = (columns: typeof footerPlan) =>
  columns
    .flatMap((list) => list.links.map((link) => link.href))
    .filter((href) => href.startsWith("/"));

const lines = (columns: ReturnType<typeof builtColumns>) =>
  columns.map((list) => [list.heading, list.links.map((link) => link.label)]);

describe("the footer's plan", () => {
  it("leads each line to a page that is built, or that is listed as not built yet, never both", () => {
    const built = new Set(pageRoutes());
    for (const href of own(footerPlan)) {
      expect(built.has(href) !== unbuiltPages.has(href), href).toBe(true);
    }
    /* Nothing is held back that the footer does not plan. */
    for (const href of unbuiltPages) expect(own(footerPlan), href).toContain(href);
  });

  it("draws no line to a page that is not built", () => {
    for (const href of own(footerColumns)) expect(unbuiltPages.has(href), href).toBe(false);
    const drawn = [...render(<FooterSection />).container.querySelectorAll("footer a")].map((a) =>
      a.getAttribute("href"),
    );
    for (const href of unbuiltPages) expect(drawn, href).not.toContain(href);
  });

  it("puts each product on each cloud after its product, and Works with under Products, once built", () => {
    const all = builtColumns(footerPlan, new Set());
    expect(lines(all).slice(0, 2)).toEqual([
      [
        "Products",
        [
          "Coral",
          "Coral for AKS",
          "Coral for EKS",
          "Amoeba",
          "Amoeba for Azure",
          "Amoeba for AWS",
          "Assessment",
          "Pricing",
          "Marketplaces",
        ],
      ],
      [
        "Works with",
        [
          "Cluster Autoscaler",
          "Karpenter",
          "AKS node auto provisioning",
          "KEDA",
          "Helm",
          "Terraform",
        ],
      ],
    ]);
    expect(all[1]).toMatchObject({ stacked: true, whole: true });
    /* Every planned page sits at the site's root (owner, 29 Oct 2026). */
    for (const href of unbuiltPages) expect(href, href).toMatch(/^\/[a-z0-9-]+$/);
  });

  it("draws a built cloud page alone, but Works with only once all six of its pages are built", () => {
    /* Fixed inputs, not today's list, so the case holds however many pages are built later. */
    const one = builtColumns(
      footerPlan,
      new Set([routes.coralForEks, routes.coralWorksWithTerraform]),
    );
    expect(one[0]!.links.map((link) => link.label).slice(0, 3)).toEqual([
      "Coral",
      "Coral for AKS",
      "Amoeba",
    ]);
    expect(one.map((list) => list.heading)).not.toContain("Works with");
    const five = builtColumns(footerPlan, new Set([routes.coralWorksWithTerraform]));
    expect(five.map((list) => list.heading)).not.toContain("Works with");
    expect(five[0]!.links).toHaveLength(9);
  });
});
