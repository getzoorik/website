import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { careers } from "@/content/careers";
import { CareersPage } from "@/features/careers/careers-page";

import "@/styles/careers.css";

/**
 * `/careers`: work at Zoorik. Indexed, listed in the sitemap, and prerendered
 * at build like every page here; linked from the footer's Company column, after
 * About.
 *
 * 🔴 ITS TITLE IS ABSOLUTE, like /about's. "Careers at Zoorik: work with us,
 * remotely" names the company already, so the mock gives it no " · Zoorik"
 * after it.
 */
export const metadata: Metadata = {
  title: { absolute: careers.meta.title },
  description: careers.meta.description,
  alternates: { canonical: routes.careers },
  openGraph: pageOpenGraph(routes.careers, careers.meta),
};

export default function Careers(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.careers)} />
      <CareersPage />
    </>
  );
}
