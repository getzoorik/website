import { contactEmail, routes } from "@/config/site";
import type { FooterSocialPlatform } from "@/content/footer";
import type { ProductId } from "@/content/products";

/**
 * `/careers`: every string the page prints, verbatim from the approved mock.
 *
 * The rules the copy carries: our values are the six CREDIT values in our own
 * words; no open roles are shown for now, only the teams we hire for; the
 * interview questions are in Zoorik's terms and work for tech and non-tech
 * roles alike.
 *
 * The copy is kept minimal: no caps labels, one line where a longer draft had
 * two, each behaviour its name alone, and no values-interview card.
 *
 * 🔴 THE SITE'S PRODUCT WORDS ("reduce", never "cut" or "lower")
 * win over the mock where it still has the old ones: the hero deck says
 * "reduces" (the mock: "cuts") and Results for customers "We reduce" (the
 * mock: "We lower"). The Efficiency question's "a time you cut something" is
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
 * The day /careers's content last changed (its title, "Careers at Zoorik | …"), for the sitemap's `lastmod` only:
 * the page does not print it. Whoever changes the page's content moves this to
 * that day in the same PR; never the build's date.
 */
export const careersLastUpdated = "21 October 2026";

/** One of the six CREDIT values: its letter, its meaning in one line, how we live it, and its interview question. */
export interface CareerValue {
  /** The panel's address (`#val-<id>`) and its tab's (`#tab-<id>`). */
  readonly id: string;
  readonly letter: string;
  readonly name: string;
  readonly meaning: string;
  /** How we live it: each behaviour by its name alone, with its tick. */
  readonly behaviours: readonly string[];
  /** The question the values interview asks about it, printed in quotes. */
  readonly question: string;
}

/** The four habits of How we work, each with the picture the mock draws for it. */
export interface CareerHabit {
  readonly picture: "team" | "doc" | "async" | "results";
  readonly title: string;
  readonly body: string;
}

/** A step of How we hire: how it happens (a video call unless it says so), its name and what it is, in one line. */
export interface HiringStep {
  readonly mode: "In writing" | "Video call";
  readonly title: string;
  readonly body: string;
  /** The values interview, the step every candidate has: its number is filled. */
  readonly values?: true;
}

const intro = `mailto:${contactEmail}?subject=Introducing%20myself`;

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
  /** The `<title>`'s own words, after "Zoorik | ", and the description. */
  meta: {
    title: "Careers",
    description:
      "Work at Zoorik, remotely. What you will build, our six values, how we work and how we hire.",
  },
  hero: {
    title: "Work at Zoorik",
    deck: "Help build Coral and Amoeba, the software that reduces cloud cost on Azure and AWS.",
    introduce: { label: "Introduce yourself", href: intro },
    values: { label: "Our values", href: "#values" },
    /** The six letters as the hero's figure, each a link to its value; the short names the tiles print. */
    tilesLabel: "Our six values",
    tiles: ["Collaboration", "Results", "Efficiency", "Diversity", "Iteration", "Transparency"],
  },
  build: {
    id: "build",
    title: "What you will build",
    lede: "Two products that change live systems, safely.",
    /** Each product's 5-second Overview film (the home page's, `public/motion/`), its line and its stack. */
    products: [
      {
        product: "coral",
        line: "Kubernetes cost optimization on AKS and EKS",
        href: routes.coral,
        poster: "/motion/coral-poster.jpg",
        src: "/motion/coral-overview-5s.mp4",
        label: "Coral’s Overview with example figures",
        stack: ["Kubernetes", "AKS", "EKS", "Java", "Go", "PostgreSQL"],
      },
      {
        product: "amoeba",
        line: "Block storage cost optimization on Azure and AWS",
        href: routes.amoeba,
        poster: "/motion/amoeba-poster.jpg",
        src: "/motion/amoeba-overview-5s.mp4",
        label: "Amoeba’s Overview with example figures",
        stack: ["Linux VMs", "btrfs", "systemd", "Azure", "AWS", "Java"],
      },
    ] as const satisfies readonly {
      readonly product: ProductId;
      readonly line: string;
      readonly href: string;
      readonly poster: string;
      readonly src: string;
      readonly label: string;
      readonly stack: readonly string[];
    }[],
    stackLabel: "What it is built with",
  },
  values: {
    id: "values",
    title: "Our values",
    /* No lede: the mock heads it with the heading alone, as How we work. */
    tabsLabel: "Our six values",
    /** Over each value's interview question, plain: no blue caps label. */
    questionLabel: "We ask",
    /** The last panel's way on, where the others name the next value. */
    after: { label: "How we work", href: "#how-we-work" },
    list: values,
  },
  work: {
    id: "how-we-work",
    title: "How we work",
    /* No lede: the mock heads it with the heading alone. */
    habits: [
      { picture: "team", title: "Remote first", body: "Work from where you work best." },
      { picture: "doc", title: "Written down", body: "Plans and decisions live in writing." },
      { picture: "async", title: "Asynchronous by default", body: "Most work needs no meeting." },
      {
        picture: "results",
        title: "Results, not hours",
        body: "What shipped, not when you were online.",
      },
    ] as const satisfies readonly CareerHabit[],
  },
  hire: {
    id: "how-we-hire",
    title: "How we hire",
    lede: "Six steps, all remote.",
    /* The steps alone: no values-interview card under them. */
    steps: [
      { mode: "In writing", title: "Apply", body: "Your CV and something you are proud of." },
      { mode: "Video call", title: "Intro call", body: "The role, and how we work." },
      { mode: "Video call", title: "Skills interview", body: "Real systems, or your own work." },
      {
        mode: "Video call",
        title: "Values interview",
        body: "One question per value.",
        values: true,
      },
      { mode: "Video call", title: "Meet the founders", body: "Questions both ways." },
      { mode: "In writing", title: "Offer", body: "References, then the offer in writing." },
    ] as const satisfies readonly HiringStep[],
  },
  /**
   * The dark close. No open roles for now; each team opens a ready email.
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
    writeTo: "or write to ",
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
