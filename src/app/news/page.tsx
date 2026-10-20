import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { newsPage } from "@/content/news";
import { NewsPage } from "@/features/news/news-page";

import "@/styles/news.css";

/**
 * `/news`: Zoorik News, at its own address rather than under /learn: our announcements, then Zoorik Radar, the week's
 * changes in cloud cost, Kubernetes and FinOps. Indexed, listed in the sitemap, and prerendered at build like every
 * page here; linked from the footer's Resources column, after Events, and from /learn's Zoorik News card. The radar
 * run refreshes it weekly (`src/content/news.ts`).
 */
/* ITS TITLE IS ABSOLUTE, like /learn's: "Zoorik News: …" names the company already. */
export const metadata: Metadata = {
  title: { absolute: newsPage.meta.title },
  description: newsPage.meta.description,
  alternates: { canonical: routes.news },
  openGraph: pageOpenGraph(routes.news, newsPage.meta),
};

export default function News(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.news)} />
      <NewsPage />
    </>
  );
}
