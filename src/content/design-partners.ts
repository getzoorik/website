import { calendarUrl } from "@/config/site";

/**
 * `/design-partners`: every string the page prints, verbatim from the approved mock.
 *
 * The program is open now: the offer and what we ask, side by side on the band; what a partner gets; how it works in
 * four steps; and who it is for. Product names are written plainly here; the page keeps each one out of a
 * translator's hands (`named()`) wherever the mock marks it.
 *
 * 🔴 ONE OFFER, ONE TERM, NO OTHER FIGURE: the first {@link designPartnerPlaces} partners run Coral and Amoeba
 * free on their non-production clusters and disks, and production is "on terms agreed with each partner". No price,
 * no discount, no length of term, no other figure (`design-partners-page.test.tsx` holds the page to it). The number
 * of places is written once, below, and every line that names it reads it from there.
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#get`, `#how` and `#who` are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /design-partners's content last changed, for the sitemap's `lastmod` only: the page does not print it.
 * Whoever changes /design-partners's content moves this to that day in the same PR; never the build's date.
 */
export const designPartnersLastUpdated = "21 October 2026";

/** How many design partners get the offer: their non-production infrastructure is free. */
export const designPartnerPlaces = 10;

/** A tile's glyph in What you get, by what it means. */
export type DesignPartnerGetIcon = "check" | "play" | "send" | "eye";

/** A team's mark in Who it is for: the product it is for. */
export type DesignPartnerTeamIcon = "coral" | "amoeba";

/** The ready email's subject (`Design%20partner%20program`, as the mock encodes it). */
const subject = "Design partner program";

export const designPartnersPage = {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and description. */
  meta: {
    title: "Design partner program",
    description:
      "Join Zoorik's design partner program: the first 10 partners run Coral and Amoeba free on their non-production infrastructure and shape what we build next.",
  },
  hero: {
    title: "Design partner program",
    deck: "Run Coral and Amoeba free on your non-production clusters and disks, and shape what we build next.",
  },
  /** The white card: the offer, open now, a slot for each place, and a ready email. */
  offer: {
    flag: `Open now · the first ${designPartnerPlaces}`,
    title: "Free on non-production",
    line: `For the first ${designPartnerPlaces} design partners, Coral and Amoeba cost nothing on development, test and staging clusters and disks. Production is on terms agreed with each partner.`,
    apply: { label: "Apply to be a design partner", subject },
  },
  /** The navy card: the three things we ask, and the calendar, in a new tab. */
  ask: {
    title: "What we ask",
    line: "Three things, so we build what you need.",
    items: [
      "Run Coral or Amoeba on a real non-production cluster or real disks.",
      "Join regular feedback calls with our team.",
      "If you agree, let us publish your results as a case study, named or anonymised.",
    ],
    call: { label: "Book a call", href: calendarUrl },
  },
  get: {
    id: "get",
    title: "What you get",
    tiles: [
      {
        icon: "check",
        title: "Free on non-production",
        line: "No cost on your development, test and staging clusters and disks.",
      },
      {
        icon: "play",
        title: "Early access",
        line: "New Coral and Amoeba features reach you first.",
      },
      {
        icon: "send",
        title: "A direct line to the builders",
        line: "Work with the people who build them, not a ticket queue.",
      },
      {
        icon: "eye",
        title: "A say in what we build",
        line: "What you need shapes what we build next.",
      },
    ] satisfies readonly { icon: DesignPartnerGetIcon; title: string; line: string }[],
  },
  /** The program as a path: four numbered steps on one line. */
  journey: {
    id: "how",
    title: "How it works",
    steps: [
      { title: "Apply", line: "Tell us about your clusters and disks." },
      {
        title: "See your number",
        line: "The free assessment shows your estimated saving at list price.",
      },
      {
        title: "Connect a non-production cluster",
        line: `zoorikctl, Helm or Terraform; free for the first ${designPartnerPlaces} partners.`,
      },
      {
        title: "Review together",
        line: "We go through the results with you and plan what comes next.",
      },
    ],
  },
  who: {
    id: "who",
    title: "Who it is for",
    teams: [
      { icon: "coral", title: "Platform teams on AKS", line: "Coral" },
      { icon: "coral", title: "Platform teams on Amazon EKS", line: "Coral" },
      { icon: "amoeba", title: "Teams whose Azure managed disks keep growing", line: "Amoeba" },
      { icon: "amoeba", title: "Teams with large Amazon EBS volumes", line: "Amoeba" },
    ] satisfies readonly { icon: DesignPartnerTeamIcon; title: string; line: string }[],
  },
} as const;
