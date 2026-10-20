import { calendarUrl, contactEmail, routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * Copy for the row that closes the page: the free assessment on the left, the
 * calendar on the right, in the same words on every page that draws it.
 *
 * Two cards of the same weight, each a heading, one paragraph and one button,
 * then the dark card's fine line. No periods on the two headings, as the mocks
 * draw them; the paragraphs are sentences and keep theirs.
 *
 * 🔴 THERE IS NO FORM, AND NOTHING HERE POSTS ANYWHERE. A reader who wants to
 * talk picks a time on the calendar or writes to one address; a reader who wants
 * a number runs the assessment. The site no longer calls `/api/lead`.
 */
export const assessContent = {
  assessment: {
    title: "Find your own number",
    body: "One line in your cloud console. One PDF report with your estimated saving at list price.",
    /** Same tab, to `/assessment`, or `/assessment?p=<product>` (`assessmentHref`). */
    cta: { label: "Estimate your saving" },
  },
  contact: {
    title: "Talk to the builders",
    /** Split around the product names, so a page that belongs to one product
     *  names only it: "…who build Coral and Amoeba." on home and the docs hub,
     *  "…who build Coral." on `/coral` and its guide and FAQ. The
     *  names render with `translate="no"`. */
    body: {
      before: "Thirty minutes with the people who build ",
      after: ".",
    },
    /**
     * Both products, in the order the sentence names them: Coral, then Amoeba,
     * as every mock writes it. This sentence is copy: its order is the
     * mock's, written here, not read from `productOrder`.
     */
    both: ["coral", "amoeba"] as const satisfies readonly ProductId[],
    /** The calendar. Off-site, so it opens in a new tab, says so, and ends on
     *  the external arrow. The same "Book a demo" the bar carries. */
    cta: { label: "Book a demo", href: calendarUrl },
    /** One sentence with a link inside it, split around the link. */
    fine: { before: "Or write to ", email: contactEmail },
  },
} as const;

/** The assessment page, preset to one product (`/assessment?p=coral`). */
export function assessmentHref(product?: ProductId): string {
  return product ? `${routes.assessment}?p=${product}` : routes.assessment;
}
