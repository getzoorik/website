import { Fragment, type ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import { assessContent, assessmentHref } from "@/content/assess";
import { products, type ProductId } from "@/content/products";
import { offSiteProps } from "@/lib/links";

/**
 * The closing row: "Find your own number" beside "Talk to the builders", on
 * home, the product pages and the generated pages.
 *
 * A server component. Two cards of equal width on one subgrid, so the two
 * headings, paragraphs and buttons line up across the cards; stacked below
 * 980px. The white card sends the reader to the assessment, the dark card to the
 * calendar, and the dark card's fine line to the one address.
 *
 * ─── ONE COMPONENT, THREE SWITCHES ─────────────────────────────────────────
 *   · `product`: on a page that belongs to one product. The button opens that
 *     product's assessment and the dark card names only it.
 *   · `talkOnly`: /assessment, which is the assessment. Only the dark card, in
 *     `div.as-grid.as-solo` (its rules are /assessment's own).
 *   · `reveal`: on by default, for home and the two product pages, where the
 *     cards rise as they arrive (`<Reveal>` at order 0 and 1, so `.rise` and
 *     `data-i="1"`). The generated pages (the docs hub, the guides, the FAQs and
 *     /assessment) draw nothing that rises, so they pass `reveal={false}` and
 *     the cards are plain divs: no `.rise`, no `data-i`, no observer.
 *   /privacy and /terms have no closing row at all.
 *
 *   route                          props
 *   /                              none
 *   /coral, /amoeba                product
 *   /docs                          reveal={false}
 *   the guides and FAQs            product, reveal={false}
 *   /assessment                    talkOnly, reveal={false}
 *
 * ─── `#contact` IS THE DARK CARD, NOT THE SECTION ──────────────────────────
 * The section is `#assess`. "Contact" in links from outside means the card with
 * the calendar and the address in it, so the id sits there and a jump lands on
 * it. It carries its own scroll margin (assess.css), because the rule that
 * clears the fixed bar is written for sections and this is a div.
 *
 * 🔴 SO A PAGE WITH ITS OWN `#contact` NEVER RENDERS THIS ROW: /privacy's §15
 * is `id="contact"`, and two elements would share the id.
 */

export interface AssessSectionProps {
  /** On a page that belongs to one product: the button opens that product's
   *  assessment, and the dark card names only that product. */
  readonly product?: ProductId;
  /** Only the dark card (/assessment). */
  readonly talkOnly?: boolean;
  /** The cards rise as they arrive. Home and the product pages only. */
  readonly reveal?: boolean;
}

/** One card: a `<Reveal>` where the page reveals, a plain div where it does not. */
function Card({
  reveal,
  order,
  className,
  id,
  children,
}: {
  readonly reveal: boolean;
  readonly order: number;
  readonly className: string;
  readonly id?: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return reveal ? (
    <Reveal className={className} order={order} id={id}>
      {children}
    </Reveal>
  ) : (
    <div className={className} id={id}>
      {children}
    </div>
  );
}

export function AssessSection({
  product,
  talkOnly = false,
  reveal = true,
}: AssessSectionProps = {}): React.JSX.Element {
  const { assessment, contact } = assessContent;
  const builders: readonly ProductId[] = product ? [product] : contact.both;

  return (
    <section className="sec" id="assess">
      <div className="wrap">
        <div className={talkOnly ? "as-grid as-solo" : "as-grid"}>
          {talkOnly ? null : (
            <Card reveal={reveal} order={0} className="as-card as-mini">
              <h2 className="as-h">{assessment.title}</h2>
              <p>{assessment.body}</p>
              <a className="btn-ink" href={assessmentHref(product)}>
                {assessment.cta.label} <Arrow />
              </a>
            </Card>
          )}

          {/* Second to rise beside the white card; first, and alone, without it. */}
          <Card reveal={reveal} order={talkOnly ? 0 : 1} className="as-cal" id="contact">
            <h2 className="as-h">{contact.title}</h2>
            <p>
              {contact.body.before}
              {builders.map((id, index) => (
                <Fragment key={id}>
                  {index > 0 ? " and " : null}
                  <span translate="no">{products[id].name}</span>
                </Fragment>
              ))}
              {contact.body.after}
            </p>
            {/* One form on every page: the label and the hidden hint in
                one span, then the arrow, so the button's gap falls between the
                words and the arrow. */}
            <a className="cta-go" href={contact.cta.href} {...offSiteProps(contact.cta.href)}>
              <span>
                {contact.cta.label}
                <NewTabHint href={contact.cta.href} />
              </span>
              <ExternalArrow />
            </a>
            <p className="cta-fine">
              {contact.fine.before}
              <a href={`mailto:${contact.fine.email}`}>{contact.fine.email}</a>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
