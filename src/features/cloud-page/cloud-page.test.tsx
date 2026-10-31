import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";

import AmoebaForAws, { metadata as amoebaForAwsMeta } from "@/app/amoeba-for-aws/page";
import AmoebaForAzure, { metadata as amoebaForAzureMeta } from "@/app/amoeba-for-azure/page";
import CoralForAks, { metadata as coralForAksMeta } from "@/app/coral-for-aks/page";
import CoralForEks, { metadata as coralForEksMeta } from "@/app/coral-for-eks/page";
import { amoebaDocs, keepsHash, navState, routes } from "@/config/site";
import { amoebaGuideSectionIds } from "@/content/amoeba-guide";
import {
  amoebaForAwsPage,
  amoebaForAzurePage,
  cloudPages,
  coralForAksPage,
  coralForEksPage,
  type AmoebaCloudPage,
  type CloudPageContent,
  type CoralCloudPage,
} from "@/content/cloud-pages";
import { coralGuideSectionIds } from "@/content/coral-guide";
import { howItWorksSteps } from "@/content/how-it-works";
import { findTerm, glossarySlugOf } from "@/content/learn/glossary";
import { findArticle, learnSlugOf } from "@/content/learn/published";

/**
 * The four per-cloud pages, `/coral-for-aks`, `/coral-for-eks`, `/amoeba-for-azure` and `/amoeba-for-aws`: one
 * template, four contents. What is checked is what the drafts and the mocks ask of each page as a whole: the title
 * and description, the hero, every section in the template's order under its anchor, the cards, the setup table, the
 * works-with tiles (Coral), the questions, Read more and the closing row; that every link lands; and that nothing on
 * the page is a figure or a price.
 */
let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** What `richText` prints for the drafts' markup: code bare, a link's words, straight quotes curled. */
const plain = (source: string): string =>
  source
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/'/g, "’");

interface Case {
  readonly Page: () => React.JSX.Element;
  readonly metadata: Metadata;
  readonly content: CloudPageContent;
  /** The draft's Page facts, word for word. */
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly chips: readonly string[];
  /** `main`'s children by id; a guides' frame as the ids of its sections, in brackets. */
  readonly order: readonly string[];
  /** Every h2 in order, with the anchor of the section that holds it. */
  readonly h2s: readonly (readonly [string, string])[];
  readonly cards: readonly string[];
  readonly setupRows: number;
  readonly worksWith?: readonly string[];
  /** Each question's id and its words. */
  readonly questions: readonly (readonly [string, string])[];
  readonly readMore: readonly string[];
}

const closing = (product: "coral" | "amoeba"): readonly (readonly [string, string])[] => [
  [`read-${product}`, "Read more"],
  ["assess", "Find your own number"],
  ["assess", "Talk to the builders"],
];

const coralOrder = [
  "top",
  "about",
  "how",
  "[setup]",
  "works-with",
  "install",
  "[questions]",
  "read-coral",
  "assess",
];
const amoebaOrder = ["top", "about", "how", "[setup needs questions]", "read-amoeba", "assess"];

