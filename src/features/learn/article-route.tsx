import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import type { Article } from "@/content/learn/article";
import { articleRoute } from "@/content/learn/published";
import { documentMetadata } from "@/features/documents/document-page";
import { ArticlePage } from "@/features/learn/article-page";

/**
 * What a Learn article's address serves, wherever the article lives: /learn/<slug>, or its own `route` at the site's
 * root (/cloud-cost-optimization, /kubernetes-cost-optimization). One metadata function and one page, so the two
 * kinds of address never differ but by where they are.
 */

/** Its metadata: titled from its own file, canonical at its own address, with its own share card or the /learn one. */
export const articleMetadata = (article: Article): Metadata =>
  documentMetadata(articleRoute(article), {
    title: article.title,
    description: article.meta,
  });

/** Its page: its structured data, then the article. */
export function LearnArticleDocument({
  article,
}: {
  readonly article: Article;
}): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(articleRoute(article))} />
      <ArticlePage article={article} />
    </>
  );
}
