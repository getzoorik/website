import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { marketplacesPage } from "@/content/marketplaces";
import { documentMetadata } from "@/features/documents/document-page";
import { MarketplacesPage } from "@/features/marketplaces/marketplaces-page";

import "@/styles/program-pages.css";
import "@/styles/marketplaces.css";

/**
 * `/marketplaces`: where to find Zoorik: the cloud marketplaces, the review sites, the registries and the company's
 * profiles. Indexed, listed in the sitemap, and prerendered at build like every page here; linked from the footer's
 * Products column, after Assessment. It is drawn with the program pages' parts, so it loads their sheet first and its
 * own after it, as the mock carries them.
 * Its title goes through the layout's template: "Marketplaces | Zoorik".
 */
export const metadata: Metadata = documentMetadata(routes.marketplaces, marketplacesPage.meta);

export default function Marketplaces(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.marketplaces)} />
      <MarketplacesPage />
    </>
  );
}
