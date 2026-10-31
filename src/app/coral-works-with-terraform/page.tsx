import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { worksWithPages } from "@/content/works-with";
import { documentMetadata } from "@/features/documents/document-page";
import { WorksWithPage } from "@/features/works-with/works-with-page";

import "@/styles/article.css";
import "@/styles/open-source.css";
import "@/styles/works-with.css";

/**
 * `/coral-works-with-terraform`: "Coral works with Terraform", a works-with page in the Helm guide's article frame.
 * Indexed, listed in the sitemap, and prerendered at build like every page here; in no menu, linked from the footer's
 * Works with list and the Coral cloud pages.
 */
export const metadata: Metadata = documentMetadata(
  routes.coralWorksWithTerraform,
  worksWithPages.terraform.meta,
);

export default function CoralWorksWithTerraform(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.coralWorksWithTerraform)} />
      <WorksWithPage page={worksWithPages.terraform} />
    </>
  );
}
