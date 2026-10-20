import { routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * The comparison pages: the hub at /compare, the versus pages under /compare/<slug> and each product's
 * alternatives pages. Competitors are named on these pages only (/learn and every other page are name-free): names
 * only, no logos, every claim with its source and the day it was checked. Code identifiers stay name-free, so a versus
 * page is a `slug`, never a key or a file named after a company.
 */

/**
 * The day the comparison pages' content last changed, for the sitemap's `lastmod` only. Whoever changes them moves this
 * to that day in the same PR; never the build's date.
 */
export const learnCompareLastUpdated = "19 October 2026";

/**
 * The comparison hub at /compare: every string it prints, verbatim. The market map's tools are `learn-market.ts`'s,
 * its cards the live versus pages and the alternatives pages below, and the day the facts were checked is
 * `marketChecked`, which the deck, the note and the cards print.
 */
export const compareHubPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Cloud cost optimization tools: Kubernetes, block storage and FinOps",
    description:
      "Every kind of tool that touches the cloud bill, by name: what each one does, how it acts and where it runs, checked on each company's own pages.",
  },
  hero: {
    title: "Cloud cost optimization tools",
    deck: (checked: string) =>
      `Every kind of tool that touches the cloud bill, by name: what each one does, whether it acts on its own, recommends or reports, and where it runs. Checked on each company’s own pages, ${checked}.`,
  },
  /** The market map: four tabs, one per kind of tool, then the note under them. */
  tools: {
    id: "tools",
    title: "Tools in the market",
    lede: "Four groups. Coral and Amoeba are marked in theirs.",
    /** The tabs' name for a screen reader, and each tab's count. */
    tabs: "Kinds of tool",
    count: (n: number) => `${n} tools`,
    /** The note under the map, around the address. */
    note: (checked: string) => ({
      before: `Names, owners and descriptions come from each company’s own pages, checked ${checked}. Names are their owners’ trademarks. Something changed? Write to `,
      after: " and we will correct it.",
    }),
  },
  /** Coral and Amoeba compared: the live versus pages, then the alternatives pages, as cards. */
  ours: {
    id: "ours",
    title: "Compare Coral and Amoeba",
    lede: "Side by side with a tool you may be considering, and every alternative in one list.",
    /** Between the two names on a versus card's cover. */
    vs: "vs",
    /** Each card's foot: the day its facts were checked. */
    checked: (checked: string) => `Checked ${checked}`,
  },
} as const;

export interface VersusPage {
  /** Its address under /compare/. */
  readonly slug: string;
  readonly product: ProductId;
  /** The page's `<title>` (through the site's " · Zoorik" template) and description; the title is its h1 and the
   *  description its deck. */
  readonly meta: { readonly title: string; readonly description: string };
  /** Its card's line on /compare's Compare Coral and Amoeba. */
  readonly line: string;
}

/**
 * The versus pages that are live: one per product, each against a tool that is not a direct competitor. The other
 * seven are held until the first 10 clients: not built, not shown, not linked.
 */
export const versusPages: readonly VersusPage[] = [
  {
    slug: "coral-vs-stormforge",
    product: "coral",
    meta: {
      title: "Coral vs StormForge",
      description:
        "Both reduce the cost of Kubernetes. Here is what each one does, side by side, from each company’s own pages.",
    },
    line: "What each one does for Kubernetes cost on Azure and AWS, side by side.",
  },
  {
    slug: "amoeba-vs-zesty-disk",
    product: "amoeba",
    meta: {
      title: "Amoeba vs Zesty Disk",
      description:
        "Both reduce the cost of block storage. Here is what each one does, side by side, from each company’s own pages.",
    },
    line: "What each one does for block storage cost on Azure and AWS, side by side.",
  },
];

export const versusRoute = (page: VersusPage): `/${string}` => `${routes.compare}/${page.slug}`;

export interface AlternativesPage {
  readonly route: string;
  readonly product: ProductId;
  /** The `<title>` and description, as a versus page's: the title is its h1 and the description its deck. */
  readonly meta: { readonly title: string; readonly description: string };
  /** Its card's line on /compare's Compare Coral and Amoeba. */
  readonly line: string;
}

/** Each product's alternatives page. */
export const alternativesPages: readonly AlternativesPage[] = [
  {
    route: routes.compareCoralAlternatives,
    product: "coral",
    meta: {
      title: "Coral alternatives: Kubernetes cost tools compared",
      description:
        "Weighing Coral against other ways to reduce Kubernetes cost on AKS and EKS? Here is each option, what it does and how it acts, from each company’s own pages.",
    },
    line: "Every way to reduce Kubernetes cost on AKS and EKS, and how each one acts.",
  },
  {
    route: routes.compareAmoebaAlternatives,
    product: "amoeba",
    meta: {
      title: "Amoeba alternatives: block storage tools compared",
      description:
        "Weighing Amoeba against other ways to reduce what Azure managed disks and Amazon EBS cost? Here is each option, what it does and how it acts, from each company’s own pages.",
    },
    line: "Every way to right-size Azure managed disks and Amazon EBS, and how each one acts.",
  },
];

/** What a versus page prints around its facts. */
export const versusCopy = {
  /** Over the h1. */
  kicker: (checked: string) => `Compare · checked ${checked}`,
  glance: {
    id: "glance",
    title: "At a glance",
    lede: "What each one is, in its maker’s words.",
    /** Our side's link to its product page. */
    see: (product: string) => `See ${product}`,
  },
  table: {
    id: "side-by-side",
    title: "Side by side",
    lede: "From the product pages and docs of each.",
    caption: (ours: string, theirs: string) => `${ours} and ${theirs}, side by side`,
  },
  /** A claim's link to the page it comes from; numbered where a claim has more than one ("source 1", "source 2"). */
  source: "source",
  /** The fine print under the table, around the address. */
  fine: (theirs: string, checked: string) => ({
    before: `${theirs} is a trademark of its owner. Everything said here about ${theirs} comes from its own public pages, each linked, checked ${checked}. “Not stated” means its pages do not say. Something changed? Write to `,
    after: " and we will correct it.",
  }),
} as const;

/** What an alternatives page prints around its facts. */
export const alternativesCopy = {
  kicker: (checked: string) => `Alternatives · checked ${checked}`,
  choose: {
    id: "choose",
    title: "How to choose",
    lede: "Four questions that separate these tools faster than any feature list.",
  },
  options: {
    id: "options",
    title: "The options",
    lede: "The tools you are likely to meet, what each does, and how it acts.",
  },
  /** A listed tool's link to its live versus page. */
  compare: (product: string) => `Compare with ${product}`,
  /** The note under the list, around the address. */
  note: (checked: string) => ({
    before: `Names, owners and descriptions come from each company’s own pages, checked ${checked}. Names are their owners’ trademarks. Something changed? Write to `,
    after: ".",
  }),
} as const;
