import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/** `/docs/coral-not-connecting-to-cluster`: "Coral is not connecting to my cluster", a troubleshooting page in the guides' article frame. */
export const metadata: Metadata = documentMetadata(
  routes.docsCoralNotConnecting,
  troubleshootingGuides.coralNotConnecting.meta,
);

export default function CoralNotConnecting(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsCoralNotConnecting)} />
      <OsGuidePage guide={troubleshootingGuides.coralNotConnecting} />
    </>
  );
}
