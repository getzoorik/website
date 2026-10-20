import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { termsCopy } from "@/content/terms";
import { documentMetadata } from "@/features/documents/document-page";
import { TermsOfUse } from "@/features/terms/terms-of-use";

/**
 * `/terms`: the terms of use (the frozen `terms.html`). Indexed, listed in the
 * sitemap, and prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(routes.terms, termsCopy.meta);

export default function TermsPage(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.terms)} />
      <TermsOfUse />
    </>
  );
}
