import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { partnersPage } from "@/content/partners";
import { documentMetadata } from "@/features/documents/document-page";
import { PartnersPage } from "@/features/programs/partners-page";

import "@/styles/program-pages.css";

/**
 * `/partners`: the partner program, coming soon. Indexed, listed in the sitemap, and prerendered at build like every
 * page here; linked from the footer's Company column, after Referrals. The program has no terms yet, so the page
 * states none. It shares its sheet with /referrals and /design-partners.
 */
export const metadata: Metadata = documentMetadata(routes.partners, partnersPage.meta);

export default function Partners(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.partners)} />
      <PartnersPage />
    </>
  );
}
