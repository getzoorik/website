import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { pageStructuredData } from "@/config/structured-data";
import { findTerm, glossaryTerms, termRoute } from "@/content/learn/glossary";
import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { documentMetadata } from "@/features/documents/document-page";
import { GlossaryPage } from "@/features/learn/glossary-page";

import "@/styles/article.css";

/**
 * `/learn/glossary/<slug>`: one glossary term, for every term in the glossary index. Each is prerendered at build,
 * indexed, listed in the sitemap and titled from its own file, with its own share card or the glossary's. Any other
 * slug is a 404 (`dynamicParams = false`, and `notFound()` for a direct call).
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

const termOf = async (params: Promise<{ slug: string }>): Promise<GlossaryTerm> => {
  const { slug } = await params;
  const term = findTerm(slug);
  if (!term) notFound();
  return term;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const term = await termOf(params);
  return documentMetadata(termRoute(term), { title: term.title, description: term.meta });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const term = await termOf(params);
  return (
    <>
      <JsonLd data={pageStructuredData(termRoute(term))} />
      <GlossaryPage term={term} />
    </>
  );
}
