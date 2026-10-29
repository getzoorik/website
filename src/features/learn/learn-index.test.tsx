import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { glossaryPath, learnPath } from "@/config/site";
import { authors } from "@/content/authors";
import type { ArticleBlock } from "@/content/learn/article";
import { articleFiles } from "@/content/learn/articles.generated";
import { glossaryTerms } from "@/content/learn/glossary";
import { articleAuthor, learnArticles } from "@/content/learn/published";
import { versusPages, versusRoute } from "@/content/learn-compare";
import { isoDay, printedDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

/* The nav and the footer read the pathname: each page is rendered at its own. */
const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import LearnArticle from "@/app/learn/[slug]/page";
import GlossaryTermPage from "@/app/learn/glossary/[slug]/page";

import { ArticleFigure } from "./article-figures";

/**
 * The Learn index and the rules every article file keeps, whatever it says: its slug is its file's name, its days
 * are real and not ahead of today (`LEARN_TODAY` when set), its author is one of `authors.ts`, every figure it names
 * is drawn, and no page that links into Learn draws a link to a page that does not exist.
 */

const blocksOf = (slug: string): readonly ArticleBlock[] => {
  const article = learnArticles.find((entry) => entry.slug === slug)!;
  return [...(article.lead ?? []), ...article.sections.flatMap((section) => section.blocks)];
};

/** Every page route the app serves: each page.tsx folder, each article, each glossary term and each versus page. */
function routes(dir = "src/app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return routes(path, `${base}/${name}`);
    if (name !== "page.tsx") return [];
    if (base === "/learn/[slug]") return learnArticles.map((article) => learnPath(article.slug));
    if (base === "/learn/glossary/[slug]")
      return glossaryTerms.map((term) => glossaryPath(term.slug));
    if (base === "/compare/[slug]") return versusPages.map(versusRoute);
    return [base === "" ? "/" : base];
  });
}

