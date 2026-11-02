import { calendarUrl, contactEmail, routes } from "@/config/site";
import { assessmentHref } from "@/content/assess";

/**
 * `/pricing`: every string it prints, word for word from the checked draft
 * (docs/website-seo/new-pages-2026-10-30/contact-pricing/pricing.md, each fact traced in its ledger.md) and the mock
 * (pricing.html).
 *
 * 🔴 NO PRICE, RATE, CURRENCY OR FIGURE (D193, 9 Oct 2026: "no prices on the site, only one true sentence about
 * pricing"). The one line is the owner's, word for word (D226, 30 Oct 2026): its first sentence is the hero's deck,
 * and its second opens the free assessment (2 Nov 2026). Nothing here says what a vCPU or a GB "it manages" is beyond
 * that line. The page's text holds no digit at all, and its structured data no offer (`pricing-page.test.tsx`); the
 * shared closing row's "Thirty minutes" and the safety snapshots' "seven days" (the 7 days /security prints) are
 * spelled out.
 *
 * The text is the draft's small markup, drawn by `RichText`: `code`, [text](href), the address as a mailto.
 */

/**
 * The day /pricing's content last changed, for the sitemap's `lastmod` only: the page prints no date. Whoever changes
 * the page moves it in the same PR; never the build's date.
 */
export const pricingLastUpdated = "2 November 2026";

/**
 * The owner's line (D226) in its two sentences, word for word, never paraphrased: the hero's deck, then the free
 * assessment's lead.
 */
const pricingDeck = "Coral is priced per vCPU it manages, and Amoeba per GB it manages.";
const pricingAssessment = "The free assessment shows your saving before you pay anything.";

/** The owner's line (D226), whole. */
export const pricingLine = `${pricingDeck} ${pricingAssessment}`;

/** A ready email with its subject, as the mock encodes it. */
const mail = (subject: string): string =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

export interface PricingTable {
  readonly head: readonly string[];
  /** The columns' widths, as the mock's colgroup sets them. */
  readonly widths: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export type PricingBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  | ({ readonly kind: "table" } & PricingTable);

export const pricingPage = {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and its description. */
  meta: {
    title: "Pricing",
    description:
      "Kubernetes optimization pricing: Coral is priced per vCPU it manages, Amoeba per GB. Run the free assessment first, then buy on AWS or Microsoft Marketplace.",
  },
  hero: {
    title: "Pricing",
    deck: pricingDeck,
    /** The hero's two buttons: the assessment, then the calendar. */
    assess: { label: "Estimate your saving", href: routes.assessment },
    demo: { label: "Book a demo", href: calendarUrl },
  },
  assessment: {
    id: "assessment",
    title: "Start with the free assessment",
    blocks: [
      { kind: "p", text: pricingAssessment },
      {
        kind: "ul",
        items: [
          "It is free and read-only.",
          "Run it in Cloud Shell or your terminal, on Azure or AWS.",
          "It writes the PDF on your machine and uploads nothing.",
          "You decide whether to email us the report.",
        ],
      },
      {
        kind: "table",
        head: ["Product", "Run", "Page"],
        widths: ["22%", "39%", "39%"],
        rows: [
          [
            "Coral",
            "`npx -y zoorik assess coral`",
            `[Coral assessment](${assessmentHref("coral")})`,
          ],
          [
            "Amoeba",
            "`npx -y zoorik assess amoeba`",
            `[Amoeba assessment](${assessmentHref("amoeba")})`,
          ],
        ],
      },
      {
        kind: "p",
        text: `Sign in to your cloud first: \`az login\` or \`aws sso login\` in your terminal, or run it directly in Cloud Shell. The [assessment page](${routes.assessment}) has every step.`,
      },
    ] satisfies readonly PricingBlock[] as readonly PricingBlock[],
  },
  products: {
    id: "products",
    title: "Coral and Amoeba",
    blocks: [
      {
        kind: "table",
        head: ["", "Coral", "Amoeba"],
        widths: ["22%", "39%", "39%"],
        rows: [
          [
            "What it does",
            "Rebalances pod requests and nodes on AKS and EKS",
            "Rightsizes block storage on Windows and Linux VMs, on Azure and AWS",
          ],
          ["Priced per", "vCPU it manages", "GB it manages"],
          ["More", `[Coral](${routes.coral})`, `[Amoeba](${routes.amoeba})`],
        ],
      },
      {
        kind: "p",
        text: "Your order, or your marketplace purchase, sets the price, how often you pay and the payment terms.",
      },
    ] satisfies readonly PricingBlock[] as readonly PricingBlock[],
  },
  /** The four listings by name, text only (`marketplaces[].listings`), then the private offer and every listing. */
  buy: {
    id: "buy",
    title: "Buy through your cloud marketplace",
    line: "Coral and Amoeba are available in AWS Marketplace and Microsoft Marketplace. Buy through the account you already use to pay for AWS or Azure.",
    /** A listing's name: the product, then the store in full ("Coral on AWS Marketplace"). */
    on: " on ",
    offer: `Want a private offer? We can set one up on AWS or Microsoft Marketplace. [Write to us](${mail("Marketplace")}).`,
    all: { text: "Every marketplace, review site and registry", href: routes.marketplaces },
  },
  /** The pair on the band: early access on the white card, design partners on the navy one. */
  early: {
    title: "Early access",
    line: "Coral and Amoeba are in early access.",
    go: { label: "Book a demo for early access", href: calendarUrl },
    after: [
      `Or write to ${contactEmail}`,
      `All the ways to reach us are on [Contact](${routes.contact}).`,
    ],
  },
  partners: {
    title: "Design partners",
    line: "Design partners run Coral and Amoeba free on their non-production clusters and disks. Places are limited. They help shape what we build next, and production runs on terms agreed with each partner.",
    go: { label: "Apply to be a design partner", href: mail("Design partner program") },
    more: { text: "Design partner program", href: routes.designPartners },
  },
  /** The FAQ's one row, closed, with no number: the question no section above answers (2 Nov 2026). */
  questions: {
    id: "questions",
    title: "Questions",
    rows: [
      {
        question: "Do I pay for both sets of disks during an Amoeba move?",
        answer: [
          {
            kind: "p",
            text: "Yes, but only while the move runs. The source disks are deleted once the switch is checked. Then you pay for the safety snapshots for the seven days they're kept.",
          },
          {
            kind: "p",
            text: "Your cloud provider charges you directly for the disks and snapshots Amoeba creates or keeps.",
          },
        ],
      },
    ] satisfies readonly { readonly question: string; readonly answer: readonly PricingBlock[] }[],
  },
} as const;
