import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import type { Article } from "@/content/learn/article";
import { articleCard, articleRoute, findArticle, learnArticles } from "@/content/learn/published";
import { documentMetadata } from "@/features/documents/document-page";
import { ArticlePage } from "@/features/learn/article-page";

import "@/styles/article.css";

/**
 * `/learn/<slug>`: one Learn article, for every article in the Learn index. Each is prerendered at build, indexed,
 * listed in the sitemap and titled from its own file, with its own share card or the /learn one. Any other slug is a
 * 404 (`dynamicParams = false`, and `notFound()` for a direct call).
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

const articleOf = async (params: Promise<{ slug: string }>): Promise<Article> => {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return article;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await articleOf(params);
  return documentMetadata(
    articleRoute(article),
    { title: article.title, description: article.meta },
    articleCard(article),
  );
}

export default async function LearnArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const article = await articleOf(params);
  return (
    <>
      <JsonLd data={pageStructuredData(articleRoute(article))} />
      <ArticlePage article={article} />
    </>
  );
}
