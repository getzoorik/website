import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { communityPage } from "@/content/community";
import { CommunityPage } from "@/features/community/community-page";

import "@/styles/learn.css";
import "@/styles/community.css";

/**
 * `/community`: Zoorik Community: r/zoorik, Zoorik News, and the FinOps and cloud cost communities that matter.
 * Indexed, listed in the sitemap, and prerendered at build like every page here; linked from the footer's Resources
 * column, after Cloud cost optimization tools. It is drawn on Learn's frame and carries Learn's sheet, as the mock does, then its own.
 */
/* ITS TITLE IS ABSOLUTE, like /learn's and /news's: "Zoorik Community: …" names the company already. */
export const metadata: Metadata = {
  title: { absolute: communityPage.meta.title },
  description: communityPage.meta.description,
  alternates: { canonical: routes.community },
  openGraph: pageOpenGraph(routes.community, communityPage.meta),
};

export default function Community(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.community)} />
      <CommunityPage />
    </>
  );
}
