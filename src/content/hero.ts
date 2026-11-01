import { routes, site } from "@/config/site";

/**
 * Hero copy — the name, the headline, the pitch and the one call to action.
 * The line under the button, where to buy, takes its words from the stores'
 * config (`marketplaceWords`) and the products' names.
 *
 * 🔴 THE THREE FIGURES ARE GONE, ON PURPOSE. The row here used to count up to
 * "60% / 50% / 0s". None of the three had a source, so they were removed rather
 * than reworded. The product lockups that took their place went too (owner,
 * 23 Oct 2026: the hero holds five things only); the sections below name the
 * products.
 *
 * 🔴 ONE BUTTON, AND IT STAYS ON THE SITE. "Estimate your saving" to the plain
 * assessment, in place of the Book a demo the hero used to carry: that one
 * stays in the header, the closing row and the footer. Same tab, so no new-tab
 * hint and the plain arrow.
 *
 * 🔴 THE TAGLINE. The h1 is "Reduce cloud cost, autonomously.", and the /login
 * panel and the share card say it too.
 */
/**
 * The rack photograph's alt text, wherever it is drawn (/login's panel; the home hero
 * draws the Gargantua film in its place).
 * For search engines, which count an empty alt as missing (Bing Webmaster);
 * the photo stays `aria-hidden`, so a screen reader still skips it.
 */
export const heroPhotoAlt = "Server racks in a data centre, lit by blue status lights";

/**
 * The day the home page's content last changed (the company sentence in its hero), for the
 * sitemap's `lastmod` only: the page does not print it. Whoever changes the home page's content
 * moves this to that day in the same PR; never the build's date.
 */
export const homeLastUpdated = "1 November 2026";

export const heroContent = {
  /**
   * The name, in the h1 ahead of the tagline: its own small line above the
   * words, so the page's one heading names the company as well as the
   * promise. Text, not the logo, so a search engine reads "Zoorik" as the
   * heading's first word. Only the visible h1 carries it: the <title>, the meta
   * description and the JSON-LD say what they said, and `headline` stays the
   * tagline's words alone.
   */
  name: "Zoorik",
  headline: "Reduce cloud cost, autonomously.",
  sub: "Software that optimizes Kubernetes and block storage on its own, while your systems keep serving.",
  /**
   * Under the pitch, the company sentence (owner, 1 Nov 2026, O12): what Zoorik is, in the words
   * the Organization's markup uses (`site.description`), so the two never drift apart.
   */
  company: site.description,
  cta: { label: "Estimate your saving", href: routes.assessment },
} as const;