describe("the Learn index", () => {
  it("lists every article file once, A–Z, each named by its slug", () => {
    const files = readdirSync("src/content/learn/articles")
      .filter((name) => name.endsWith(".ts"))
      .map((name) => name.slice(0, -3))
      .sort();
    expect(articleFiles.map((entry) => entry.file)).toEqual(files);
    for (const { file, article } of articleFiles) expect(article.slug, file).toBe(file);
    expect(learnArticles.map((article) => article.slug)).toEqual(files);
  });

  it("dates every article by real ISO days, published on or before today, and updated no earlier", () => {
    const today = learnToday();
    for (const article of learnArticles) {
      for (const day of [article.published, article.updated]) {
        expect(day, article.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(isoDay(printedDay(day)), article.slug).toBe(day);
      }
      expect(article.published <= today, `${article.slug} is published ${article.published}`).toBe(
        true,
      );
      expect(article.updated >= article.published, article.slug).toBe(true);
      expect(article.updated <= today, article.slug).toBe(true);
    }
  });

  it("publishes every article under Zoorik or an author of authors.ts", () => {
    for (const article of learnArticles) {
      if (article.author === "zoorik") expect(articleAuthor(article)).toBeNull();
      else expect(Object.keys(authors), article.slug).toContain(article.author);
    }
    for (const [key, author] of Object.entries(authors)) {
      expect(author.guest, key).toBe(author.role.startsWith("Guest author"));
      expect(author.name.trim(), key).not.toBe("");
      expect(`${author.name} ${author.role}`, key).not.toMatch(/["']/);
      if (author.linkedin)
        expect(author.linkedin, key).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[^/]+\/$/);
    }
  });

  it("draws every figure an article names", () => {
    for (const article of learnArticles) {
      for (const block of blocksOf(article.slug)) {
        if (block.kind !== "figure") continue;
        const figure = render(<ArticleFigure figure={block.figure} />).container;
        expect(
          figure.querySelector("figure.ln-d"),
          `${article.slug}: ${block.figure}`,
        ).not.toBeNull();
        cleanup();
      }
      for (const block of blocksOf(article.slug)) {
        if (block.kind === "image") expect(existsSync(`public${block.src}`), block.src).toBe(true);
      }
      /* An article's own diagrams are numbered in its order, each in its own module, its style scoped to it. */
      const diagrams = blocksOf(article.slug).flatMap((block) =>
        block.kind === "diagram" ? [block.figure] : [],
      );
      diagrams.forEach((figure, index) => {
        const name = `fg-${article.slug}-${index + 1}`;
        expect(figure.className, article.slug).toBe(`ln-d ${name}`);
        expect(existsSync(`src/features/learn/figures/${article.slug}/${index + 1}.ts`), name).toBe(
          true,
        );
        expect(figure.label, name).toMatch(/^Diagram\. \S/);
        /* The label is an attribute's text, set as given: a character reference in it would be read out as written. */
        expect(figure.label, name).not.toMatch(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/i);
        expect(figure.html.trim(), name).not.toBe("");
        for (const rule of figure.style.replace(/\/\*[\s\S]*?\*\//g, "").match(/[^{}]+(?=\{)/g) ??
          []) {
          if (!rule.trim().startsWith("@")) expect(rule, name).toContain(`.${name}`);
        }
      });
      /* Its diagrams and drawn figures share one numbering, each in its own module. */
      blocksOf(article.slug)
        .filter((block) => block.kind === "diagram" || block.kind === "svg")
        .forEach((_, index) =>
          expect(
            existsSync(`src/features/learn/figures/${article.slug}/${index + 1}.ts`),
            `${article.slug}-${index + 1}`,
          ).toBe(true),
        );
      /* Every article carries its drawn cover, shown under its byline and on its /learn tile (21 Oct 2026). The
         generator sets `cover` only when the file exists as it runs, so an article built before its cover lands
         would ship without one. */
      expect(article.cover, article.slug).toBe(
        `/learn-covers/zoorik-learn-${article.slug}-1200x630.webp`,
      );
      expect(existsSync(`public${article.cover}`), article.cover).toBe(true);
    }
  });

  /* It renders every article and glossary term, and the pages that link into Learn. */
  it("draws no link to a page that does not exist, on Learn or the pages that link into it", async () => {
    const known = new Set(routes());
    const pages: [string, () => Promise<React.JSX.Element>][] = [
      ...learnArticles.map(
        (article) =>
          [
            learnPath(article.slug),
            () => LearnArticle({ params: Promise.resolve({ slug: article.slug }) }),
          ] as [string, () => Promise<React.JSX.Element>],
      ),
      ...glossaryTerms.map(
        (term) =>
          [
            glossaryPath(term.slug),
            () => GlossaryTermPage({ params: Promise.resolve({ slug: term.slug }) }),
          ] as [string, () => Promise<React.JSX.Element>],
      ),
      ...[
        "learn",
        "learn/glossary",
        "coral-guide",
        "coral-faq",
        "amoeba-guide",
        "amoeba-faq",
        "coral",
        "amoeba",
      ].map(
        (folder) =>
          [
            `/${folder}`,
            async () => {
              const page = (await import(
                /* @vite-ignore */ join(process.cwd(), `src/app/${folder}/page.tsx`)
              )) as { default: ComponentType };
              return createElement(page.default);
            },
          ] as [string, () => Promise<React.JSX.Element>],
      ),
    ];
    const missing: string[] = [];
    for (const [path, draw] of pages) {
      pathname.current = path;
      const { container } = render(await draw());
      for (const a of container.querySelectorAll("a[href^='/']")) {
        const href = a.getAttribute("href")!;
        const target = href.split(/[?#]/)[0]!.replace(/(.)\/$/, "$1");
        if (!known.has(target) && !existsSync(`public${target}`)) missing.push(`${path} → ${href}`);
      }
      cleanup();
    }
    expect(missing).toEqual([]);
  }, 40_000);
});
