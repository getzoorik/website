import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { statusPage } from "@/content/status";
import { documentMetadata } from "@/features/documents/document-page";
import { StatusPage } from "@/features/status/status-page";
import "@/styles/status.css";

/** `/status`: whether Coral and Amoeba are working, feature by feature. Indexed and in the sitemap. */
export const metadata: Metadata = documentMetadata(routes.status, statusPage.meta);

export default function Status(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.status)} />
      <StatusPage />
    </>
  );
}
