import { existsSync, readdirSync, readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { afterEach, describe, expect, it, vi } from "vitest";

import { rootArticlePaths, routes } from "@/config/site";
import {
  learnTopics,
  relatedTitle,
  type Article,
  type ArticleBlock,
  type ArticleItem,
  type ArticleText,
} from "@/content/learn/article";
import {
  articleAt,
  articleAuthor,
  articleCard,
  articleRoute,
  isLiveHref,
  learnArticles,
  learnSlugOf,
  titleLink,
} from "@/content/learn/published";
import { learnPillars } from "@/content/learn";
import { products } from "@/content/products";
import { ArticlePage } from "@/features/learn/article-page";
import { articleMetadata } from "@/features/learn/article-route";
import { promptedLines } from "@/features/learn/article-well";
import { printedDay } from "@/lib/content-date";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/learn" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import CloudCostOptimization, {
  metadata as cloudCostOptimizationMeta,
} from "@/app/cloud-cost-optimization/page";
import KubernetesCostOptimization, {
  metadata as kubernetesCostOptimizationMeta,
} from "@/app/kubernetes-cost-optimization/page";
import LearnArticle, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "@/app/learn/[slug]/page";

/**
 * The Learn articles, every one in the index, laid out like /security: the metadata, the outline and its addresses,
 * the frame (each section's name beside its text, the names as chips, no "On this page" list), the byline, the short
 * answer, the diagrams and pictures, the help box, the sources, the Related row and the closing row for the article's
 * product, and no placeholder. Every expectation is read from the article's own file, so a new article is checked
 * with no change here. Their sitemap entries are in `src/app/sitemap.test.ts`.
 */

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Words as `text` reads them: a no-break space between a figure and its unit reads as a space. */
const words = (value: string): string => value.replace(/\s+/g, " ").trim();

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

/** The two articles at the site's root (D230): each is a page of its own, at the address its file names. */
const rootPages: Readonly<
  Record<string, { readonly Page: () => React.JSX.Element; readonly metadata: Metadata }>
> = {
  [routes.cloudCostOptimization]: {
    Page: CloudCostOptimization,
    metadata: cloudCostOptimizationMeta,
  },
  [routes.kubernetesCostOptimization]: {
    Page: KubernetesCostOptimization,
    metadata: kubernetesCostOptimizationMeta,
  },
};

/** An article's metadata, from the page at its own address: its root page, or /learn/[slug]. */
const metadataOf = async (slug: string): Promise<Metadata> => {
  const root = rootPages[articleRoute(articleAt(slug))];
  return root ? root.metadata : generateMetadata(params(slug));
};

const main = async (slug: string): Promise<HTMLElement> => {
  pathname.current = articleRoute(articleAt(slug));
  const root = rootPages[pathname.current];
  const page = root ? <root.Page /> : await LearnArticle(params(slug));
  return render(page).container.querySelector("main")!;
};

const blocksOf = (article: Article): readonly ArticleBlock[] => [
  ...(article.lead ?? []),
  ...article.sections.flatMap((section) => section.blocks),
];

/** Every link piece of a run of text, bold's own included, with its words as the page prints them. */
const linksOf = (run: ArticleText): readonly { readonly a: string; readonly href: string }[] =>
  typeof run === "string"
    ? []
    : run.flatMap((piece): readonly { readonly a: string; readonly href: string }[] => {
        if (typeof piece === "string") return [];
        if ("a" in piece)
          return [{ a: typeof piece.a === "string" ? piece.a : piece.a.code, href: piece.href }];
        if ("b" in piece) return linksOf(piece.b);
        return [];
      });

/** Every run of text in some blocks, a list item's own blocks included, in the order the page prints them. */
const runsIn = (blocks: readonly ArticleBlock[]): readonly ArticleText[] =>
  blocks.flatMap((block): readonly ArticleText[] => {
    switch (block.kind) {
      case "p":
      case "quote":
      case "note":
      case "callout":
        return [block.text];
      case "svg":
        return [block.figure.caption];
      case "steps":
        return block.items;
      case "ul":
      case "ol":
        return block.items.flatMap((item: ArticleItem) =>
          typeof item === "string" || Array.isArray(item)
            ? [item as ArticleText]
            : [
                (item as { text: ArticleText }).text,
                ...runsIn((item as { blocks: readonly ArticleBlock[] }).blocks),
              ],
        );
      case "table":
        return [...block.columns.map((column) => column.label), ...block.rows.flat()];
      default:
        return [];
    }
  });