const cases: readonly (readonly [string, Case])[] = [
  [
    "/coral-for-aks",
    {
      Page: CoralForAks,
      metadata: coralForAksMeta,
      content: coralForAksPage,
      title: "AKS cost optimization",
      description:
        "AKS cost optimization with Coral: it rebalances your cluster, sizes pods to real use, and empties spare nodes for the Cluster Autoscaler or NAP to remove.",
      eyebrow: "Coral for AKS",
      chips: ["AKS"],
      order: coralOrder,
      h2s: [
        ["about", "What Coral does on AKS"],
        ["how", "How it works on AKS"],
        ["setup", "What connect sets up on AKS"],
        ["works-with", "Works with"],
        ["install", "Install your way"],
        ["questions", "Questions about Coral on AKS"],
        ...closing("coral"),
      ],
      cards: ["Connect a cluster", "See the waste", "Optimize"],
      setupRows: 4,
      worksWith: [
        routes.coralWorksWithNodeAutoProvisioning,
        routes.coralWorksWithClusterAutoscaler,
        routes.coralWorksWithKeda,
        routes.coralWorksWithHelm,
        routes.coralWorksWithTerraform,
      ],
      questions: [
        [
          "does-coral-replace-the-cluster-autoscaler-or",
          "Does Coral replace the Cluster Autoscaler or NAP?",
        ],
        ["what-if-my-aks-cluster-has-no", "What if my AKS cluster has no autoscaler?"],
        [
          "can-coral-move-my-workloads-to-cheaper",
          "Can Coral move my workloads to cheaper machines on AKS?",
        ],
        ["what-do-i-need-on-azure-to", "What do I need on Azure to connect a cluster?"],
        ["how-do-i-remove-corals-azure-access", "How do I remove Coral’s Azure access?"],
      ],
      readMore: [
        "/coral-guide#connect-a-cluster",
        "/coral-faq",
        "/learn/reduce-kubernetes-cost",
        "/learn/cluster-autoscaler-not-scaling-down",
      ],
    },
  ],
  [
    "/coral-for-eks",
    {
      Page: CoralForEks,
      metadata: coralForEksMeta,
      content: coralForEksPage,
      title: "EKS cost optimization",
      description:
        "EKS cost optimization with Coral: it rebalances your cluster, sizes pods to real use, and empties spare nodes for Karpenter or the Cluster Autoscaler to remove.",
      eyebrow: "Coral for EKS",
      chips: ["EKS"],
      order: coralOrder,
      h2s: [
        ["about", "What Coral does on EKS"],
        ["how", "How it works on EKS"],
        ["setup", "What connect sets up on EKS"],
        ["works-with", "Works with"],
        ["install", "Install your way"],
        ["questions", "Questions about Coral on EKS"],
        ...closing("coral"),
      ],
      cards: ["Connect a cluster", "See the waste", "Optimize"],
      setupRows: 4,
      worksWith: [
        routes.coralWorksWithKarpenter,
        routes.coralWorksWithClusterAutoscaler,
        routes.coralWorksWithKeda,
        routes.coralWorksWithHelm,
        routes.coralWorksWithTerraform,
      ],
      questions: [
        [
          "does-coral-replace-karpenter-or-the-cluster",
          "Does Coral replace Karpenter or the Cluster Autoscaler?",
        ],
        ["what-if-my-eks-cluster-has-no", "What if my EKS cluster has no autoscaler?"],
        [
          "can-coral-move-my-workloads-to-cheaper",
          "Can Coral move my workloads to cheaper machines on EKS?",
        ],
        ["what-do-i-need-on-aws-to", "What do I need on AWS to connect a cluster?"],
        ["can-i-use-irsa-instead-of-eks", "Can I use IRSA instead of EKS Pod Identity?"],
      ],
      readMore: [
        "/coral-guide#connect-a-cluster",
        "/coral-faq",
        "/learn/change-eks-node-group-instance-type",
        "/learn/keda-vs-karpenter",
      ],
    },
  ],
  [
    "/amoeba-for-azure",
    {
      Page: AmoebaForAzure,
      metadata: amoebaForAzureMeta,
      content: amoebaForAzurePage,
      title: "Azure managed disk cost optimization",
      description:
        "Reduce Azure managed disk cost on Windows and Linux VMs. Amoeba moves data disks onto one pool sized to your data, then grows and shrinks it with your data.",
      eyebrow: "Amoeba for Azure",
      chips: ["Azure", "Windows", "Linux"],
      order: amoebaOrder,
      h2s: [
        ["about", "What Amoeba does on Azure"],
        ["how", "How it works on Azure"],
        ["setup", "What onboarding sets up on Azure"],
        ["needs", "What your VMs need"],
        ["questions", "Questions about Amoeba on Azure"],
        ...closing("amoeba"),
      ],
      cards: ["Onboard a Windows or Linux VM", "Move onto one pool", "Rightsize the pool"],
      setupRows: 5,
      questions: [
        ["which-azure-disks-does-amoeba-work-on", "Which Azure disks does Amoeba work on?"],
        [
          "which-azure-disk-type-does-amoebas-pool",
          "Which Azure disk type does Amoeba’s pool use?",
        ],
        ["is-there-downtime", "Is there downtime?"],
        ["do-shrinks-wait-for-me", "Do shrinks wait for me?"],
        ["how-is-the-saving-worked-out-on", "How is the saving worked out on Azure?"],
      ],
      readMore: [
        "/amoeba-guide",
        "/amoeba-faq",
        "/learn/azure-disk-cost-optimization",
        "/learn/shrink-azure-managed-disk",
      ],
    },
  ],
  [
    "/amoeba-for-aws",
    {
      Page: AmoebaForAws,
      metadata: amoebaForAwsMeta,
      content: amoebaForAwsPage,
      title: "EBS cost optimization",
      description:
        "Reduce Amazon EBS cost on EC2 instances. Amoeba moves data volumes onto one pool of gp3 volumes sized to your data, then grows and shrinks it with your data.",
      eyebrow: "Amoeba for AWS",
      chips: ["AWS", "Windows", "Linux"],
      order: amoebaOrder,
      h2s: [
        ["about", "What Amoeba does on AWS"],
        ["how", "How it works on AWS"],
        ["setup", "What onboarding sets up on AWS"],
        ["needs", "What your VMs need"],
        ["questions", "Questions about Amoeba on AWS"],
        ...closing("amoeba"),
      ],
      cards: ["Onboard a Windows or Linux VM", "Move onto one pool", "Rightsize the pool"],
      setupRows: 4,
      questions: [
        ["which-ebs-volumes-does-amoeba-work-on", "Which EBS volumes does Amoeba work on?"],
        [
          "which-ebs-volume-type-does-amoebas-pool",
          "Which EBS volume type does Amoeba’s pool use?",
        ],
        ["is-there-downtime", "Is there downtime?"],
        ["do-i-pay-for-both-sets-of", "Do I pay for both sets of volumes during the move?"],
        ["how-is-the-saving-worked-out-on", "How is the saving worked out on AWS?"],
      ],
      readMore: [
        "/amoeba-guide",
        "/amoeba-faq",
        "/learn/check-ebs-volume-usage",
        "/learn/glossary/ebs-gp3",
      ],
    },
  ],
];

