import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { compareHubPage } from "@/content/learn-compare";
import { CompareHub } from "@/features/compare/compare-hub";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/learn.css";
import "@/styles/compare.css";

/**
 * `/compare`: Cloud cost optimization tools: the market map, then Coral and Amoeba compared, each card one of the
 * pages under it. Indexed, listed in the sitemap and prerendered at build like every page here; linked from the
 * footer's Resources column, after News. It takes the site's default card, like every page under it.
 */
export const metadata: Metadata = documentMetadata(routes.compare, compareHubPage.meta);

export default function Compare(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.compare)} />
      <CompareHub />
    </>
  );
}
