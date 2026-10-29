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
 * `/docs/amoeba-not-showing-my-vm`: "Amoeba is not showing my VM", a troubleshooting page in the guides' article frame, ending on
 * Amoeba's closing row.
 *
 * 🔴 HELD WHILE `amoebaDocs` IS OFF, with the Amoeba guide and FAQ it links to: the route calls `notFound()`, the hub
 * lists no tile for it and the sitemap leaves it out.
 */
export const metadata: Metadata = documentMetadata(
  routes.docsAmoebaNotShowingVm,
  troubleshootingGuides.amoebaNotShowingVm.meta,
);

export default function AmoebaNotShowingVm(): React.JSX.Element {
  if (!amoebaDocs) notFound();
  return (
    <>
      <JsonLd data={pageStructuredData(routes.docsAmoebaNotShowingVm)} />
      <OsGuidePage guide={troubleshootingGuides.amoebaNotShowingVm} />
    </>
  );
}