function renderPage(path: string, { Page }: Case): HTMLElement {
  pathname = path;
  return render(<Page />).container;
}

describe("the four per-cloud pages", () => {
  it("are the four the footer names, in its order, each dated the day it was built", () => {
    expect(cloudPages.map((page) => page.path)).toEqual([
      routes.coralForAks,
      routes.coralForEks,
      routes.amoebaForAzure,
      routes.amoebaForAws,
    ]);
    expect(cloudPages.map((page) => page.lastUpdated)).toEqual(Array(4).fill("31 October 2026"));
    /* Product pages, not documents: the header marks nothing, and an in-page link leaves the address clean, as on
       /coral and /amoeba (their mocks carry no data-keep-hash). */
    for (const page of cloudPages) {
      expect(navState(page.path), page.path).toEqual({});
      expect(keepsHash(page.path), page.path).toBe(false);
    }
  });

  it("link the Amoeba guide inline (What your VMs need), so that link holds only while the guide is published", () => {
    /* Read more's guide and FAQ tiles are /amoeba's, behind this flag; the inline link has no flag of its own. */
    expect(amoebaDocs).toBe(true);
  });

  it("start every rule of their sheet at the page's own hero, so a visited page's sheet touches no other page", () => {
    const css = readFileSync(
      join(process.cwd(), "src", "styles", "cloud-page.css"),
      "utf8",
    ).replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = css
      .split("}")
      .filter((chunk) => chunk.includes("{"))
      .map((chunk) => chunk.slice(0, chunk.lastIndexOf("{")))
      .map((head) => head.slice(head.lastIndexOf("{") + 1).trim())
      .filter((prelude) => prelude !== "" && !prelude.startsWith("@"))
      .flatMap((prelude) => prelude.split(",").map((selector) => selector.trim()));
    expect(selectors.length).toBeGreaterThan(0);
    expect(selectors.filter((selector) => !selector.startsWith(".cl-hero "))).toEqual([]);
  });
});

