import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { articles } from "@/content/learn-articles";
import { documentMetadata } from "@/features/documents/document-page";
import { ArticlePage } from "@/features/learn/article-page";

import "@/styles/article.css";

/**
 * `/learn/vpa-vs-hpa`: "VPA vs HPA: rebalance first, then scale out".
 * Indexed, listed in the sitemap, and prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(
  routes.learnVpaVsHpa,
  articles["vpa-vs-hpa"].meta,
  pageCards.learn,
);

export default function LearnVpaVsHpa(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.learnVpaVsHpa)} />
      <ArticlePage id="vpa-vs-hpa" />
    </>
  );
}
