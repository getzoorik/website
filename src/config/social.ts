import type { Metadata } from "next";

import { site } from "@/config/site";

/** The X account the footer links to (x.com/getzoorik), named as every page's card site and creator. */
export const xHandle = "@getzoorik";

/**
 * The brand kit's card, brand 2.0: the logo and the tagline "Reduce cloud cost, autonomously.",
 * with no marketplace line. Stored as an 8-bit palette PNG like every page card, 174 KB instead
 * of the kit's 1.2 MB, the picture unchanged. Platforms cache cards by URL, so a re-encoded or
 * new picture gets a new file name.
 */
export const socialImage = {
  url: "/og/zoorik-reduce-cloud-cost-autonomously-1200x630.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Zoorik. Reduce cloud cost, autonomously.",
} as const;

/** A share card: a 1200 × 630 PNG in `public/og/`, and the words it shows. */
export interface ShareImage {
  readonly url: `/og/${string}.png`;
  readonly width: 1200;
  readonly height: 630;
  readonly type: "image/png";
  readonly alt: string;
}

/** A card from its picture and its words. */
export const shareImage = (url: ShareImage["url"], alt: string): ShareImage => ({
  url,
  width: 1200,
  height: 630,
  type: "image/png",
  alt,
});

/**
 * The pages with a card of their own, drawn by the brand kit and copied byte
 * for byte under a new name each. Every other page uses the home card above.
 * Each `alt` reads the card: its mark, then its words. A Learn article's own
 * card is in its file (`Article.shareCard`); an article without one takes the
 * /learn card.
 */
const card = (name: string, alt: string): ShareImage =>
  shareImage(`/og/zoorik-${name}-1200x630.png`, alt);

export const pageCards = {
  coral: card(
    "coral",
    "Coral. Kubernetes cost optimization. Kubernetes cost optimization on AKS and EKS.",
  ),
  amoeba: card(
    "amoeba",
    "Amoeba. Block storage cost optimization. Block storage cost optimization on Azure and AWS.",
  ),
  assessment: card("assessment", "Zoorik. Free cloud cost assessment."),
  learn: card("learn", "Zoorik. Kubernetes and block storage cost, explained."),
} as const;

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** No title, description or url here: each page sets its own. */
export const baseOpenGraph = {
  type: "website",
  siteName: site.name,
  locale: "en_US",
  images: [socialImage],
} satisfies OpenGraph;

/** No separate X image: Next copies openGraph.images into the twitter:* tags. */
export const baseTwitter = {
  card: "summary_large_image",
  site: xHandle,
  creator: xHandle,
} satisfies NonNullable<Metadata["twitter"]>;

/** Metadata merges shallowly: a page's openGraph replaces the layout's. Always go through this. */
export function pageOpenGraph(
  path: `/${string}`,
  copy: { readonly title: string; readonly description: string },
  image?: ShareImage,
): OpenGraph {
  return {
    ...baseOpenGraph,
    ...(image === undefined ? {} : { images: [image] }),
    url: path,
    ...copy,
  };
}
