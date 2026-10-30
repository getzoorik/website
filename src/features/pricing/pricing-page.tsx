import type { ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { Reveal } from "@/components/primitives/reveal";
import { marketplaces } from "@/config/marketplaces";
import { productOrder, products } from "@/content/products";
import { pricingPage, type PricingBlock, type PricingTable } from "@/content/pricing";
import { ValueLabMark } from "@/features/case-studies/value-lab-mark";
import { AllMarketplaces, OffSiteButton, StoreButtons } from "@/features/contact/contact-page";
import { ChevronGlyph } from "@/features/documents/document-glyphs";
import { DocumentFolds } from "@/features/documents/document-folds";
import { DocumentPage } from "@/features/documents/document-page";
import { richText } from "@/features/documents/rich-text";
import { sectionSlug } from "@/features/open-source/os-guide-page";
import { MailGlyph } from "@/features/programs/program-glyphs";
import { ProgramPair } from "@/features/programs/program-parts";

/**
 * `/pricing`, on /partners' frame:
 *
 *   hero                              the title, the owner's line (D226) as the deck, Estimate your saving and
 *                                     Book a demo
 *   Start with the free assessment    what the assessment is, and the two commands in the docs' table
 *   Coral and Amoeba                  on the band: what each does, what it is priced per, its assessment and page
 *   Buy through your cloud marketplace  the four listings by name, the private offer and every listing
 *   the pair                          on the band: early access on the white card, design partners on the navy one
 *   Questions                         the FAQ's rows, closed, with no numbers
 *   closing row                       the site's, for both products
 *
 * 🔴 NO PRICE, RATE, CURRENCY OR FIGURE (D193): the text holds no digit. The pair rises as it arrives; nothing else
 * moves. A server component; the FAQ rows open in place, and a link to one opens it (`DocumentFolds`).
 */

const { hero, assessment, products: both, buy, early, partners, questions } = pricingPage;

/** The docs' table (`doc-tbl nw-tbl`), its widths the mock's, stacked on a phone with each cell labelled. */
function Table({ head, widths, rows }: PricingTable): React.JSX.Element {
  return (
    <table className="doc-tbl nw-tbl" role="table">
      <colgroup>
        {widths.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>
      <thead role="rowgroup">
        <tr role="row">
          {head.map((label, index) => (
            <th scope="col" role="columnheader" key={index}>
              {richText(label)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((cells, row) => (
          <tr role="row" key={row}>
            {cells.map((cell, index) => (
              <td role="cell" data-label={head[index]} key={index}>
                <div>{richText(cell)}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Blocks({ blocks }: { readonly blocks: readonly PricingBlock[] }): ReactNode {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "p":
        return <p key={index}>{richText(block.text)}</p>;
      case "ul":
        return (
          <ul key={index}>
            {block.items.map((item) => (
              <li key={item}>{richText(item)}</li>
            ))}
          </ul>
        );
      case "table":
        return <Table key={index} {...block} />;
    }
  });
}

/** A section under the hero: its heading in the site's row, then its column of prose. */
function Section({
  id,
  title,
  band,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly band?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <section className={band ? "sec sec-band" : "sec cp-sec"} id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${id}-h`}>{richText(title)}</h2>
        </div>
        <div className="doc-prose pr-col">{children}</div>
      </div>
    </section>
  );
}

/** The four listings, Coral's then Amoeba's, each named by its product and its store in full. */
const listings = productOrder.flatMap((product) =>
  marketplaces.flatMap((store) => {
    const href = store.listings[product];
    return href
      ? [
          {
            name: richText(`${products[product].name}${buy.on}${store.name}`),
            href,
          },
        ]
      : [];
  }),
);

function Buy(): React.JSX.Element {
  return (
    <section className="sec cp-sec" id={buy.id} aria-labelledby={`${buy.id}-h`}>
      <div className="wrap">
        <div className="cp-buyrow">
          <div>
            <h2 id={`${buy.id}-h`}>{buy.title}</h2>
            <p>{richText(buy.line)}</p>
          </div>
          <div className="mkt-btns cp-stores">
            <StoreButtons stores={listings} />
          </div>
        </div>
        <div className="cp-more">
          <p>{richText(buy.offer)}</p>
          <AllMarketplaces all={buy.all} />
        </div>
      </div>
    </section>
  );
}

function Pair(): React.JSX.Element {
  return (
    <ProgramPair>
      <Reveal className="as-card as-mini cp-w" order={0}>
        <ValueLabMark className="cp-own cp-own-l" />
        <h2 className="as-h">{early.title}</h2>
        <p>{richText(early.line)}</p>
        <OffSiteButton className="btn-ink" href={early.go.href}>
          {early.go.label}
        </OffSiteButton>
        <p className="ct-after">
          {richText(early.after[0])}
          <br />
          {richText(early.after[1])}
        </p>
      </Reveal>
      <Reveal className="as-cal cp-d" order={1}>
        <MailGlyph className="cp-own" />
        <h2 className="as-h">{partners.title}</h2>
        <p>{richText(partners.line)}</p>
        <a className="cta-go" href={partners.go.href}>
          <span>{partners.go.label}</span>
          <ExternalArrow />
        </a>
        <p className="cta-fine">
          <a href={partners.more.href}>{partners.more.text}</a>
        </p>
      </Reveal>
    </ProgramPair>
  );
}

/** The questions: the FAQ's rows, closed, each its question and its answer, with no row numbers. */
function Questions(): React.JSX.Element {
  return (
    <div className="sec doc-body pr-faq" id={questions.id}>
      <div className="wrap">
        <article className="doc-main fq-main">
          <section className="fq-sec" aria-labelledby={`${questions.id}-h`}>
            <h2 id={`${questions.id}-h`}>{questions.title}</h2>
            <div className="fq-sec-b">
              <div className="fq-list">
                {questions.rows.map((row) => (
                  <details className="fq" id={sectionSlug(row.question)} key={row.question}>
                    <summary>
                      <h3>{richText(row.question)}</h3>
                      <ChevronGlyph className="fq-chev" />
                    </summary>
                    <div className="fq-body doc-prose">
                      <Blocks blocks={row.answer} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </article>
      </div>
      <DocumentFolds />
    </div>
  );
}

export function PricingPage(): React.JSX.Element {
  return (
    <DocumentPage
      hero={{
        title: richText(hero.title),
        deck: richText(hero.deck),
        actions: (
          <div className="hero-cta pr-cta">
            <a className="btn btn-light" href={hero.assess.href}>
              {hero.assess.label} <Arrow />
            </a>
            <OffSiteButton className="btn btn-wire" href={hero.demo.href}>
              {hero.demo.label}
            </OffSiteButton>
          </div>
        ),
      }}
    >
      <Section id={assessment.id} title={assessment.title}>
        <Blocks blocks={assessment.blocks} />
      </Section>
      <Section id={both.id} title={both.title} band>
        <Blocks blocks={both.blocks} />
      </Section>
      <Buy />
      <Pair />
      <Questions />
    </DocumentPage>
  );
}
