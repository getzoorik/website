import {
  crunchbaseProfile,
  f6sCompany,
  g2Coral,
  g2Seller,
  saasBrowserProfile,
  tracxnCompany,
  wellfoundCompany,
} from "@/config/entity";
import { channels, type ChannelId } from "@/config/open-source";

/**
 * `/marketplaces`, where to find Zoorik: every string the page prints, verbatim from the approved mock.
 *
 * Only real listings link: the stores' listings are `src/config/marketplaces.ts`'s, the registries
 * `src/config/open-source.ts`'s channels, and the review sites and profiles `src/config/entity.ts`'s. No rating or
 * review count is printed: the page states none it has not read on the listing itself. What does not apply is not
 * drawn: a review site that does not list Zoorik has no tile, and a store that does not list a product has no row.
 */

/**
 * The day /marketplaces's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /marketplaces's content moves this to that day in the same PR; never the build's date.
 */
export const marketplacesLastUpdated = "21 October 2026";

/**
 * The assessment's package on npm, `zoorik` (unscoped; `npx zoorik assess coral`). The tile points at the package, as
 * PyPI's points at its project: Zoorik's org on npm holds no package. No config holds this address yet; it belongs
 * beside `open-source.ts`'s `pypiProject`.
 */
export const npmPackage = "https://www.npmjs.com/package/zoorik";

/**
 * The icon a tile carries: a channel's own icon (a registry's line icon, GitHub's mark), or the platform's logo file in
 * `public/marketplace-logos/`. G2's, Crunchbase's and Wellfound's are Simple Icons' (CC0) in each brand's colour;
 * Tracxn's, F6S's and SaaS Browser's are their own sites' icons.
 */
export type MarketplacesIcon = ChannelId | `/marketplace-logos/${string}`;

/** One tile of Reviews, Install from or Find us on the web: its icon, the place's name, what is there, the address. */
export interface MarketplacesLink {
  readonly icon: MarketplacesIcon;
  readonly name: string;
  readonly line: string;
  readonly href: string;
}

export const marketplacesPage = {
  /** The page's `<title>` (through the site's "Zoorik | %s" template) and description. */
  meta: {
    title: "Marketplaces",
    description:
      "Buy Coral and Amoeba on AWS or Microsoft Marketplace, read reviews on G2, and install from Homebrew, PyPI, npm and the Terraform Registry.",
  },
  /** The page's name (its h1) and the line under it. */
  hero: {
    title: "Where to find Zoorik",
    deck: "Buy Coral and Amoeba through your cloud’s marketplace, read and write reviews, install from the registries you already use, and find us across the web.",
  },
  /** The pair on the band: the two cards. */
  band: {
    /** The white card: every listing as a row, "<product> on <store>", Coral's first, each in a new tab. */
    buy: {
      title: "Cloud marketplaces",
      line: "Buy through the account you already pay your cloud bill with.",
      on: " on ",
    },
    /** The navy card: a private offer, by a ready email to the founders. */
    offer: {
      title: "Want to buy through your marketplace?",
      line: "We can set up a private offer on AWS or Microsoft Marketplace.",
      write: { label: "Write to us", subject: "Marketplace" },
    },
  },
  reviews: {
    id: "reviews",
    title: "Reviews",
    links: [
      {
        icon: "/marketplace-logos/g2.svg",
        name: "Reviews of Coral",
        line: "Read what teams say about Coral, or leave a review of your own.",
        href: g2Coral,
      },
      {
        icon: "/marketplace-logos/g2.svg",
        name: "Zoorik on G2",
        line: "Our seller page on G2.",
        href: g2Seller,
      },
    ] as readonly MarketplacesLink[],
  },
  install: {
    id: "install",
    title: "Install from",
    links: [
      { icon: "homebrew", ...channels.homebrew, line: "zoorikctl for macOS and Linux" },
      { icon: "scoop", ...channels.scoop, line: "zoorikctl for Windows" },
      { icon: "pypi", ...channels.pypi, line: "The free assessment" },
      /* npm is no channel of `open-source.ts`: the name is the registry's, the address the assessment's package there,
         and its icon PyPI's carton, the package the assessment is. */
      { icon: "pypi", name: "npm", href: npmPackage, line: "The free assessment, with npx" },
      { icon: "artifact-hub", ...channels["artifact-hub"], line: "The Coral agent Helm chart" },
      {
        icon: "terraform-registry",
        ...channels["terraform-registry"],
        line: "AKS and EKS modules",
      },
    ] as readonly MarketplacesLink[],
  },
  web: {
    id: "web",
    title: "Find us on the web",
    links: [
      {
        icon: "/marketplace-logos/crunchbase.svg",
        name: "Crunchbase",
        line: "Company profile",
        href: crunchbaseProfile,
      },
      {
        icon: "/marketplace-logos/wellfound.svg",
        name: "Wellfound",
        line: "Company and roles",
        href: wellfoundCompany,
      },
      {
        icon: "/marketplace-logos/tracxn.png",
        name: "Tracxn",
        line: "Company profile",
        href: tracxnCompany,
      },
      {
        icon: "/marketplace-logos/f6s.png",
        name: "F6S",
        line: "Company profile",
        href: f6sCompany,
      },
      {
        icon: "/marketplace-logos/saas-browser.png",
        name: "SaaS Browser",
        line: "Product listing",
        href: saasBrowserProfile,
      },
      { icon: "github", ...channels.github, line: "Code, charts and issues" },
    ] as readonly MarketplacesLink[],
  },
} as const;
