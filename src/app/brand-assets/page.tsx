import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { brandAssetsPage } from "@/content/brand-assets";
import { BrandAssetsPage } from "@/features/brand-assets/brand-assets-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/brand-assets.css";

/**
 * `/brand-assets`: the Zoorik logo, mark, colours and words, and the brand kit to download. Indexed, listed in the
 * sitemap, and prerendered at build like every page here, which is when the kit ZIP's size is read; linked from the
 * footer's Company column, after Careers.
 *
 * Its title runs through the layout's template: "Brand assets: the Zoorik logo, colours and words · Zoorik", as the
 * mock's `<title>` reads.
 */
export const metadata: Metadata = documentMetadata(routes.brandAssets, brandAssetsPage.meta);

export default function BrandAssets(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.brandAssets)} />
      <BrandAssetsPage />
    </>
  );
}
