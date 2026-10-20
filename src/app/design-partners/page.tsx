import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { designPartnersPage } from "@/content/design-partners";
import { DesignPartnersPage } from "@/features/design-partners/design-partners-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/programs.css";
import "@/styles/design-partners.css";

/**
 * `/design-partners`: the design partner program, open now (the first 10 partners free on non-production
 * infrastructure). Indexed, listed in the sitemap, and prerendered at build like every page here; linked from the
 * footer's Company column, after Partners. It draws the programs' panels, so it loads their sheet first and its own
 * after it, as the mock carries them.
 */
export const metadata: Metadata = documentMetadata(routes.designPartners, designPartnersPage.meta);

export default function DesignPartners(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.designPartners)} />
      <DesignPartnersPage />
    </>
  );
}
