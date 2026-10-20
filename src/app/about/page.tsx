import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { about } from "@/content/about";
import { AboutPage } from "@/features/about/about-page";

import "@/styles/about.css";

/**
 * `/about`: who builds Coral and Amoeba. Indexed, listed in the sitemap, and
 * prerendered at build like every page here.
 *
 * 🔴 ITS TITLE IS ABSOLUTE. "About Zoorik: who builds Coral and Amoeba" names
 * the company already, so the mock gives it no " · Zoorik" after it: one of
 * the two pages (with /careers) whose `<title>` skips the layout's template.
 */
export const metadata: Metadata = {
  title: { absolute: about.meta.title },
  description: about.meta.description,
  alternates: { canonical: routes.about },
  openGraph: pageOpenGraph(routes.about, about.meta),
};

export default function About(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.about)} />
      <AboutPage />
    </>
  );
}
