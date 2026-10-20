import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { caseStudiesHub } from "@/content/case-studies";
import { CaseStudiesHub } from "@/features/case-studies/case-studies-hub";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/case-studies.css";

/**
 * `/case-studies`: the library, one card per study. Indexed, listed in the
 * sitemap, and prerendered at build like every page here; linked from the
 * footer's Resources column, after Learn. The header has none.
 */
/* The hub's name already says "by Zoorik", so its title is used as is, with no " · Zoorik" after it. */
const base = documentMetadata(routes.caseStudies, caseStudiesHub.meta);
export const metadata: Metadata = {
  ...base,
  title: { absolute: caseStudiesHub.meta.title },
  openGraph: { ...base.openGraph, title: caseStudiesHub.meta.title },
};

export default function CaseStudies(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.caseStudies)} />
      <CaseStudiesHub />
    </>
  );
}
