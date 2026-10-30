import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The footer as it will be drawn once every planned page is built: nothing held back. */
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/site")>()),
  unbuiltPages: new Set<string>(),
}));

import { FooterSection } from "@/features/footer/footer-section";

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the footer, with every planned page built", () => {
  it("draws Works with under Products in the first column, and still three columns", () => {
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
