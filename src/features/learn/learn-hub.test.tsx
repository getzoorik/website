import { existsSync, readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { comparePath, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { caseStudy } from "@/content/case-studies";
import {
  learnFixes,
  learnMedium,
  learnMore,
  learnPage,
  learnPillars,
  learnPriority,
  learnSubjects,
  type LearnTile,
} from "@/content/learn";
import type { Article } from "@/content/learn/article";
import { articleAuthor, articleRoute, findArticle, learnArticles } from "@/content/learn/published";
import { alternativesPages } from "@/content/learn-compare";
import { marketGroups, versusFacts } from "@/content/learn-market";
import { productFilms } from "@/content/product-films";
import { isoDay, shortDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/learn" }));

import LearnRoute, { metadata } from "@/app/learn/page";

import { LearnArticleList } from "./learn-list";

/**
 * `/learn`: the metadata, the hero, the band (Start here beside Find the right fix), All articles, Watch and read and
 * More from Zoorik, and the page's rules: only published articles, each read from the Learn index; no article both on
 * the band and in the list; the list in the priority order; chips and Show all that work in the page and store nothing;
 * no tool of the market named anywhere on the page. Every row, tile and count is worked out from the index, so a new
 * article is checked with no change here. Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

afterEach(() => {
  vi.restoreAllMocks();
});

const page = () => render(<LearnRoute />).container;

/** Whether an element is in view: neither it nor anything around it is `hidden`. */
const shown = (el: Element) => !el.closest("[hidden]");

/** A row of the band as it prints: where it goes, its words and its hover title. */
const row = (a: Element) => [a.getAttribute("href"), text(a), a.getAttribute("title")];

const published = (slugs: readonly string[]): readonly Article[] =>
  slugs.flatMap((slug) => {
    const article = findArticle(slug);
    return article ? [article] : [];
  });

const onBand = new Set([
  ...learnPillars.map((entry) => entry.pillar),
  ...learnFixes.map((fix) => fix.slug),
]);

const rank = (slug: string) => {
  const at = learnPriority.indexOf(slug);
  return at < 0 ? learnPriority.length : at;
};

/** All articles, as the hub should list them: every published article off the band, by rank, then A–Z by slug. */
const listed: readonly Article[] = learnArticles
  .filter((article) => !onBand.has(article.slug))
  .sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug, "en"));

const subjectLabel = (article: Article) =>
  learnSubjects.find((subject) => subject.label === article.hub)!.label;

const tiles = (root: ParentNode) => [...root.querySelectorAll("#articles .lr-t")];

/**
 * The market's competitors, read from the market data as `market-names.test.ts` reads them: every tool but the
 * clouds' own and the open-source ones, by its name (before any bracket), both halves of a "<product> by <owner>"
 * name, and its owner; names of three letters or fewer are left out, as there.
 */
const NOT_COMPETITORS = new Set(["Open source", "Azure", "AWS"]);
const competitors = [
  ...new Set(
    marketGroups
      .filter((group) => group.id !== "native")
      .flatMap((group) => group.tools)
      .filter((tool) => !NOT_COMPETITORS.has(tool.subgroup))
      .flatMap((tool) => {
        const head = tool.name.split(" (")[0]!;
        const owner = tool.company
          .split(/ \(|;|,/)[0]!
          .replace(/ Inc\.?$/, "")
          .trim();
        return [head, ...head.split(" by "), owner].map((name) => name.trim());
      }),
  ),
].filter((name) => name.length > 3);
const literal = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("/learn's metadata", () => {
  it("titles and describes the hub as its mock does, with the /learn card", () => {
    expect(metadata.title).toBe("Cloud cost optimization guides");
    expect(metadata.description).toBe(
      "Guides and comparisons for Kubernetes, block storage and the whole cloud bill on Azure and AWS, from where the money goes to the right fix.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/learn" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/learn",
      title: "Cloud cost optimization guides | Zoorik",
      images: [pageCards["/learn"]],
    });
    /* The sitemap's date for the hub: a printed day, not ahead of today. */
    expect(isoDay(learnPage.updated) <= learnToday()).toBe(true);
  });
});

describe("/learn", () => {
  it("has one h1 and its line, then the band, All articles, Watch and read and More from Zoorik, and no closing row", () => {
    const root = page();
    expect([...root.querySelectorAll("h1")].map(text)).toEqual(["Zoorik Learn"]);
    expect(text(root.querySelector(".doc-hero .doc-deck"))).toBe(learnPage.hero.deck);
    const parts = [...root.querySelectorAll("main > section")].map(
      (section) => section.id || section.getAttribute("aria-label"),
    );
    expect(parts).toEqual([learnPage.band, "articles", "watch", "more"]);
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("starts each subject on its pillar, and names each cause by the guide that fixes it, once published", () => {
    const root = page();
    const [start, fix] = [...root.querySelectorAll(".lr-pair .lr-c")];
    expect(text(start!.querySelector("h2"))).toBe(learnPage.start.title);
    expect(text(start!.querySelector("p"))).toBe(learnPage.start.line);
    expect([...start!.querySelectorAll("a.lr-l")].map(row)).toEqual(
      published(learnPillars.map((entry) => entry.pillar)).map((article) => [
        articleRoute(article),
        expect.any(String),
        article.h1,
      ]),
    );
    expect(text(fix!.querySelector("h2"))).toBe(learnPage.fix.title);
    expect(text(fix!.querySelector("p"))).toBe(learnPage.fix.line);
    expect([...fix!.querySelectorAll("a.lr-l")].map(row)).toEqual(
      learnFixes.flatMap((entry) => {
        const article = findArticle(entry.slug);
        return article ? [[articleRoute(article), entry.problem, article.h1]] : [];
      }),
    );
    expect(fix!.querySelector(".lr-list.lr-dark")).not.toBeNull();
  });

  it("lists every other published article once, by the priority list, as its cover with its day and author", () => {
    const root = page();
    expect(text(root.querySelector("#articles .sec-hrow p"))).toBe(
      `${listed.length} ${learnPage.articles.more}`,
    );
    const drawn = tiles(root);
    expect(drawn.map((tile) => tile.querySelector("a")!.getAttribute("href"))).toEqual(
      listed.map(articleRoute),
    );
    drawn.forEach((tile, index) => {
      const article = listed[index]!;
      const author = articleAuthor(article);
      expect(tile.getAttribute("data-p")).toBe(
        learnSubjects.find((subject) => subject.label === article.hub)!.id,
      );
      expect(tile.querySelector("a")!.getAttribute("title")).toBe(article.h1);
      expect(text(tile.querySelector(".lr-eb"))).toBe(subjectLabel(article));
      expect(text(tile.querySelector(".dt-t"))).not.toBe("");
      expect(text(tile.querySelector(".lr-m"))).toBe(
        `${shortDay(article.published)}${author ? ` · By ${author.name}` : ""}`,
      );
      const art = tile.querySelector<HTMLElement>(".lr-art")!;
      expect(art.getAttribute("aria-hidden")).toBe("true");
      const cover = /^url\("?([^")]+)"?\)$/.exec(art.style.backgroundImage)![1]!;
      expect(cover).toBe(`/learn-covers/zoorik-learn-${article.slug}-1200x630.webp`);
      expect(existsSync(`public${cover}`), cover).toBe(true);
    });
    /* Nothing on the band is listed again, and the band's own rows are all published. */
    expect(listed.filter((article) => onBand.has(article.slug))).toEqual([]);
  });

  it("filters the tiles by subject, one chip pressed at a time", async () => {
    const user = userEvent.setup();
    const root = page();
    const chips = [...root.querySelectorAll<HTMLButtonElement>(".lr-chips button")];
    expect(chips.map(text)).toEqual([
      learnPage.articles.subjects.all,
      ...learnSubjects.map((subject) => subject.label),
    ]);
    for (const subject of learnSubjects) {
      await user.click(chips.find((chip) => text(chip) === subject.label)!);
      expect(
        chips.filter((chip) => chip.getAttribute("aria-pressed") === "true").map(text),
      ).toEqual([subject.label]);
      const left = tiles(root).filter(shown);
      const all = listed.filter((article) => subjectLabel(article) === subject.label);
      expect(left.length).toBe(Math.min(all.length, learnPage.articles.shown));
      for (const tile of left) expect(tile.getAttribute("data-p")).toBe(subject.id);
    }
    await user.click(chips[0]!);
    expect(tiles(root).filter(shown)).toHaveLength(
      Math.min(listed.length, learnPage.articles.shown),
    );
  });

  it("opens each film on YouTube and the Medium post on Medium, in a new tab, saying so", () => {
    const root = page();
    const links = [...root.querySelectorAll<HTMLAnchorElement>("#watch a")];
    const films = (["coral", "amoeba"] as const).flatMap((product) =>
      productFilms[product].url ? [productFilms[product]] : [],
    );
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      ...films.map((film) => film.url),
      learnMedium.url,
    ]);
    for (const a of links) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(text(a)).toContain("(opens in a new tab)");
    }
    films.forEach((film, index) => {
      expect(text(links[index]!.querySelector(".lr-m"))).toBe(
        `${film.length} · ${learnPage.watch.film}`,
      );
      expect(links[index]!.querySelector("img")!.getAttribute("src")).toBe(film.poster);
    });
    expect(text(links.at(-1)!.querySelector(".lr-m"))).toBe(
      `${learnPage.watch.medium} · ${learnMedium.date}`,
    );
  });

  it("links Value Lab, the tools, the community and the news, Value Lab's figure read from the study", () => {
    const root = page();
    const drawn = [...root.querySelectorAll("#more .dt a")].map((a) => [
      a.getAttribute("href"),
      text(a.querySelector(".dt-t")),
      text(a.querySelector(".dt-l")),
    ]);
    expect(drawn).toEqual(learnMore.map((tile) => [tile.href, tile.title, tile.line]));
    expect(learnMore.map((tile) => tile.href)).toEqual([
      routes.valueLab,
      routes.cloudCostTools,
      routes.community,
      routes.news,
    ]);
    expect(learnMore[0]!.line.startsWith(caseStudy.band.stats[0].value)).toBe(true);
  });

  it("names no tool of the market, and links no page that compares with one", () => {
    expect(competitors.length).toBeGreaterThan(40);
    expect(competitors).toEqual(expect.arrayContaining(versusFacts.map((facts) => facts.name)));
    const root = page();
    const words = [
      root.ownerDocument.body.textContent ?? "",
      ...[...root.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
        [...el.attributes].map((attr) => attr.value),
      ),
    ].join("\n");
    const found = competitors.filter((name) =>
      new RegExp(`(?<![A-Za-z0-9])${literal(name)}(?![A-Za-z0-9])`).test(words),
    );
    expect(found).toEqual([]);
    const hrefs = [...root.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((href) => href.startsWith(`${comparePath}/`))).toEqual([]);
    expect(hrefs.filter((href) => alternativesPages.some((entry) => entry.route === href))).toEqual(
      [],
    );
  });

  it("stores nothing in the browser, whatever the reader does", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    for (const method of ["getItem", "setItem", "removeItem", "clear", "key"] as const)
      vi.spyOn(Storage.prototype, method).mockImplementation((() => {
        calls.push(method);
        return null;
      }) as never);
    vi.spyOn(document, "cookie", "set").mockImplementation(() => calls.push("cookie"));
    const root = page();
    for (const chip of root.querySelectorAll<HTMLButtonElement>(".lr-chips button"))
      await user.click(chip);
    expect(calls).toEqual([]);
    for (const file of ["learn-hub.tsx", "learn-list.tsx"])
      expect(readFileSync(`src/features/learn/${file}`, "utf8")).not.toMatch(
        /localStorage|sessionStorage|indexedDB|document\.cookie/,
      );
  });

  it("keeps the priority list to one entry per article", () => {
    expect(new Set(learnPriority).size).toBe(learnPriority.length);
  });
});

