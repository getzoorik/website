import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { referralsPage } from "@/content/referrals";
import { documentMetadata } from "@/features/documents/document-page";
import { ReferralsPage } from "@/features/programs/referrals-page";

import "@/styles/program-pages.css";

/**
 * `/referrals`: the referral program, coming soon. Indexed, listed in the sitemap, and prerendered at build like every
 * page here; linked from the footer's Company column, after Brand assets. The program has no terms yet, so the page
 * states none. It shares its sheet with /partners and /design-partners.
 */
export const metadata: Metadata = documentMetadata(routes.referrals, referralsPage.meta);

export default function Referrals(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.referrals)} />
      <ReferralsPage />
    </>
  );
}
