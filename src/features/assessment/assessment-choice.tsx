"use client";

import { Fragment } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { assessmentCopy, assessmentProducts } from "@/content/assessment";
import { products } from "@/content/products";
import { MailGlyph } from "@/features/assessment/assessment-marks";
import { useAssessment } from "@/features/assessment/assessment-provider";
import { ByChoice } from "@/features/assessment/by-choice";
import { offSiteProps } from "@/lib/links";

const { send, book, code, how } = assessmentCopy.after;

/** What it does' two facts that follow the product: what the script reads, and what it runs only when it must. */
export function AssessmentFacts({ fact }: { readonly fact: "reads" | "runs" }): React.JSX.Element {
  return (
    <dd>
      <ByChoice
        render={(product) =>
          fact === "reads"
            ? assessmentProducts[product].reads
            : assessmentProducts[product].runs.map((part, index) =>
                part.code ? (
                  <code translate="no" key={index}>
                    {part.text}
                  </code>
                ) : (
                  <span key={index}>{part.text}</span>
                ),
              )
        }
      />
    </dd>
  );
}

function OffSite({
  href,
  children,
}: {
  readonly href: string;
  readonly children: React.ReactNode;
}) {
  return (
    <a className="alink" href={href} {...offSiteProps(href)}>
      <span>{children}</span>
      <ExternalArrow />
      <NewTabHint href={href} />
    </a>
  );
}

/**
 * After the run: "Send us your PDF" (the mail to the founders, its subject the product's) and "Book 30 minutes" (the
 * people who build the product), in the site's closing grid; then the code and how the estimate works (the product's
 * section of the README).
 *
 * The mail button and the estimate link read the same for both products, so they are one link whose address follows
 * the product. The booking line names both products whatever the switch says (`book.both`), so it is static text
 * before hydration.
 */
export function AssessmentAfter(): React.JSX.Element {
  const { product } = useAssessment();
  const mail = `mailto:${send.email}?subject=${encodeURIComponent(assessmentProducts[product].subject)}`;

  return (
    <>
      <div className="as-grid">
        <div className="as-card as-mini">
          <h3 className="as-h">{send.title}</h3>
          <p>{send.reply}</p>
          <a className="btn-ink" href={mail}>
            <MailGlyph />
            <span>{send.button}</span>
          </a>
        </div>
        <div className="as-cal">
          <h3 className="as-h">{book.title}</h3>
          <p>
            {book.line}
            {book.both.map((id, index) => (
              <Fragment key={id}>
                {index > 0 ? " and " : null}
                <span translate="no">{products[id].name}</span>
              </Fragment>
            ))}
            .
          </p>
          <a className="cta-go" href={book.href} {...offSiteProps(book.href)}>
            {book.cta}
            <ExternalArrow />
            <NewTabHint href={book.href} />
          </a>
        </div>
      </div>
      <p className="ax-foot">
        <OffSite href={code.href}>{code.label}</OffSite>
        <OffSite href={assessmentProducts[product].how}>{how}</OffSite>
      </p>
    </>
  );
}
