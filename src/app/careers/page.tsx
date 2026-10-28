import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { careers } from "@/content/careers";
import { documentMetadata } from "@/features/documents/document-page";
import { CareersPage } from "@/features/careers/careers-page";

import "@/styles/careers.css";
import "@/styles/careers-values.css";
import "@/styles/careers-scenes.css";
import "@/styles/careers-work.css";

/**
 * `/careers`: work at Zoorik. Indexed, listed in the sitemap, and prerendered
 * at build like every page here; linked from the footer's Company column, after
 * About. Its title goes through the layout's template: "Careers | Zoorik".
 */
export const metadata: Metadata = documentMetadata(routes.careers, careers.meta);

export default function Careers(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.careers)} />
      <CareersPage />
    </>
  );
}