const pillars = new Set(learnPillars.map((entry) => entry.pillar));

/**
 * The pillar's generated list: every other published article under its topic's heading, in the topics' order, a
 * pillar first and the rest A–Z by h1, and no heading left empty.
 */
const everyGroups = (article: Article) =>
  learnTopics
    .map((topic) => ({
      topic,
      id: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      articles: learnArticles
        .filter((other) => other.slug !== article.slug && other.topic === topic)
        .sort(
          (a, b) =>
            Number(pillars.has(b.slug)) - Number(pillars.has(a.slug)) ||
            a.h1.localeCompare(b.h1, "en"),
        ),
    }))
    .filter((group) => group.articles.length > 0);

/** The h3 ids an article's sections print, in order: its own parts', and the generated list's headings. */
const h3IdsOf = (article: Article): readonly string[] =>
  blocksOf(article).flatMap((block) =>
    block.kind === "h3"
      ? [block.id]
      : block.kind === "every"
        ? everyGroups(article).map((group) => group.id)
        : [],
  );

/** The site links an article's short answer and sections print, in order, the generated list's included. */
const bodyLinksOf = (
  article: Article,
): readonly { readonly a: string; readonly href: string }[] => [
  ...(article.short ? linksOf(article.short) : []),
  ...blocksOf(article).flatMap((block) =>
    block.kind === "every"
      ? everyGroups(article).flatMap((group) =>
          group.articles.map((other) => ({ a: other.h1, href: articleRoute(other) })),
        )
      : runsIn([block]).flatMap(linksOf),
  ),
];

/** Every code block of an article, a list item's included. */
const codeOf = (blocks: readonly ArticleBlock[]): readonly { lang: string; code: string }[] =>
  blocks.flatMap((block) => {
    if (block.kind === "code") return [block];
    if (block.kind !== "ul" && block.kind !== "ol") return [];
    return block.items.flatMap((item: ArticleItem) =>
      typeof item === "string" || Array.isArray(item)
        ? []
        : codeOf((item as { blocks: readonly ArticleBlock[] }).blocks),
    );
  });

/**
 * The byline as read: the day, the day it changed where that is a later one, the author with the new-tab hint where
 * they link, and the publisher.
 */
const bylineOf = (article: Article): string => {
  const author = articleAuthor(article);
  const updated =
    article.updated === article.published ? "" : ` · Updated ${printedDay(article.updated)}`;
  const by = author
    ? ` · By ${author.name}${author.linkedin ? " (opens in a new tab)" : ""}, ${author.role}`
    : "";
  /* A Zoorik author's role already names Zoorik, so only a guest's byline or no one's ends on the publisher. */
  const publisher = author && !author.guest ? "" : " · Published by Zoorik";
  return `Published ${printedDay(article.published)}${updated}${by}${publisher}`;
};

/** The product the closing row offers: the help box's, else the article's own. */
const closingProduct = (article: Article) =>
  article.help?.product ?? (article.product === "both" ? null : article.product);

/** Where each page a Related tile links to keeps its anchors. */
const ANCHOR_SOURCES: Record<string, string> = {
  "/coral-faq": "src/content/coral-faq.ts",
  "/coral-guide": "src/content/coral-guide.ts",
  "/amoeba-faq": "src/content/amoeba-faq.ts",
  "/amoeba-guide": "src/content/amoeba-guide.ts",
};

describe("/learn/[slug]", () => {
  it("prerenders every article in the index but the two at the site's root, and nothing else", async () => {
    expect(dynamicParams).toBe(false);
    expect(generateStaticParams()).toEqual(
      learnArticles
        .filter((article) => article.route === undefined)
        .map((article) => ({ slug: article.slug })),
    );
    await expect(LearnArticle(params("no-such-article"))).rejects.toThrow();
    for (const article of learnArticles.filter((entry) => entry.route !== undefined)) {
      await expect(LearnArticle(params(article.slug)), article.slug).rejects.toThrow();
      await expect(generateMetadata(params(article.slug)), article.slug).rejects.toThrow();
    }
  });
});

