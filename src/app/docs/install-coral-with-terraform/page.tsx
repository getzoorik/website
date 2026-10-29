import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { openSourceGuides } from "@/content/open-source";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/** `/docs/install-coral-with-terraform`: a guide in the article frame. */
export const metadata: Metadata = documentMetadata(
  routes.docsInstallTerraform,
  openSourceGuides.terraform.meta,
);

export default function InstallCoralWithTerraform(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsInstallTerraform)} />
      <OsGuidePage guide={openSourceGuides.terraform} />
    </>
  );
}
