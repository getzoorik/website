import { calendarUrl, routes } from "@/config/site";

/**
 * `/design-partners`: every string the page prints, verbatim from the approved mock.
 *
 * The program is open now, not coming soon: the offer, what a partner gets, how it works in four steps, what we ask,
 * who it is for, where the results will sit, and the close. Product names are written plainly here; the page keeps
 * each one out of a translator's hands (`named()`) wherever the mock marks it.
 *
 * 🔴 ONE OFFER, ONE TERM, NO OTHER FIGURE: the first {@link designPartnerPlaces} partners run Coral and Amoeba
 * free on their non-production infrastructure, and production is "on terms agreed with each partner". No price, no
 * discount, no length of term, no other figure (`design-partners-page.test.tsx` holds the page to it). The number of
 * places is written once, below, and every line that names it reads it from there; the study's label, its −58% and its
 * bill are the study's own (`case-studies.ts`), and the command is the assessment's (`assessment.ts`).
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * `#offer`, `#get`, `#how`, `#ask`, `#who` and `#proof` are the mock's. Keep an id when its heading changes.
 */

/**
 * The day /design-partners's content last changed, for the sitemap's `lastmod` only: the page does not print it.
 * Whoever changes /design-partners's content moves this to that day in the same PR; never the build's date.
 */
export const designPartnersLastUpdated = "19 October 2026";

/** How many design partners get the offer: their non-production infrastructure is free. */
export const designPartnerPlaces = 10;

/** A card's glyph in What you get: the mock's sprite symbol, by what it means. */
export type DesignPartnerGetIcon = "check" | "play" | "send" | "eye";

/** A team's mark in Who it is for: the product it is for. */
export type DesignPartnerTeamIcon = "coral" | "amoeba";

/** The ready email's subject, on every button that writes to us (`Design%20partner%20program`, as the mock encodes it). */
const subject = "Design partner program";

export const designPartnersPage = {
  /** The page's `<title>` (through the site's " · Zoorik" template) and description. */
  meta: {
    title: "Design partner program",
    description:
      "Join Zoorik's design partner program: the first 10 partners run Coral and Amoeba free on their non-production infrastructure and shape what we build next.",
  },
  hero: {
    /** The label over the h1: open now, and for how many. */
    soon: `Open now · the first ${designPartnerPlaces} partners`,
    title: "Design partner program",
    deck: "Run Coral and Amoeba on your own clusters and disks before everyone else, shape what we build next, and work directly with the people who build them.",
    /** The light button: a ready email to the founders. */
    write: { label: "Apply to be a design partner", subject },
    /** The wire button: the calendar, in a new tab. */
    more: { label: "Book a call", href: calendarUrl },
  },
  /** The navy panel: the offer, a diamond for each place, and the one term production has. */
  offer: {
    id: "offer",
    eyebrow: "The offer",
    title: "Free on your non-production infrastructure",
    lede: `For the first ${designPartnerPlaces} design partners: Coral and Amoeba at no cost on development, test and staging clusters and disks.`,
    production: "Production clusters and disks are on terms agreed with each partner.",
    apply: { label: "Apply for a place", subject },
  },
  get: {
    id: "get",
    title: "What you get",
    cards: [
      {
        icon: "check",
        title: "Free on non-production",
        body: "Coral and Amoeba at no cost on your development, test and staging clusters and disks.",
      },
      {
        icon: "play",
        title: "Early access",
        body: "New Coral and Amoeba features reach you before everyone else.",
      },
      {
        icon: "send",
        title: "A direct line to the builders",
        body: "Work with the people who build Coral and Amoeba, not a ticket queue.",
      },
      {
        icon: "eye",
        title: "A say in what we build",
        body: "What you need shapes what we build next.",
      },
    ] satisfies readonly { icon: DesignPartnerGetIcon; title: string; body: string }[],
  },
  /** The navy panel: the four steps on one line, each with its picture. */
  journey: {
    id: "how",
    eyebrow: "The program",
    title: "How it works",
    lede: "Four steps, from your first email to your first results.",
    /** Step 1's picture: an email to the founders, its body drawn as three grey lines. */
    mail: { to: "To", subject: "Subject", line: subject, send: "Send" },
    /** The title of steps 2 and 3's windows. */
    terminal: "Terminal",
    /** Step 3's picture: the command that connects a cluster. Step 2's is the assessment's own (`assessment.ts`). */
    connect: "zoorikctl connect",
    steps: [
      { title: "Apply", body: "Tell us about your clusters and disks." },
      {
        title: "See your number",
        body: "The free assessment shows your estimated saving at list price.",
      },
      {
        title: "Connect a non-production cluster",
        body: `zoorikctl, Helm or Terraform; free for the first ${designPartnerPlaces} partners.`,
      },
      {
        title: "Review together",
        body: "We go through the results with you and plan what comes next.",
      },
    ],
  },
  ask: {
    id: "ask",
    title: "What we ask",
    lede: "Three things, so we build what you need.",
    items: [
      "Run Coral or Amoeba on a real non-production cluster or real disks.",
      "Join regular feedback calls with our team.",
      "If you agree, let us publish your results as a case study, named or anonymised.",
    ],
  },
  who: {
    id: "who",
    title: "Who it is for",
    lede: "Teams who pay for Kubernetes or block storage on Azure or AWS and want to shape the product.",
    teams: [
      { icon: "coral", title: "Platform teams on AKS", for: "Coral" },
      { icon: "coral", title: "Platform teams on Amazon EKS", for: "Coral" },
      { icon: "amoeba", title: "Teams whose Azure managed disks keep growing", for: "Amoeba" },
      { icon: "amoeba", title: "Teams with large Amazon EBS volumes", for: "Amoeba" },
    ] satisfies readonly { icon: DesignPartnerTeamIcon; title: string; for: string }[],
  },
  proof: {
    id: "proof",
    title: "Where your results will sit",
    lede: "Our own cluster came first. Design partners’ results come next, named or anonymised.",
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
      /** The page at the size the card draws it, the image /referrals shows. */
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
    title: `Want one of the first ${designPartnerPlaces} places?`,
    line: "Apply by email or book a call with the people who build Coral and Amoeba.",
    write: { label: "Write to us", subject },
  },
} as const;
