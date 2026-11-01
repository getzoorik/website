import type { Metadata } from "next";

import { awsCostOptimizationPage } from "@/content/topic-pages";
import { documentMetadata } from "@/features/documents/document-page";
import { TopicPage } from "@/features/topic-page/topic-page";

import "@/styles/cloud-page.css";
import "@/styles/article.css";
import "@/styles/open-source.css";
import "@/styles/topic-page.css";

/**
 * `/aws-cost-optimization`: how to reduce AWS costs, one cost line at a time, and where Coral and Amoeba fit. The
 * Topic template (`TopicPage`), word for word from its checked draft
 * (docs/website-seo/new-pages-2026-11-01/aws-cost-optimization/page.md). Indexed, and prerendered at build like
 * every page here: it reads no request data.
 */
/* Its title goes through the layout's template: "AWS cost optimization: how to reduce AWS costs | Zoorik". */
export const metadata: Metadata = documentMetadata(
  awsCostOptimizationPage.path,
  awsCostOptimizationPage.meta,
);

export default function AwsCostOptimization(): React.JSX.Element {
  return <TopicPage content={awsCostOptimizationPage} />;
}
