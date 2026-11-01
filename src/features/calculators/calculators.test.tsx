import { readFileSync } from "node:fs";

import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/eks-and-aks-pricing-calculator",
}));

import DiskPage, { metadata as diskMetadata } from "@/app/ebs-and-azure-disk-pricing/page";
import NodePage, { metadata as nodeMetadata } from "@/app/eks-and-aks-pricing-calculator/page";
import { routes } from "@/config/site";
import {
  calculatorsLastUpdated,
  diskCalculator,
  nodeCalculator,
  type CalculatorCopy,
} from "@/content/calculators";
import { pricesRetrieved, pricesRetrievedAt } from "@/content/cloud-prices";
import { glossaryTerms, termRoute } from "@/content/learn/glossary";
import { articleRoute, learnArticles } from "@/content/learn/published";
import { diskReferenceTables, nodeReferenceTables } from "@/features/calculators/reference-tables";

import checked from "./checked-tables.json";

/**
 * The two calculators: their metadata and cards, the reference tables against the checked drafts' (every size and
 * every tier), the calculators as the server draws them and as a reader drives them, the dated sources beside every
 * cloud price, the links, and the sheet.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/** A table's cells with the markup the drafts write (`code`) as plain text, as the drafts' tables read once printed. */
const plain = (cell: string): string => cell.replace(/`/g, "");

describe("the calculators' metadata", () => {
  it("titles, describes and canonicalises each at the site's root, with its own card", () => {
    /* Part 4's titles and descriptions (1 Nov 2026): each page carries its search. */
    expect(nodeMetadata.title).toBe("EKS pricing calculator: AKS and EKS node cost");
    expect(nodeMetadata.description).toBe(
      "EKS pricing calculator for nodes: price an EKS or AKS node pool at AWS and Azure list prices, and see how much of each node your pods can use.",
    );
    expect(nodeMetadata.alternates).toEqual({ canonical: "/eks-and-aks-pricing-calculator" });
    expect(nodeMetadata.openGraph).toMatchObject({
      url: "/eks-and-aks-pricing-calculator",
      title: "EKS pricing calculator: AKS and EKS node cost | Zoorik",
      images: [{ url: "/og/pages/eks-and-aks-pricing-calculator.png" }],
    });
    expect(diskMetadata.title).toBe("EBS pricing and Azure disk pricing calculator");
    expect(diskMetadata.description).toBe(
      "EBS pricing and Azure disk pricing in one calculator: see what an EBS volume or a managed disk costs a month at list price, and what its empty space costs.",
    );
    expect(diskMetadata.alternates).toEqual({ canonical: "/ebs-and-azure-disk-pricing" });
    expect(diskMetadata.openGraph).toMatchObject({
      title: "EBS pricing and Azure disk pricing calculator | Zoorik",
      images: [{ url: "/og/pages/ebs-and-azure-disk-pricing.png" }],
    });
    for (const meta of [nodeMetadata, diskMetadata]) {
      expect(`${String(meta.title)} | Zoorik`.length).toBeLessThanOrEqual(60);
      expect(String(meta.description).length).toBeLessThanOrEqual(158);
    }
    expect([nodeCalculator.tile.href, diskCalculator.tile.href]).toEqual([
      routes.eksAndAksPricingCalculator,
      routes.ebsAndAzureDiskPricing,
    ]);
  });

  it("dates both by the day their content last changed, their prices still those of 30 October", () => {
    expect(pricesRetrievedAt.startsWith("2026-10-30")).toBe(true);
    expect(pricesRetrieved).toBe("30 October 2026");
    /* Part 4's titles, h1s, descriptions and first paragraphs, 1 Nov 2026. */
    expect(calculatorsLastUpdated).toBe("1 November 2026");
  });

  it("opens each page on Part 4's h1 and first paragraph", () => {
    expect(nodeCalculator.hero.title).toBe(
      "EKS pricing calculator: what an EKS or AKS node costs a month",
    );
    expect(nodeCalculator.intro).toEqual([
      "EKS pricing is an hourly fee for each cluster, plus the EC2 instances and other resources your worker nodes use. This calculator prices the nodes, on EKS and on AKS. A node costs its hourly list price for every hour it runs, and here a month is 730 hours.",
      "Your pods can't use all of it. Kubernetes keeps some CPU and memory on every node for itself. The results show both: what a node costs, and what your pods get.",
    ]);
    expect(diskCalculator.hero.title).toBe("AWS EBS pricing and Azure disk pricing calculator");
    expect(diskCalculator.intro[0]).toBe(
      "Under AWS EBS pricing and Azure disk pricing, you pay for a disk's full size every month, however little data it holds. AWS prices an EBS volume by the GB you provision. Azure prices a Premium SSD or Standard SSD at the smallest size tier that holds it.",
    );
    /* The node page's first sentence rests on AWS's EKS pricing page, which its Sources names. */
    const sources = nodeCalculator.frame.find((section) => section.title === "Sources")!;
    expect(JSON.stringify(sources.blocks)).toContain(
      "The EKS cluster fee from AWS's [Amazon EKS pricing](https://aws.amazon.com/eks/pricing/), checked 1 November 2026.",
    );
  });
});

describe("the reference tables", () => {
  it("print every size's monthly price and what pods can use, as the checked node draft does", () => {
    const tables = nodeReferenceTables();
    expect(tables.map((table) => table.title)).toEqual(checked.node.map((table) => table.title));
    tables.forEach((table, index) => {
      expect(table.head).toEqual(checked.node[index]!.head);
      expect(table.rows.map((row) => row.map(plain))).toEqual(
        checked.node[index]!.rows.map((row) => row.map(plain)),
      );
    });
  });

  it("carry the note EKS's Not shown cells point to, under its table, whichever cloud the calculator shows", () => {
    const eks = nodeReferenceTables().find((table) => table.title.startsWith("AWS (EKS): what"))!;
    expect(eks.rows.every((row) => row[3] === "Not shown (see the note)")).toBe(true);
    expect(eks.note).toBe(
      "**Memory pods can use: not shown.** AWS works this out from the memory the node reports, which is less than the instance's memory. In AWS's example, an 8 GB instance reports 7,748 MiB. AWS doesn't publish that figure for each instance type.",
    );
    expect(nodeReferenceTables().filter((table) => table.note)).toEqual([eks]);
    const root = render(<NodePage />).container;
    const note = root.querySelector("#list-prices .fq-body table:last-of-type + p");
    expect(text(note)).toMatch(/^Memory pods can use: not shown\. .* for each instance type\.$/);
  });

  it("print every Azure tier and both EBS types, as the checked disk draft does", () => {
    const tables = diskReferenceTables();
    expect(tables.map((table) => table.title)).toEqual(checked.disk.map((table) => table.title));
    tables.forEach((table, index) => {
      expect(table.head).toEqual(checked.disk[index]!.head);
      expect(table.rows).toEqual(checked.disk[index]!.rows);
    });
  });
});

describe("/eks-and-aks-pricing-calculator", () => {
  it("draws the calculator at its defaults on the server: three Standard_D4s_v5 nodes in East US", () => {
    const root = render(<NodePage />).container;
    const result = root.querySelector("#calc-result")!;
    expect(text(result.querySelector("#o-total"))).toBe("$420.48");
    expect(text(result.querySelector("#o-node"))).toBe("$140.16 a month");
    expect(text(result.querySelector("#o-hour"))).toBe("$0.192 an hour");
    expect(text(result.querySelector("#o-cpu"))).toBe("3.86 of 4 vCPUs (96.5%)");
    expect(text(result.querySelector("#o-mem"))).toBe("11.9 of 16 GiB (74.4%)");
    expect(text(result.querySelector("#o-keep"))).toBe("0.14 vCPU and 4.1 GiB");
    expect(text(result.querySelector("#o-pods"))).toBe("250 pods");
    expect(text(result.querySelector("#o-all-h"))).toBe("Across all 3 nodes");
    expect(text(result.querySelector("#o-tc"))).toBe("11.58 vCPUs");
    expect(text(result.querySelector("#o-tpm"))).toBe("35.7 GiB");
    expect(result.querySelector("#o-eks")).toHaveAttribute("hidden");
    expect(result.querySelector("#calc-stop")).toHaveAttribute("hidden");
    expect(root.querySelector("select#region")).toHaveValue("eastus");
    expect(root.querySelector("select#size")).toHaveValue("Standard_D4s_v5");
    expect(
      [...root.querySelectorAll("select#size optgroup")].map((g) => g.getAttribute("label")),
    ).toEqual(["General purpose", "Compute optimized", "Memory optimized"]);
  });

  it("shows a message in place of every figure for a blank, zero or part node count, and on EKS the note", () => {
    const root = render(<NodePage />).container;
    const nodes = root.querySelector<HTMLInputElement>("#nodes")!;
    /* "1e308" is a whole number to JavaScript, but its cost is Infinity: a message, never "$∞". */
    for (const value of ["", "0", "1.5", "1e308"]) {
      fireEvent.change(nodes, { target: { value } });
      expect(root.querySelector(".calc-ok")).toHaveAttribute("hidden");
      expect(text(root.querySelector("#calc-stop"))).toBe(
        "Enter a whole number of nodes, 1 or more.",
      );
      expect(root.querySelector("#nodes-m")).not.toHaveAttribute("hidden");
      expect(nodes).toHaveAttribute("aria-invalid", "true");
    }
    /* A large count is grouped in the heading as in every figure. */
    fireEvent.change(nodes, { target: { value: "5000" } });
    expect(text(root.querySelector("#o-all-h"))).toBe("Across all 5,000 nodes");
    expect(text(root.querySelector("#o-total"))).toBe("$700,800.00");
    fireEvent.change(nodes, { target: { value: "2" } });
    fireEvent.click(within(root.querySelector("[data-sw=cloud]")!).getByText("AWS (EKS)"));
    expect(root.querySelector("#more")).toHaveAttribute("hidden");
    expect(root.querySelector("select#size")).toHaveValue("m6i.xlarge");
    expect(root.querySelector("#o-mem-row")).toHaveAttribute("hidden");
    expect(text(root.querySelector("#o-eks"))).toBe(
      "Memory pods can use: not shown. AWS works this out from the memory the node reports, which is less than the instance’s memory. In AWS’s example, an 8 GB instance reports 7,748 MiB. AWS doesn’t publish that figure for each instance type. From what the node reports, Kubernetes keeps 0.97 GiB for itself.",
    );
    expect(text(root.querySelector("#o-tpm"))).toBe("Not shown (see the note)");
    expect(text(root.querySelector("#o-total"))).toBe("$280.32");
  });

  it("keeps the outline in order and offers digits for whole numbers", () => {
    const root = render(<NodePage />).container;
    const levels = [...root.querySelectorAll("main h1, main h2, main h3, main h4")].map((h) =>
      Number(h.tagName[1]),
    );
    levels.forEach((level, index) => {
      if (index > 0) expect(level).toBeLessThanOrEqual(levels[index - 1]! + 1);
    });
    const section = root.querySelector("#calculator")!;
    expect(section).toHaveAttribute("aria-labelledby", "calculator-h");
    expect(text(root.querySelector("#calculator-h"))).toBe("Calculator");
    expect(root.querySelector("#nodes")).toHaveAttribute("inputmode", "numeric");
    expect(root.querySelector("#maxpods")).toHaveAttribute("inputmode", "numeric");
  });

  it("opens More settings on a max pods message", () => {
    const root = render(<NodePage />).container;
    const more = root.querySelector<HTMLDetailsElement>("#more")!;
    expect(more.open).toBe(false);
    fireEvent.change(root.querySelector("#maxpods")!, { target: { value: "300" } });
    expect(more.open).toBe(true);
    expect(text(root.querySelector("#maxpods-m"))).toBe("AKS allows 10 to 250 pods per node.");
  });

  it("names its formula and its prices' sources and day under the calculator, and in Sources", () => {
    const root = render(<NodePage />).container;
    expect(text(root.querySelector("#calculator .calc-src"))).toBe(
      "Monthly cost = the hourly list price × 730 hours × the number of nodes. Prices from the Azure Retail Prices API (opens in a new tab) and the AWS Price List for Amazon EC2 (opens in a new tab), retrieved 30 October 2026.",
    );
    expect(text(root.querySelector("#sources h3"))).toBe(
      "List prices and reserves, 30 October 2026",
    );
    expect(root.querySelector("#sources details#list-prices")).not.toHaveAttribute("open");
    expect(root.querySelectorAll("#list-prices table.doc-tbl")).toHaveLength(4);
  });

  it("ends on Coral's closing row, its line over the cards", () => {
    const row = render(<NodePage />).container.querySelector("main > section#assess")!;
    expect(text(row.querySelector("p.calc-close"))).toBe(
      nodeCalculator.close.replace("cluster's", "cluster’s"),
    );
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=coral");
  });
});

describe("/ebs-and-azure-disk-pricing", () => {
  it("draws the calculator at its defaults on the server: 200 GiB Standard SSD in East US, 50 GiB used", () => {
    const root = render(<DiskPage />).container;
    const result = root.querySelector("#calc-result")!;
    expect(text(result.querySelector("#o-cost"))).toBe("$19.20");
    expect(text(result.querySelector("#o-ecost"))).toBe("$11.25");
    expect(text(result.querySelector("#o-tier"))).toBe("E15 · 256 GiB");
    expect(text(result.querySelector("#o-empty"))).toBe("150 GiB (75%)");
    expect(text(result.querySelector("#o-up"))).toBe("56 GiB, $4.20 a month");
    expect(text(result.querySelector("#o-upline"))).toBe(
      "Azure prices this disk as E15 (256 GiB). The tier is 56 GiB larger than the disk. That part of the price is $4.20 a month.",
    );
    /* The size is whole GiB, the used space can carry a fraction. */
    expect(root.querySelector("#size")).toHaveAttribute("inputmode", "numeric");
    expect(root.querySelector("#used")).toHaveAttribute("inputmode", "decimal");
  });

  it("prices EBS per GB, clamps the empty space at 0 and says why, and shows each range's message", () => {
    const root = render(<DiskPage />).container;
    fireEvent.click(within(root.querySelector("[data-sw=cloud]")!).getByText("AWS"));
    expect(text(root.querySelector("#o-cost"))).toBe("$16.00");
    expect(text(root.querySelector("#o-price"))).toBe("$0.08 per GB-month");
    expect(root.querySelector("#o-tier-row")).toHaveAttribute("hidden");
    expect(root.querySelector("#o-up-row")).toHaveAttribute("hidden");
    expect(text(root.querySelector("#size-h"))).toBe("AWS prices every GB you provision.");
    fireEvent.change(root.querySelector("#used")!, { target: { value: "250" } });
    expect(text(root.querySelector("#o-empty"))).toBe("0 GiB (0%)");
    expect(text(root.querySelector("#o-ecost"))).toBe("$0.00");
    expect(text(root.querySelector("#used-m"))).toBe(diskCalculator.overLine);
    fireEvent.click(within(root.querySelector("[data-sw=type]")!).getByText("gp2"));
    fireEvent.change(root.querySelector("#size")!, { target: { value: "16385" } });
    expect(text(root.querySelector("#calc-stop"))).toBe(
      "A gp2 volume can be 1 GiB to 16 TiB (16,384 GiB).",
    );
    fireEvent.change(root.querySelector("#size")!, { target: { value: "" } });
    expect(text(root.querySelector("#calc-stop"))).toBe(
      "Enter the disk size as a whole number of GiB.",
    );
  });

  it("ends on Amoeba's closing row", () => {
    const row = render(<DiskPage />).container.querySelector("main > section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=amoeba");
  });
});

describe("both calculators", () => {
  it("link only published Learn articles and glossary terms", () => {
    const live = new Set<string>([
      ...learnArticles.map(articleRoute),
      ...glossaryTerms.map(termRoute),
    ]);
    const copies: readonly CalculatorCopy[] = [nodeCalculator, diskCalculator];
    const hrefs = copies
      .flatMap((copy) => copy.frame.flatMap((section) => section.related ?? []))
      .map((link) => link.href);
    hrefs.push(...[...diskCalculator.help.used.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]!));
    expect(hrefs).toHaveLength(10);
    expect(hrefs.filter((href) => !live.has(href))).toEqual([]);
  });

  it("print a cloud's list price only beside its source and the day it was read", () => {
    for (const Page of [NodePage, DiskPage]) {
      const main = render(<Page />).container.querySelector("main")!;
      expect(text(main)).toContain("retrieved 30 October 2026");
      for (const href of [
        "https://prices.azure.com/api/retail/prices",
        "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json",
      ]) {
        /* Not by the section's id: both pages are in this document, and jsdom finds an id's first element. */
        expect(main.querySelector(`.calc-src a[href="${href}"]`)).not.toBeNull();
      }
    }
  });
});

describe("the calculators' sheet", () => {
  const css = readFileSync("src/styles/calculators.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  it("starts every selector at a class only the calculators draw, or at their own section", () => {
    const selectors: string[] = [];
    for (const chunk of css.split("}")) {
      if (!chunk.includes("{")) continue;
      const head = chunk.slice(0, chunk.lastIndexOf("{"));
      const prelude = head.slice(head.lastIndexOf("{") + 1).trim();
      if (!prelude || prelude.startsWith("@")) continue;
      selectors.push(...prelude.split(",").map((part) => part.trim()));
    }
    expect(selectors.length).toBeGreaterThan(50);
    expect(selectors.filter((s) => !/^(\.calc-|#calculator ~ \.doc-body )/.test(s))).toEqual([]);
  });
});
