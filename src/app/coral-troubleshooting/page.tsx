import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/**
 * `/coral-troubleshooting`: "Coral troubleshooting", Coral's troubleshooting page in the guides' article frame: a cluster
 * that is not connecting, then a node that is not removed, then Still stuck?.
 */
export const metadata: Metadata = documentMetadata(
  routes.coralTroubleshooting,
  troubleshootingGuides.coral.meta,
);

export default function CoralTroubleshooting(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.coralTroubleshooting)} />
      <OsGuidePage guide={troubleshootingGuides.coral} />
    </>
  );
}
