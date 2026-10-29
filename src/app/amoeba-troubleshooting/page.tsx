import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { amoebaDocs, routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { documentMetadata } from "@/features/documents/document-page";
import { OsGuidePage } from "@/features/open-source/os-guide-page";

import "@/styles/article.css";
import "@/styles/open-source.css";

/**
 * `/amoeba-troubleshooting`: "Amoeba troubleshooting", Amoeba's troubleshooting page in the guides' article frame: a VM
 * that is not showing, then disks that are not rightsized yet, then Still stuck?, ending on Amoeba's closing row.
 *
 * 🔴 HELD WHILE `amoebaDocs` IS OFF, with the Amoeba guide and FAQ it links to: the route calls `notFound()`, the hub
 * lists no tile for it and the sitemap leaves it out.
 */
export const metadata: Metadata = documentMetadata(
  routes.amoebaTroubleshooting,
  troubleshootingGuides.amoeba.meta,
);

export default function AmoebaTroubleshooting(): React.JSX.Element {
  if (!amoebaDocs) notFound();
  return (
    <>
      <JsonLd data={pageStructuredData(routes.amoebaTroubleshooting)} />
      <OsGuidePage guide={troubleshootingGuides.amoeba} />
    </>
  );
}
