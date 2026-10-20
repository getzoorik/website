/**
 * Off-site links open in a new tab; nothing else does.
 *
 * The site has three kinds of href: an in-page anchor (`#how`), a page of its
 * own (`/assessment`) and an address somewhere else (the calendar, a console, a
 * social profile). Only the last leaves the reader's place, so only it gets a
 * new tab — and `noopener noreferrer` with it, so the page that opens cannot
 * reach back through `window.opener`.
 *
 * A `mailto:` is not off-site in this sense: it hands off to the mail client and
 * the tab stays where it is.
 */
const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" } as const;

export function isOffSite(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Spread onto an anchor: the new-tab pair for an off-site href, nothing otherwise. */
export function offSiteProps(href: string): typeof NEW_TAB | Record<string, never> {
  return isOffSite(href) ? NEW_TAB : {};
}

/**
 * What a screen reader hears after the name of a link that opens a new tab.
 *
 * Sighted readers see the tab open; a screen-reader user is moved to a new
 * context with no warning unless the link says so. The social tiles append it
 * to their `aria-label`; every other off-site link renders it as visually
 * hidden text through `<NewTabHint>`.
 */
export const NEW_TAB_HINT = " (opens in a new tab)";
