import { NEW_TAB_HINT, isOffSite } from "@/lib/links";

/**
 * The visually hidden " (opens in a new tab)" after an off-site link's label.
 *
 * Renders only for an href that `offSiteProps` would send to a new tab, so the
 * hint and the behaviour are decided by the same test and cannot disagree. Put
 * it inside the anchor, straight after the label text.
 */
export function NewTabHint({ href }: { href: string }): React.JSX.Element | null {
  return isOffSite(href) ? <span className="sr-only">{NEW_TAB_HINT}</span> : null;
}
