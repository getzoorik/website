import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { amoebaDocs, routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { amoebaGuide } from "@/content/amoeba-guide";
import { AmoebaGuide } from "@/features/amoeba-guide/amoeba-guide";
import { documentMetadata } from "@/features/documents/document-page";

/**
 * `/amoeba-guide`: the Amoeba product guide. Prerendered at build like every
 * page here.
 *
 * Published while `amoebaDocs` is on. With the flag off, the route calls
 * `notFound()`, so the build prerenders the site's 404 here, nothing links to
 * it and the sitemap leaves it out.
 */
export const metadata: Metadata = documentMetadata(routes.amoebaGuide, amoebaGuide.meta);

export default function AmoebaGuidePage(): React.JSX.Element {
  if (!amoebaDocs) notFound();
  return (
    <>
      <JsonLd data={pageStructuredData(routes.amoebaGuide)} />
      <AmoebaGuide />
    </>
  );
}
