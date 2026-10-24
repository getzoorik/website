import { contactEmail, routes } from "@/config/site";
import type { FooterSocialPlatform } from "@/content/footer";
import type { ProductId } from "@/content/products";

/**
 * `/careers`: every string the page prints, verbatim from option A
 * (`ux-design/_proposals/2026-10-24-careers/careers-option-A.html`, 24 Oct 2026).
 *
 * The rules the copy carries: our values are the six CREDIT values in our own
 * words; no open roles are shown for now, only the teams we hire for; the
 * interview questions are in Zoorik's terms and work for tech and non-tech
 * roles alike.
 *
 * The copy is kept minimal: no caps labels, one line where a longer draft had
 * two, each behaviour its name alone, and no values-interview card.
 *
 * 🔴 THE SITE'S PRODUCT WORDS ("reduce", never "cut" or "lower"): the hero
 * deck says "reduces" and Results for customers "We reduce", as option A
 * prints them (the older `ux-design/website/careers.html` still has "cuts" and
 * "We lower"). The Efficiency question's "a time you cut something" is
 * about a candidate's own work, not the products, and stays as drawn.
 *
 * Product names are written plainly here; the page keeps each one out of a
 * translator's hands (`named()`), as the mock marks them.
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * The sections (`#build`, `#values`, `#how-we-work`, `#how-we-hire`, `#join`)
 * keep their hash when linked (`hashKeepingRoutes`). Keep an id when its
 * heading changes.
 */

/**
 * The day /careers's content last changed (its title, "Careers | Zoorik"), for the sitemap's `lastmod` only:
 * the page does not print it. Whoever changes the page's content moves this to
 * that day in the same PR; never the build's date.
 */
export const careersLastUpdated = "25 October 2026";

/**
 * A tool's mark (`careers-marks.tsx`): the site's own for Kubernetes, Azure,
 * AWS and Linux, Install your way's for Helm and Terraform, Simple Icons' for
 * Go, PostgreSQL and GitHub.
 */
export type CareersToolMark =
  "kubernetes" | "azure" | "aws" | "linux" | "go" | "postgresql" | "github" | "helm" | "terraform";

/** A tool we build with: its name, and its mark where it has one (Java, btrfs and systemd show as their names). */
export interface CareersTool {
  readonly name: string;
  readonly mark?: CareersToolMark;
}

/** The six CREDIT values, in their order; each has its drawing (`careers-value-drawings.tsx`). */
export type CareerValueId =
  "collaboration" | "results" | "efficiency" | "diversity" | "iteration" | "transparency";

/** One of the six CREDIT values: its letter, its meaning in one line, how we live it, and its interview question. */
export interface CareerValue {
  /** The panel's address (`#val-<id>`, which opens it) and its tab's (`#tab-<id>`). */
  readonly id: CareerValueId;
  readonly letter: string;
  readonly name: string;
  readonly meaning: string;
  /** How we live it: each behaviour by its name alone, after a small square bullet. */
  readonly behaviours: readonly string[];
  /** The question the values interview asks about it, printed in quotes. */
  readonly question: string;
}

/**
 * One of How we work's four habits: one outlined card, its drawing and its title. The sentence is the drawing's
 * name for a screen reader, word for word ("<title>. <body>"), and is not printed.
 */
export interface CareerHabit {
  /**
   * The card's drawing, by the mock's own name for it (`il-w-<drawing>`, careers-work-drawings.tsx):
   * `globe` three clocks in three time zones, with messages travelling between them; `doc` a page writing
   * itself from Confluence and GitHub; `clock` messages landing at different hours on one day; `target` a
   * GitHub branch with two commits, merged.
   */
  readonly drawing: "globe" | "doc" | "clock" | "target";
  readonly title: string;
  readonly body: string;
}

/** A step of How we hire: its icon, how it happens (a video call unless it says so), its name and what it is, in one line. */
export interface HiringStep {
  /** The glyph over its number (careers-hire-icons.tsx): a document, a video call, code, a checklist, two people, a signed offer. */
  readonly icon: "document" | "video" | "code" | "checklist" | "people" | "offer";
  readonly mode: "In writing" | "Video call";
  readonly title: string;
  readonly body: string;
}

const intro = `mailto:${contactEmail}?subject=Introducing%20myself`;

/** The hero's inner ring: what the products run on. */
const innerRing = [
  { name: "Kubernetes", mark: "kubernetes" },
  { name: "Azure", mark: "azure" },
  { name: "AWS", mark: "aws" },
  { name: "Linux", mark: "linux" },
] as const satisfies readonly Required<CareersTool>[];

