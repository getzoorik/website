import type { CSSProperties } from "react";

import { CoralMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { NamedText } from "@/components/primitives/named-text";
import { caseBand } from "@/content/case-band";
import type { CaseStudyCostStep } from "@/content/case-studies";
import { products } from "@/content/products";
import { share } from "@/lib/share";

/**
 * The case study band on the home page: after the why points, in the logo's navy, the
 * study's headline and a button to it beside the study's cost chart.
 *
 * A server component. Its two halves carry `.mo-r`, the chart 120ms behind the words, and
 * `HomeMotion` brings them in; once the chart is in (`.mo-wf.is-in`), its four bars rise in
 * turn and their figures follow (case-band.css). Under reduced motion, or with scripting off
 * (`HomeMotion`'s `<noscript>`), everything sits in its end state.
 *
 * The chart is one picture to a screen reader, its words in its label; the caption and the
 * bars are hidden from it. Each bar stands on the connected bill's scale, its foot and its
 * height a share of that bill to two places, as the mock prints them ("60.00%").
 */

/** The mock's class per step: the connected bill, a drop, today's bill. */
const BAR: Record<CaseStudyCostStep["kind"], string> = {
  start: "mo-b s",
  drop: "mo-b d",
  end: "mo-b e",
};

export function CaseBand(): React.JSX.Element {
  const { chart } = caseBand;
  return (
    <section className="mo-case" id="case-study" aria-labelledby="mo-case-h">
      <div className="wrap">
        <div className="mo-case-in">
          <div className="mo-case-t mo-r">
            <p className="mo-eyebrow">
              <CoralMark />
              <span>
                <NamedText text={caseBand.eyebrow} name={products.coral.name} />
              </span>
            </p>
            <h2 id="mo-case-h">
              {caseBand.title} <span>{caseBand.titleGreen}</span>
            </h2>
            <p className="mo-case-l">
              <NamedText text={caseBand.line} name={products.coral.name} />
            </p>
            {/* The mock's markup, a space before the arrow included: inside the inline-flex
                button it collapses. */}
            <a className="btn btn-light" href={caseBand.cta.href}>
              {caseBand.cta.label} <Arrow />
            </a>
          </div>
          <figure
            className="mo-wf mo-r"
            style={{ "--d": "120ms" } as CSSProperties}
            role="img"
            aria-label={chart.alt}
          >
            <figcaption aria-hidden="true">
              <span>{chart.caption}</span>
              <small>{chart.unit}</small>
            </figcaption>
            <div className="mo-wf-p" aria-hidden="true">
              {chart.steps.map((step) => (
                <div className="mo-wf-c" key={step.name}>
                  <div className="mo-wf-t">
                    <span
                      className={BAR[step.kind]}
                      style={{
                        bottom: share(step.from, chart.top),
                        height: share(step.amount, chart.top),
                      }}
                    >
                      <b>{step.label}</b>
                    </span>
                  </div>
                  <p>
                    {step.name}
                    <small>{step.date}</small>
                  </p>
                </div>
              ))}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