describe.each(cases)("%s", (path, c) => {
  const { content } = c;
  const product = content.product;
  const name = product === "coral" ? "Coral" : "Amoeba";

  it("is titled, described and canonicalised as its draft", () => {
    expect(content.path).toBe(path);
    expect(c.metadata.title).toBe(c.title);
    expect(`${c.title} | Zoorik`.length).toBeLessThanOrEqual(60);
    expect(c.metadata.description).toBe(c.description);
    expect(c.description.length).toBeLessThanOrEqual(160);
    expect(c.metadata.alternates).toEqual({ canonical: path });
    expect(c.metadata.openGraph).toMatchObject({
      url: path,
      title: `${c.title} | Zoorik`,
      description: c.description,
    });
  });

  it("leads with the eyebrow, the search phrase, one line, Estimate your saving and the Runs on chips", () => {
    const page = renderPage(path, c);
    const hero = page.querySelector("main > header")!;
    expect(hero).toHaveClass("hero", "pp-hero", "cl-hero");
    expect(hero.id).toBe("top");
    expect(page.querySelectorAll("h1")).toHaveLength(1);
    const [eyebrow, h1, line] = [...hero.querySelectorAll(".hero-in > *")];
    expect(eyebrow).toHaveClass("hero-ey");
    expect(text(eyebrow!)).toBe(c.eyebrow);
    expect(eyebrow!.querySelector('span[translate="no"]')).toHaveTextContent(name);
    expect(h1!.tagName).toBe("H1");
    expect(text(h1!)).toBe(c.title);
    expect(line).toHaveClass("hero-sub");
    expect(text(line!)).toBe(plain(content.hero.line));
    /* One button, same tab, to this product's assessment. */
    expect(
      [...hero.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href"), a.target]),
    ).toEqual([["Estimate your saving", `/assessment?p=${product}`, ""]]);
    expect(text(hero.querySelector(".hero-chips .chips-l"))).toBe("Runs on");
    expect([...hero.querySelectorAll(".hero-chips .chip")].map(text)).toEqual(c.chips);
    /* The product hero's ground, all decorative: the glow, the turning mark and the racks photo. No film. */
    expect(hero.querySelector(":scope > .zk-glow")).toHaveAttribute("aria-hidden", "true");
    expect(hero.querySelector(":scope > svg.zk-art")).toHaveAttribute("aria-hidden", "true");
    expect(hero.querySelector(":scope > img.hero-photo")).toHaveAttribute("aria-hidden", "true");
    expect(hero.querySelector("video, .hx-mkt, .hero-film, .pp-min")).toBeNull();
  });

  it("runs in the template's order, How it works the one band, with every h2 under its anchor", () => {
    const main = renderPage(path, c).querySelector("main")!;
    /* The mock's <main> has no class. */
    expect(main.className).toBe("");
    const order = [...main.children].map((el) =>
      el.matches("div.sec.doc-body")
        ? `[${[...el.querySelectorAll(".fq-sec")].map((section) => section.id).join(" ")}]`
        : el.id,
    );
    expect(order).toEqual(c.order);
    expect([...main.querySelectorAll(".sec-band")].map((el) => el.id)).toEqual(["how"]);
    expect(
      [...main.querySelectorAll("h2")].map((h2) => [
        h2.closest("section[id], header[id]")!.id,
        text(h2),
      ]),
    ).toEqual(c.h2s);
    /* No heading level is skipped. */
    const levels = [...main.querySelectorAll("h1, h2, h3, h4")].map((h) => Number(h.tagName[1]));
    levels.forEach((level, index) => {
      if (index > 0) expect(level - levels[index - 1]!).toBeLessThanOrEqual(1);
    });
    /* What it does, its paragraphs all in view. */
    expect([...main.querySelectorAll("#about .pp-prose > p")].map(text)).toEqual(
      content.about.paragraphs.map(plain),
    );
  });

  it("keeps the product's card names, each with one line and no figure, mark or key", () => {
    const how = renderPage(path, c).querySelector("#how")!;
    const cards = [...how.querySelectorAll(".steps > .stepc")];
    expect(cards.map((card) => text(card.querySelector("h3")))).toEqual(c.cards);
    expect(cards.map((card) => text(card.querySelector(".stepn")))).toEqual(["01", "02", "03"]);
    expect(cards.map((card) => text(card.querySelector(".step-l")))).toEqual(
      content.how.steps.map((step) => plain(step.line)),
    );
    expect(how.querySelector(".hw-lead, .hw-key, .hw-leg, .hw-num, .sr-only")).toBeNull();
    /* Read from the product page's cards: 01 and 02 by name (Amoeba's 03 is the drafts' own, ledger X1), and
       Amoeba's 02 with /amoeba's note. */
    expect(c.cards.slice(0, 2)).toEqual(
      howItWorksSteps[product].slice(0, 2).map((step) => step.title),
    );
    if (product === "coral") expect(c.cards[2]).toBe(howItWorksSteps.coral[2]!.title);
    expect(cards.map((card) => text(card.querySelector(".step-note")))).toEqual(
      product === "amoeba" ? ["", "Services restart at the switch", ""] : ["", "", ""],
    );
  });

  it("draws what connect or onboarding sets up as the docs table, stacked on a phone, then what to know", () => {
    const setup = renderPage(path, c).querySelector("section.fq-sec#setup")!;
    expect(setup).toHaveAttribute("aria-labelledby", "setup-h");
    const table = setup.querySelector(".fq-sec-b.doc-prose > table.doc-tbl.nw-tbl")!;
    expect(table).not.toBeNull();
    expect(
      [...table.querySelectorAll("col")].map((col) => (col as HTMLElement).style.width),
    ).toEqual(["36%", "64%"]);
    expect([...table.querySelectorAll("thead th")].map(text)).toEqual(["What", "What it is for"]);
    const rows = [...table.querySelectorAll("tbody tr")];
    expect(rows).toHaveLength(c.setupRows);
    expect(rows.map((row) => [...row.querySelectorAll("td")].map(text))).toEqual(
      content.setup.table.rows.map((cells) => cells.map(plain)),
    );
    for (const row of rows) {
      expect([...row.querySelectorAll("td")].map((td) => td.getAttribute("data-label"))).toEqual([
        "What",
        "What it is for",
      ]);
    }
    expect([...setup.querySelectorAll(".fq-sec-b > ul > li")].map(text)).toEqual(
      content.setup.notes.map(plain),
    );
  });

  it("asks its questions in /pricing's rows: closed, with no number column", () => {
    const section = renderPage(path, c).querySelector("section.fq-sec.pr-faq#questions")!;
    expect(section.querySelector(":scope > .fq-sec-b")).not.toHaveClass("doc-prose");
    const rows = [...section.querySelectorAll(".fq-list > details.fq")];
    expect(rows.map((row) => [row.id, text(row.querySelector("summary > h3"))])).toEqual(
      c.questions,
    );
    expect(rows.map((row) => text(row.querySelector(".fq-body.doc-prose > p")))).toEqual(
      content.questions.rows.map((row) => plain(row.answer)),
    );
    for (const row of rows) {
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(".fq-n")).toBeNull();
      expect(row.querySelector("summary > svg.fq-chev")).toHaveAttribute("aria-hidden", "true");
    }
  });

  if (content.product === "amoeba") {
    const { needs } = content as AmoebaCloudPage;
    it("says what the VMs need, then where the full list is", () => {
      const section = renderPage(path, c).querySelector("section.fq-sec#needs")!;
      expect([...section.querySelectorAll(".fq-sec-b > ul > li")].map(text)).toEqual(
        needs.items.map(plain),
      );
      expect(text(section.querySelector(".fq-sec-b > p"))).toBe(plain(needs.after));
      expect(section.querySelector(".fq-sec-b > p > a")).toHaveAttribute(
        "href",
        `${routes.amoebaGuide}#before-you-start`,
      );
    });
  }

  if (content.product === "coral") {
    const { tiles } = (content as CoralCloudPage).worksWith;
    const hrefs = c.worksWith;
    it("links each works-with page that applies on its cloud, with one line", () => {
      const links = [
        ...renderPage(path, c).querySelectorAll("#works-with .dt-grid > article.dt > a.dt-a"),
      ];
      expect(links.map((a) => a.getAttribute("href"))).toEqual(hrefs);
      expect(
        links.map((a) => [text(a.querySelector(".dt-t")), text(a.querySelector(".dt-l"))]),
      ).toEqual(tiles.map((tile) => [tile.title, plain(tile.line)]));
      for (const a of links) {
        expect(a).not.toHaveAttribute("target");
        /* A line that names Coral keeps the name out of translation. */
        const line = a.querySelector(".dt-l")!;
        if (text(line).includes("Coral"))
          expect(line.querySelector("span[translate='no']")).toHaveTextContent("Coral");
      }
    });
  }

  it("ends on Read more and the closing row, for its product alone", () => {
    const page = renderPage(path, c);
    const read = page.querySelector(`section#read-${product}`)!;
    expect([...read.querySelectorAll("a.dt-a")].map((a) => a.getAttribute("href"))).toEqual(
      c.readMore,
    );
    expect(read.querySelector(`a[href="/docs#${product}"]`)).toHaveTextContent("All docs");
    const assess = page.querySelector("section#assess")!;
    expect(assess.querySelector("a.btn-ink")).toHaveAttribute("href", `/assessment?p=${product}`);
    expect(text(assess.querySelector(".as-cal p"))).toBe(
      `Thirty minutes with the people who build ${name}.`,
    );
  });

  it("links only pages and anchors that exist", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const live = new Set<string>(Object.values(routes));
    const anchors: Record<string, readonly string[]> = {
      [routes.coralGuide]: coralGuideSectionIds,
      [routes.amoebaGuide]: amoebaGuideSectionIds,
      [routes.docs]: ["coral", "amoeba"],
    };
    const own = [...main.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")!);
    expect(own.length).toBeGreaterThan(0);
    for (const href of own) {
      const [address, hash] = href.split("#") as [string, string | undefined];
      const where = address.split("?")[0]!;
      const article = learnSlugOf(where);
      const term = glossarySlugOf(where);
      if (article) expect(findArticle(article), href).toBeDefined();
      else if (term) expect(findTerm(term), href).toBeDefined();
      else expect(live.has(where), href).toBe(true);
      if (hash) expect(anchors[where], href).toContain(hash);
    }
  });

  it("prints no figure and no price, and keeps the site's words", () => {
    const main = renderPage(path, c).querySelector("main")!;
    /* Install your way is /coral's own section, checked there: its commands name files and systems. The cards'
       numerals are their order, hidden from a screen reader. */
    main.querySelector("#install")?.remove();
    for (const numeral of main.querySelectorAll(".stepn")) numeral.remove();
    const all = text(main);
    /* The only digits are in names: EC2, gp3 and Premium SSD v2. */
    for (const token of all.match(/\S*\d\S*/g) ?? []) {
      expect(token.replace(/[,.:;)]+$/, "")).toMatch(/^(EC2|gp3|v2)$/);
    }
    expect(all).not.toMatch(/[$€£₹%]|\b(USD|EUR|INR)\b/);
    /* The retired names spelled in halves, as the old names' check in app/page.test.tsx spells them, so this file does
       not itself contain what it forbids. */
    const retired = [
      ["storage", "tax"],
      ["s", "tx"],
      ["ex", "cel"],
    ].map(([head, tail]) => head! + tail!);
    expect(all).not.toMatch(
      new RegExp(`\\b(${[...retired, "bill", "cut", "lower", "online"].join("|")})\\b`, "i"),
    );
    /* Coral rebalances, on AKS and EKS: it never rightsizes and never names Windows or Linux. */
    if (product === "coral") expect(all).not.toMatch(/\b(rightsiz\w*|windows|linux)\b/i);
  });
});
