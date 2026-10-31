import { learnPath } from "@/config/site";
import { cardFor, type ShareImage } from "@/config/social";
import { authors, type Author } from "@/content/authors";

import type { Article } from "./article";
import { articleFiles } from "./articles.generated";
import { findTerm, glossarySlugOf } from "./glossary";

/**
 * The Learn index: every published article, read from the generated list of article files. Everything per article
 * reads it (the page and its metadata, the structured data, the sitemap and the hub), so publishing an article is
 * adding its file, and a link to an article that is not published yet is never drawn.
 */

/** Every published article, A–Z by slug. */
export const learnArticles: readonly Article[] = articleFiles.map((entry) => entry.article);

const bySlug = new Map(learnArticles.map((article) => [article.slug, article]));

/** The published article with this slug, if there is one. */
export function findArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

/** The published article with this slug; a slug that is not published throws, at build. */
export function articleAt(slug: string): Article {
  const article = bySlug.get(slug);
  if (!article) throw new Error(`No published Learn article "${slug}"`);
  return article;
}

/**
 * An article's address: the one its file names (`route`), else /learn/<slug>. Every page, list and index that leads
 * to an article builds its address here.
 */
export const articleRoute = (article: Article): `/${string}` =>
  article.route ?? learnPath(article.slug);

/** The articles with an address of their own (`route`), by that address. */
const byRoute: ReadonlyMap<string, Article> = new Map(
  learnArticles.flatMap((article) => (article.route ? [[article.route, article] as const] : [])),
);

/** The published article served at this address of its own (`route`); none there throws, at build. */
export function articleServedAt(route: `/${string}`): Article {
  const article = byRoute.get(route);
  if (!article) throw new Error(`No published Learn article at "${route}"`);
  return article;
}

/**
 * The slug a link names when it leads to a Learn article (`/learn/<slug>`, or an article's own `route`, with or without
 * a hash or query). The glossary's hub, /learn/glossary, is not an article.
 */
export function learnSlugOf(href: string): string | null {
  const path = /^[^?#]*/.exec(href)![0];
  const match = /^\/learn\/([^/]+)$/.exec(path);
  return byRoute.get(path)?.slug ?? (match && match[1] !== "glossary" ? match[1]! : null);
}

/** Whether a link may be drawn: anything but a link to a Learn article or a glossary term that is not published. */
export function isLiveHref(href: string): boolean {
  const slug = learnSlugOf(href);
  if (slug !== null) return bySlug.has(slug);
  const term = glossarySlugOf(href);
  return term === null || findTerm(term) !== undefined;
}

/**
 * A link named by its target: to a published article, that article's h1; to one not yet published, the link's own
 * words and no address, so it is drawn as plain text; to any other page, the link as written.
 */
export function titleLink(link: { readonly text: string; readonly href: string }): {
  readonly text: string;
  readonly href: string | null;
} {
  const slug = learnSlugOf(link.href);
  if (slug === null) return link;
  const article = bySlug.get(slug);
  return article ? { text: article.h1, href: link.href } : { text: link.text, href: null };
}

/** The person an article is published under, or null when it is published under Zoorik alone. */
export function articleAuthor(article: Article): Author | null {
  return article.author === "zoorik" ? null : authors[article.author];
}

/** An article's share card: its own where it has one, else the /learn card (`cardFor`). */
export function articleCard(article: Article): ShareImage {
  return cardFor(articleRoute(article));
}
