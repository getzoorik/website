import { routes } from "@/config/site";

/**
 * `/referrals`: every string the page prints, verbatim from the approved mock.
 *
 * The program is coming soon: the offer and the ask, side by side on the band, with the free assessment's two
 * commands to share; how it will work, as three cards joined by arrows (who hands what to whom); and who to
 * introduce. Product names are written plainly here; the page keeps each one out of a translator's hands (`named()`)
 * wherever the mock marks it.
 *
 * 🔴 THE PROGRAM HAS NO TERMS YET, SO THE PAGE STATES NONE: no reward amount, no commission rate, no payout, no
 * figure of our own making. The page says the terms will be on it when the program opens, and nothing more
 * (`referrals-page.test.tsx` holds the page to it). The two commands are the assessment's own (`assessment.ts`).
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#how` and `#who` are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /referrals's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /referrals's content moves this to that day in the same PR; never the build's date.
 */
export const referralsLastUpdated = "21 October 2026";

/** A team's glyph in Who you could introduce: a product's mark, or a line glyph for the roles both serve. */
export type ReferralTeamIcon = "coral" | "amoeba" | "eye" | "shield";

export const referralsPage = {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and description. */
  meta: {
    title: "Referral program",
    description:
      "Introduce a team that runs Kubernetes or block storage on Azure or AWS to Zoorik. The referral program is coming soon.",
  },
  hero: {
    title: "Referral program",
    deck: "Introduce a team that runs Kubernetes or block storage on Azure or AWS, and be rewarded when they become a customer.",
  },
  /** The white card: the program to come, and the free assessment to share until then. */
  offer: {
    flag: "Coming soon",
    title: "Introduce a team, be rewarded",
    line: "The terms will be on this page when the program opens. Until then, share the free assessment: one command, one PDF with their estimated saving.",
    go: { label: "See the free assessment", href: routes.assessment },
  },
  /** The Copy buttons beside the two commands: their label at rest and for 1.6 s after a copy, and what a screen
   *  reader hears then. Each button's name is the assessment's own ("Copy the Coral command"). */
  copy: { idle: "Copy", done: "Copied", announcement: "Copied" },
  /** The navy card: a ready email to the founders. */
  ask: {
    title: "Want to hear when it opens?",
    line: "Write to us and we will tell you first.",
    write: { label: "Write to us", subject: "Referral program" },
  },
  /** Three cards joined by arrows: who does what. */
  journey: {
    id: "how",
    title: "How it will work",
    steps: [
      {
        who: "You",
        title: "Introduce a team",
        line: "Send us their name, or share the free assessment with them.",
      },
      {
        who: "Their team",
        title: "They see their number",
        line: "The free assessment shows their estimated saving at list price, in one PDF.",
      },
      {
        who: "Zoorik",
        title: "You’re rewarded",
        line: "When they become a customer, on the terms this page will set out.",
      },
    ],
  },
  who: {
    id: "who",
    title: "Who you could introduce",
    teams: [
      { icon: "coral", title: "Platform teams on AKS", line: "Coral" },
      { icon: "coral", title: "Platform teams on Amazon EKS", line: "Coral" },
      { icon: "amoeba", title: "Teams whose Azure managed disks keep growing", line: "Amoeba" },
      { icon: "amoeba", title: "Teams with large Amazon EBS volumes", line: "Amoeba" },
      { icon: "eye", title: "FinOps practitioners", line: "Coral and Amoeba" },
      { icon: "shield", title: "SRE and DevOps leads", line: "Coral and Amoeba" },
    ] satisfies readonly { icon: ReferralTeamIcon; title: string; line: string }[],
  },
} as const;
