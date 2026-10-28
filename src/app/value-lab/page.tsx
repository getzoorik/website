import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { caseStudiesHub } from "@/content/case-studies";
import { CaseStudiesHub } from "@/features/case-studies/case-studies-hub";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/value-lab.css";

/**
 * `/value-lab`: Value Lab by Zoorik, the case studies' hub. Indexed, listed in
 * the sitemap, and prerendered at build like every page here; linked from the
 * footer's Resources column, after Learn. The header has none. Its old
 * address, /case-studies, redirects here (next.config.ts).
 */
/* Its title goes through the layout's template: "Value Lab | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.valueLab, caseStudiesHub.meta);

export default function ValueLab(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.valueLab)} />
      <CaseStudiesHub />
    </>
  );
}
