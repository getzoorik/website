import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import { securityPage } from "@/content/security";
import { documentMetadata } from "@/features/documents/document-page";
import { SecurityPage } from "@/features/security/security-page";

/**
 * `/security`: security and data handling. Indexed, listed in the sitemap, and
 * prerendered at build like every page here.
 */
export const metadata: Metadata = documentMetadata(securityPage.path, securityPage.meta);

export default function Security(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(securityPage.path)} />
      <SecurityPage />
    </>
  );
}
