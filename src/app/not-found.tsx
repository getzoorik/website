import type { Metadata } from "next";

import { routes } from "@/config/site";

/**
 * The 404 page: standalone, from the site's own tokens. No mock draws one, so
 * it stays a plain page: the code, the heading, one sentence and the two ways
 * on.
 *
 * 🔴 NO HEADER, NO FOOTER, NO HERO, NO TURNING MARK. This tree is the root
 * layout's not-found boundary, so it ships in EVERY page's payload: the home
 * page's HTML carries "Page not found" today. Chrome here would be the bar, its
 * menu, the drawer and the footer a second time on every page, for a
 * page almost nobody sees.
 *
 * Its title, "Page not found | Zoorik", is this file's metadata through the
 * layout's template; without it, the 404 printed the home title.
 * Next prints exactly one <title> and applies it only when this tree renders;
 * the status stays 404. Its robots is noindex: without its own, the layout's
 * "index, follow" would print beside the noindex Next adds to every 404.
 *
 * 🔴 PLAIN ANCHORS, NOT next/link, and NO IMPORT BUT `routes`. The tree is in
 * every page's payload (above), so a next/link here put the link runtime into
 * every page's JavaScript, and an import of its own sheet made every page
 * preload it. The nav and footer use plain anchors too; a reader sees no
 * difference.
 *
 * The button is the site's one button: `.btn-ink` takes its 48px height, its
 * press and its focus ring from the site system, and the 404's own sheet never
 * sizes it. The assessment link reads "Estimate your saving", the label of
 * every call to action into the assessment.
 */
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound(): React.JSX.Element {
  return (
    <main className="nf">
      <div className="nf-in">
        <p className="nf-code">404</p>
        <h1>Page not found</h1>
        <p className="nf-body">
          This page isn’t here. It may have moved, or the link may be wrong.
        </p>
        <div className="nf-links">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- see "plain anchors" above */}
          <a className="btn-ink" href="/">
            Go to the home page
          </a>
          <a className="nf-link" href={routes.assessment}>
            Estimate your saving
          </a>
        </div>
      </div>
    </main>
  );
}
