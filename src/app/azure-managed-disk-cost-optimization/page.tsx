import type { Metadata } from "next";

import { azureManagedDiskCostOptimizationPage } from "@/content/cloud-pages";
import { CloudPage } from "@/features/cloud-page/cloud-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/cloud-page.css";

/**
 * `/azure-managed-disk-cost-optimization`: Amoeba on Azure managed disks: what it does there, what onboarding sets up,
 * what the VMs need and the questions. The Cloud template (`CloudPage`), word for word from its checked draft
 * (docs/website-seo/new-pages-2026-10-31/amoeba-for-azure/page.md). Indexed, and prerendered at build like every page
 * here: it reads no request data.
 */
/* Its title goes through the layout's template: "Azure managed disk cost optimization | Zoorik". */
export const metadata: Metadata = documentMetadata(
  azureManagedDiskCostOptimizationPage.path,
  azureManagedDiskCostOptimizationPage.meta,
);

export default function AzureManagedDiskCostOptimization(): React.JSX.Element {
  return <CloudPage content={azureManagedDiskCostOptimizationPage} />;
}
