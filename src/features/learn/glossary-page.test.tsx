import { existsSync, readdirSync } from "node:fs";

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { glossaryPath, routes } from "@/config/site";
import { cardFor, pageCards } from "@/config/social";
import type { ArticleBlock, ArticleItem, ArticleText } from "@/content/learn/article";
import { findTerm, glossaryTerms, termCard } from "@/content/learn/glossary";
import { glossaryFiles } from "@/content/learn/glossary.generated";
import { glossaryGroups, type GlossaryTerm } from "@/content/learn/glossary-term";
import { isLiveHref, learnSlugOf } from "@/content/learn/published";
import { products } from "@/content/products";
import { isoDay, printedDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/learn/glossary" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import GlossaryTermPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "@/app/learn/glossary/[slug]/page";

/**
 * The glossary terms, every one in the index, in the Learn articles' design: the metadata and the share card, the
 * hero with its trail back to Learn and the glossary, the frame (each section's name beside its text, the names as
 * chips), the Updated line, the definition first, the one drawn figure under its caption, the lists, the article to
 * read next, the sources, the Related terms tiles and the closing row for the term's product; no help box, author or
 * cover, and no link to a page that is not published. Every page's expectations are read from the term's own file;
 * the index's counts pin the 25 October plan (thirty terms, ten in each group). The sitemap is in
 * `src/app/sitemap.test.ts`, the structured data in `src/config/structured-data.test.ts`, the hub in
 * `glossary-hub.test.tsx`.
 */

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Words as `text` reads them: a no-break space between a figure and its unit reads as a space. */
const words = (value: string): string => value.replace(/\s+/g, " ").trim();

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

const main = async (slug: string): Promise<HTMLElement> => {
  pathname.current = glossaryPath(slug);
  return render(await GlossaryTermPage(params(slug))).container.querySelector("main")!;
};

const blocksOf = (term: GlossaryTerm): readonly ArticleBlock[] => [
  ...term.definition,
  ...term.sections.flatMap((section) => section.blocks),
];

/** A run of text as plain words: links and code as their words. */
const plain = (run: ArticleText): string =>
  typeof run === "string"
    ? run
    : run
        .map((piece) => {
          if (typeof piece === "string") return piece;
          if ("b" in piece) return plain(piece.b);
          if ("code" in piece) return piece.code;
          return typeof piece.a === "string" ? piece.a : piece.a.code;
        })
        .join("");

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

/** Every run of text in some blocks, a list item's own included, in the order the page prints them. */
const runsIn = (blocks: readonly ArticleBlock[]): readonly ArticleText[] =>
  blocks.flatMap((block): readonly ArticleText[] => {
    switch (block.kind) {
      case "p":
      case "callout":
        return [block.text];
      case "svg":
        return [block.figure.caption];
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
      default:
        return [];
    }
  });

describe("the glossary index", () => {
  it("lists every term file once, A–Z, each named by its slug: the sixty terms of the two 25 October plans", () => {
    const files = readdirSync("src/content/learn/glossary")
      .filter((name) => name.endsWith(".ts"))
      .map((name) => name.slice(0, -3))
      .sort();
    expect(glossaryFiles.map((entry) => entry.file)).toEqual(files);
    for (const { file, term } of glossaryFiles) expect(term.slug, file).toBe(file);
    expect(glossaryTerms.map((term) => term.slug)).toEqual(files);
    expect(files).toHaveLength(60);
  });

  it("dates every term by real ISO days, published on or before today, and updated no earlier", () => {
    const today = learnToday();
    for (const term of glossaryTerms) {
      for (const day of [term.published, term.updated]) {
        expect(day, term.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(isoDay(printedDay(day)), term.slug).toBe(day);
      }
      expect(term.published <= today, `${term.slug} is published ${term.published}`).toBe(true);
      expect(term.updated >= term.published, term.slug).toBe(true);
      expect(term.updated <= today, term.slug).toBe(true);
    }
  });

  it("draws a link to a term only once it is published, and takes the hub for neither an article nor a term", () => {
    const [first] = glossaryTerms;
    expect(isLiveHref(glossaryPath(first!.slug))).toBe(true);
    expect(isLiveHref(`${glossaryPath(first!.slug)}#why-it-matters-for-your-cloud-cost`)).toBe(
      true,
    );
    expect(isLiveHref("/learn/glossary/no-such-term")).toBe(false);
    expect(isLiveHref(routes.learnGlossary)).toBe(true);
    expect(learnSlugOf(routes.learnGlossary)).toBeNull();
    expect(learnSlugOf(glossaryPath(first!.slug))).toBeNull();
    /* A term with no card of its own would share the glossary's. */
    expect(cardFor("/learn/glossary/no-such-term")).toBe(pageCards[routes.learnGlossary]);
  });

  it("files every term under one of the three groups: 13 Kubernetes, 19 block storage, 28 FinOps and pricing", () => {
    expect(
      glossaryGroups.map((group) => glossaryTerms.filter((term) => term.group === group.id).length),
    ).toEqual([13, 19, 28]);
  });

  it('says "cloud cost", never "bill", in its own words: only a vendor\'s own name or a source\'s address keeps it', () => {
    /* The owner, 26 Oct 2026. A source's title is the vendor's own, so a term's sources are left out. */
    const vendor = /Billing and Cost Management|Billing User Guide|billing account/g;
    for (const term of glossaryTerms) {
      const own = JSON.stringify({ ...term, sources: [] })
        .replace(/https?:\/\/[^"\s]+/g, "")
        .replace(vendor, "");
      expect(own.match(/\bbill(s|ed|ing)?\b/gi), term.slug).toBeNull();
    }
  });

  it("titles a term by its h1, opens it on its definition, and draws its one figure from its own module", () => {
    for (const term of glossaryTerms) {
      expect(term.title, term.slug).toBe(term.h1);
      expect(term.definition[0]?.kind, term.slug).toBe("p");
      /* The hub's line is the definition's first sentence. */
      const opening = plain((term.definition[0] as { text: ArticleText }).text);
      expect(opening.startsWith(term.card), term.slug).toBe(true);
      expect(term.card, term.slug).toMatch(/[.?!]$/);
      expect(
        blocksOf(term).filter((block) => block.kind === "svg"),
        term.slug,
      ).toHaveLength(1);
      expect(
        blocksOf(term).some((block) => block.kind === "diagram" || block.kind === "figure"),
      ).toBe(false);
      expect(existsSync(`src/features/learn/figures/glossary/${term.slug}/1.ts`), term.slug).toBe(
        true,
      );
      expect(term.sections.length, term.slug).toBeGreaterThanOrEqual(1);
      expect(term.sections.length, term.slug).toBeLessThanOrEqual(3);
      expect(term.sections.map((section) => section.title)).toContain(
        "Why it matters for your cloud cost",
      );
    }
  });

  it("relates three or four other terms, each one published", () => {
    for (const term of glossaryTerms) {
      expect(term.related.length, term.slug).toBeGreaterThanOrEqual(3);
      expect(term.related.length, term.slug).toBeLessThanOrEqual(4);
      for (const tile of term.related) {
        const target = findTerm(tile.href.slice(`${routes.learnGlossary}/`.length));
        expect(target, `${term.slug} → ${tile.href}`).toBeDefined();
        expect(target!.slug, term.slug).not.toBe(term.slug);
        expect(tile.line, tile.href).toMatch(/^[A-Z].*[.?!]$/);
      }
      /* Each tile is keyed by its title, never its address: the titles are each the tile's own. */
      expect(new Set(term.related.map((tile) => tile.title)).size, term.slug).toBe(
        term.related.length,
      );
    }
  });
});

describe("/learn/glossary/[slug]", () => {
  it("prerenders every term in the index and nothing else", async () => {
    expect(dynamicParams).toBe(false);
    expect(generateStaticParams()).toEqual(glossaryTerms.map((term) => ({ slug: term.slug })));
    await expect(GlossaryTermPage(params("no-such-term"))).rejects.toThrow();
  });
});

describe.each(glossaryTerms.map((term) => term.slug))("/learn/glossary/%s", (slug) => {
  const term = findTerm(slug)!;
  const route = glossaryPath(slug);

  it("titles, describes and canonicalises the page in its own words, with its own card", async () => {
    const meta = await generateMetadata(params(slug));
    expect(meta.title).toBe(term.title);
    expect(meta.description).toBe(term.meta);
    expect(meta.alternates).toEqual({ canonical: route });
    expect(meta).not.toHaveProperty("robots");
    expect(meta.openGraph).toMatchObject({
      url: route,
      title: `${term.title} | Zoorik`,
      description: term.meta,
      images: [termCard(term)],
    });
    expect(termCard(term)).toBe(pageCards[route]);
    expect(termCard(term).url).toBe(`/og/pages/glossary-${slug}.png`);
  });

  it("opens on the utility hero: the trail back to Learn and the glossary over the h1, and no deck", async () => {
    const hero = (await main(slug)).querySelector("header.hero.doc-hero.gl-hero#top")!;
    expect(text(hero.querySelector("h1"))).toBe(words(term.h1));
    const trail = hero.querySelector("p.cs-kick")!;
    expect(text(trail)).toBe("Learn / Glossary");
    expect([...trail.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["Learn", "/learn"],
      ["Glossary", "/learn/glossary"],
    ]);
    /* `gl-kl` names no rule but keeps each step out of the site's plain-link rules (white, underlined): they rest at
       the kicker's colour, as the "/" between them does. */
    for (const a of trail.querySelectorAll("a")) expect(a).toHaveAttribute("class", "gl-kl");
    expect(hero.querySelector(".doc-deck, .as-switch, .dl, img")).toBeNull();
  });

  it("keeps its sections in order, each section's name beside its open text, named as chips on a phone", async () => {
    const container = await main(slug);
    const frame = container.querySelector("article.doc-main.fq-main.ar-frame")!;
    const sections = [...frame.querySelectorAll(":scope > section.fq-sec")];
    expect(sections.map((section) => section.id)).toEqual(term.sections.map((s) => s.id));
    expect(sections.map((section) => text(section.querySelector("h2")))).toEqual(
      term.sections.map((s) => words(s.title)),
    );
    for (const section of sections) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.lastElementChild).toHaveClass("fq-sec-b", "doc-prose");
    }
    /* Related terms are the tiles under the frame, not a section of it. */
    expect(sections.map((section) => text(section.querySelector("h2")))).not.toContain(
      "Related terms",
    );
    expect(frame.querySelector("details")).toBeNull();
    expect(
      [...container.querySelectorAll("nav.fq-chips a")].map((a) => a.getAttribute("href")),
    ).toEqual(term.sections.map((section) => `#${section.id}`));
  });

  it("opens the frame on its Updated line, published by Zoorik, then the definition", async () => {
    const top = (await main(slug)).querySelector(".ar-frame > .fq-upd.doc-prose:first-child")!;
    const updated = top.querySelector(":scope > p.doc-updated:first-child")!;
    expect(text(updated)).toBe(`Updated ${printedDay(term.updated)} · Published by Zoorik`);
    expect(updated.querySelector("a")).toHaveAttribute("href", "/about");
    const definition = updated.nextElementSibling!;
    expect(definition).toHaveClass("ar-short");
    expect(text(definition)).toBe(words(plain((term.definition[0] as { text: ArticleText }).text)));
    expect(text(definition).startsWith(words(term.card))).toBe(true);
    /* No author, no cover, no "Short answer." label. */
    expect(text(top)).not.toMatch(/ · By |Short answer\./);
    expect(top.querySelector("figure.ar-cover, img")).toBeNull();
  });

  it("draws its one figure as its SVG, named for the ear, under its caption, with no figure number", async () => {
    const figures = [...(await main(slug)).querySelectorAll(".ar-frame figure.ar-fig")];
    expect(figures).toHaveLength(1);
    const [figure] = figures;
    const svg = figure!.querySelector(":scope > .ar-fig-s > svg")!;
    expect(svg).toHaveAttribute("role", "img");
    for (const id of svg.getAttribute("aria-labelledby")!.split(" "))
      expect(svg.querySelector(`#${id}`)?.textContent?.trim(), id).toBeTruthy();
    expect(svg.textContent).not.toMatch(/FIG \d+ \/\//);
    const block = blocksOf(term).find((entry) => entry.kind === "svg")!;
    expect(text(figure!.querySelector("figcaption"))).toBe(
      words(plain((block as { figure: { caption: ArticleText } }).figure.caption)),
    );
  });

  it("sets its lists and its command as the draft writes them", async () => {
    const frame = (await main(slug)).querySelector(".ar-frame")!;
    const lists = [...frame.querySelectorAll(".doc-prose > ul, .fq-sec-b > ul")];
    expect(lists).toHaveLength(blocksOf(term).filter((block) => block.kind === "ul").length);
    expect(lists.length).toBeGreaterThan(0);
    expect(frame.querySelectorAll(".doc-well")).toHaveLength(
      blocksOf(term).filter((block) => block.kind === "code").length,
    );
  });

  it("links a body's words only to pages that are published, and keeps the words of the rest", async () => {
    const frame = (await main(slug)).querySelector(".ar-frame")!;
    const drawn = [...frame.querySelectorAll("a")]
      .filter((a) => !a.closest("p.doc-updated, .ar-foot"))
      .map((a) => a.getAttribute("href")!);
    const pieces = runsIn(blocksOf(term)).flatMap(linksOf);
    expect(drawn).toEqual(pieces.filter((piece) => isLiveHref(piece.href)).map((p) => p.href));
    for (const piece of pieces.filter((p) => !isLiveHref(p.href))) {
      expect(text(frame), piece.href).toContain(words(piece.a));
      expect(frame.querySelector(`a[href="${piece.href}"]`), piece.href).toBeNull();
    }
    /* Every body link is on this site; none is to the old case study address. */
    expect(pieces.every((piece) => piece.href.startsWith("/"))).toBe(true);
    expect(pieces.some((piece) => piece.href.startsWith("/case-studies"))).toBe(false);
  });

  it("closes the frame on Read next and the sources, with no help box", async () => {
    const container = await main(slug);
    const foot = container.querySelector(".ar-frame > .fq-upd.ar-foot.doc-prose:last-child")!;
    expect(container.querySelector(".doc-help, aside.doc-call:not(.ar-call)")).toBeNull();
    expect(text(container)).not.toMatch(/How (Coral|Amoeba) helps/);
    const next = foot.querySelector(":scope > p.gl-next:first-child")!;
    /* The draft's words, linked once the article is published and plain text until then. */
    expect(text(next)).toBe(`Read next: ${words(term.next.title)}`);
    const a = next.querySelector("a");
    if (isLiveHref(term.next.href)) {
      expect(a).toHaveAttribute("href", term.next.href);
      expect(text(a)).toBe(words(term.next.title));
    } else expect(a).toBeNull();
    const sources = foot.querySelector(":scope > p.ar-src:last-child")!;
    expect(text(sources)).toMatch(/^Sources: .*\.$/);
    const links = [...sources.querySelectorAll("a")];
    expect(links.map((source) => source.getAttribute("href"))).toEqual(
      term.sources.map((source) => source.url),
    );
    for (const source of links) {
      expect(source).toHaveAttribute("target", "_blank");
      expect(source).toHaveAttribute("rel", "noopener noreferrer");
      expect(source.textContent).toMatch(/ \(opens in a new tab\)$/);
    }
  });

  it("draws its Related terms as the articles' Related tiles, each a term with its line", async () => {
    const related = (await main(slug)).querySelector("section.sec.ar-rel#related")!;
    expect(related).toHaveAttribute("aria-labelledby", "related-h");
    expect(text(related.querySelector("h2#related-h"))).toBe("Related terms");
    const tiles = [...related.querySelectorAll("article.dt > .dt-a")];
    expect(
      tiles.map((tile) => [
        tile.getAttribute("href"),
        text(tile.querySelector(".dt-t")),
        text(tile.querySelector(".dt-l")),
      ]),
    ).toEqual(term.related.map((tile) => [tile.href, words(tile.title), words(tile.line)]));
  });

  it("ends on the closing row for its product", async () => {
    const row = (await main(slug)).querySelector("section#assess")!;
    const product = term.product === "both" ? null : term.product;
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
    expect(container.innerHTML).not.toMatch(/\[OWNER|\[DIAGRAM|\[set at publish\]|ph-chip|To come/);
    const loose = [...container.querySelectorAll(".ar-frame p, .ar-frame li, .ar-frame h2")].filter(
      (el) => {
        const own = [...el.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent)
          .join("");
        return /\b(Coral|Amoeba|Zoorik)\b/.test(own);
      },
    );
    expect(loose.map(text)).toEqual([]);
  });
});