describe("the Learn articles at the site's root (D230)", () => {
  it("are the cloud cost and Kubernetes pillars, each at the address its file names", () => {
    expect(
      learnArticles.flatMap((article) => (article.route ? [[article.slug, article.route]] : [])),
    ).toEqual([
      ["how-to-reduce-cloud-costs", routes.cloudCostOptimization],
      ["reduce-kubernetes-cost", routes.kubernetesCostOptimization],
    ]);
    expect([...rootArticlePaths].sort()).toEqual(Object.keys(rootPages).sort());
  });

  it("are each a page of their own at the root, and the article any link to that address names", () => {
    for (const route of rootArticlePaths) {
      expect(readdirSync(`src/app${route}`), route).toEqual(["page.tsx"]);
      const slug = learnSlugOf(route);
      expect(slug, route).not.toBeNull();
      expect(articleRoute(articleAt(slug!))).toBe(route);
      expect(learnSlugOf(`${route}#short-answer`)).toBe(slug);
    }
  });

  it("are titled by the same metadata function as /learn/[slug], canonical at the root, with their own cards", () => {
    for (const route of rootArticlePaths) {
      const article = articleAt(learnSlugOf(route)!);
      const { metadata } = rootPages[route]!;
      expect(metadata).toEqual(articleMetadata(article));
      expect(metadata.alternates).toEqual({ canonical: route });
      expect(metadata.openGraph).toMatchObject({ url: route, images: [articleCard(article)] });
      /* Named for the address since its title moved there (1 Nov 2026). */
      expect(articleCard(article).url).toBe(`/og/pages${route}.png`);
    }
  });
});

