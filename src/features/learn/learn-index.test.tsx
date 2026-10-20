import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { learnPath } from "@/config/site";
import { authors } from "@/content/authors";
import type { ArticleBlock } from "@/content/learn/article";
import { articleFiles } from "@/content/learn/articles.generated";
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

/** Every page route the app serves: each page.tsx folder, each article and each versus page. */
function routes(dir = "src/app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return routes(path, `${base}/${name}`);
    if (name !== "page.tsx") return [];
    if (base === "/learn/[slug]") return learnArticles.map((article) => learnPath(article.slug));
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
      if (article.shareCard) expect(existsSync(`public${article.shareCard.url}`)).toBe(true);
    }
  });

  /* It renders every article and the pages that link into Learn. */
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
      ...["learn", "coral/guide", "coral/faq", "amoeba/guide", "amoeba/faq", "coral", "amoeba"].map(
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
  }, 20_000);
});
