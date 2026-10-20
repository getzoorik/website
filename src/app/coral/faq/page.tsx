import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import { coralFaqPage, coralFaqSections } from "@/content/coral-faq";
import { DocumentPage, documentMetadata } from "@/features/documents/document-page";
import { Faq } from "@/features/documents/faq";

/**
 * `/coral/faq`: the Coral FAQ on the web, the questions and their short answers.
 * Indexed, and prerendered at build like every page here; the download line's
 * facts are read from the PDF then. No FAQPage structured data.
 */
export const metadata: Metadata = documentMetadata(coralFaqPage.path, coralFaqPage.meta);

export default function CoralFaqPage(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(coralFaqPage.path)} />
      <DocumentPage
        hero={{ ...coralFaqPage.hero, productSwitch: { menu: "faq", current: "coral" } }}
        product="coral"
      >
        <Faq
          updated={coralFaqPage.updated}
          sections={coralFaqSections}
          download={coralFaqPage.download}
        />
      </DocumentPage>
    </>
  );
}
