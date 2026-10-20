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
 * `/learn/poor-architecture-cloud-bill`: "How Poor Infrastructure Architecture Quietly Increases
 * Your Cloud Bill", first published here; Medium copies it with a canonical
 * link to this page. Indexed, listed in the sitemap, and prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(
  routes.learnPoorArchitecture,
  articles["poor-architecture-cloud-bill"].meta,
  pageCards.learnPoorArchitecture,
);

export default function LearnPoorArchitecture(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.learnPoorArchitecture)} />
      <ArticlePage id="poor-architecture-cloud-bill" />
    </>
  );
}
