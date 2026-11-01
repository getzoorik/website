import { readdirSync } from "node:fs";

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { comparePath, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import {
  alternativesPages,
  versusPages,
  versusRoute,
  type VersusPage,
} from "@/content/learn-compare";
import { marketChecked, marketGroups, marketMarks, versusFacts } from "@/content/learn-market";
import { findTerm, glossarySlugOf } from "@/content/learn/glossary";
import { findArticle, isLiveHref, learnSlugOf } from "@/content/learn/published";
import { products } from "@/content/products";

/* The nav and the footer read the pathname; `notFound` stays Next's own. */
const pathname = vi.hoisted(() => ({ current: "/cloud-cost-optimization-library" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import * as route from "@/app/cloud-cost-optimization-library/[slug]/page";
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "../../../next.config";

import { marketTool } from "./market-rows";

/**
 * The versus pages, one dynamic route under /cloud-cost-optimization-library: only
 * the four live pages exist (one per product, then since 1 Nov 2026 two more for Coral, against the clouds' own
 * tools), each prints its rows from the market data with every claim about the other tool linked to its source,
 * the day it was checked, and no SOC 2 row; the two newer print the template's optional parts too (the short answer,
 * the Learn frame, the questions, the sources and Read more), the other two as before, but for coral-vs-stormforge's
 * questions (1 Nov 2026); any other slug, a held page among them, is a 404, and each live page's old address under
 * /learn redirects here. Competitors' names are read from the data, never typed here. The sitemap entries are in `src/app/sitemap.test.ts`, the page graphs in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const params = (slug: string) => Promise.resolve({ slug });

async function page(entry: VersusPage): Promise<HTMLElement> {
  pathname.current = versusRoute(entry);
  return render(await route.default({ params: params(entry.slug) })).container;
}

const factsOf = (entry: VersusPage) => versusFacts.find((facts) => facts.slug === entry.slug)!;

/** What a cell prints: its mark's word, then " · " and its note when it has one (a figure's no-break space read as a
 *  space, as `text` reads it). */
const printed = (cell: { mark: keyof typeof marketMarks; note: string }) =>
  `${marketMarks[cell.mark].word}${cell.note ? ` · ${cell.note}` : ""}`.replace(/\s+/g, " ");

/** What `richText` prints for the drafts' markup: code bare, a link's words, bold bare, straight quotes curled. */
const plain = (source: string): string =>
  source
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/'/g, "’")
    .replace(/\s+/g, " ");

/** The day each page prints in its kicker and its fine print: its own, else the market's. */
const checkedOf = (entry: VersusPage): string => entry.checked ?? "19 October 2026";

/** Each page's rows with the pricing row: the two first pages' counts as they were, the newer pages' from their drafts. */
const rowCounts: Readonly<Record<string, number>> = {
  "coral-vs-stormforge": 13,
  "amoeba-vs-zesty-disk": 10,
  "coral-vs-azure-advisor": 11,
  "coral-vs-aws-compute-optimizer": 12,
};

afterEach(() => {
  pathname.current = comparePath;
});

describe("the versus route", () => {
  it("prerenders exactly the live pages, the first two then Coral's two newer, and nothing else", () => {
    expect(route.dynamicParams).toBe(false);
    expect(route.generateStaticParams()).toEqual(
      versusPages.map((entry) => ({ slug: entry.slug })),
    );
    expect(versusPages.map((entry) => entry.product)).toEqual([
      "coral",
      "amoeba",
      "coral",
      "coral",
    ]);
    expect(Object.keys(rowCounts)).toEqual(versusPages.map((entry) => entry.slug));
    for (const entry of versusPages)
      expect(versusRoute(entry)).toBe(`${comparePath}/${entry.slug}`);
    /* No file or folder under the tools hub is named after a company: its own page, the one dynamic segment for the
       versus pages, and the two alternatives pages. */
    expect(readdirSync(`src/app${comparePath}`).sort()).toEqual(
      [
        "[slug]",
        "page.tsx",
        ...alternativesPages.map((entry) => entry.route.slice(`${comparePath}/`.length)),
      ].sort(),
    );
    expect(readdirSync(`src/app${comparePath}/[slug]`)).toEqual(["page.tsx"]);
  });

  it("takes each page's old address under /learn to its own address under the tools hub, with a 301", async () => {
    const old = [
      ...versusPages.map((entry) => [`/learn/compare/${entry.slug}`, versusRoute(entry)] as const),
      ...alternativesPages.map(
        (entry) => [entry.route.replace(comparePath, "/learn"), entry.route] as const,
      ),
    ];
    expect(old).toHaveLength(6);
    for (const [from, to] of old) {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://zoorik.com${from}`,
        nextConfig,
      });
      expect(response.status, from).toBe(301);
      expect(getRedirectUrl(response), from).toBe(`https://zoorik.com${to}`);
    }
  });

  it("ships rows for the live pages only (the held ones are not in src/)", () => {
    expect(versusFacts.map((facts) => facts.slug)).toEqual(versusPages.map((entry) => entry.slug));
  });

  it("answers any other slug with a 404, every tool in the market against either product included", async () => {
    const live = new Set(versusPages.map((entry) => entry.slug));
    const slug = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    /* Each tool by its name, by its name before " by " or "(", and by its first word: the forms a page's address
       would take, the held pages' among them. */
    const candidates = new Set(
      marketGroups
        .flatMap((group) => group.tools)
        .flatMap((tool) => {
          const head = tool.name.split(/ \(| by /)[0]!;
          return [tool.name, head, head.split(" ")[0]!].map(slug);
        })
        .flatMap((tool) => [`coral-vs-${tool}`, `amoeba-vs-${tool}`])
        .filter((candidate) => !live.has(candidate)),
    );
    expect(candidates.size).toBeGreaterThan(100);
    candidates.add("nothing-here");
    for (const candidate of candidates) {
      await expect(route.default({ params: params(candidate) }), candidate).rejects.toThrow();
      await expect(
        route.generateMetadata({ params: params(candidate) }),
        candidate,
      ).rejects.toThrow();
    }
  });
});

describe.each(versusPages.map((entry) => [entry.slug, entry] as const))("%s", (_slug, entry) => {
  const facts = factsOf(entry);
  const tool = marketTool(facts.tool);
  const ours = products[entry.product].name;

  it("is titled, described and canonicalised as its mock, with its own card", async () => {
    const metadata = await route.generateMetadata({ params: params(entry.slug) });
    expect(metadata.title).toBe(entry.meta.title);
    expect(metadata.description).toBe(entry.meta.description);
    expect(metadata.alternates).toEqual({ canonical: versusRoute(entry) });
    expect(metadata.openGraph).toMatchObject({
      url: versusRoute(entry),
      title: `${entry.meta.title} | Zoorik`,
      images: [pageCards[versusRoute(entry)]],
    });
    /* Its own card, whose words are its title; else the product's comparison card, its alternatives page's. */
    const card = entry.card
      ? entry.slug
      : entry.product === "coral"
        ? "kubernetes-cost-tools"
        : "block-storage-tools";
    expect(metadata.openGraph).toMatchObject({ images: [{ url: `/og/pages/${card}.png` }] });
    if (entry.card) expect(pageCards[versusRoute(entry)]!.alt).toBe(`Zoorik. ${entry.meta.title}.`);
    expect(`${entry.meta.title} | Zoorik`.length).toBeLessThanOrEqual(60);
    expect(entry.meta.description.length).toBeLessThanOrEqual(158);
    /* "AWS Compute Optimizer vs Coral for EKS": the title names both, either way round (theirs first where that is the
       search, 1 Nov 2026), and the cluster it is about where the draft's does. */
    expect(
      entry.meta.title.startsWith(`${ours} vs ${facts.name}`) ||
        entry.meta.title.startsWith(`${facts.name} vs ${ours}`),
    ).toBe(true);
  });

  it("draws the hero: the kicker with the checked day, the h1 and the deck", async () => {
    const root = await page(entry);
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector(".vp-kick"))).toBe(`Compare · checked ${checkedOf(entry)}`);
    expect(marketChecked).toBe("19 October 2026");
    expect(text(root.querySelector("h1"))).toBe(entry.meta.title);
    expect(text(root.querySelector(".doc-deck"))).toBe(entry.deck ?? entry.meta.description);
    expect(root.querySelector("header.hero.doc-hero.lv-hero")).not.toBeNull();
  });

  it("carries the page's structured data, then the sections in order and the closing row", async () => {
    const root = await page(entry);
    const blocks = root.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(pageStructuredData(versusRoute(entry)))),
    );
    /* `main`'s children by id; the Learn frame as the ids of its sections, in brackets. */
    const order = [...root.querySelector("main")!.children].map((el) =>
      el.matches("div.sec.doc-body")
        ? `[${[...el.querySelectorAll(".fq-sec")].map((section) => section.id).join(" ")}]`
        : el.id,
    );
    /* The Learn frame holds the parts a page has, in this order: its sections, its questions and its sources
       (coral-vs-stormforge's questions alone, 1 Nov 2026). */
    const frame = [
      ...(entry.sections ?? []).map((section) => section.id),
      ...(entry.questions ? ["questions"] : []),
      ...(entry.sources ? ["sources"] : []),
    ];
    expect(order).toEqual([
      "top",
      "glance",
      "side-by-side",
      ...(frame.length > 0 ? [`[${frame.join(" ")}]`] : []),
      ...(entry.readMore ? ["read-more"] : []),
      "assess",
    ]);
    expect(root.querySelector("#side-by-side")).toHaveClass("sec", "lv-sec", "sec-band");
    expect([...root.querySelectorAll("main .sec-band")].map((el) => el.id)).toEqual([
      "side-by-side",
    ]);
  });

  it("sets each one beside the other in its maker's words, ours to its page, theirs to its own", async () => {
    const root = await page(entry);
    const [mine, theirs] = [...root.querySelectorAll(".vp-glance > article")];
    expect(mine).toHaveClass("vp-side", "vp-ours");
    expect(text(mine!.querySelector("h3"))).toBe(ours);
    expect(mine!.querySelector("a.fx-read")).toHaveAttribute("href", `/${entry.product}`);
    expect(text(mine!.querySelector("a.fx-read"))).toBe(`See ${ours}`);
    expect(text(theirs!.querySelector(".vp-k"))).toBe(tool.company);
    expect(text(theirs!.querySelector("h3"))).toBe(facts.name);
    expect(text(theirs!.querySelector("h3 + p"))).toBe(facts.line);
    const out = theirs!.querySelector("a.vp-out")!;
    expect(out).toHaveAttribute("href", tool.url);
    expect(out).toHaveAttribute("target", "_blank");
    expect(out).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(out)).toBe(
      `${tool.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} (opens in a new tab)`,
    );
  });

  it("prints the rows in the data's order, then the pricing, and no SOC 2 row", async () => {
    const root = await page(entry);
    const heads = [...root.querySelectorAll(".vp-t thead th")].map(text);
    expect(heads).toEqual(["", ours, facts.name]);
    const labels = [...root.querySelectorAll(".vp-t tbody th[scope=row]")].map(text);
    expect(labels).toEqual([...facts.rows.map((row) => row.label), "Published pricing"]);
    expect(labels.length).toBe(rowCounts[entry.slug]);
    expect(labels.some((label) => /soc ?2/i.test(label))).toBe(false);
    expect(text(root.querySelector(".vp-t"))).not.toMatch(/soc ?2/i);
  });

  it("links every claim about the other tool to its sources, one link a page, and none on our side", async () => {
    const root = await page(entry);
    const rows = [...root.querySelectorAll(".vp-t tbody tr")];
    facts.rows.forEach((row, index) => {
      const [mine, theirs] = [...rows[index]!.querySelectorAll("td")];
      expect(mine!.querySelector(`.vx.vx-${marketMarks[row.ours.mark].key}`)).not.toBeNull();
      expect(text(mine!.querySelector(".vx-t"))).toBe(printed(row.ours));
      expect(mine!.querySelectorAll("a")).toHaveLength(0);
      const links = [...theirs!.querySelectorAll("a.vx-src")];
      expect(row.theirs.sources.length, row.label).toBeGreaterThan(0);
      expect(links.map((a) => a.getAttribute("href"))).toEqual(row.theirs.sources);
      for (const a of links) {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a.getAttribute("href")).toMatch(/^https:\/\/[^\s;]+$/);
      }
      expect(links.map(text)).toEqual(
        links.length === 1
          ? ["source (opens in a new tab)"]
          : links.map((_a, n) => `source ${n + 1} (opens in a new tab)`),
      );
      const said = text(theirs!.querySelector(".vx-t")).replace(
        / source( \d)? \(opens in a new tab\)/g,
        "",
      );
      expect(said, row.label).toBe(printed(row.theirs));
    });
    const pricing = rows.at(-1)!;
    const [mine, theirs] = [...pricing.querySelectorAll("td")];
    expect(text(mine)).toBe(facts.pricing.ours.replace(/\s+/g, " "));
    expect([...theirs!.querySelectorAll("a.vx-src")].map((a) => a.getAttribute("href"))).toEqual(
      facts.pricing.sources,
    );
    expect(facts.pricing.sources.length).toBeGreaterThan(0);
    expect(text(theirs).startsWith(facts.pricing.theirs)).toBe(true);
  });

  it("ends the table on the fine print: the trademark, the checked day and the address", async () => {
    const root = await page(entry);
    const fine = root.querySelector(".vp-fine")!;
    expect(text(fine)).toBe(
      `${facts.name} is a trademark of its owner. Everything said here about ${facts.name} comes from its own public pages, each linked, checked ${checkedOf(entry)}. “Not stated” means its pages do not say. Something changed? Write to founders@zoorik.com and we will correct it.`,
    );
    expect(fine.querySelector("a")).toHaveAttribute("href", "mailto:founders@zoorik.com");
  });

  it("draws no logo of the other tool, only its name", async () => {
    const root = await page(entry);
    expect(root.querySelectorAll("main img")).toHaveLength(0);
  });
});

