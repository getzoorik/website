import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { documentMetadata } from "@/features/documents/document-page";
import { AlternativesPage, alternativesPageAt } from "@/features/learn/alternatives-page";

import "@/styles/learn.css";

/**
 * `/compare/coral-alternatives`: Coral's alternatives; its old address, /learn/coral-alternatives, 301-redirects here
 * (next.config.ts). Indexed, listed in the sitemap, prerendered at build like every page here, and linked from
 * /compare's cards; it takes the site's default card.
 */
const page = alternativesPageAt(routes.compareCoralAlternatives);

export const metadata: Metadata = documentMetadata(routes.compareCoralAlternatives, page.meta);

export default function CompareCoralAlternatives(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.compareCoralAlternatives)} />
      <AlternativesPage page={page} />
    </>
  );
}
