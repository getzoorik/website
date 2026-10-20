import type { Metadata } from "next";

import { coralPageContent } from "@/content/coral-page";
import { ProductPage } from "@/features/product-page/product-page";
import { productPageMetadata } from "@/features/product-page/product-page-meta";

/**
 * `/coral` — Coral's own page: Kubernetes cost optimization on AKS and EKS. Indexed,
 * and prerendered at build like every page here: it reads no request data.
 */
export const metadata: Metadata = productPageMetadata(coralPageContent);

export default function CoralPage(): React.JSX.Element {
  return <ProductPage content={coralPageContent} />;
}
