import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { cloudCostToolsPage } from "@/content/learn-compare";
import { CloudCostTools } from "@/features/cloud-cost-tools/tools-hub";

import "@/styles/learn.css";
import "@/styles/community.css";
import "@/styles/cloud-cost-tools.css";

/**
 * `/cloud-cost-optimization-tools`: Cloud cost optimization tools: the tools that reduce the cloud bill, then Coral and
 * Amoeba compared, each tile one of the pages under /compare. Indexed, listed in the sitemap and prerendered at build
 * like every page here; linked from the footer's Resources column, after News. Its old address, /compare, redirects
 * here (next.config.ts). It is drawn on Learn's frame and carries Learn's sheet and /community's, as the mock does,
 * then its own; it takes the site's default card.
 */
/* ITS TITLE IS ABSOLUTE, as the mock prints it: no " · Zoorik" after it. */
export const metadata: Metadata = {
  title: { absolute: cloudCostToolsPage.meta.title },
  description: cloudCostToolsPage.meta.description,
  alternates: { canonical: routes.cloudCostTools },
  openGraph: pageOpenGraph(routes.cloudCostTools, cloudCostToolsPage.meta),
};

export default function CloudCostOptimizationTools(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.cloudCostTools)} />
      <CloudCostTools />
    </>
  );
}
