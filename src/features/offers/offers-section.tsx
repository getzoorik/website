import type { CSSProperties } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { NamedText } from "@/components/primitives/named-text";
import { offersContent, type OfferRow } from "@/content/offers";
import { productOrder, products, type ProductId } from "@/content/products";
import { savingsFigures, type SavingsKey } from "@/content/savings";

/** Every product name a row's name can carry. */
const NAMES = productOrder.map((id) => products[id].name);

/** The products a figure is for: one, or both in the site's order. */
const marksOf = (key: SavingsKey): readonly ProductId[] => (key === "both" ? productOrder : [key]);

/** Custom properties, which React's style type does not know, as the mock writes them inline. */
const vars = (values: Readonly<Record<`--${string}`, string>>): CSSProperties =>
  values as CSSProperties;

/**
 * A range's two ends, read from its printed form ("40–50%" is 40 and 50), so
 * the band can never disagree with the figure beside it. A range written any
 * other way fails the build rather than drawing a wrong band.
 */
function rangeOf(range: string): { readonly low: number; readonly high: number } {
  const ends = /^(\d+)–(\d+)%$/.exec(range);
  if (!ends) throw new Error(`What we offer cannot draw the range "${range}" on its scale.`);
  return { low: Number(ends[1]), high: Number(ends[2]) };
}

/**
 * A range as a counter that rolls up, built from the
 * printed range one character at a time, so its text IS the range.
 *
 * 🔴 THE TEXT IS THE FIGURE, NEVER THE STRIP. The mock writes each digit's
 * strip into the DOM, twenty `<i>` from 0 to 9 twice over, so a crawler, a
 * copy or a reader without scripting gets "0123456789…" where the page shows a
 * 4. Here each digit (`.od-d`) holds only its own character, and the sheet
 * paints that character transparent and draws the strip as generated content
 * (`.od-d::before`) that slides up to it: `--v` is the digit's place on the
 * strip (its second pass, 10 plus the digit) and `--k` its place in the range,
 * which staggers the digits 90ms apart, as the mock counts them.
 *
 * The figure is `role="img"` with the spoken range as its name, so "40–50%" is
 * heard as "40 to 50 percent" rather than as two numbers and a dash; the digits
 * inside are hidden from assistive tech, as the mock hides them.
 */
function Counter({
  range,
  spoken,
}: {
  readonly range: string;
  readonly spoken: string;
}): React.JSX.Element {
  return (
    <span className="od" role="img" aria-label={spoken}>
      <span className="od-r" aria-hidden="true">
        {[...range].map((char, place) =>
          /\d/.test(char) ? (
            <span
              className="od-d"
              style={vars({ "--v": String(10 + Number(char)), "--k": String(place) })}
              key={place}
            >
              {char}
            </span>
          ) : (
            <span className="od-x" key={place}>
              {char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

/**
 * One row of the scale: its mark and name
 * over its caption, its band, its figure. The band is soft from 0 up to the
 * range and firm across it, so "up to 50%" reads at a glance; it is
 * `aria-hidden`, since the figure already says it. `--i` is the row's place,
 * from which the sheet staggers the rows 260ms apart.
 *
 * Its name is an h3, where the mock sets a `<p>`: the home page's other cards
 * name themselves in h3s, so a screen reader can move from one to the next by
 * heading. The sheet sets it exactly as the mock's `<p>` (`.ofx-h`).
 */
function Row({
  row,
  index,
}: {
  readonly row: OfferRow;
  readonly index: number;
}): React.JSX.Element {
  const marks = marksOf(row.figure);
  const { range, spoken, caption } = savingsFigures[row.figure];
  const { low, high } = rangeOf(range);
  return (
    <li className="ofx-row ofx-in mo-r" style={vars({ "--i": String(index) })} data-k={row.figure}>
      <div className="ofx-rl">
        <h3 className="ofx-h">
          <span className={marks.length > 1 ? "ofx-m is-two" : "ofx-m"}>
            {marks.map((id) => (
              <ProductMark key={id} product={id} />
            ))}
          </span>
          <span>
            <NamedText text={row.title} name={NAMES} />
          </span>
        </h3>
        <p className="ofx-cap">{caption}</p>
      </div>
      <div className="ofx-track" aria-hidden="true">
        <i className="lo" style={vars({ "--a": String(low) })} />
        <i className="hi" style={vars({ "--a": String(low), "--b": String(high - low) })} />
      </div>
      <div className="ofx-rn">
        <Counter range={range} spoken={spoken} />
      </div>
    </li>
  );
}

/**
 * What we offer (`#offers`): on the left the title, the qualifier and the free
 * assessment as a navy card with its way in; on the right one 0 to 100% scale,
 * a row for each range.
 *
 * The navy card's icon is Zoorik's own mark, its rings turning opposite ways
 * as the logo's do in the nav, one colour, white
 * on the navy.
 *
 * Side by side, stacked to 1100px, and to 760px each row its name and figure
 * over its band (`home-offers.css`). A server component: the side and each row
 * carry `.mo-r`, and `HomeMotion`, the pass's one observer, gives each `.is-in`
 * once it is in view; from that the side fades up, and each row fades up,
 * sweeps its band and rolls its figure. The rows' list carries
 * `data-mo-clock`, so they keep one start between them, as the mock's do from
 * its one observer: 260ms a row from the first row in, and a row that comes in
 * after its turn plays at once.
 *
 * The rows are a list, so a screen reader hears "list, 3 items"; `role="list"`
 * is restated because Safari drops it under `list-style:none`. The axis is
 * hidden from it, as each figure and caption already say what it is a share
 * of. The free card's label and each row's name are h3s under the section's
 * h2, so each can be reached by heading.
 */
export function OffersSection(): React.JSX.Element {
  const { free, axis } = offersContent;
  return (
    <section className="sec ofx ofx-b" id="offers" aria-labelledby="offers-h">
      <div className="wrap">
        <div className="ofx-split">
          <div className="ofx-side ofx-in mo-r">
            <h2 id="offers-h">{offersContent.title}</h2>
            <p className="ofx-note">{offersContent.note}</p>
            <div className="ofx-free">
              <h3 className="ofx-free-l">
                <span className="ofx-free-i" aria-hidden="true">
                  <BrandMark />
                </span>
                {free.label}
              </h3>
              <p className="ofx-free-n">{free.word}</p>
              <p className="ofx-free-c">{free.line}</p>
              {/* The mock's markup, a space before the arrow included: inside the inline-flex
                  button it collapses. */}
              <a className="btn btn-light ofx-free-go" href={free.cta.href}>
                {free.cta.label} <Arrow />
              </a>
            </div>
          </div>
          <div className="ofx-scale">
            <div className="ofx-axis" aria-hidden="true">
              <span className="ofx-axis-l">{axis.label}</span>
              <div className="ofx-ticks">
                {axis.ticks.map((tick) => (
                  <span style={vars({ "--t": String(tick) })} key={tick}>
                    {`${tick}%`}
                  </span>
                ))}
              </div>
            </div>
            <ul className="ofx-rows" role="list" data-mo-clock="">
              {offersContent.rows.map((row, index) => (
                <Row row={row} index={index} key={row.figure} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
