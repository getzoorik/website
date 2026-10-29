import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { researchPage } from "@/content/research";
import { documentMetadata } from "@/features/documents/document-page";
import { ResearchPage } from "@/features/research/research-page";

import "@/styles/learn.css";
import "@/styles/community.css";
import "@/styles/research.css";

/**
 * `/cloud-cost-optimization-research-papers`: research papers on cloud cost optimization, by subject. Indexed, listed in the
 * sitemap, and prerendered at build like every page here. It is drawn on /community's frame and carries Learn's and
 * /community's sheets, as the mock does, then its own.
 */
/* Its title goes through the layout's template: "Cloud cost optimization research | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.research, researchPage.meta);

export default function Research(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.research)} />
      <ResearchPage />
    </>
  );
}
