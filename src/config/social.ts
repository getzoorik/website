import type { Metadata } from "next";

import { routes, site } from "@/config/site";
import { alternativesPages, versusPages, versusRoute } from "@/content/learn-compare";
import type { ProductId } from "@/content/products";

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
 * Every page's own card, by its address: the brand card above with the page's own words where the tagline sits,
 * drawn by the brand kit from these same words and stored as a palette PNG in `public/og/pages/`. Platforms cache a
 * card by its URL, so a redrawn card gets a new file name. Each `alt` reads the card: its name, then its words. The
 * home page has none of its own: it shows the brand card.
 */
/** A product's comparison pages, its alternatives page then its versus page: they share one card. */
const comparisonsOf = (product: ProductId): `/${string}`[] => [
  ...alternativesPages
    .filter((page) => page.product === product)
    .map((page) => page.route as `/${string}`),
  ...versusPages.filter((page) => page.product === product).map(versusRoute),
];

const CARDS: readonly {
  readonly file: string;
  readonly words: string;
  readonly paths: readonly `/${string}`[];
}[] = [
  { file: "coral", words: "Kubernetes cost optimization on AKS and EKS", paths: ["/coral"] },
  { file: "amoeba", words: "Block storage cost optimization on Azure and AWS", paths: ["/amoeba"] },
  { file: "assessment", words: "Free cloud cost assessment", paths: ["/assessment"] },
  { file: "docs", words: "Product guides, FAQs and one-pagers", paths: ["/docs"] },
  { file: "coral-guide", words: "Coral product guide", paths: ["/coral/guide"] },
  { file: "coral-faq", words: "Coral FAQ", paths: ["/coral/faq"] },
  { file: "amoeba-guide", words: "Amoeba product guide", paths: ["/amoeba/guide"] },
  { file: "amoeba-faq", words: "Amoeba FAQ", paths: ["/amoeba/faq"] },
  {
    file: "docs-install-coral-with-helm",
    words: "Install Coral with Helm",
    paths: ["/docs/install-coral-with-helm"],
  },
  {
    file: "docs-install-coral-with-terraform",
    words: "Install Coral with Terraform + Helm",
    paths: ["/docs/install-coral-with-terraform"],
  },
  {
    file: "docs-contributing",
    words: "Contributing to our open source",
    paths: ["/docs/contributing"],
  },
  { file: "open-source", words: "Open source", paths: ["/open-source"] },
  { file: "learn", words: "Cloud cost optimization guides", paths: ["/learn"] },
  {
    file: "cloud-cost-optimization-tools",
    words: "Cloud cost optimization tools",
    paths: [routes.cloudCostTools],
  },
  {
    file: "kubernetes-cost-tools",
    words: "Kubernetes cost tools compared",
    paths: comparisonsOf("coral"),
  },
  {
    file: "block-storage-tools",
    words: "Block storage tools compared",
    paths: comparisonsOf("amoeba"),
  },
  {
    file: "value-lab",
    words: "What Coral and Amoeba reduced on real cloud bills",
    paths: ["/value-lab"],
  },
  {
    file: "value-lab-coral-dev-cluster",
    words: "How we reduced our own cluster’s machine bill by 58%",
    paths: ["/value-lab/coral-dev-cluster"],
  },
  { file: "events", words: "Cloud cost, FinOps and Kubernetes events", paths: ["/events"] },
  { file: "news", words: "Cloud cost, Kubernetes and FinOps updates", paths: ["/news"] },
  { file: "community", words: "FinOps and cloud cost communities", paths: ["/community"] },
  { file: "about", words: "Who builds Coral and Amoeba", paths: ["/about"] },
  { file: "careers", words: "Work with us, remotely", paths: ["/careers"] },
  { file: "brand-assets", words: "The Zoorik logo, colours and words", paths: ["/brand-assets"] },
  { file: "referrals", words: "Referral program", paths: ["/referrals"] },
  { file: "partners", words: "Partner program", paths: ["/partners"] },
  { file: "design-partners", words: "Design partner program", paths: ["/design-partners"] },
  { file: "marketplaces", words: "Marketplaces, reviews and installs", paths: ["/marketplaces"] },
  { file: "privacy", words: "Privacy policy", paths: ["/privacy"] },
  { file: "terms", words: "Terms of use", paths: ["/terms"] },
  { file: "security", words: "Security and data handling", paths: ["/security"] },
  { file: "login", words: "Sign in", paths: ["/login"] },
  {
    file: "learn-azure-disk-cost-optimization",
    words: "Azure disk cost optimization",
    paths: ["/learn/azure-disk-cost-optimization"],
  },
  {
    file: "learn-change-eks-node-group-instance-type",
    words: "How to change an EKS node group instance type",
    paths: ["/learn/change-eks-node-group-instance-type"],
  },
  {
    file: "learn-cluster-autoscaler-not-scaling-down",
    words: "Cluster Autoscaler not scaling down on AKS and EKS",
    paths: ["/learn/cluster-autoscaler-not-scaling-down"],
  },
  {
    file: "learn-find-unattached-disks-azure",
    words: "How to find unattached disks in Azure and clean up",
    paths: ["/learn/find-unattached-disks-azure"],
  },
  {
    file: "learn-how-to-reduce-cloud-costs",
    words: "How to reduce cloud costs: what moves the bill",
    paths: ["/learn/how-to-reduce-cloud-costs"],
  },
  {
    file: "learn-hpa-vs-vpa-vs-cluster-autoscaler",
    words: "HPA vs VPA vs Cluster Autoscaler, plus Karpenter",
    paths: ["/learn/hpa-vs-vpa-vs-cluster-autoscaler"],
  },
  {
    file: "learn-kubernetes-cost-estimation",
    words: "Kubernetes cost estimation for AKS and EKS",
    paths: ["/learn/kubernetes-cost-estimation"],
  },
  {
    file: "learn-kubernetes-pod-right-sizing",
    words: "Kubernetes pod rebalancing",
    paths: ["/learn/kubernetes-pod-right-sizing"],
  },
  {
    file: "learn-poor-architecture-cloud-bill",
    words: "How poor architecture increases your cloud bill",
    paths: ["/learn/poor-architecture-cloud-bill"],
  },
  {
    file: "learn-reduce-kubernetes-cost",
    words: "How to reduce Kubernetes cost: requests, then nodes",
    paths: ["/learn/reduce-kubernetes-cost"],
  },
  {
    file: "learn-shrink-azure-managed-disk",
    words: "Can a managed disk shrink?",
    paths: ["/learn/shrink-azure-managed-disk"],
  },
  { file: "learn-vpa-vs-hpa", words: "VPA vs HPA", paths: ["/learn/vpa-vs-hpa"] },
];

const sentence = (words: string): string => (/[.?!]$/.test(words) ? words : `${words}.`);

export const pageCards: Readonly<Record<string, ShareImage>> = Object.fromEntries(
  CARDS.flatMap(({ file, words, paths }) =>
    paths.map((path) => [path, shareImage(`/og/pages/${file}.png`, `Zoorik. ${sentence(words)}`)]),
  ),
);

/** A page's card: its own; else, for a Learn article, the /learn card; else the brand card. */
export const cardFor = (path: string): ShareImage =>
  pageCards[path] ?? (path.startsWith("/learn/") ? pageCards["/learn"] : undefined) ?? socialImage;

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
    images: [image ?? cardFor(path)],
    url: path,
    ...copy,
  };
}
