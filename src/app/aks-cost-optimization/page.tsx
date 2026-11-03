import type { Metadata } from "next";

import { aksCostOptimizationPage } from "@/content/cloud-pages";
import { CloudPage } from "@/features/cloud-page/cloud-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/cloud-page.css";

/**
 * `/aks-cost-optimization`: Coral on Azure Kubernetes Service (AKS): what it does there, how it works, what connect
 * sets up, the works-with pages that apply and the questions. The Cloud template (`CloudPage`), its words in
 * `cloud-pages.ts`. Indexed, and prerendered at build like every page here: it reads no request data.
 */
/* Its title goes through the layout's template: "AKS cost optimization | Zoorik". */
export const metadata: Metadata = documentMetadata(
  aksCostOptimizationPage.path,
  aksCostOptimizationPage.meta,
);

export default function AksCostOptimization(): React.JSX.Element {
  return <CloudPage content={aksCostOptimizationPage} />;
}
