import { calendarUrl, contactEmail, routes } from "@/config/site";
import { assessmentHref } from "@/content/assess";

/**
 * `/pricing`: every string it prints, word for word from the checked draft
 * (docs/website-seo/new-pages-2026-10-30/contact-pricing/pricing.md, each fact traced in its ledger.md) and the mock
 * (pricing.html).
 *
 * 🔴 NO PRICE, RATE, CURRENCY OR FIGURE (D193, 9 Oct 2026: "no prices on the site, only one true sentence about
 * pricing"). The one sentence is the owner's, word for word (D226, 30 Oct 2026), and it is the hero's deck. Nothing
 * here says what a vCPU or a GB "it manages" is beyond that line. The page's text holds no digit at all, and its
 * structured data no offer (`pricing-page.test.tsx`); the shared closing row's "Thirty minutes" is spelled out.
 *
 * The text is the draft's small markup, drawn by `RichText`: `code`, [text](href), the address as a mailto.
 */

/**
 * The day /pricing's content last changed, for the sitemap's `lastmod` only: the page prints no date. Whoever changes
 * the page moves it in the same PR; never the build's date.
 */
export const pricingLastUpdated = "30 October 2026";

/** The owner's line (D226), the page's lead: word for word, never paraphrased. */
export const pricingLine =
  "Coral is priced per vCPU it manages, and Amoeba per GB it manages. The free assessment shows your saving before you pay anything.";

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
      "Coral is priced per vCPU it manages, and Amoeba per GB it manages. See your saving with the free assessment, then buy on AWS or Microsoft Marketplace.",
  },
  hero: {
    title: "Pricing",
    deck: pricingLine,
    /** The hero's two buttons: the assessment, then the calendar. */
    assess: { label: "Estimate your saving", href: routes.assessment },
    demo: { label: "Book a demo", href: calendarUrl },
  },
  assessment: {
    id: "assessment",
    title: "Start with the free assessment",
    blocks: [
      {
        kind: "p",
        text: "One line in your cloud console. One PDF report with your estimated saving at list price.",
      },
      {
        kind: "ul",
        items: [
          "It is free and read-only.",
          "Run it in Cloud Shell or your terminal, on Azure or AWS.",
          "It writes the PDF on your machine and uploads nothing.",
          "You decide whether to email us the report.",
        ],
      },
      { kind: "p", text: "Choose the assessment you want:" },
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
            "Rebalances Kubernetes on AKS and EKS",
            "Rightsizes block storage on Windows and Linux VMs, on Azure and AWS",
          ],
          ["Priced per", "vCPU it manages", "GB it manages"],
          [
            "See your saving",
            `[Coral assessment](${assessmentHref("coral")})`,
            `[Amoeba assessment](${assessmentHref("amoeba")})`,
          ],
          ["More", `[Coral](${routes.coral})`, `[Amoeba](${routes.amoeba})`],
        ],
      },
      {
        kind: "p",
        text: "Your order, or your marketplace purchase, sets the price, how often you pay and the payment terms.",
      },
      {
        kind: "p",
        text: "Your cloud provider charges you directly for the disks and snapshots Amoeba creates or keeps.",
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
    line: "Design partners run Coral and Amoeba free on their non-production clusters and disks. Places are limited. They help shape what we build next. Production is on terms agreed with each partner.",
    go: { label: "Apply to be a design partner", href: mail("Design partner program") },
    more: { text: "Design partner program", href: routes.designPartners },
  },
  /** The FAQ's rows, closed, with no numbers: the Coral and Amoeba FAQs' own answers. */
  questions: {
    id: "questions",
    title: "Questions",
    rows: [
      {
        question: "Where can I buy Coral?",
        answer: [
          {
            kind: "p",
            text: "Coral is available in AWS Marketplace and Microsoft Marketplace. If you pay for Coral, the price, how often you pay and the payment terms are in your order or your marketplace purchase.",
          },
        ],
      },
      {
        question: "What does Amoeba cost?",
        answer: [
          {
            kind: "p",
            text: "The assessment is free. If you pay for Amoeba, your order sets the price, how often you pay and the payment terms.",
          },
          {
            kind: "p",
            text: "Your cloud provider charges you directly for the disks and snapshots Amoeba creates or keeps.",
          },
        ],
      },
      {
        question: "How do I get Amoeba?",
        answer: [
          {
            kind: "p",
            text: "Amoeba is in early access. Book a demo for early access, or run the free assessment first.",
          },
        ],
      },
      {
        question: "How do I see what I could save?",
        answer: [
          {
            kind: "p",
            text: "Run the free assessment in your terminal or Cloud Shell, on Azure or AWS.",
          },
          {
            kind: "ul",
            items: [
              "For Coral, it works out your own figure from your clusters, at list price.",
              "For Amoeba, it writes one PDF report with each VM's estimated saving at list price.",
            ],
          },
        ],
      },
      {
        question: "Do I pay for both sets of disks during an Amoeba move?",
        answer: [
          {
            kind: "p",
            text: "Yes, but only while the move runs. The source disks are deleted once the switch is checked. Then you pay for the safety snapshots for the few days they're kept.",
          },
        ],
      },
    ] satisfies readonly { readonly question: string; readonly answer: readonly PricingBlock[] }[],
  },
} as const;
