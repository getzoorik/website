import { readdirSync } from "node:fs";

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { comparePath } from "@/config/site";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import {
  alternativesPages,
  versusPages,
  versusRoute,
  type VersusPage,
} from "@/content/learn-compare";
import { marketChecked, marketGroups, marketMarks, versusFacts } from "@/content/learn-market";
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
 * the two live pages exist, each prints its rows from the market data with every claim about the other tool linked to
 * its source, the day it was checked, and no SOC 2 row; any other slug, a held page among them, is a 404, and each
 * live page's old address under /learn redirects here. Competitors' names are read from the data, never typed here.
 * The sitemap entries are in `src/app/sitemap.test.ts`, the page graphs in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const params = (slug: string) => Promise.resolve({ slug });

async function page(entry: VersusPage): Promise<HTMLElement> {
  pathname.current = versusRoute(entry);
  return render(await route.default({ params: params(entry.slug) })).container;
}

const factsOf = (entry: VersusPage) => versusFacts.find((facts) => facts.slug === entry.slug)!;

/** What a cell prints: its mark's word, then " · " and its note when it has one. */
const printed = (cell: { mark: keyof typeof marketMarks; note: string }) =>
  `${marketMarks[cell.mark].word}${cell.note ? ` · ${cell.note}` : ""}`;

afterEach(() => {
  pathname.current = comparePath;
});

describe("the versus route", () => {
  it("prerenders exactly the live pages, one per product, and nothing else", () => {
    expect(route.dynamicParams).toBe(false);
    expect(route.generateStaticParams()).toEqual(
      versusPages.map((entry) => ({ slug: entry.slug })),
    );
    expect(versusPages.map((entry) => entry.product)).toEqual(["coral", "amoeba"]);
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
    expect(old).toHaveLength(4);
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
      /* the product's comparison card, the same as its alternatives page's */
      images: [pageCards[versusRoute(entry)]],
    });
    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: `/og/pages/${entry.product === "coral" ? "kubernetes-cost-tools" : "block-storage-tools"}.png`,
        },
      ],
    });
    expect(entry.meta.title).toBe(`${ours} vs ${facts.name}`);
  });

  it("draws the hero: the kicker with the checked day, the h1 and the deck", async () => {
    const root = await page(entry);
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector(".vp-kick"))).toBe("Compare · checked 19 October 2026");
    expect(marketChecked).toBe("19 October 2026");
    expect(text(root.querySelector("h1"))).toBe(entry.meta.title);
    expect(text(root.querySelector(".doc-deck"))).toBe(entry.meta.description);
    expect(root.querySelector("header.hero.doc-hero.lv-hero")).not.toBeNull();
  });

  it("carries the page's structured data, then the sections in order and the closing row", async () => {
    const root = await page(entry);
    const blocks = root.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(pageStructuredData(versusRoute(entry)))),
    );
    expect([...root.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "glance",
      "side-by-side",
      "assess",
    ]);
    expect(root.querySelector("#side-by-side")).toHaveClass("sec", "lv-sec", "sec-band");
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
    expect(labels.length).toBe(entry.product === "coral" ? 14 : 11);
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
    expect(text(mine)).toBe(facts.pricing.ours);
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
      `${facts.name} is a trademark of its owner. Everything said here about ${facts.name} comes from its own public pages, each linked, checked 19 October 2026. “Not stated” means its pages do not say. Something changed? Write to founders@zoorik.com and we will correct it.`,
    );
    expect(fine.querySelector("a")).toHaveAttribute("href", "mailto:founders@zoorik.com");
  });

  it("draws no logo of the other tool, only its name", async () => {
    const root = await page(entry);
    expect(root.querySelectorAll("main img")).toHaveLength(0);
  });
});
