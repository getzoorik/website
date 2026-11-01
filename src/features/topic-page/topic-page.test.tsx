import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";

import AwsCostOptimization, {
  metadata as awsCostOptimizationMeta,
} from "@/app/aws-cost-optimization/page";
import AzureCostOptimization, {
  metadata as azureCostOptimizationMeta,
} from "@/app/azure-cost-optimization/page";
import { comparePath, keepsHash, navState, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { versusPages, versusRoute } from "@/content/learn-compare";
import { marketGroups } from "@/content/learn-market";
import { findTerm, glossarySlugOf } from "@/content/learn/glossary";
import { findArticle, isLiveHref, learnSlugOf } from "@/content/learn/published";
import {
  awsCostOptimizationPage,
  azureCostOptimizationPage,
  topicPages,
  type TopicPage,
} from "@/content/topic-pages";

/**
 * The two Topic pages, `/azure-cost-optimization` and `/aws-cost-optimization`: one template, two contents, word for
 * word from their checked drafts and drawn as their mocks draw them. What is checked is what the drafts and the mocks
 * ask of each page as a whole: the title and description, the card, the hero, the Learn frame and its chips, every
 * section's blocks, the band of Coral and Amoeba cards, the questions, Read more and the closing row; that every link
 * lands, a Learn page not published yet set as its words; the cross-links to the library's versus pages; and that the
 * page keeps the site's words and names no competitor.
 */
let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** What `richText` prints for the drafts' markup: code bare, a link's words, bold bare, straight quotes curled. */
const plain = (source: string): string =>
  source
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/'/g, "’")
    .replace(/\s+/g, " ")
    .trim();

/** A block's element, by its kind. */
const blockTag = { p: "P", ul: "UL", ol: "OL", h3: "H3", table: "TABLE", links: "ASIDE" } as const;

interface Case {
  readonly Page: () => React.JSX.Element;
  readonly metadata: Metadata;
  readonly content: TopicPage;
  /** The draft's Page facts, word for word. */
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  /** The card's file in public/og/pages. */
  readonly card: string;
  /** The sections' anchors, in order, as the mock writes them. */
  readonly sections: readonly string[];
  /** Each question's id, as the mock writes it. */
  readonly questions: readonly string[];
  /** The cards' links, Coral's then Amoeba's. */
  readonly cardLinks: readonly [string, string];
  /** The versus page the page links on the cloud's own tool's name. */
  readonly versus: string;
}

const cases: readonly (readonly [string, Case])[] = [
  [
    "/azure-cost-optimization",
    {
      Page: AzureCostOptimization,
      metadata: azureCostOptimizationMeta,
      content: azureCostOptimizationPage,
      title: "Azure cost optimization: how to reduce Azure costs",
      description:
        "Azure cost optimization, line by line: how to reduce Azure costs on VMs, managed disks, AKS and data transfer, and where Microsoft Cost Management fits.",
      eyebrow: "Azure",
      card: "azure-cost-optimization",
      sections: [
        "azure-cost-management",
        "azure-cost-optimization-by-line",
        "azure-vm-cost",
        "azure-disk-cost",
        "aks-cost",
        "azure-data-transfer-cost",
        "reservations-and-savings-plans",
      ],
      questions: [
        "what-is-azure-cost-management",
        "where-do-you-start-to-reduce-azure",
        "reservation-or-savings-plan-which-should-you",
        "is-data-transfer-free-inside-azure",
        "does-zoorik-replace-microsoft-cost-management-or",
      ],
      cardLinks: [routes.aksCostOptimization, routes.azureManagedDiskCostOptimization],
      versus: `${comparePath}/coral-vs-azure-advisor`,
    },
  ],
  [
    "/aws-cost-optimization",
    {
      Page: AwsCostOptimization,
      metadata: awsCostOptimizationMeta,
      content: awsCostOptimizationPage,
      title: "AWS cost optimization: how to reduce AWS costs",
      description:
        "AWS cost optimization, line by line: how to reduce AWS costs on EC2, EBS, EKS, S3 and data transfer, and when to buy Savings Plans.",
      eyebrow: "AWS",
      card: "aws-cost-optimization",
      sections: awsCostOptimizationPage.sections.map((section) => section.id),
      questions: [
        "where-do-you-start-to-reduce-aws",
        "does-a-stopped-ec2-instance-still-cost",
        "can-an-ebs-volume-shrink",
        "savings-plan-or-spot-which-should-you",
        "does-zoorik-replace-cost-explorer-or-aws",
      ],
      cardLinks: [routes.eksCostOptimization, routes.ebsCostOptimization],
      versus: `${comparePath}/coral-vs-aws-compute-optimizer`,
    },
  ],
];

function renderPage(path: string, { Page }: Case): HTMLElement {
  pathname = path;
  return render(<Page />).container;
}

describe("the two Topic pages", () => {
  it("are Azure's then AWS's, each dated the day it was built", () => {
    expect(topicPages.map((page) => page.path)).toEqual([
      routes.azureCostOptimization,
      routes.awsCostOptimization,
    ]);
    expect(topicPages.map((page) => page.lastUpdated)).toEqual(Array(2).fill("1 November 2026"));
    /* Built in the article frame: the header marks nothing, and an in-page link keeps its address, as the mocks'
       `data-keep-hash` asks. */
    for (const page of topicPages) {
      expect(navState(page.path), page.path).toEqual({});
      expect(keepsHash(page.path), page.path).toBe(true);
    }
  });

  it("start every rule of their sheet at the page's own hero, so a visited page's sheet touches no other page", () => {
    const css = readFileSync(
      join(process.cwd(), "src", "styles", "topic-page.css"),
      "utf8",
    ).replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = css
      .split("}")
      .filter((chunk) => chunk.includes("{"))
      .map((chunk) => chunk.slice(0, chunk.lastIndexOf("{")))
      .map((head) => head.slice(head.lastIndexOf("{") + 1).trim())
      .filter((prelude) => prelude !== "" && !prelude.startsWith("@"))
      .flatMap((prelude) => prelude.split(",").map((selector) => selector.trim()));
    expect(selectors.length).toBeGreaterThan(10);
    expect(selectors.filter((selector) => !selector.startsWith(".tp-hero "))).toEqual([]);
  });
});

describe.each(cases)("%s", (path, c) => {
  const { content } = c;

  it("is titled, described, carded and canonicalised as its draft", () => {
    expect(content.path).toBe(path);
    expect(c.metadata.title).toBe(c.title);
    expect(content.meta.title).toBe(c.title);
    expect(`${c.title} | Zoorik`.length).toBeLessThanOrEqual(60);
    expect(c.metadata.description).toBe(c.description);
    expect(c.description.length).toBeLessThanOrEqual(158);
    expect(c.metadata.alternates).toEqual({ canonical: path });
    const card = { url: `/og/pages/${c.card}.png`, alt: `Zoorik. ${c.title}.` };
    expect(pageCards[path]).toMatchObject(card);
    expect(c.metadata.openGraph).toMatchObject({
      url: path,
      title: `${c.title} | Zoorik`,
      description: c.description,
      images: [card],
    });
  });

  it("carries its structured data: a web page under the home page, by its h1, about neither product alone", () => {
    const page = renderPage(path, c);
    const blocks = page.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0]!.textContent!);
    expect(data).toEqual(JSON.parse(JSON.stringify(pageStructuredData(path))));
    const graph = data["@graph"] as readonly Record<string, unknown>[];
    const webPage = graph.find((node) => node["@type"] === "WebPage")!;
    expect(webPage).toMatchObject({ name: `${c.title} | Zoorik`, description: c.description });
    expect(webPage.about).toBeUndefined();
    const trail = graph.find((node) => node["@type"] === "BreadcrumbList")!;
    expect(
      (trail.itemListElement as readonly Record<string, unknown>[]).map((step) => step.name),
    ).toEqual(["Zoorik", c.title]);
  });

  it("leads with the cloud, the search phrase, the short answer and Estimate your saving, with no chips", () => {
    const page = renderPage(path, c);
    const hero = page.querySelector("main > header")!;
    expect(hero).toHaveClass("hero", "pp-hero", "cl-hero", "tp-hero");
    expect(hero.id).toBe("top");
    expect(page.querySelectorAll("h1")).toHaveLength(1);
    const [eyebrow, h1, line, cta, ...rest] = [...hero.querySelectorAll(".hero-in > *")];
    expect(rest).toEqual([]);
    expect(eyebrow).toHaveClass("hero-ey");
    expect(text(eyebrow!)).toBe(c.eyebrow);
    expect(h1!.tagName).toBe("H1");
    expect(text(h1!)).toBe(c.title);
    expect(line).toHaveClass("hero-sub");
    expect(text(line!)).toBe(plain(content.hero.line));
    expect(cta).toHaveClass("hero-cta");
    /* One button, same tab, to the assessment with no product preset: the page names both. */
    expect(
      [...hero.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href"), a.target]),
    ).toEqual([["Estimate your saving", "/assessment", ""]]);
    expect(hero.querySelector(".hero-chips, .chip")).toBeNull();
    /* The cloud pages' ground, all decorative: the glow, the turning mark and the racks photo. */
    expect(hero.querySelector(":scope > .zk-glow")).toHaveAttribute("aria-hidden", "true");
    expect(hero.querySelector(":scope > svg.zk-art")).toHaveAttribute("aria-hidden", "true");
    expect(hero.querySelector(":scope > img.hero-photo")).toHaveAttribute("aria-hidden", "true");
  });

  it("runs in the template's order, the band the one band, with every h2 under its anchor", () => {
    const main = renderPage(path, c).querySelector("main")!;
    expect(main.className).toBe("");
    const order = [...main.children].map((el) =>
      el.matches("div.sec.doc-body")
        ? `[${[...el.querySelectorAll(".fq-sec")].map((section) => section.id).join(" ")}]`
        : el.id,
    );
    expect(order).toEqual([
      "top",
      `[${c.sections.join(" ")}]`,
      "coral-and-amoeba",
      "[questions]",
      "read-more",
      "assess",
    ]);
    expect(content.sections.map((section) => section.id)).toEqual(c.sections);
    expect([...main.querySelectorAll(".sec-band")].map((el) => el.id)).toEqual([
      "coral-and-amoeba",
    ]);
    expect(
      [...main.querySelectorAll("h2")].map((h2) => [
        h2.closest("section[id], header[id]")!.id,
        text(h2),
      ]),
    ).toEqual([
      ...content.sections.map((section) => [section.id, plain(section.title)]),
      ["coral-and-amoeba", "Where Coral and Amoeba fit"],
      ["questions", plain(content.questions.title)],
      ["read-more", "Read more"],
      ["assess", "Find your own number"],
      ["assess", "Talk to the builders"],
    ]);
    /* No heading level is skipped. */
    const levels = [...main.querySelectorAll("h1, h2, h3, h4")].map((h) => Number(h.tagName[1]));
    levels.forEach((level, index) => {
      if (index > 0) expect(level - levels[index - 1]!).toBeLessThanOrEqual(1);
    });
  });

  it("names every part of the page in one row of chips on a phone, the band and the questions too", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const rows = main.querySelectorAll("nav.fq-chips");
    expect(rows).toHaveLength(1);
    expect(rows[0]!.closest(".doc-body")).toBe(main.querySelector("div.doc-body"));
    expect(
      [...rows[0]!.querySelectorAll("a")].map((a) => [a.getAttribute("href"), text(a)]),
    ).toEqual([
      ...content.sections.map((section) => [`#${section.id}`, plain(section.title)]),
      ["#coral-and-amoeba", "Where Coral and Amoeba fit"],
      ["#questions", plain(content.questions.title)],
    ]);
    /* Both frames are the article frame. */
    for (const frame of main.querySelectorAll("div.doc-body"))
      expect(frame.querySelector(":scope > .wrap > article")).toHaveClass(
        "doc-main",
        "fq-main",
        "ar-frame",
      );
  });

  it("sets each section's text open, block for block as its draft", () => {
    const main = renderPage(path, c).querySelector("main")!;
    for (const section of content.sections) {
      const el = main.querySelector(`section.fq-sec#${section.id}`)!;
      expect(el).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      const body = el.querySelector(":scope > .fq-sec-b.doc-prose")!;
      expect(
        [...body.children].map((child) => child.tagName),
        section.id,
      ).toEqual(section.blocks.map((block) => blockTag[block.kind]));
      section.blocks.forEach((block, index) => {
        const child = body.children[index]!;
        if (block.kind === "p" || block.kind === "h3")
          expect(text(child), section.id).toBe(plain(block.text));
        if (block.kind === "h3" && block.id) expect(child.id).toBe(block.id);
        if (block.kind === "ul" || block.kind === "ol")
          expect([...child.children].map(text), section.id).toEqual(block.items.map(plain));
        if (block.kind === "table") {
          expect(child).toHaveClass("doc-tbl", "nw-tbl");
          expect([...child.querySelectorAll("thead th")].map(text)).toEqual(block.head);
          expect(
            [...child.querySelectorAll("col")].map((col) => (col as HTMLElement).style.width),
          ).toEqual(block.widths);
          expect(
            [...child.querySelectorAll("tbody tr")].map((row) =>
              [...row.querySelectorAll("td")].map(text),
            ),
          ).toEqual(block.rows.map((cells) => cells.map(plain)));
          for (const row of child.querySelectorAll("tbody tr"))
            expect(
              [...row.querySelectorAll("td")].map((td) => td.getAttribute("data-label")),
            ).toEqual(block.head);
        }
        if (block.kind === "links") {
          expect(child).toHaveClass("doc-call", "doc-help");
          expect(text(child.querySelector(".doc-call-t"))).toBe(block.title);
          const links = [...child.querySelectorAll(".doc-help-a > a.alink")];
          expect(links.map((a) => a.getAttribute("href"))).toEqual(
            block.links.map((link) => link.href),
          );
          for (const a of links) {
            expect(a).toHaveAttribute("target", "_blank");
            expect(a).toHaveAttribute("rel", "noopener noreferrer");
          }
        }
      });
    }
  });

  it("fits Coral and Amoeba in the one band: two cards, each to its page on this cloud, then the lines under them", () => {
    const band = renderPage(path, c).querySelector("section.sec.sec-band#coral-and-amoeba")!;
    expect(band).toHaveAttribute("aria-labelledby", "coral-and-amoeba-h");
    expect(text(band.querySelector(".sec-head > h2#coral-and-amoeba-h"))).toBe(
      "Where Coral and Amoeba fit",
    );
    expect(text(band.querySelector(".sec-head > p"))).toBe(plain(content.products.lead));
    const cards = [...band.querySelectorAll(".tp-prods > article.pl")];
    expect(cards).toHaveLength(2);
    cards.forEach((card, index) => {
      const data = content.products.cards[index]!;
      expect(data.product).toBe(index === 0 ? "coral" : "amoeba");
      expect(card.querySelector(".tp-ph > svg")).toHaveAttribute("aria-hidden", "true");
      expect(text(card.querySelector(".tp-ph > h3"))).toBe(plain(data.title));
      expect([...card.querySelectorAll(":scope > p")].map(text)).toEqual(
        data.paragraphs.map(plain),
      );
      /* The product's name opens its page; the card ends on its page on this cloud. */
      expect(card.querySelector(":scope > p a")).toHaveAttribute("href", `/${data.product}`);
      const link = card.querySelector(":scope > a.alink")!;
      expect(link).toHaveAttribute("href", c.cardLinks[index]);
      expect(text(link)).toBe(plain(data.link.label));
    });
    expect([...band.querySelectorAll(".tp-prods + .pp-prose > p")].map(text)).toEqual(
      content.products.notes.map(plain),
    );
    /* The last line opens the free assessment, with no product preset. */
    expect(band.querySelector(".pp-prose > p:last-child > a")).toHaveAttribute(
      "href",
      "/assessment",
    );
  });

  it("asks its questions in /pricing's rows, in the frame again: closed, with no number column", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const section = main.querySelector("section.fq-sec.pr-faq#questions")!;
    expect(section.closest("div.doc-body")!.querySelector("nav.fq-chips")).toBeNull();
    expect(section.querySelector(":scope > .fq-sec-b")).not.toHaveClass("doc-prose");
    const rows = [...section.querySelectorAll(".fq-list > details.fq")];
    expect(rows.map((row) => row.id)).toEqual(c.questions);
    expect(rows.map((row) => text(row.querySelector("summary > h3")))).toEqual(
      content.questions.rows.map((row) => plain(row.question)),
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

  it("ends on Read more, six tiles, then the closing row naming both products", () => {
    const page = renderPage(path, c);
    const read = page.querySelector("main > section.sec#read-more")!;
    expect(text(read.querySelector(".sec-hrow > h2#read-more-h"))).toBe("Read more");
    const tiles = [...read.querySelectorAll(".dt-grid > article.dt")];
    expect(tiles).toHaveLength(6);
    expect(
      tiles.map((tile) => [
        text(tile.querySelector(".dt-t")),
        tile.querySelector("a.dt-a")?.getAttribute("href") ?? null,
        text(tile.querySelector(".dt-l")),
      ]),
    ).toEqual(
      content.readMore.tiles.map((tile) => [
        plain(tile.title),
        isLiveHref(tile.href) ? tile.href : null,
        plain(tile.line),
      ]),
    );
    const assess = page.querySelector("section#assess")!;
    expect(assess.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment");
    expect(text(assess.querySelector(".as-cal p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
  });

  it("links the cloud's own tool to its versus page in the library, and that page links back", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const links = [...main.querySelectorAll(`a[href^="${comparePath}/"]`)];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([c.versus]);
    const versus = versusPages.find((page) => versusRoute(page) === c.versus)!;
    const back = [
      ...versus.sections!.flatMap((section) => section.blocks),
      ...(versus.readMore ?? []),
    ];
    expect(JSON.stringify(back)).toContain(`](${path})`);
  });

  it("links only pages that exist, a Learn page not published yet set as its words", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const live = new Set<string>(Object.values(routes));
    const own = [...main.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")!);
    expect(own.length).toBeGreaterThan(10);
    for (const href of own) {
      const where = href.split("#")[0]!.split("?")[0]!;
      const article = learnSlugOf(where);
      const term = glossarySlugOf(where);
      if (article) expect(findArticle(article), href).toBeDefined();
      else if (term) expect(findTerm(term), href).toBeDefined();
      else if (where.startsWith(`${comparePath}/`))
        expect(versusPages.map(versusRoute), href).toContain(where);
      else expect(live.has(where), href).toBe(true);
    }
    /* Every link out of the site opens a new tab. */
    for (const a of main.querySelectorAll("a[href^='http']")) {
      expect(a, a.getAttribute("href")!).toHaveAttribute("target", "_blank");
      expect(a, a.getAttribute("href")!).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("keeps the site's words, every product name out of translation, and names no competitor", () => {
    const main = renderPage(path, c).querySelector("main")!;
    const all = text(main);
    const retired = [
      ["storage", "tax"],
      ["s", "tx"],
      ["ex", "cel"],
    ].map(([head, tail]) => head! + tail!);
    expect(all).not.toMatch(
      new RegExp(
        `\\b(${[...retired, "cut", "cuts", "lower", "slash", "online", "bill", "bills", "billed", "billing"].join("|")})\\b`,
        "i",
      ),
    );
    expect(all).not.toMatch(new RegExp(["disk", "storage"].join(" "), "i"));
    /* Amoeba moves data without any downtime; its pool is a btrfs pool. */
    expect(all).toContain("btrfs pool");
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement!.closest("nav.fq-chips")) continue;
      if (/\b(Coral|Amoeba|Zoorik)\b/.test(node.textContent ?? ""))
        expect(node.parentElement!.closest('[translate="no"]'), node.textContent!).not.toBeNull();
    }
    /* The market's competitors: every tool but the clouds' own and the open-source ones, by its name before any
       bracket. */
    const competitors = marketGroups
      .filter((group) => group.id !== "native")
      .flatMap((group) => group.tools)
      .filter((tool) => !["Open source", "Azure", "AWS"].includes(tool.subgroup))
      .map((tool) => tool.name.split(" (")[0]!.split(" by ")[0]!.trim())
      .filter((name) => name.length > 3);
    expect(competitors.length).toBeGreaterThan(40);
    const literal = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expect(
      competitors.filter((name) =>
        new RegExp(`(?<![A-Za-z0-9])${literal(name)}(?![A-Za-z0-9])`).test(all),
      ),
    ).toEqual([]);
  });
});