/** Each newer page's question rows' ids, as its mock writes them (`sectionSlug`: the question's first seven words). */
const questionIds: Readonly<Record<string, readonly string[]>> = {
  "coral-vs-azure-advisor": [
    "what-is-azure-advisor",
    "is-azure-advisor-free",
    "does-azure-advisor-rightsize-aks-pods",
    "does-coral-replace-azure-advisor",
    "are-advisors-saving-figures-exact",
    "how-do-you-see-what-coral-would",
  ],
  "coral-vs-aws-compute-optimizer": [
    "what-is-aws-compute-optimizer",
    "is-aws-compute-optimizer-free",
    "does-aws-compute-optimizer-support-eks",
    "can-coral-and-aws-compute-optimizer-run",
    "does-coral-change-eks-managed-node-groups",
    "can-coral-move-eks-nodes-to-cheaper",
    "how-do-you-see-what-coral-would",
  ],
};

/** A block's element, by its kind. */
const blockTag = { p: "P", ul: "UL", ol: "OL", h3: "H3", table: "TABLE", links: "ASIDE" } as const;

describe("the template's optional parts", () => {
  it("are printed by the two pages of 1 Nov 2026 only, each checked, dated and carded that day", () => {
    const newer = versusPages.filter((entry) => entry.sections);
    expect(newer.map((entry) => entry.slug)).toEqual(Object.keys(questionIds));
    for (const entry of newer) {
      expect(entry.checked, entry.slug).toBe("1 November 2026");
      expect(entry.lastUpdated, entry.slug).toBe("1 November 2026");
      expect(entry.card, entry.slug).toBe(true);
      expect([entry.short, entry.questions, entry.sources, entry.readMore]).not.toContain(
        undefined,
      );
    }
  });

  it.each(
    versusPages
      .filter((entry) => !entry.sections && !entry.questions)
      .map((entry) => [entry.slug, entry]),
  )("leave %s exactly as it was", async (_slug, entry) => {
    const root = await page(entry);
    expect(root.querySelector(".ar-short, .doc-body, .fq-chips, #read-more")).toBeNull();
    expect([
      entry.checked,
      entry.lastUpdated,
      entry.card,
      entry.short,
      entry.questions,
      entry.sources,
      entry.readMore,
    ]).toEqual(Array(7).fill(undefined));
  });

  /* The keyword map's three questions about the other tool, each answered from a row the page already prints: the one
     part coral-vs-stormforge gained on 1 Nov 2026. */
  it("add only its questions to coral-vs-stormforge: closed, in the Learn frame, and nothing else", async () => {
    const entry = versusPages.find((candidate) => candidate.slug === "coral-vs-stormforge")!;
    const { name } = factsOf(entry);
    const root = await page(entry);
    expect(root.querySelector(".ar-short, #sources, #read-more")).toBeNull();
    expect([
      entry.checked,
      entry.lastUpdated,
      entry.card,
      entry.short,
      entry.sections,
      entry.sources,
      entry.readMore,
    ]).toEqual(Array(7).fill(undefined));
    const frame = root.querySelector("main > div.sec.doc-body")!;
    expect(
      [...frame.querySelectorAll("nav.fq-chips a")].map((a) => [a.getAttribute("href"), text(a)]),
    ).toEqual([["#questions", `Questions about ${name} and Coral`]]);
    const section = frame.querySelector("section.fq-sec.pr-faq#questions")!;
    expect(text(section.querySelector("h2#questions-h"))).toBe(`Questions about ${name} and Coral`);
    const rows = [...section.querySelectorAll(".fq-list > details.fq")];
    const id = name.toLowerCase();
    expect(rows.map((row) => row.id)).toEqual([
      `what-is-${id}`,
      `how-much-does-${id}-cost`,
      `does-${id}-manage-nodes`,
    ]);
    expect(rows.map((row) => text(row.querySelector("summary > h3")))).toEqual([
      `What is ${name}?`,
      `How much does ${name} cost?`,
      `Does ${name} manage nodes?`,
    ]);
    expect(rows.map((row) => text(row.querySelector(".fq-body.doc-prose > p")))).toEqual(
      entry.questions!.rows.map((row) => plain(row.answer)),
    );
    for (const row of rows) {
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(".fq-n")).toBeNull();
    }
  });
});

