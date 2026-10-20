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
 * footer's Resources column, after Zoorik Learn. The header has none. Its old
 * address, /case-studies, redirects here (next.config.ts).
 */
/* The hub's name already says "by Zoorik", so its title is used as is, with no " · Zoorik" after it. */
const base = documentMetadata(routes.valueLab, caseStudiesHub.meta);
export const metadata: Metadata = {
  ...base,
  title: { absolute: caseStudiesHub.meta.title },
  openGraph: { ...base.openGraph, title: caseStudiesHub.meta.title },
};

export default function ValueLab(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.valueLab)} />
      <CaseStudiesHub />
    </>
  );
}