describe.each(learnArticles.map((article) => [articleRoute(article), article.slug]))(
  "%s",
  (_, slug) => {
    const article = articleAt(slug);
    const route = articleRoute(article);

    it("titles, describes and canonicalises the page in its own words, with its card", async () => {
      const meta = await metadataOf(slug);
      expect(meta.title).toBe(article.title);
      expect(meta.description).toBe(article.meta);
      expect(meta.alternates).toEqual({ canonical: route });
      expect(meta).not.toHaveProperty("robots");
      expect(meta.openGraph).toMatchObject({
        url: route,
        title: `${article.title} | Zoorik`,
        description: article.meta,
        images: [articleCard(article)],
      });
    });

    it("opens on the utility hero, with no date, photo or author", async () => {
      const hero = (await main(slug)).querySelector("header.hero.doc-hero#top")!;
      expect(text(hero.querySelector("h1"))).toBe(words(article.h1));
      expect(text(hero.querySelector(".doc-deck"))).toBe(words(article.deck));
      expect(hero.querySelector(".as-switch, .dl, img")).toBeNull();
    });

    it("keeps its section and part ids, in order, each section's name beside its open text", async () => {
      const frame = (await main(slug)).querySelector("article.doc-main.fq-main.ar-frame")!;
      const sections = [...frame.querySelectorAll(":scope > section.fq-sec")];
      expect(sections.map((section) => section.id)).toEqual(article.sections.map((s) => s.id));
      expect(sections.map((section) => text(section.querySelector("h2")))).toEqual(
        article.sections.map((s) => words(s.title)),
      );
      for (const section of sections) {
        expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
        expect(section.firstElementChild).toHaveAttribute("id", `${section.id}-h`);
        expect(section.firstElementChild!.tagName).toBe("H2");
        expect(section.lastElementChild).toHaveClass("fq-sec-b", "doc-prose");
      }
      expect([...frame.querySelectorAll("h3[id]")].map((h3) => h3.id)).toEqual(h3IdsOf(article));
      /* Nothing is folded, and nothing lists the sections but the chips. */
      expect(frame.querySelector("details")).toBeNull();
    });

    it("names the sections as chips on a phone, and has no On this page list", async () => {
      const container = await main(slug);
      expect(
        [...container.querySelectorAll("nav.fq-chips a")].map((a) => a.getAttribute("href")),
      ).toEqual(article.sections.map((section) => `#${section.id}`));
      expect(container.querySelector(".doc-rail, .doc-toc, .rl")).toBeNull();
    });

    it("opens the frame on its byline, published by Zoorik, then the short answer where it has one", async () => {
      const top = (await main(slug)).querySelector(".ar-frame > .fq-upd.doc-prose:first-child")!;
      const byline = top.querySelector(":scope > p.doc-updated:first-child")!;
      expect(text(byline)).toBe(bylineOf(article));
      const author = articleAuthor(article);
      const publisher = byline.querySelector("a[href='/about']");
      if (author && !author.guest) expect(publisher).toBeNull();
      else expect(publisher!.querySelector("span[translate='no']")).toHaveTextContent(/^Zoorik$/);
      const profile = byline.querySelector("a[href^='https://']");
      if (author?.linkedin) {
        expect(profile).toHaveAttribute("href", author.linkedin);
        expect(profile).toHaveAttribute("target", "_blank");
        expect(profile).toHaveAttribute("rel", "noopener noreferrer");
        expect(text(profile)).toBe(`${author.name} (opens in a new tab)`);
        /* The name's last word and the arrow stay on one line. */
        const held = profile!.querySelector(".nw-nb")!;
        expect(held.textContent).toBe(author.name.split(" ").at(-1));
        expect(held.lastElementChild).toHaveClass("ext");
      } else {
        expect(profile).toBeNull();
      }
      const short = top.querySelector(":scope > p.ar-short");
      if (!article.short) {
        expect(short).toBeNull();
        return;
      }
      expect(short!.querySelector("b")).toHaveTextContent("Short answer.");
      expect(text(short)).toMatch(/^Short answer\. \S/);
    });

    it("carries its pictures as files, each with its alt text and caption", async () => {
      const images = [...(await main(slug)).querySelectorAll("figure.ar-img")];
      expect(images).toHaveLength(
        blocksOf(article).filter((block) => block.kind === "image").length,
      );
      for (const figure of images) {
        const img = figure.querySelector("img")!;
        expect(img.getAttribute("src")).toMatch(/^\/articles\/[a-z0-9-]+\.(webp|svg)$/);
        expect(img.getAttribute("alt")!.length).toBeGreaterThan(40);
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("decoding", "async");
        expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
        expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
        expect(text(figure.querySelector("figcaption")).length).toBeGreaterThan(20);
      }
    });

    it("draws each diagram it names, each one image with its words", async () => {
      const container = await main(slug);
      const figures = [...container.querySelectorAll("figure.ln-d")];
      expect(figures).toHaveLength(
        blocksOf(article).filter((block) => block.kind === "figure" || block.kind === "diagram")
          .length,
      );
      /* A diagram of the article's own is drawn as its figure file draws it, its style scoped to its class. */
      for (const block of blocksOf(article)) {
        if (block.kind !== "diagram") continue;
        const drawn = container.querySelector(
          `figure.${block.figure.className.split(" ").join(".")}`,
        );
        expect(drawn, block.figure.className).not.toBeNull();
        expect(drawn).toHaveAttribute("aria-label", block.figure.label);
        expect(drawn!.previousElementSibling?.tagName).toBe("STYLE");
        expect(drawn!.previousElementSibling!.textContent).toBe(block.figure.style);
      }
      for (const figure of figures) {
        expect(figure).toHaveAttribute("role", "img");
        expect(figure.getAttribute("aria-label")).toMatch(/^Diagram\. /);
        for (const svg of figure.querySelectorAll("svg")) {
          expect(svg).toHaveAttribute("aria-hidden", "true");
        }
      }
      expect(container.querySelectorAll(".ln-strip > li")).toHaveLength(article.strip?.length ?? 0);
    });

    it("draws each drawn figure as its SVG, named for the ear, under its caption, with no figure number", async () => {
      const container = await main(slug);
      const drawn = blocksOf(article).flatMap((block) =>
        block.kind === "svg" ? [block.figure] : [],
      );
      const figures = [...container.querySelectorAll(".ar-frame figure.ar-fig")];
      expect(figures).toHaveLength(drawn.length);
      figures.forEach((figure, index) => {
        const svg = figure.querySelector(":scope > .ar-fig-s > svg")!;
        expect(svg).toHaveAttribute("role", "img");
        for (const id of svg.getAttribute("aria-labelledby")!.split(" "))
          expect(svg.querySelector(`#${id}`)?.textContent?.trim(), id).toBeTruthy();
        expect(svg.textContent).not.toMatch(/FIG \d+ \/\//);
        expect(text(figure.querySelector("figcaption"))).not.toBe("");
        expect(drawn[index]!.markup.startsWith("<svg")).toBe(true);
      });
    });

    it("sets each callout apart under its label", async () => {
      const callouts = [...(await main(slug)).querySelectorAll(".ar-frame aside.ar-call")];
      expect(callouts.map((aside) => text(aside.querySelector(".doc-call-t")))).toEqual(
        blocksOf(article).flatMap((block) => (block.kind === "callout" ? [block.label] : [])),
      );
      for (const aside of callouts) {
        expect(aside).toHaveClass("doc-call");
        expect(text(aside.querySelector(".doc-call-t + p"))).not.toBe("");
      }
    });

    it("shows its cover under the byline, named by its draft's alt text or else decoration", async () => {
      const top = (await main(slug)).querySelector(".ar-frame > .fq-upd.doc-prose:first-child")!;
      const cover = top.querySelector(":scope > p.doc-updated + figure.ar-cover img");
      if (!article.cover) {
        expect(top.querySelector("figure.ar-cover")).toBeNull();
        return;
      }
      expect(cover).toHaveAttribute("src", article.cover);
      expect(cover).toHaveAttribute("alt", article.coverAlt ?? "");
      expect(readFileSync(`public${article.cover}`).length).toBeGreaterThan(0);
    });

    it("closes the frame on the help box and the sources, each source a new tab", async () => {
      const container = await main(slug);
      const foot = container.querySelector(".ar-frame > .fq-upd.ar-foot");
      const sources = article.sources ?? [];
      /* An article that ends on its own product's section carries the help box's links there, and no box. */
      const helpNames = article.help?.product
        ? [products[article.help.product].name]
        : ["Coral", "Amoeba"];
      const lastTitle = article.sections.at(-1)!.title;
      const inLast = Boolean(article.help && helpNames.some((name) => lastTitle.includes(name)));
      const lastSection = container.querySelector(`#${article.sections.at(-1)!.id}`)!;
      const moved = lastSection.querySelector("p.ar-help-a");
      if (inLast) {
        expect([...moved!.querySelectorAll("a.alink")].map((a) => a.getAttribute("href"))).toEqual(
          article.help!.links.map((link) => link.href),
        );
        expect(text(moved)).not.toMatch(/[a-z]Estimate/);
      } else {
        expect(moved).toBeNull();
      }
      const box = article.help && !inLast ? article.help : undefined;
      if (!box && sources.length === 0) {
        /* An essay has neither, or its help is in its last section, so the frame has no closing block. */
        expect(foot).toBeNull();
        return;
      }
      const prose = container.querySelector(".ar-frame > .fq-upd.ar-foot.doc-prose:last-child")!;
      const help = prose.querySelector(":scope > aside.doc-call.doc-help");
      if (box) {
        expect(text(help!.querySelector(".doc-call-t"))).toBe(
          box.product ? `How ${products[box.product].name} helps` : "How Coral and Amoeba help",
        );
        expect([...help!.querySelectorAll("a.alink")].map((a) => a.getAttribute("href"))).toEqual(
          box.links.map((link) => link.href),
        );
      } else {
        expect(help).toBeNull();
      }
      const line = prose.querySelector(":scope > p.ar-src");
      if (sources.length === 0) {
        expect(line).toBeNull();
        return;
      }
      expect(prose.lastElementChild).toBe(line);
      expect(text(line)).toMatch(/^Sources: .*\.$/);
      const links = [...line!.querySelectorAll("a")];
      expect(links.map((link) => link.getAttribute("href"))).toEqual(sources.map((s) => s.url));
      for (const link of links) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link.textContent).toMatch(/ \(opens in a new tab\)$/);
      }
    });

    it("relates three to five pages, each named as its page names it, each anchor one its page still has", async () => {
      const related = (await main(slug)).querySelector("section.sec.ar-rel#related")!;
      expect(related).toHaveAttribute("aria-labelledby", "related-h");
      expect(text(related.querySelector("h2#related-h"))).toBe(relatedTitle[article.topic]);
      expect(article.related.length).toBeGreaterThanOrEqual(3);
      expect(article.related.length).toBeLessThanOrEqual(5);
      const tiles = [...related.querySelectorAll("article.dt > .dt-a")];
      expect(tiles).toHaveLength(article.related.length);
      /* Each tile is keyed by its title, never its address, so an unpublished article's address stays out of the
         page's payload: the titles are each the tile's own. */
      expect(new Set(article.related.map((tile) => tile.title)).size).toBe(article.related.length);
      article.related.forEach((tile, index) => {
        const link = titleLink({ text: tile.title, href: tile.href });
        const drawn = tiles[index]!;
        expect(text(drawn.querySelector(".dt-t")), tile.href).toBe(words(link.text));
        expect(text(drawn.querySelector(".dt-l")), tile.href).toBe(tile.where);
        /* A tile to an article not yet published is its own words, with no link and no arrow. */
        expect(drawn.tagName, tile.href).toBe(link.href ? "A" : "DIV");
        if (link.href) expect(drawn).toHaveAttribute("href", link.href);
        else expect(drawn.querySelector(".dt-go")).toBeNull();
        const [path, anchor] = tile.href.split("#");
        if (anchor && ANCHOR_SOURCES[path!])
          expect(readFileSync(ANCHOR_SOURCES[path!]!, "utf8"), tile.href).toContain(`"${anchor}"`);
      });
    });

    it("links a body's words only to pages that are published, and keeps the words of the rest", async () => {
      const frame = (await main(slug)).querySelector(".ar-frame")!;
      /* The links of the short answer, the opening and the sections, to pages of this site: not the byline's, nor the
       help box's and the sources'. */
      const drawn = [...frame.querySelectorAll("a")]
        .filter((a) => !a.closest("p.doc-updated, .ar-foot, p.ar-help-a"))
        .map((a) => a.getAttribute("href")!)
        .filter((href) => href.startsWith("/"));
      const pieces = bodyLinksOf(article).filter((piece) => piece.href.startsWith("/"));
      expect(drawn).toEqual(pieces.filter((piece) => isLiveHref(piece.href)).map((p) => p.href));
      for (const piece of pieces.filter((p) => !isLiveHref(p.href))) {
        expect(text(frame), piece.href).toContain(words(piece.a));
      }
    });

    it("opens a link to another site in a new tab, with its arrow and its hint", async () => {
      const frame = (await main(slug)).querySelector(".ar-frame")!;
      const away = [...frame.querySelectorAll("a[href^='https://']")].filter(
        (a) => !a.closest("p.doc-updated, .ar-foot, p.ar-help-a"),
      );
      expect(away.map((a) => a.getAttribute("href"))).toEqual(
        bodyLinksOf(article)
          .filter((piece) => piece.href.startsWith("https://"))
          .map((piece) => piece.href),
      );
      for (const a of away) {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a).toHaveAttribute("rel", "noopener noreferrer");
        expect(a.querySelector("svg.ext")).not.toBeNull();
        expect(a.textContent).toMatch(/ \(opens in a new tab\)$/);
      }
    });

    it("sets its code in wells, prompted only where a command starts, with Copy on all but output", async () => {
      const wells = [...(await main(slug)).querySelectorAll(".ar-frame .doc-well")];
      const code = codeOf(blocksOf(article));
      expect(wells).toHaveLength(code.length);
      code.forEach((block, index) => {
        const well = wells[index]!;
        const lines = block.code.split("\n");
        const kind = block.lang.toLowerCase();
        expect(well).toHaveClass("as-well");
        expect(well.classList.contains("is-yaml"), block.code).toBe(
          ["yaml", "yml", "json"].includes(kind),
        );
        expect(well.classList.contains("is-line"), block.code).toBe(lines.length === 1);
        const prompts = [...well.querySelectorAll("pre > i")];
        expect(prompts).toHaveLength(promptedLines(kind, lines).filter(Boolean).length);
        for (const prompt of prompts) expect(prompt).toHaveAttribute("aria-hidden", "true");
        /* The well's words are the code's own, with its prompts. */
        expect(well.querySelector("pre")!.textContent!.replace(/\$ /g, "")).toBe(
          block.code.replace(/\$ /g, ""),
        );
        const copy = well.querySelector("button.as-copy");
        if (["text", "txt", "output", ""].includes(kind)) expect(copy).toBeNull();
        else expect(copy).toHaveAttribute("aria-label", "Copy the command");
      });
    });

    it("numbers each list from where it starts, and labels each table cell with its column", async () => {
      const frame = (await main(slug)).querySelector(".ar-frame")!;
      const lists = [...frame.querySelectorAll(".fq-sec-b > ol:not(.doc-steps)")];
      const blocks = blocksOf(article).filter((block) => block.kind === "ol");
      expect(lists).toHaveLength(blocks.length);
      blocks.forEach((block, index) => {
        if (block.start) expect(lists[index]).toHaveAttribute("start", String(block.start));
        else expect(lists[index]).not.toHaveAttribute("start");
      });
      const tables = [...frame.querySelectorAll("table.doc-tbl.nw-tbl")];
      const drawn = blocksOf(article).filter((block) => block.kind === "table");
      expect(tables).toHaveLength(drawn.length);
      drawn.forEach((block, index) => {
        const table = tables[index]!;
        expect([...table.querySelectorAll("col")].map((col) => col.style.width)).toEqual(
          block.columns.map((column) => column.width),
        );
        const labels = [...table.querySelectorAll("th")].map(text);
        for (const row of table.querySelectorAll("tbody tr")) {
          [...row.querySelectorAll("td")].forEach((td, at) =>
            expect(td.getAttribute("data-label")!.replace(/\s+/g, " ")).toBe(labels[at]),
          );
        }
      });
    });

    it("lists every other article under its topic, where it carries that list", async () => {
      const section = article.sections.find((entry) =>
        entry.blocks.some((block) => block.kind === "every"),
      );
      if (!section) return;
      const body = (await main(slug)).querySelector(`section#${section.id} > .fq-sec-b`)!;
      const groups = everyGroups(article);
      const listed = [...body.querySelectorAll(":scope > h3")].slice(-groups.length);
      expect(listed.map(text)).toEqual(groups.map((group) => group.topic));
      listed.forEach((heading, index) => {
        const items = [...heading.nextElementSibling!.querySelectorAll(":scope > li > a")];
        expect(items.map((a) => [text(a), a.getAttribute("href")])).toEqual(
          groups[index]!.articles.map((other) => [words(other.h1), articleRoute(other)]),
        );
      });
      expect(body.querySelector(`a[href="${route}"]`)).toBeNull();
    });

    it("ends on the closing row for its product", async () => {
      const row = (await main(slug)).querySelector("section#assess")!;
      const product = closingProduct(article);
      expect(row.querySelector("a.btn-ink")).toHaveAttribute(
        "href",
        product ? `/assessment?p=${product}` : "/assessment",
      );
      expect(text(row.querySelector("#contact p"))).toBe(
        `Thirty minutes with the people who build ${product ? products[product].name : "Coral and Amoeba"}.`,
      );
    });

    it("keeps product names out of translation and ships no placeholder", async () => {
      const container = await main(slug);
      expect(container.innerHTML).not.toMatch(/\[OWNER|ph-chip|To come/);
      const prose = container.querySelector(".ar-frame")!;
      /* Every Coral and Amoeba in running text sits in a translate="no" span; the help box's title is plain text. */
      const loose = [...prose.querySelectorAll("p, li, td, th, h2, h3")].filter((el) => {
        if (el.matches(".doc-call-t")) return false;
        const own = [...el.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent)
          .join("");
        return /\b(Coral|Amoeba|Zoorik)\b/.test(own);
      });
      expect(loose.map(text)).toEqual([]);
    });
  },
);

