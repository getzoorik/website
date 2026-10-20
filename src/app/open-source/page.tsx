import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { openSourcePage } from "@/content/open-source";
import { documentMetadata } from "@/features/documents/document-page";
import { OpenSourcePage } from "@/features/open-source/open-source-page";

import "@/styles/open-source.css";

/**
 * `/open-source`: what is open source at Zoorik and how to contribute. Linked from the Docs menu, the footer, the hub
 * and /coral's Install your way. The default share card.
 */
export const metadata: Metadata = documentMetadata(routes.openSource, openSourcePage.meta);

export default function OpenSource(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.openSource)} />
      <OpenSourcePage />
    </>
  );
}
