import type { Metadata } from "next";

import { azureCostOptimizationPage } from "@/content/topic-pages";
import { documentMetadata } from "@/features/documents/document-page";
import { TopicPage } from "@/features/topic-page/topic-page";

import "@/styles/cloud-page.css";
import "@/styles/article.css";
import "@/styles/open-source.css";
import "@/styles/topic-page.css";

/**
 * `/azure-cost-optimization`: how to reduce Azure costs, one cost line at a time, and where Coral and Amoeba fit. The
 * Topic template (`TopicPage`) with this page's content from `topic-pages.ts`. Indexed, and prerendered at build like
 * every page here: it reads no request data.
 */
/* Its title goes through the layout's template: "Azure cost optimization | Zoorik". */
export const metadata: Metadata = documentMetadata(
  azureCostOptimizationPage.path,
  azureCostOptimizationPage.meta,
);

export default function AzureCostOptimization(): React.JSX.Element {
  return <TopicPage content={azureCostOptimizationPage} />;
}
