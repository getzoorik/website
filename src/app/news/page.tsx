import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { newsPage } from "@/content/news";
import { documentMetadata } from "@/features/documents/document-page";
import { NewsPage } from "@/features/news/news-page";

import "@/styles/news.css";

/**
 * `/news`: Zoorik News, at its own address rather than under /learn: our announcements, then Zoorik Radar, the week's
 * changes in cloud cost, Kubernetes and FinOps. Indexed, listed in the sitemap, and prerendered at build like every
 * page here; linked from the footer's Resources column, after Events, and from /learn's Zoorik News card. The radar
 * run refreshes it weekly (`src/content/news.ts`).
 */
/* Its title goes through the layout's template: "News | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.news, newsPage.meta);

export default function News(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.news)} />
      <NewsPage />
    </>
  );
}
