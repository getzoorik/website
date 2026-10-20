import { routes } from "@/config/site";

/**
 * `/partners`: every string the page prints, verbatim from the approved mock.
 *
 * What a partner brings to its customers, who the program is for, and the kit that works today. Product names are
 * written plainly here; the page keeps each one out of a translator's hands (`named()`) wherever the mock marks it.
 *
 * 🔴 THE PROGRAM HAS NO TERMS YET, SO THE PAGE STATES NONE: no commission rate, no margin, no payout, no figure of
 * our own making (`partners-page.test.tsx` holds the page to it). Every figure on it is read from its source: the
 * three ranges and their qualifier are the home page's (`savings.ts`, on its axis, `offers.ts`), the −58% is the case
 * study's (`case-studies.ts`), the two commands are the assessment's (`assessment.ts`), and the chart, the module and
 * the two marketplaces are `open-source.ts`'s and `marketplaces.ts`'s, and the marketplaces' card links to /marketplaces.
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#offer`, `#who` and `#today` (the hero's second button) are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /partners's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /partners's content moves this to that day in the same PR; never the build's date.
 */
export const partnersLastUpdated = "19 October 2026";

/** A card's cover in Who it is for: a plan of machines, a fleet, or the two marketplaces. */
export type PartnerCover = "plan" | "fleet" | "market";

export const partnersPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Partner program (coming soon)",
    description:
      "A partner program for consultancies, managed service providers and resellers who run Kubernetes and block storage on Azure and AWS. Coming soon.",
  },
  hero: {
    /** The label over the h1, as on both programs' pages until each opens. */
    soon: "Coming soon",
    title: "Partner program",
    deck: "For consultancies, managed service providers and resellers who run Kubernetes and block storage for their customers on Azure and AWS.",
    /** The light button: a ready email to the founders. */
    write: { label: "Talk to us about partnering", subject: "Partner program" },
    more: { label: "What you can use today", href: "#today" },
  },
  /** The navy panel: the home page's three estimated ranges on one 0 to 100% scale. */
  offer: {
    id: "offer",
    eyebrow: "What you bring to your customers",
    title: "Reduce their cloud bill, autonomously, without any downtime",
    lede: "Coral rebalances Kubernetes. Amoeba rightsizes block storage.",
    /** Each row's name and what its range is a share of; the range itself is `savings.ts`'s. */
    rows: [
      { figure: "coral", name: "Coral", of: "Kubernetes on AKS and EKS" },
      { figure: "amoeba", name: "Amoeba", of: "Block storage: Azure managed disks and Amazon EBS" },
      { figure: "both", name: "Together", of: "The overall cloud bill" },
    ],
    /** The link after the qualifier: the case study's figure, then these words. */
    study: " on our own cluster",
  },
  who: {
    id: "who",
    title: "Who it is for",
    cards: [
      {
        cover: "plan",
        title: "Consultancies and system integrators",
        body: "You design and run cloud platforms for clients. Bring Coral and Amoeba into the work you already do.",
      },
      {
        cover: "fleet",
        title: "Managed service providers",
        body: "You run clusters and VMs for customers every day. Coral rebalances their Kubernetes and Amoeba rightsizes their block storage, autonomously, without any downtime.",
      },
      {
        cover: "market",
        title: "Resellers and marketplace partners",
        body: "Zoorik is on AWS Marketplace and Microsoft Marketplace, where your customers already buy.",
      },
    ] satisfies readonly { cover: PartnerCover; title: string; body: string }[],
  },
  today: {
    id: "today",
    title: "What you can use today",
    lede: "Real tools, ready before the program opens.",
    /** The title of the two command windows; the module's window is titled by its file. */
    terminal: "Terminal",
    assessment: {
      title: "The free assessment",
      body: "Show a customer their estimated saving at list price, in one PDF.",
      go: "See the assessment",
      href: routes.assessment,
    },
    helm: {
      title: "Helm chart",
      body: "Install Coral’s agent the way your team already ships.",
      go: "Install with Helm",
      href: routes.docsInstallHelm,
      /** The command before the chart's address (`open-source.ts`), which goes on the line under it. */
      command: "helm install coral-agent \\",
    },
    terraform: {
      title: "Terraform modules",
      body: "AKS and EKS modules on the Terraform Registry.",
      go: "Install with Terraform",
      href: routes.docsInstallTerraform,
      /** The terminal's title: the file the module block goes in. */
      file: "main.tf",
      /** The block's name; its source is the AKS module's address on the Registry (`open-source.ts`). */
      module: "zoorik_coral",
    },
    marketplaces: {
      title: "The marketplaces",
      body: "Your customers can buy Zoorik where they already buy their cloud.",
      /** "Where to find us": /marketplaces, the stores, review sites and registries. */
      go: "Where to find us",
      href: routes.marketplaces,
    },
  },
  close: {
    title: "Want to partner with us?",
    line: "The terms will be on this page when the program opens.",
    write: { label: "Write to us", subject: "Partner program" },
  },
} as const;
