import type { Metadata } from "next";

import { coralForEksPage } from "@/content/cloud-pages";
import { CloudPage } from "@/features/cloud-page/cloud-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/cloud-page.css";

/**
 * `/coral-for-eks`: Coral on Amazon Elastic Kubernetes Service (EKS): what it does there, what connect sets up, the
 * works-with pages that apply and the questions. The Cloud template (`CloudPage`), word for word from its checked draft
 * (docs/website-seo/new-pages-2026-10-31/coral-for-eks/page.md). Indexed, and prerendered at build like every page
 * here: it reads no request data.
 */
/* Its title goes through the layout's template: "EKS cost optimization | Zoorik". */
export const metadata: Metadata = documentMetadata(coralForEksPage.path, coralForEksPage.meta);

export default function CoralForEks(): React.JSX.Element {
  return <CloudPage content={coralForEksPage} />;
}
