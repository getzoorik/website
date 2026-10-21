import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { about } from "@/content/about";
import { documentMetadata } from "@/features/documents/document-page";
import { AboutPage } from "@/features/about/about-page";

import "@/styles/about.css";

/**
 * `/about`: who builds Coral and Amoeba. Indexed, listed in the sitemap, and
 * prerendered at build like every page here. Its title goes through the
 * layout's template, as every page's does: "Zoorik | About".
 */
export const metadata: Metadata = documentMetadata(routes.about, about.meta);

export default function About(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.about)} />
      <AboutPage />
    </>
  );
}
