import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { caseStudy } from "@/content/case-studies";
import { CaseStudyPage } from "@/features/case-studies/case-study-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/case-studies.css";

/**
 * `/coral-value-lab`: "Coral on our own development cluster".
 * Indexed, listed in the sitemap, and prerendered at build like every page
 * here. Its hub is Value Lab, /value-lab; its old addresses there and under /case-studies redirect here.
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