describe.each(
  versusPages.filter((entry) => entry.sections).map((entry) => [entry.slug, entry] as const),
)("%s: its own parts", (_slug, entry) => {
  const sections = entry.sections!;
  const questions = entry.questions!;
  const sources = entry.sources!;
  const readMore = entry.readMore!;

  it("puts the short answer under the deck, on the hero's ground", async () => {
    const root = await page(entry);
    const short = root.querySelector("header.lv-hero .hero-in > .doc-deck + p.ar-short")!;
    expect(short).not.toBeNull();
    expect(text(short.querySelector(":scope > b"))).toBe("Short answer.");
    expect(text(short)).toBe(`Short answer. ${plain(entry.short!)}`);
    expect(short.querySelector('span[translate="no"]')).toHaveTextContent("Coral");
  });

  it("sets each section's text open in the Learn frame, the chips naming every group", async () => {
    const frame = (await page(entry)).querySelector("main > div.sec.doc-body")!;
    expect(frame.querySelector(":scope > .wrap > article")).toHaveClass(
      "doc-main",
      "fq-main",
      "ar-frame",
    );
    expect(
      [...frame.querySelectorAll("nav.fq-chips a")].map((a) => [a.getAttribute("href"), text(a)]),
    ).toEqual([
      ...sections.map((section) => [`#${section.id}`, plain(section.title)]),
      ["#questions", plain(questions.title)],
      ["#sources", "Sources"],
    ]);
    for (const section of sections) {
      const el = frame.querySelector(`section.fq-sec#${section.id}`)!;
      expect(el).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(text(el.querySelector(`h2#${section.id}-h`))).toBe(plain(section.title));
      const body = el.querySelector(":scope > .fq-sec-b.doc-prose")!;
      expect([...body.children].map((child) => child.tagName)).toEqual(
        section.blocks.map((block) => blockTag[block.kind]),
      );
      section.blocks.forEach((block, index) => {
        const child = body.children[index]!;
        if (block.kind === "p" || block.kind === "h3")
          expect(text(child), section.id).toBe(plain(block.text));
        if (block.kind === "ul" || block.kind === "ol")
          expect([...child.children].map(text), section.id).toEqual(block.items.map(plain));
      });
    }
  });

  it("asks its questions in /pricing's rows: closed, with no number column", async () => {
    const section = (await page(entry)).querySelector("section.fq-sec.pr-faq#questions")!;
    expect(text(section.querySelector("h2#questions-h"))).toBe(plain(questions.title));
    expect(section.querySelector(":scope > .fq-sec-b")).not.toHaveClass("doc-prose");
    const rows = [...section.querySelectorAll(".fq-list > details.fq")];
    expect(rows.map((row) => row.id)).toEqual(questionIds[entry.slug]);
    expect(rows.map((row) => text(row.querySelector("summary > h3")))).toEqual(
      questions.rows.map((row) => plain(row.question)),
    );
    expect(rows.map((row) => text(row.querySelector(".fq-body.doc-prose > p")))).toEqual(
      questions.rows.map((row) => plain(row.answer)),
    );
    for (const row of rows) {
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(".fq-n")).toBeNull();
      expect(row.querySelector("summary > svg.fq-chev")).toHaveAttribute("aria-hidden", "true");
    }
    /* The last question opens Coral's own assessment. */
    expect(rows.at(-1)!.querySelector("a")).toHaveAttribute("href", "/assessment?p=coral");
  });

  it("names the sources of its prose, each a new tab, set apart by semicolons and closed by a full stop", async () => {
    const section = (await page(entry)).querySelector("section.fq-sec#sources")!;
    expect(text(section.querySelector("h2#sources-h"))).toBe("Sources");
    const line = section.querySelector(":scope > .fq-sec-b.doc-prose > p.ar-src")!;
    const links = [...line.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(sources.map((source) => source.url));
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.querySelector(".nw-nb > svg")).not.toBeNull();
    }
    expect(text(line)).toBe(
      `${sources.map((source) => `${source.publisher}, ${source.title} (opens in a new tab)`).join("; ")}.`,
    );
  });

  it("ends on Read more, its sibling page last but one, before the closing row", async () => {
    const read = (await page(entry)).querySelector("main > section.sec#read-more")!;
    expect(read).toHaveAttribute("aria-labelledby", "read-more-h");
    expect(text(read.querySelector(".sec-hrow > h2#read-more-h"))).toBe(
      `${entry.product === "coral" ? "Coral" : "Amoeba"} docs and guides`,
    );
    const tiles = [...read.querySelectorAll(".dt-grid > article.dt")];
    const expected = readMore.map((tile) => {
      if (!("versus" in tile)) return tile;
      const sibling = versusPages.find((other) => other.slug === tile.versus)!;
      return { title: sibling.meta.title, href: versusRoute(sibling), line: sibling.line };
    });
    expect(
      tiles.map((tile) => [
        text(tile.querySelector(".dt-t")),
        tile.querySelector("a.dt-a")?.getAttribute("href") ?? null,
        text(tile.querySelector(".dt-l")),
      ]),
    ).toEqual(
      expected.map((tile) => [
        plain(tile.title),
        isLiveHref(tile.href) ? tile.href : null,
        plain(tile.line),
      ]),
    );
    const other = versusPages.find((page) => page.sections && page.slug !== entry.slug)!;
    expect(readMore.at(-1)).toEqual({ versus: other.slug });
  });

  it("links only pages that exist, a Learn page not published yet set as its words", async () => {
    const main = (await page(entry)).querySelector("main")!;
    const live = new Set<string>(Object.values(routes));
    const own = [...main.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")!);
    expect(own.length).toBeGreaterThan(0);
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
  });

  it("keeps the site's words in its own copy, and every product name out of translation", async () => {
    const root = await page(entry);
    const parts = [
      root.querySelector(".ar-short")!,
      ...root.querySelectorAll("main > div.doc-body section.fq-sec:not(#sources)"),
      root.querySelector("#read-more")!,
    ];
    const own = parts.map(text).join(" ");
    const retired = [
      ["storage", "tax"],
      ["s", "tx"],
    ].map(([head, tail]) => head! + tail!);
    expect(own).not.toMatch(
      new RegExp(
        `\\b(${[...retired, "cut", "cuts", "lower", "slash", "online", "bill", "bills", "billed", "billing"].join("|")})\\b`,
        "i",
      ),
    );
    expect(own).not.toMatch(new RegExp(["disk", "storage"].join(" "), "i"));
    for (const part of parts) {
      const walker = document.createTreeWalker(part, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (/\b(Coral|Amoeba|Zoorik)\b/.test(node.textContent ?? ""))
          expect(node.parentElement!.closest('[translate="no"]'), node.textContent!).not.toBeNull();
      }
    }
  });
});
