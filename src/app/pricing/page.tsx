import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { pricingPage } from "@/content/pricing";
import { documentMetadata } from "@/features/documents/document-page";
import { PricingPage } from "@/features/pricing/pricing-page";

import "@/styles/program-pages.css";
import "@/styles/contact-pricing.css";

/**
 * `/pricing`: the owner's one line on pricing (D226), the free assessment, both products, the marketplaces, early
 * access and design partners, and the questions. No price, rate or figure (D193). Indexed, listed in the sitemap, and
 * prerendered at build like every page here. In no menu and no footer column yet (the owner's call): /contact links
 * it. It is drawn on /partners' frame and carries its sheet, as the mock does, then its own.
 */
/* Its title goes through the layout's template: "Pricing | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.pricing, pricingPage.meta);

export default function Pricing(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.pricing)} />
      <PricingPage />
    </>
  );
}
