import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { footerColumns } from "@/content/footer";
import { FooterSection } from "@/features/footer/footer-section";

/**
 * The ten pages the footer drew before they were built (owner, 30 Oct 2026:
 * "just put it there"), built on 31 Oct 2026. Every line the footer draws leads
 * to a page this app builds, and each of the ten sits at the site's root.
 */

/** Every page.tsx under src/app, as its route. */
function pageRoutes(dir = "src/app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pageRoutes(path, `${base}/${name}`);
    return name === "page.tsx" ? [base === "" ? "/" : base] : [];
  });
}

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the footer's per-cloud and Works with pages", () => {
  it("lead every line to a page that is built, and put each of the ten at the site's root", () => {
    const built = new Set(pageRoutes());
    const own = footerColumns
      .flatMap((list) => list.links.map((link) => link.href))
      .filter((href) => href.startsWith("/"));
    for (const href of own) expect(built, href).toContain(href);
    /* Each product on each cloud, and every Works with line: built, and at the site's root (owner, 29 Oct 2026). */
    const ten = [
      ...footerColumns[0]!.links.filter((link) => link.named),
      ...footerColumns.find((list) => list.heading === "Works with")!.links,
    ].map((link) => link.href);
    expect(ten).toHaveLength(10);
    for (const href of ten) {
      expect(built, href).toContain(href);
      expect(href, href).toMatch(/^\/(coral|amoeba)-[a-z0-9-]+$/);
    }
  });

  it("put each product on each cloud after its product, and Works with under Products, in the first column", () => {
    const footer = render(<FooterSection />).container;
    const columns = [...footer.querySelectorAll(".foot-col")];
    expect(columns.map((col) => [...col.querySelectorAll(":scope > .foot-h")].map(text))).toEqual([
      ["Products", "Works with"],
      ["Resources"],
      ["Company"],
    ]);
    /* Works with's title follows Marketplaces, the last line of Products. */
    const works = columns[0]!.querySelectorAll(":scope > .foot-h")[1]!;
    expect(text(works.previousElementSibling)).toBe("Marketplaces");
    expect(
      [...columns[0]!.querySelectorAll<HTMLAnchorElement>(":scope > a")].map((a) => [
        text(a),
        a.getAttribute("href"),
      ]),
    ).toEqual([
      ["Coral", "/coral"],
      ["Coral for AKS", "/coral-for-aks"],
      ["Coral for EKS", "/coral-for-eks"],
      ["Amoeba", "/amoeba"],
      ["Amoeba for Azure", "/amoeba-for-azure"],
      ["Amoeba for AWS", "/amoeba-for-aws"],
      ["Assessment", "/assessment"],
      ["Pricing", "/pricing"],
      ["Marketplaces", "/marketplaces"],
      ["Cluster Autoscaler", "/coral-works-with-cluster-autoscaler"],
      ["Karpenter", "/coral-works-with-karpenter"],
      ["AKS node auto provisioning", "/coral-works-with-aks-node-auto-provisioning"],
      ["KEDA", "/coral-works-with-keda"],
      ["Helm", "/coral-works-with-helm"],
      ["Terraform", "/coral-works-with-terraform"],
    ]);
    /* The product name in each cloud page's line stays out of translation, as in "Coral guide". */
    expect(
      [...columns[0]!.querySelectorAll("a > span > span[translate='no']")].map(
        (el) => el.textContent,
      ),
    ).toEqual(["Coral", "Coral", "Amoeba", "Amoeba"]);
  });
});