/** The hero's outer ring: what we build them with. */
const outerRing = [
  { name: "Go", mark: "go" },
  { name: "PostgreSQL", mark: "postgresql" },
  { name: "GitHub", mark: "github" },
  { name: "Helm", mark: "helm" },
  { name: "Terraform", mark: "terraform" },
] as const satisfies readonly Required<CareersTool>[];

const values = [
  {
    id: "collaboration",
    letter: "C",
    name: "Collaboration",
    meaning: "We get further together than alone.",
    behaviours: [
      "Be kind",
      "Share what you learn",
      "Say thanks, and say what for",
      "Give feedback early",
      "Assume positive intent",
      "No ego",
      "Fix the system, not the person",
      "Input is not consensus",
    ],
    question:
      "Tell us about a launch, an incident or a deal where you helped another team, or asked one for help. What did each of you do?",
  },
  {
    id: "results",
    letter: "R",
    name: "Results for customers",
    meaning: "We reduce our customers’ cloud bills without breaking anything.",
    behaviours: [
      "Measure impact, not activity",
      "Know the people we serve",
      "Use what we build",
      "Own it end to end",
      "Act when a step can be undone",
      "Disagree, then commit",
      "Ask for help early",
    ],
    question:
      "Tell us about something you built, ran or sold that saved a customer money or time. How did you measure it?",
  },
  {
    id: "efficiency",
    letter: "E",
    name: "Efficiency",
    meaning: "We spend time and money on what matters, and we do it once.",
    behaviours: [
      "Write it down",
      "Choose boring solutions",
      "Look it up, then write it up",
      "Respect each other’s time",
      "Spend money like it is yours",
      "Be a manager of one",
      "Accept mistakes",
    ],
    question:
      "Tell us about a time you cut something that cost more than it gave: a process, a tool, a meeting or a piece of a system.",
  },
  {
    id: "diversity",
    letter: "D",
    name: "Diversity, inclusion and belonging",
    meaning: "Good ideas come from everywhere.",
    behaviours: [
      "Asynchronous by default",
      "Ask someone who sees it differently",
      "Interview everyone the same way",
      "“Fit” is not a reason",
      "Use names and words with care",
      "Family and friends first",
      "Speak up",
    ],
    question:
      "Tell us about a time someone who saw it differently changed what you built or how you did it.",
  },
  {
    id: "iteration",
    letter: "I",
    name: "Iteration",
    meaning: "Small steps add up faster than big plans.",
    behaviours: [
      "Ship the smallest useful change",
      "Don’t wait",
      "Everything is in draft",
      "Make a proposal",
      "Most doors swing both ways",
      "Small steps, safe steps",
      "Keep changes reviewable",
    ],
    question:
      "Tell us about a change you made in small, safe steps. What did the first step teach you?",
  },
  {
    id: "transparency",
    letter: "T",
    name: "Transparency",
    meaning: "We share by default. It builds trust.",
    behaviours: [
      "Public where we can",
      "Say why, not just what",
      "One source of truth",
      "Say when you change your mind",
      "Raise problems early",
      "Be direct, and kind",
      "Some things stay private",
    ],
    question:
      "Tell us about a mistake that reached a customer or a live system. How did you tell people, and what changed afterwards?",
  },
] as const satisfies readonly CareerValue[];

