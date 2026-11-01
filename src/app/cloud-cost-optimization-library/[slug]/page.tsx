import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import { versusPages, versusRoute, type VersusPage as VersusEntry } from "@/content/learn-compare";
import { documentMetadata } from "@/features/documents/document-page";
import { VersusPage } from "@/features/learn/versus-page";

import "@/styles/learn.css";
import "@/styles/article.css";

/**
 * `/cloud-cost-optimization-library/<slug>`: a versus page; its old addresses, /compare/<slug> and /learn/compare/<slug>, 301-redirect here (next.config.ts). One
 * dynamic route, so no file or folder is named after a company: its slugs are data (`versusPages`), the live ones only.
 * Each is prerendered at build, indexed, listed in the sitemap, and linked from Cloud cost optimization tools' tiles
 * and, where its tool is one the list names, its product's alternatives page; it takes its own card where it has one, else its product's comparison card
 * (`social.ts`). The articles' sheet is for the optional parts' sources line (`.ar-src`, `.nw-nb`). Any other slug, a
 * held page among them, is a 404 (`dynamicParams = false`, and `notFound()` for a direct call).
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return versusPages.map((page) => ({ slug: page.slug }));
}

const pageAt = async (params: Promise<{ slug: string }>): Promise<VersusEntry> => {
  const { slug } = await params;
  const page = versusPages.find((entry) => entry.slug === slug);
  if (!page) notFound();
  return page;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const page = await pageAt(params);
  return documentMetadata(versusRoute(page), page.meta);
}

export default async function CompareVersus({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const page = await pageAt(params);
  return (
    <>
      <JsonLd data={pageStructuredData(versusRoute(page))} />
      <VersusPage page={page} />
    </>
  );
}
