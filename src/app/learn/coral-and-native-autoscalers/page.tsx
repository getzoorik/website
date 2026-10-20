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
 * `/learn/coral-and-native-autoscalers`: "Coral and the native Kubernetes autoscalers".
 * Indexed, listed in the sitemap, and prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(
  routes.learnCoralAutoscalers,
  articles["coral-and-native-autoscalers"].meta,
  pageCards.learnCoralAutoscalers,
);

export default function LearnCoralAutoscalers(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.learnCoralAutoscalers)} />
      <ArticlePage id="coral-and-native-autoscalers" />
    </>
  );
}
