import type { JSX } from "react";

import { AwsMark, AzureMark, LinuxMark, WindowsMark } from "@/components/brand/cloud-marks";
import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { loginCopy, type LoginProduct, type LoginTag } from "@/content/login";
import { offSiteProps } from "@/lib/links";

/** A tag's mark, sized by the sheet (`.lg-tag svg`); AWS is wider, Tux takes the text's ink. */
function TagMark({ tag, id }: { readonly tag: LoginTag; readonly id: string }): JSX.Element {
  switch (tag.mark) {
    case "azure":
      return <AzureMark idSuffix={id} />;
    case "aws":
      return <AwsMark className="aws" />;
    case "windows":
      return <WindowsMark />;
    case "linux":
      return <LinuxMark className="tux" />;
  }
}

/**
 * One product's card under the switch: what it does, where it runs as tags, and one
 * action. Both cards are in the page; the sheet shows the one `html[data-ap]` names, so the first paint and the switch
 * pick it with no script of their own. The switch above already names the product, so the card carries no heading:
 * the section is named by `aria-label`.
 *
 * ─── THE CARD IS NOT THE LINK ──────────────────────────────────────────────
 * Only the action is a link: Continue on a live product, the early-access calendar on a coming one. A coming card has
 * no console link by any route; the union in `@/content/login` is what makes the two shapes distinguishable here.
 *
 * 🔴 CONTINUE STAYS IN THIS TAB. The console's URL is off-site, so `isOffSite` is true for it, and `offSiteProps` and
 * `NewTabHint` would both fire. Neither is used here: signing in is where the reader is going. Its name is "Continue to
 * Coral", from a visually hidden " to Coral".
 */
export function ProductCard({ product }: { product: LoginProduct }): JSX.Element {
  return (
    <section className="card" data-p={product.id} aria-label={product.name}>
      <p className="line">{product.line}</p>
      <ul className="lg-tags" role="list">
        {product.tags.map((tag) => (
          <li className="lg-tag" key={tag.label}>
            <TagMark tag={tag} id={`lg-${product.id}`} />
            {tag.label}
          </li>
        ))}
      </ul>
      {product.status === "live" ? (
        <div className="act">
          <a className="btn-ink" href={product.console.href}>
            <span>
              {loginCopy.continueLabel}
              <span className="sr-only">{` to ${product.name}`}</span>
            </span>
            <Arrow />
          </a>
        </div>
      ) : (
        <div className="act">
          <p className="soon-t">{loginCopy.comingSoonLabel}</p>
          <a
            className="lk"
            href={product.earlyAccess.href}
            {...offSiteProps(product.earlyAccess.href)}
          >
            {product.earlyAccess.label}
            <NewTabHint href={product.earlyAccess.href} />
            <ExternalArrow />
          </a>
        </div>
      )}
    </section>
  );
}
