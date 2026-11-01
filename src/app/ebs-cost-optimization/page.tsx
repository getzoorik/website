import type { Metadata } from "next";

import { ebsCostOptimizationPage } from "@/content/cloud-pages";
import { CloudPage } from "@/features/cloud-page/cloud-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/cloud-page.css";

/**
 * `/ebs-cost-optimization`: Amoeba on Amazon EBS: what it does there, what onboarding sets up, what the instances need
 * and the questions. The Cloud template (`CloudPage`), word for word from its checked draft
 * (docs/website-seo/new-pages-2026-10-31/amoeba-for-aws/page.md). Indexed, and prerendered at build like every page
 * here: it reads no request data.
 */
/* Its title goes through the layout's template: "EBS cost optimization | Zoorik". */
export const metadata: Metadata = documentMetadata(
  ebsCostOptimizationPage.path,
  ebsCostOptimizationPage.meta,
);

export default function EbsCostOptimization(): React.JSX.Element {
  return <CloudPage content={ebsCostOptimizationPage} />;
}
