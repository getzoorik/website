import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { trustPage } from "@/content/trust";
import { documentMetadata } from "@/features/documents/document-page";
import { TrustPage } from "@/features/trust/trust-page";

import "@/styles/trust.css";

/**
 * `/trust`: the Trust center, Coral's security overview, the DPA and the sub-processors. Indexed, listed in the
 * sitemap, and prerendered at build like every page here. In no menu; linked from the footer's Company column, after
 * Security (owner, 30 Oct 2026), and from /security's Report a security issue row and /contact.
 */
/* Its title goes through the layout's template: "Trust center | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.trust, trustPage.meta);

export default function Trust(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.trust)} />
      <TrustPage />
    </>
  );
}
