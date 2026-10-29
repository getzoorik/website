import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { openSourceGuides } from "@/content/open-source";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/** `/docs/install-coral-with-helm`: a guide in the article frame. */
export const metadata: Metadata = documentMetadata(
  routes.docsInstallHelm,
  openSourceGuides.helm.meta,
);

export default function InstallCoralWithHelm(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsInstallHelm)} />
      <OsGuidePage guide={openSourceGuides.helm} />
    </>
  );
}