/**
 * The architecture essay, in the Learn articles' own frame since its rework: a short answer, its sections and parts,
 * two drawn figures and the help box. Its headings are listed here, so a drift from its draft fails.
 */
describe("/learn/poor-architecture-cloud-bill, against its draft", () => {
  const slug = "poor-architecture-cloud-bill";

  it("keeps its sections and parts, in order, under the ids its old page gave them", async () => {
    const frame = (await main(slug)).querySelector(".ar-frame")!;
    expect([...frame.querySelectorAll("section.fq-sec > h2")].map(text)).toEqual([
      "The hidden cost of architectural decisions",
      "Containers vs virtual machines: the architectural trade-off",
      "Five places poor architecture adds cost",
      "How we review an architecture for cost",
      "What we found in that engagement",
      "Cloud cost is an engineering discipline",
      "Where Coral fits",
    ]);
    expect([...frame.querySelectorAll("section.fq-sec")].map((s) => s.id).slice(0, 6)).toEqual([
      "the-hidden-cost-of-architectural-decisions",
      "vms-versus-containers-understanding-the-architectural-trade-off",
      "where-poor-architecture-translates-into-higher-costs",
      "how-we-approach-cloud-cost-optimization-as",
      "what-we-found-in-that-engagement",
      "the-bigger-lesson-cloud-waste-is-often",
    ]);
    expect([...frame.querySelectorAll("h3[id]")].map(text)).toEqual([
      "1. Overprovisioning compute and storage",
      "2. Running workloads in isolation when they could share capacity",
      "3. Scaling infrastructure instead of fixing the application",
      "4. Ignoring non-production environments",
      "5. Designing for peak traffic without a scaling strategy",
      "1. Establish a baseline",
      "2. Understand the workload",
      "3. Compare realistic architecture options",
      "4. Model the expected savings",
      "5. Validate through measurement",
      "6. Prevent the same costs from returning",
    ]);
  });

  it("names its author once, in the byline", async () => {
    const author = articleAuthor(articleAt(slug))!;
    const frame = (await main(slug)).querySelector(".ar-frame")!;
    expect(text(frame).split(`By ${author.name}`)).toHaveLength(2);
  });

  it("draws its two figures, each named for a screen reader", async () => {
    const figures = [...(await main(slug)).querySelectorAll(".ar-frame figure svg[role='img']")];
    expect(figures.map((svg) => text(svg.querySelector("title")))).toEqual([
      "Apps that share nodes need fewer machines for the same use",
      "Sharing nodes reduced the client’s compute cost by 44%",
    ]);
  });

  it("links only words already in the text", async () => {
    const links = [...(await main(slug)).querySelectorAll(".ar-frame .fq-sec-b a")].map((a) => [
      text(a),
      a.getAttribute("href"),
    ]);
    expect(links).toEqual([
      [
        "Azure managed disks and Amazon EBS volumes can grow but can’t shrink in place",
        "/learn/shrink-azure-managed-disk",
      ],
      ["cost per request", "/learn/glossary/cloud-unit-economics"],
      ["tagging", "/learn/glossary/cloud-tagging-strategy"],
      ["on-demand", "/learn/glossary/on-demand-instance"],
      ["FinOps", "/learn/glossary/finops"],
      ["Coral", "/coral"],
      ["the cluster’s machines cost", "/coral-value-lab"],
    ]);
  });

  it("ships its share card within its size budget", () => {
    const file = "public/og/pages/learn-poor-architecture-cloud-costs.png";
    expect(readFileSync(file).length / 1024, file).toBeLessThan(200);
  });
});

