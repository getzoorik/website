import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { communityPage } from "@/content/community";
import { documentMetadata } from "@/features/documents/document-page";
import { CommunityPage } from "@/features/community/community-page";

import "@/styles/learn.css";
import "@/styles/community.css";

/**
 * `/community`: Zoorik Community: r/zoorik, Zoorik News, and the FinOps and cloud cost communities that matter.
 * Indexed, listed in the sitemap, and prerendered at build like every page here; linked from the footer's Resources
 * column, after EBS and Azure disk pricing. It is drawn on Learn's frame and carries Learn's sheet, as the mock does,
 * then its own.
 */
/* Its title goes through the layout's template: "Community | Zoorik". */
export const metadata: Metadata = documentMetadata(routes.community, communityPage.meta);

export default function Community(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.community)} />
      <CommunityPage />
    </>
  );
}
