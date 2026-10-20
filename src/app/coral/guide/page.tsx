import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { coralGuide } from "@/content/coral-guide";
import { CoralGuide } from "@/features/coral-guide/coral-guide";
import { documentMetadata } from "@/features/documents/document-page";

/**
 * `/coral/guide`: the Coral product guide. Indexed, and prerendered at build
 * like every page here; the PDF's download facts are read from the file then.
 */
export const metadata: Metadata = documentMetadata(routes.coralGuide, coralGuide.meta);

export default function CoralGuidePage(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.coralGuide)} />
      <CoralGuide />
    </>
  );
}
