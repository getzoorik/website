import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { amoebaDocs } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { amoebaFaqPage, amoebaFaqSections } from "@/content/amoeba-faq";
import { DocumentPage, documentMetadata } from "@/features/documents/document-page";
import { Faq } from "@/features/documents/faq";

/**
 * `/amoeba-faq`: the Amoeba FAQ on the web, the questions and their short
 * answers, on the Coral FAQ's layout. Prerendered at build like every page
 * here. No download line, because no Amoeba FAQ PDF exists, and no FAQPage
 * structured data.
 *
 * 🔴 HELD WHILE `amoebaDocs` IS OFF: the route
 * answers 404, stays out of the sitemap, and nothing on the site links to it.
 * Turning the flag on publishes it, its menu rows and its switch at once.
 */
export const metadata: Metadata = documentMetadata(amoebaFaqPage.path, amoebaFaqPage.meta);

export default function AmoebaFaqPage(): React.JSX.Element {
  if (!amoebaDocs) notFound();
  return (
    <>
      <JsonLd data={pageStructuredData(amoebaFaqPage.path)} />
      <DocumentPage
        hero={{ ...amoebaFaqPage.hero, productSwitch: { menu: "faq", current: "amoeba" } }}
        product="amoeba"
      >
        <Faq updated={amoebaFaqPage.updated} sections={amoebaFaqSections} />
      </DocumentPage>
    </>
  );
}
