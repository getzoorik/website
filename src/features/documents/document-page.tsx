import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteNav } from "@/components/layout/site-nav";
import { pageTitle } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import type { ProductId } from "@/content/products";
import { AssessSection } from "@/features/assess/assess-section";
import { DocumentHero, type DocumentHeroProps } from "@/features/documents/document-hero";
import { FooterSection } from "@/features/footer/footer-section";

/**
 * A page of the documents section: the skip link, the nav, one
 * `<main>` holding the dark hero, the page's own body and the site's closing
 * assessment row, then the footer.
 *
 * The closing row is the site's own: "Estimate your saving" to
 * `/assessment?p=<product>` and "Book a demo". The PDFs' "Need help?" and
 * "Pick a time" are not ported, and there is no print link (the PDF is the
 * print version). Nothing on a document page rises into place, so the row's
 * cards are drawn still (`reveal={false}`), as the generated mocks draw them.
 *
 * A legal page leaves the row out (`assessmentRow={false}`): it ends on its
 * last section and the footer. Every other
 * document keeps it, which is the default.
 *
 * A server component with no request data: every document page is prerendered
 * at build, and its download facts are read from the files then.
 */

export interface DocumentPageProps {
  readonly hero: DocumentHeroProps;
  /** The documents' product: the closing row's button opens its assessment and names only it. */
  readonly product?: ProductId;
  /**
   * The closing assessment row after the body. On by default; off on `/privacy`.
   *
   * 🔴 THE ROW CARRIES `id="contact"`, the anchor every "Contact" link on the
   * site points at. A page that leaves it out and has its own `#contact` (the
   * policy's §15) must never turn it back on: two elements would share the id.
   */
  readonly assessmentRow?: boolean;
  readonly children: ReactNode;
}

export function DocumentPage({
  hero,
  product,
  assessmentRow = true,
  children,
}: DocumentPageProps): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <DocumentHero {...hero} />
        {children}
        {assessmentRow ? <AssessSection product={product} reveal={false} /> : null}
      </main>
      <FooterSection />
    </>
  );
}

/**
 * A document page's metadata: the title through the layout's "%s | Zoorik"
 * template, its description, its canonical, and the Open Graph card with the
 * full title (Open Graph does not apply the template): the page's own share
 * card when it has one (`pageCards`), else the brand card.
 */
export function documentMetadata(
  path: `/${string}`,
  copy: { readonly title: string; readonly description: string },
  card?: Parameters<typeof pageOpenGraph>[2],
): Metadata {
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: path },
    openGraph: pageOpenGraph(
      path,
      { title: pageTitle(copy.title), description: copy.description },
      card,
    ),
  };
}
