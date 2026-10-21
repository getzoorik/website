import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { learnPage } from "@/content/learn";
import { documentMetadata } from "@/features/documents/document-page";
import { LearnHub } from "@/features/learn/learn-hub";

import "@/styles/learn.css";

/**
 * `/learn`: the hub. Indexed, listed in the sitemap, and prerendered at build like every page here, with the /learn
 * share card. Learn teaches only: the market map, the news and the community have their own pages, which the hub
 * links.
 */
/* Its title goes through the layout's template: "Cloud cost optimization guides | Zoorik"; the h1 stays "Zoorik Learn". */
export const metadata: Metadata = documentMetadata(learnPage.path, learnPage.meta, pageCards.learn);

export default function Learn(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(learnPage.path)} />
      <LearnHub />
    </>
  );
}