export const careers = {
  /** The `<title>`'s own words, before " | Zoorik", and the description. */
  meta: {
    title: "Careers",
    description:
      "Work at Zoorik, remotely. What you will build, our six values, how we work and how we hire.",
  },
  hero: {
    /** The small line over the heading. */
    eyebrow: "Careers",
    title: "Work at Zoorik",
    deck: "Help build Coral and Amoeba, the software that reduces cloud cost on Azure and AWS.",
    introduce: { label: "Introduce yourself", href: intro },
    /** The quiet line under the button, then the footer's LinkedIn profile (`socialProfiles`), in a new tab. */
    quiet: "No open roles right now.",
    follow: { label: "Follow us on LinkedIn", platform: "linkedin" satisfies FooterSocialPlatform },
    /** The figure: the Zoorik mark, the tools we build with turning round it on two rings. */
    rings: { inner: innerRing, outer: outerRing },
    orbitLabel: `The Zoorik mark, with the tools we build with turning round it: ${[
      ...innerRing,
      ...outerRing,
    ]
      .map((tool) => tool.name)
      .join(", ")}.`,
  },
  build: {
    id: "build",
    title: "What you will build",
    lede: "Two products that change live systems, safely.",
    /**
     * Each product's 5-second Overview film (the home page's, `public/motion/`),
     * then its name and mark, the home page's title for it (`products`), its
     * stack and its page.
     */
    products: [
      {
        product: "coral",
        href: routes.coral,
        poster: "/motion/coral-poster.jpg",
        src: "/motion/coral-overview-5s.mp4",
        label: "Coral’s Overview with example figures",
        stack: [
          { name: "Kubernetes", mark: "kubernetes" },
          { name: "AKS", mark: "azure" },
          { name: "EKS", mark: "aws" },
          { name: "Java" },
          { name: "Go", mark: "go" },
          { name: "PostgreSQL", mark: "postgresql" },
        ],
      },
      {
        product: "amoeba",
        href: routes.amoeba,
        poster: "/motion/amoeba-poster.jpg",
        src: "/motion/amoeba-overview-5s.mp4",
        label: "Amoeba’s Overview with example figures",
        stack: [
          { name: "Linux VMs", mark: "linux" },
          { name: "btrfs" },
          { name: "systemd" },
          { name: "Azure", mark: "azure" },
          { name: "AWS", mark: "aws" },
          { name: "Java" },
        ],
      },
    ] as const satisfies readonly {
      readonly product: ProductId;
      readonly href: string;
      readonly poster: string;
      readonly src: string;
      readonly label: string;
      readonly stack: readonly CareersTool[];
    }[],
    stackLabel: "What it is built with",
    /** The way on, before the product's name: "See Coral →". */
    see: "See",
  },
  values: {
    id: "values",
    title: "Our values",
    /* No lede: the mock heads it with the heading alone, as How we work. */
    tabsLabel: "Our six values",
    /** Over each value's interview question, plain: no blue caps label. */
    questionLabel: "We ask",
    list: values,
  },
  work: {
    id: "how-we-work",
    title: "How we work",
    /* No lede: the mock heads it with the heading alone. */
    habits: [
      { drawing: "globe", title: "Remote first", body: "Work from where you work best." },
      { drawing: "doc", title: "Written down", body: "Plans and decisions live in writing." },
      { drawing: "clock", title: "Asynchronous by default", body: "Most work needs no meeting." },
      {
        drawing: "target",
        title: "Results, not hours",
        body: "What shipped, not when you were online.",
      },
    ] as const satisfies readonly CareerHabit[],
  },
  hire: {
    id: "how-we-hire",
    title: "How we hire",
    lede: "Six steps, all remote.",
    /* The steps alone, under one hairline: no accent step and no values-interview card under them. */
    steps: [
      {
        icon: "document",
        mode: "In writing",
        title: "Apply",
        body: "Your CV and something you are proud of.",
      },
      {
        icon: "video",
        mode: "Video call",
        title: "Intro call",
        body: "The role, and how we work.",
      },
      {
        icon: "code",
        mode: "Video call",
        title: "Skills interview",
        body: "Real systems, or your own work.",
      },
      {
        icon: "checklist",
        mode: "Video call",
        title: "Values interview",
        body: "One question per value.",
      },
      {
        icon: "people",
        mode: "Video call",
        title: "Meet the founders",
        body: "Questions both ways.",
      },
      {
        icon: "offer",
        mode: "In writing",
        title: "Offer",
        body: "References, then the offer in writing.",
      },
    ] as const satisfies readonly HiringStep[],
  },
  /**
   * The navy close. No open roles for now; each team opens a ready email.
   * The teams: Backend, Infra, Frontend and Design in tech; Sales and Marketing in
   * non-tech, and no Operations.
   */
  join: {
    id: "join",
    title: "Want to build with us?",
    body: "No open roles right now. Introduce yourself anyway.",
    introduce: { label: "Introduce yourself", href: intro },
    /** The wire button after it: the footer's LinkedIn profile (`socialProfiles`), in a new tab. */
    follow: { label: "Follow us on LinkedIn", platform: "linkedin" satisfies FooterSocialPlatform },
    /** The line under the buttons, before the address. */
    writeTo: "Or write to ",
    teams: [
      { name: "Tech", roles: ["Backend", "Infra", "Frontend", "Design"] },
      { name: "Non-tech", roles: ["Sales", "Marketing"] },
    ],
  },
} as const;

/** A team's ready email: "Introducing myself: <team>" as the subject. */
export function teamMailto(role: string): string {
  return `mailto:${contactEmail}?subject=Introducing%20myself%3A%20${role.replaceAll(" ", "%20")}`;
}
