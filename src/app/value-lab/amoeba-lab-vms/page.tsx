import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { amoebaStudy } from "@/content/case-studies";
import { AmoebaStudyPage } from "@/features/case-studies/amoeba-study-page";
import { documentMetadata } from "@/features/documents/document-page";

import "@/styles/case-studies.css";

/**
 * `/value-lab/amoeba-lab-vms`: "Amoeba on our own Azure lab VMs", the second Value Lab study. Indexed, listed in the
 * sitemap, and prerendered at build like every page here; its hub, /value-lab, lists it beside the Coral study.
 */
export const metadata: Metadata = documentMetadata(routes.caseStudyAmoebaLabVms, amoebaStudy.meta);

export default function CaseStudyAmoebaLabVms(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.caseStudyAmoebaLabVms)} />
      <AmoebaStudyPage />
    </>
  );
}
