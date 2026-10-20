import {
  crunchbaseProfile,
  f6sCompany,
  g2Coral,
  g2Seller,
  saasBrowserProfile,
  tracxnCompany,
  wellfoundCompany,
} from "@/config/entity";
import type { MarketplaceId } from "@/config/marketplaces";
import { channels } from "@/config/open-source";
import type { ProductId } from "@/content/products";

/**
 * `/marketplaces`, where to find Zoorik: every string the page prints, verbatim from the approved mock.
 *
 * Only real listings link: the stores' listings are `src/config/marketplaces.ts`'s, the registries
 * `src/config/open-source.ts`'s channels, and the review sites and profiles `src/config/entity.ts`'s. Gartner Peer
 * Insights has no Zoorik listing yet, so its card says so and links nowhere. No rating or review count is printed: the
 * page states none it has not read on the listing itself.
 */

/**
 * The day /marketplaces's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /marketplaces's content moves this to that day in the same PR; never the build's date.
 */
export const marketplacesLastUpdated = "20 October 2026";

/**
 * The assessment's package on npm, `zoorik` (unscoped; `npx zoorik assess coral`). The mock links npm's card to Zoorik's
 * org there (`entity.ts`'s `npmOrg`), which holds no package: the assessment is published outside it, so a reader
 * following "The free assessment, with npx" to the org finds nothing to install (the registry lists no package for
 * the org, and `zoorik` 1.3.0 is the assessment). The card points at the package, as PyPI's points at
 * its project. No config holds this address yet; it belongs beside `open-source.ts`'s `pypiProject`.
 */
export const npmPackage = "https://www.npmjs.com/package/zoorik";

/** One link of Install from or Find us on the web: the place's name, what is there, and the address. */
export interface MarketplacesLink {
  readonly name: string;
  readonly line: string;
  readonly href: string;
}

export const marketplacesPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Where to find Zoorik: marketplaces, reviews and installs",
    description:
      "Buy Coral on AWS or Microsoft Marketplace and Amoeba on Microsoft Marketplace, read reviews on G2, and install from Homebrew, PyPI, npm and the Terraform Registry.",
  },
  /** The page's name (its h1), the deck under it, and the two buttons down the page. */
  hero: {
    title: "Where to find Zoorik",
    deck: "Buy Coral and Amoeba through your cloud’s marketplace, read and write reviews, install from the registries you already use, and find us across the web.",
    buy: "Cloud marketplaces",
    reviews: "Reviews",
  },
  /**
   * The stores: one navy card for each listing (the store's name, the product, what it is there, the listing), Coral's
   * first, then the line for the store that does not list Amoeba yet (`storesListing("amoeba")`).
   */
  buy: {
    id: "buy",
    title: "Cloud marketplaces",
    lede: "Buy through the account you already pay your cloud bill with.",
    stores: {
      coral: {
        aws: "Kubernetes cost optimization for Amazon EKS, bought and billed through your AWS account.",
        microsoft:
          "Kubernetes cost optimization for Azure Kubernetes Service, through your Microsoft account.",
      },
      amoeba: {
        microsoft:
          "Block storage cost optimization for Azure managed disks, through your Microsoft account.",
      },
    } satisfies Record<ProductId, Partial<Record<MarketplaceId, string>>> as Readonly<
      Record<ProductId, Partial<Readonly<Record<MarketplaceId, string>>>>
    >,
    go: "View the listing",
    /** "Amoeba is not on AWS Marketplace yet. See Amoeba or write to us.", its two links in place. */
    notYet: {
      lead: "Amoeba is not on AWS Marketplace yet. ",
      see: "See Amoeba",
      or: " or ",
      write: "write to us",
      subject: "Amoeba",
      end: ".",
    },
  },
  reviews: {
    id: "reviews",
    title: "Reviews",
    lede: "What teams say, on independent review sites.",
    /** G2: Coral's reviews and Zoorik's seller page. */
    g2: {
      kicker: "G2",
      title: "Reviews of Coral",
      line: "Read what teams say about Coral, or leave a review of your own.",
      read: { label: "Read reviews on G2", href: g2Coral },
      seller: { label: "Zoorik on G2", href: g2Seller },
    },
    /** Gartner Peer Insights: no listing yet, so no link. */
    soon: {
      kicker: "Gartner Peer Insights",
      title: "Listing coming soon",
      line: "We are setting up Zoorik on Gartner Peer Insights, Gartner’s free platform for verified reviews of enterprise software.",
      chip: "Coming soon",
    },
  },
  install: {
    id: "install",
    title: "Install from",
    lede: "Every package comes from our own accounts on these registries.",
    links: [
      { ...channels.homebrew, line: "zoorikctl for macOS and Linux" },
      { ...channels.scoop, line: "zoorikctl for Windows" },
      { ...channels.pypi, line: "The free assessment" },
      /* npm is no channel of `open-source.ts`: the name is the registry's, the address the assessment's package there. */
      { name: "npm", href: npmPackage, line: "The free assessment, with npx" },
      { ...channels["artifact-hub"], line: "The Coral agent Helm chart" },
      { ...channels["terraform-registry"], line: "AKS and EKS modules" },
    ] as readonly MarketplacesLink[],
  },
  web: {
    id: "web",
    title: "Find us on the web",
    links: [
      { name: "Crunchbase", line: "Company profile", href: crunchbaseProfile },
      { name: "Wellfound", line: "Company and roles", href: wellfoundCompany },
      { name: "Tracxn", line: "Company profile", href: tracxnCompany },
      { name: "F6S", line: "Company profile", href: f6sCompany },
      { name: "SaaS Browser", line: "Product listing", href: saasBrowserProfile },
      { ...channels.github, line: "Code, charts and issues" },
    ] as readonly MarketplacesLink[],
  },
  /** The navy close: a private offer, by a ready email to the founders. */
  close: {
    title: "Want to buy through your marketplace?",
    line: "We can set up a private offer on AWS or Microsoft Marketplace.",
    write: { label: "Write to us", subject: "Marketplace" },
  },
} as const;
