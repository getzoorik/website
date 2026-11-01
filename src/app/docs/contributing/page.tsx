import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { openSourceGuides } from "@/content/open-source";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/** `/docs/contributing`: a guide in the article frame, closing on both products, as its repositories serve both. */
export const metadata: Metadata = documentMetadata(
  routes.docsContributing,
  openSourceGuides.contributing.meta,
);

export default function Contributing(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsContributing)} />
      <OsGuidePage guide={openSourceGuides.contributing} about={null} />
    </>
  );
}
