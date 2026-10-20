import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { pageCards, pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { learnPage } from "@/content/learn";
import { LearnHub } from "@/features/learn/learn-hub";

import "@/styles/learn.css";

/**
 * `/learn`: the hub. Indexed, listed in the sitemap, and prerendered at build like every page here, with the /learn
 * share card. Learn teaches only: the market map, the news and the community have their own pages, which the hub
 * links.
 */
/* ITS TITLE IS ABSOLUTE, like /about's and /careers's: "Zoorik Learn: …" names the company already. */
export const metadata: Metadata = {
  title: { absolute: learnPage.meta.title },
  description: learnPage.meta.description,
  alternates: { canonical: learnPage.path },
  openGraph: pageOpenGraph(learnPage.path, learnPage.meta, pageCards.learn),
};

export default function Learn(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(learnPage.path)} />
      <LearnHub />
    </>
  );
}
