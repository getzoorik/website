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
 * `/learn/shrink-azure-managed-disk`: "Can you shrink an Azure managed disk?".
 * Indexed, listed in the sitemap, and prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(
  routes.learnShrinkAzureDisk,
  articles["shrink-azure-managed-disk"].meta,
  pageCards.learnShrinkAzureDisk,
);

export default function LearnShrinkAzureDisk(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.learnShrinkAzureDisk)} />
      <ArticlePage id="shrink-azure-managed-disk" />
    </>
  );
}
