import { routes } from "@/config/site";

/**
 * `/referrals`: every string the page prints, verbatim from the approved mock.
 *
 * The page sets out the three steps as a journey, then who to introduce, and what they will see.
 * Product names are written plainly here; the page keeps each one out of a translator's hands (`named()`) wherever the
 * mock marks it.
 *
 * 🔴 THE PROGRAM HAS NO TERMS YET, SO THE PAGE STATES NONE: no reward amount, no commission rate, no payout, no
 * figure of our own making. The steps say the terms will be on this page when it opens, and nothing more
 * (`referrals-page.test.tsx` holds the page to it). Its figures are read from their sources: the command is the
 * assessment's own (`assessment.ts`), and the study's figures and the example report's page are the study's and the
 * assessment's (`case-studies.ts`).
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#how` (the hero's second button), `#who` and `#proof` are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /referrals's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /referrals's content moves this to that day in the same PR; never the build's date.
 */
export const referralsLastUpdated = "19 October 2026";

/** Who a team in Who you could introduce is: its glyph, and which product it is for. */
export type ReferralTeamIcon = "coral" | "amoeba" | "eye" | "shield";

export const referralsPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Referral program (coming soon)",
    description:
      "Introduce a team that runs Kubernetes or block storage on Azure or AWS to Zoorik. The referral program is coming soon.",
  },
  hero: {
    /** The label over the h1, as on both programs' pages until each opens. */
    soon: "Coming soon",
    title: "Referral program",
    deck: "Know a team that runs Kubernetes or block storage on Azure or AWS? Soon you’ll be able to introduce them to Zoorik and be rewarded when they become a customer.",
    /** The light button: a ready email to the founders. */
    write: { label: "Tell me when it opens", subject: "Referral program" },
    more: { label: "How it will work", href: "#how" },
  },
  /** The navy panel: the three steps on one line, each with its picture. */
  journey: {
    id: "how",
    eyebrow: "The referral program",
    title: "How it will work",
    lede: "Three steps. Nothing to sign up for yet.",
    /** Step 1's picture: an email to the founders, its body drawn as three grey lines. */
    mail: { to: "To", subject: "Subject", line: "Introduction: a team on AKS", send: "Send" },
    /** Step 2's picture: the assessment's own command, then what it prints while it runs. */
    run: { title: "Terminal", reading: "Reading clusters…", writing: "Writing " },
    /** Step 3's picture: a gift, and where the terms will be. */
    terms: "Terms: on this page when it opens",
    steps: [
      {
        title: "Introduce a team",
        body: "Send us their name, or share the free assessment with them.",
      },
      {
        title: "They see their number",
        body: "The free assessment shows their estimated saving at list price, in one PDF report.",
      },
      {
        title: "You’re rewarded",
        body: "When they become a customer, you are rewarded on the terms this page will set out.",
      },
    ],
  },
  who: {
    id: "who",
    title: "Who you could introduce",
    lede: "Anyone who pays for Kubernetes or block storage on Azure or AWS.",
    teams: [
      { icon: "coral", title: "Platform teams on AKS", for: "Coral" },
      { icon: "coral", title: "Platform teams on Amazon EKS", for: "Coral" },
      { icon: "amoeba", title: "Teams whose Azure managed disks keep growing", for: "Amoeba" },
      { icon: "amoeba", title: "Teams with large Amazon EBS volumes", for: "Amoeba" },
      { icon: "eye", title: "FinOps practitioners", for: "Coral and Amoeba" },
      { icon: "shield", title: "SRE and DevOps leads", for: "Coral and Amoeba" },
    ] satisfies readonly { icon: ReferralTeamIcon; title: string; for: string }[],
  },
  proof: {
    id: "proof",
    title: "What they’ll see",
    lede: "Real numbers, not a pitch: our own cluster first, then theirs.",
    /**
     * The study's card: its label, its figure and its bill before and after are the study's own (`case-studies.ts`).
     * The kicker is the label, then this.
     */
    study: {
      kicker: "Coral on AKS",
      cap: "Our own cluster’s machine bill a month, before and after",
      go: "Read the case study",
    },
    /** The assessment's card: page one of its example report, the one /assessment offers to download. */
    report: {
      kicker: "The free assessment · example report",
      /** The page at the size the card draws it; /assessment's own thumbnail is 92 px wide. */
      image: "/programs/coral-report-page-1.webp",
      /** The page's own pixels, as WebP. */
      width: 909,
      height: 1287,
      alt: "Page one of the example Coral assessment report",
      cap: "One command in their terminal. One PDF with their estimated saving at list price.",
      go: "See the free assessment",
      href: routes.assessment,
    },
  },
  close: {
    title: "Want to hear when it opens?",
    line: "The terms will be on this page when the program opens.",
    write: { label: "Write to us", subject: "Referral program" },
  },
} as const;
