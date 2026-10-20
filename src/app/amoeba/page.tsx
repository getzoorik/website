import type { Metadata } from "next";

import { amoebaPageContent } from "@/content/amoeba-page";
import { ProductPage } from "@/features/product-page/product-page";
import { productPageMetadata } from "@/features/product-page/product-page-meta";

/**
 * `/amoeba` — Amoeba's own page: Block storage cost optimization for Windows
 * and Linux VMs on Azure and AWS. Indexed, and prerendered at build like every
 * page here: it reads no request data.
 */
export const metadata: Metadata = productPageMetadata(amoebaPageContent);

export default function AmoebaPage(): React.JSX.Element {
  return <ProductPage content={amoebaPageContent} />;
}
