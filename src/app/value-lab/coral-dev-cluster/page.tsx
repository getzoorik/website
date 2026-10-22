import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { caseStudy } from "@/content/case-studies";
import { CaseStudyPage } from "@/features/case-studies/case-study-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/case-studies.css";

/**
 * `/value-lab/coral-dev-cluster`: "Coral on our own development cluster".
 * Indexed, listed in the sitemap, and prerendered at build like every page
 * here. It keeps its address under /case-studies; its hub is Value Lab, /value-lab.
 */
export const metadata: Metadata = documentMetadata(routes.caseStudyCoralDevCluster, caseStudy.meta);

export default function CaseStudyCoralDevCluster(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.caseStudyCoralDevCluster)} />
      <CaseStudyPage />
    </>
  );
}
