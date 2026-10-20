import { routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * `/partners`: every string the page prints, verbatim from the approved mock.
 *
 * The program is coming soon: what a partner brings its customers (the two products' estimated ranges) and the ask,
 * side by side on the band; who it is for; what works today; and where customers buy. Product names are written
 * plainly here; the page keeps each one out of a translator's hands (`named()`) wherever the mock marks it.
 *
 * 🔴 THE PROGRAM HAS NO TERMS YET, SO THE PAGE STATES NONE: no commission rate, no margin, no payout, no figure of
 * our own making (`partners-page.test.tsx` holds the page to it). The two ranges are the home page's (`savings.ts`),
 * the case study is the study's own route (`case-studies.ts`), and the store buttons are Coral's listings
 * (`marketplaces.ts`).
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#who` and `#today` are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /partners's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /partners's content moves this to that day in the same PR; never the build's date.
 */
export const partnersLastUpdated = "20 October 2026";

/** A tile's glyph: the Zoorik mark, a line glyph, or the document. */
export type PartnerTileIcon = "zoorik" | "shield" | "eye" | "package" | "doc";

export const partnersPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Partner program (coming soon)",
    description:
      "A partner program for consultancies, managed service providers and resellers who run Kubernetes and block storage on Azure and AWS. Coming soon.",
  },
  hero: {
    title: "Partner program",
    deck: "For consultancies, managed service providers and resellers who run Kubernetes and block storage for their customers on Azure and AWS.",
  },
  /** The white card: what a partner brings, each product's estimated range, and our own result. */
  offer: {
    flag: "Coming soon",
    title: "Reduce your customers’ cloud bill",
    line: "Coral rebalances Kubernetes and Amoeba rightsizes block storage, autonomously, without any downtime.",
    /** Each range's name; the range itself is `savings.ts`'s. */
    ranges: [
      { product: "coral", name: "Coral · Kubernetes" },
      { product: "amoeba", name: "Amoeba · block storage" },
    ] satisfies readonly { product: ProductId; name: string }[],
    fine: "Estimated ranges of the bill, not a promise.",
    /** The case study, by its own route (`case-studies.ts`). */
    go: "See our own result",
  },
  /** The navy card: a ready email to the founders. */
  ask: {
    title: "Want to partner with us?",
    line: "The terms will be on this page when the program opens.",
    write: { label: "Write to us", subject: "Partner program" },
  },
  who: {
    id: "who",
    title: "Who it is for",
    tiles: [
      {
        icon: "shield",
        title: "Consultancies and system integrators",
        line: "Bring Coral and Amoeba into the cloud platforms you design and run.",
      },
      {
        icon: "eye",
        title: "Managed service providers",
        line: "You run clusters and VMs for customers; Coral and Amoeba reduce their bill.",
      },
      {
        icon: "package",
        title: "Resellers and marketplace partners",
        line: "Zoorik is on AWS Marketplace and Microsoft Marketplace.",
      },
    ] satisfies readonly { icon: PartnerTileIcon; title: string; line: string }[],
  },
  today: {
    id: "today",
    title: "What you can use today",
    tiles: [
      {
        icon: "zoorik",
        title: "The free assessment",
        line: "Show a customer their estimated saving at list price, in one PDF.",
        href: routes.assessment,
      },
      {
        icon: "package",
        title: "Helm chart",
        line: "Install Coral’s agent the way your team already ships.",
        href: routes.docsInstallHelm,
      },
      {
        icon: "doc",
        title: "Terraform modules",
        line: "AKS and EKS modules on the Terraform Registry.",
        href: routes.docsInstallTerraform,
      },
    ] satisfies readonly { icon: PartnerTileIcon; title: string; line: string; href: string }[],
  },
  /** The row under the tiles: where customers buy Coral, its two store buttons, and every marketplace. */
  buy: {
    /** The heading's id, which names the section; the section itself has no address, as the mock draws it. */
    headingId: "buy-h",
    title: "Where your customers buy",
    line: "Coral is on AWS Marketplace and Microsoft Marketplace, billed with the rest of their cloud.",
    all: { label: "All marketplaces", href: routes.marketplaces },
  },
} as const;
