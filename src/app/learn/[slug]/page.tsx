import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Article } from "@/content/learn/article";
import { findArticle, learnArticles } from "@/content/learn/published";
import { articleMetadata, LearnArticleDocument } from "@/features/learn/article-route";

import "@/styles/article.css";

/**
 * `/learn/<slug>`: one Learn article, for every article in the Learn index but those served at an address of their
 * own (`route`: /cloud-cost-optimization and /kubernetes-cost-optimization, each its own page at the site's root).
 * Each is prerendered at build, indexed, listed in the sitemap and titled from its own file, with its own share card
 * or the /learn one. Any other slug is a 404 (`dynamicParams = false`, and `notFound()` for a direct call); the old
 * /learn/<slug> of an article that moved is a 301 to its new address (next.config.ts), which runs before this route.
 */
export const dynamicParams = false;

/** The articles this route serves: every one with no address of its own. */
const servedHere = (article: Article): boolean => article.route === undefined;

export function generateStaticParams(): { slug: string }[] {
  return learnArticles.filter(servedHere).map((article) => ({ slug: article.slug }));
}

const articleOf = async (params: Promise<{ slug: string }>): Promise<Article> => {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article || !servedHere(article)) notFound();
  return article;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return articleMetadata(await articleOf(params));
}

export default async function LearnArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  return <LearnArticleDocument article={await articleOf(params)} />;
}