describe("All articles' Show all", () => {
  /* More tiles than the list shows at first, of two subjects, to see Show all work whatever the index holds. */
  const many: LearnTile[] = Array.from({ length: learnPage.articles.shown + 3 }, (_, index) => ({
    href: `/learn/article-${index}`,
    name: `Article ${index}`,
    title: `Article ${index}: what it says`,
    subject: index % 2 ? "k8s" : "storage",
    meta: "21 Oct",
    cover: `/learn-covers/zoorik-learn-article-${index}-1200x630.webp`,
  }));
  const list = () =>
    render(<LearnArticleList tiles={many} subjects={learnSubjects} words={learnPage.articles} />)
      .container;

  it("shows the first tiles, then every tile once pressed, and then hides itself", async () => {
    const user = userEvent.setup();
    const root = list();
    const more = root.querySelector(".lr-more")!;
    expect(tiles(root).filter(shown)).toHaveLength(learnPage.articles.shown);
    expect(shown(more)).toBe(true);
    expect(text(more)).toBe(
      `${learnPage.articles.showAll.before}${many.length}${learnPage.articles.showAll.after}`,
    );
    await user.click(more.querySelector("button")!);
    expect(tiles(root).filter(shown)).toHaveLength(many.length);
    expect(shown(more)).toBe(false);
  });

  it("hides itself where a subject has no more tiles than the list shows", async () => {
    const user = userEvent.setup();
    const root = list();
    const chip = [...root.querySelectorAll<HTMLButtonElement>(".lr-chips button")].find(
      (button) => text(button) === "Kubernetes",
    )!;
    await user.click(chip);
    expect(tiles(root).filter(shown)).toHaveLength(
      many.filter((tile) => tile.subject === "k8s").length,
    );
    expect(shown(root.querySelector(".lr-more")!)).toBe(false);
  });
});