describe("an article's cover", () => {
  it("is named by its alt text where the article gives one (W31), and read as decoration where it gives none", () => {
    const article = learnArticles.find((entry) => entry.slug === "vpa-vs-hpa")!;
    pathname.current = articleRoute(article);
    const altOf = (shown: Article) =>
      render(<ArticlePage article={shown} />)
        .container.querySelector("figure.ar-cover img")!
        .getAttribute("alt");
    expect(altOf(article)).toBe("VPA vs HPA: the VPA sets pod size, the HPA sets pod count");
    const bare: Article = { ...article };
    delete (bare as { coverAlt?: string }).coverAlt;
    expect(altOf(bare)).toBe("");
  });

  it("ships with every article from the 1 Nov release: its cover file, named by its alt text", () => {
    for (const article of learnArticles) {
      expect(article.cover, article.slug).toBe(
        `/learn-covers/zoorik-learn-${article.slug}-1200x630.webp`,
      );
      expect(existsSync(`public${article.cover}`), article.slug).toBe(true);
      expect(article.coverAlt?.length, article.slug).toBeGreaterThan(0);
      expect(article.coverAlt!.length, article.slug).toBeLessThanOrEqual(125);
      expect(article.coverAlt, article.slug).not.toMatch(/\.$|^image of/i);
    }
  });
});
