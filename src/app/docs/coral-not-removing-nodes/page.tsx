import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/** `/docs/coral-not-removing-nodes`: "Why Coral is not removing a node", a troubleshooting page in the guides' article frame. */
export const metadata: Metadata = documentMetadata(
  routes.docsCoralNotRemovingNodes,
  troubleshootingGuides.coralNotRemovingNodes.meta,
);

export default function CoralNotRemovingNodes(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsCoralNotRemovingNodes)} />
      <OsGuidePage guide={troubleshootingGuides.coralNotRemovingNodes} />
    </>
  );
}
