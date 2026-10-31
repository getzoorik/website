import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import { glossaryPage } from "@/content/learn/glossary";
import { documentMetadata } from "@/features/documents/document-page";
import { GlossaryHub } from "@/features/learn/glossary-hub";

import "@/styles/learn.css";

/**
 * `/learn/glossary`: the glossary's hub, every term by its group. Indexed, listed in the sitemap, prerendered at build,
 * with its own share card. Its title goes through the layout's template: "Cloud cost and FinOps glossary | Zoorik";
 * the h1 is "Cloud cost glossary".
 */
export const metadata: Metadata = documentMetadata(glossaryPage.path, glossaryPage.meta);

export default function Glossary(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(glossaryPage.path)} />
      <GlossaryHub />
    </>
  );
}
