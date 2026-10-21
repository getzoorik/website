import type { Metadata } from "next";

import { pageTitle, routes } from "@/config/site";
import { pageCards, pageOpenGraph } from "@/config/social";
import { productStructuredData } from "@/config/structured-data";
import type { ProductPageContent } from "@/content/product-page";

/**
 * A product page's address, metadata and structured data, built from its
 * content file so the title a search shows, the card a link unfurls into and
 * the JSON-LD all say what the page says.
 */

/** The page's own path: `/amoeba` or `/coral`, from the one route table. */
export function productPagePath(content: ProductPageContent): "/amoeba" | "/coral" {
  return routes[content.product];
}

/**
 * The title goes through the layout's "Zoorik | %s" template; og:title is the
 * same full title, because Open Graph does not apply the template, and the card
 * repeats the description. The X card is the layout's: Next fills twitter:title
 * and twitter:description from openGraph, and the page's own card with it
 * (`pageCards`).
 */
export function productPageMetadata(content: ProductPageContent): Metadata {
  const path = productPagePath(content);
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: path },
    openGraph: pageOpenGraph(
      path,
      {
        title: pageTitle(content.meta.title),
        description: content.meta.description,
      },
      pageCards[content.product],
    ),
  };
}

/** JSON-LD: the organisation, the site, the page and its trail, then this product's app (`productStructuredData`). */
export function productPageStructuredData(content: ProductPageContent) {
  return productStructuredData(content.product);
}
