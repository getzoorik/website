import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { privacy } from "@/content/privacy";
import { documentMetadata } from "@/features/documents/document-page";
import { PrivacyPolicy } from "@/features/privacy/privacy-policy";

/**
 * `/privacy`: the privacy policy. Indexed, listed in the sitemap, and
 * prerendered at build like every page here: it reads no request data, so it is
 * served from the static cache.
 */
export const metadata: Metadata = documentMetadata(routes.privacy, privacy.meta);

export default function PrivacyPage(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.privacy)} />
      <PrivacyPolicy />
    </>
  );
}
