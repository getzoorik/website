import { calendarUrl, routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * The copy and the product list behind `/login`: the product switch and one card per product.
 *
 * ─── THIS PAGE IS A SWITCHBOARD, NOT A FORM ────────────────────────────────
 * Nothing here takes a credential. Zoorik ships one console per product, each
 * with its own sign-in, so the marketing site's job is to send a
 * returning user to the right one — and to say plainly which products have a
 * console yet. The moment this page grows a password field it stops being
 * marketing and belongs in the product.
 *
 * Every string is the mock's, verbatim: a paraphrase is a different claim.
 */

export const loginCopy = {
  heading: "Choose a product to continue",
  /** The switch's name for a screen reader (`nav.lg-switch`). */
  switchLabel: "Product",
  continueLabel: "Continue",
  comingSoonLabel: "Coming soon",
  /** Shorter than the marketing footer's line, as in the mock: this footer is
   *  one row under a column of cards, not a band across the page. */
  copyright: "© 2026 Zoorik",
} as const;

/**
 * The legal links on the right of the footer row (`span.foot-legals` in the
 * mock): the two pages the site footer's Company column ends on, in the same
 * tab.
 */
export const loginLegals = [
  { label: "Privacy", href: routes.privacy },
  { label: "Terms", href: routes.terms },
] as const;

/**
 * The line under the cards, for a reader who has no account to sign in to.
 *
 * One sentence with two links inside it, so it is held as the runs it is made
 * of, in order: a sentence assembled from loose strings in the markup is one no
 * translator and no reviewer can read. A run with an `href` is a link; the
 * calendar is off-site and opens in a new tab, the assessment is a page here.
 * No comma before "or": the mock has none.
 */
export interface LoginDemoRun {
  readonly text: string;
  readonly href?: string;
}

export const loginDemo: readonly LoginDemoRun[] = [
  { text: "New to Zoorik? " },
  { text: "Book a demo", href: calendarUrl },
  { text: " or " },
  /* The page's product follows it: `/assessment?p=amoeba` while the switch is on Amoeba (`EstimateLink`). */
  { text: "estimate your saving", href: routes.assessment },
  { text: "." },
];

/**
 * The panel beside the chooser: the tagline "Reduce cloud cost, autonomously.",
 * as the home hero says it, and the two products in the site's one verb
 * ("optimizes" everywhere but the legal pages).
 */
export const loginPanel = {
  heading: "Reduce cloud cost, autonomously.",
  body: "Coral optimizes Kubernetes. Amoeba optimizes block storage.",
} as const;

/** Where a product runs, as a tag with its platform's mark. */
export interface LoginTag {
  readonly label: string;
  readonly mark: "azure" | "aws" | "windows" | "linux";
}

interface LoginProductBase {
  readonly id: ProductId;
  readonly name: string;
  /** What the product does, the card's first line. */
  readonly line: string;
  /** What it runs on, as tags. */
  readonly tags: readonly LoginTag[];
}

/**
 * 🔴 THE TWO STATES ARE A UNION, NOT A BOOLEAN WITH OPTIONAL FIELDS. A product
 * you can sign in to HAS a console URL; one that is coming has none, and offers
 * a way to ask instead. Modelled as one shape with `href?`, a card could ship
 * a Continue with nowhere to go, or "Coming soon" over a console that exists.
 * Neither compiles here.
 */
interface LiveProduct extends LoginProductBase {
  readonly status: "live";
  /** Where the console's own sign-in lives, parsed from `NEXT_PUBLIC_LOGIN_URL`
   *  at build time (`consoles` in `@/config/site`). */
  readonly console: { readonly href: string };
}

interface ComingProduct extends LoginProductBase {
  readonly status: "coming";
  readonly earlyAccess: { readonly label: string; readonly href: string };
}

export type LoginProduct = LiveProduct | ComingProduct;

/**
 * Coral first, as everywhere on the site. Both are coming (Coral is not
 * launched to production yet, so it reads "Coming soon" like Amoeba). When a
 * console opens to customers, its card turns `live` with
 * `console: consoles.<product>`, and the Continue button comes back.
 */
export const loginProducts: readonly LoginProduct[] = [
  {
    id: "coral",
    status: "coming",
    name: "Coral",
    line: "Optimizes your Kubernetes clusters.",
    tags: [
      { label: "AKS", mark: "azure" },
      { label: "EKS", mark: "aws" },
    ],
    earlyAccess: { label: "Book a demo for early access", href: calendarUrl },
  },
  {
    id: "amoeba",
    status: "coming",
    name: "Amoeba",
    line: "Optimizes your block storage.",
    tags: [
      { label: "Azure", mark: "azure" },
      { label: "AWS", mark: "aws" },
      { label: "Windows", mark: "windows" },
      { label: "Linux", mark: "linux" },
    ],
    earlyAccess: { label: "Book a demo for early access", href: calendarUrl },
  },
];
