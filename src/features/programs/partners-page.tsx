import type { ReactNode } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { marketplaceListing, storesListing } from "@/config/marketplaces";
import { caseStudy } from "@/content/case-studies";
import { partnersPage, type PartnerTileIcon } from "@/content/partners";
import { savingsFigures } from "@/content/savings";
import { EyeGlyph, ShieldGlyph } from "@/features/assessment/assessment-marks";
import { ValueLabMark } from "@/features/case-studies/value-lab-mark";
import { DocGlyph } from "@/features/documents/document-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { MailGlyph, PackageGlyph } from "@/features/programs/program-glyphs";
import {
  AskCard,
  OfferCard,
  ProgramPair,
  ProgramTiles,
  programMailto,
} from "@/features/programs/program-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/partners`, coming soon, on the documents' frame:
 *
 *   hero                       the title and one line
 *   the pair                   on the band: what a partner brings on the white card ("Coming soon", the Zoorik mark,
 *                              each product's estimated range on a 0 to 100% track, our own result), and a ready email
 *                              on the navy one
 *   Who it is for              three tiles, each with its glyph
 *   What you can use today     three tiles, each one link: the assessment, the Helm chart, the Terraform modules
 *   Where your customers buy   Coral's two store buttons, then All marketplaces
 *
 * No terms, no commission, no figure of our own making: the program has none yet, and the two ranges are the home
 * page's (`savings.ts`). No closing assessment row (the mock ends on All marketplaces). The pair rises as it arrives;
 * nothing else moves.
 */

const { hero, offer, ask, who, today, buy } = partnersPage;

/** Each tile's glyph. */
const TILE_ICONS: Readonly<Record<PartnerTileIcon, ReactNode>> = {
  zoorik: <ValueLabMark className="dt-ic cp-ic" />,
  shield: <ShieldGlyph className="dt-ic cp-ic" />,
  eye: <EyeGlyph className="dt-ic cp-ic" />,
  package: <PackageGlyph className="dt-ic cp-ic" />,
  doc: <DocGlyph className="dt-ic cp-ic" />,
};

/**
 * A range's two ends, read from its printed form ("40–50%" is 40 and 50), so the band can never disagree with the
 * figure beside it. A range written any other way fails the build rather than drawing a wrong band.
 */
function rangeOf(range: string): { readonly low: number; readonly high: number } {
  const ends = /^(\d+)–(\d+)%$/.exec(range);
  if (!ends) throw new Error(`/partners cannot draw the range "${range}" on its track.`);
  return { low: Number(ends[1]), high: Number(ends[2]) };
}

/**
 * Each product's estimated range: its mark, its name, its band on a 0 to 100% track (a drawing, hidden from assistive
 * tech), and its figure, said as it is meant ("40 to 50 percent"); then the qualifier.
 */
function Ranges(): React.JSX.Element {
  return (
    <>
      <ul className="cp-rg">
        {offer.ranges.map(({ product, name }) => {
          const { range, spoken } = savingsFigures[product];
          const { low, high } = rangeOf(range);
          return (
            <li key={product}>
              <ProductMark product={product} className="cp-rgi" />
              <span>{named(name)}</span>
              <span className="cp-track" aria-hidden="true">
                <i style={{ left: `${low}%`, width: `${high - low}%` }} />
              </span>
              <b role="img" aria-label={spoken}>
                {range}
              </b>
            </li>
          );
        })}
      </ul>
      <p className="cp-fine">{offer.fine}</p>
    </>
  );
}

function Pair(): React.JSX.Element {
  return (
    <ProgramPair>
      <OfferCard
        flag={offer.flag}
        mark={<ValueLabMark className="cp-own cp-own-l" />}
        title={offer.title}
        line={named(offer.line)}
        extra={<Ranges />}
        go={{ label: offer.go, href: caseStudy.route }}
      />
      <AskCard
        mark={<MailGlyph className="cp-own" />}
        title={ask.title}
        line={ask.line}
        go={{ label: ask.write.label, href: programMailto(ask.write.subject) }}
      />
    </ProgramPair>
  );
}

/**
 * Coral's two store buttons, as the footer draws its own (mark, store name, the arrow out), each opening Coral's
 * listing in that store; the line beside them names Coral and Amoeba, and All marketplaces under them goes on to the
 * rest.
 */
function Stores(): React.JSX.Element {
  return (
    <div className="mkt-btns cp-stores">
      {storesListing("coral").map((store) => {
        const href = marketplaceListing(store, "coral");
        return (
          <a className="mkt-b" key={store.id} href={href} {...offSiteProps(href)}>
            {store.id === "aws" ? (
              <AwsMark crop="badge" className="mkt-mk mkt-aws" />
            ) : (
              <AzureMark idSuffix="mkt-cp-buy" className="mkt-mk mkt-az" />
            )}
            <span>{store.name}</span>
            <NewTabHint href={href} />
            <ExternalArrow />
          </a>
        );
      })}
    </div>
  );
}

/** Where your customers buy: one row, its words and Coral's two store buttons, then every marketplace. */
function Buy(): React.JSX.Element {
  return (
    <section className="sec cp-sec cp-buy" aria-labelledby={buy.headingId}>
      <div className="wrap">
        <div className="cp-buyrow">
          <div>
            <h2 id={buy.headingId}>{buy.title}</h2>
            <p>{named(buy.line)}</p>
          </div>
          <Stores />
        </div>
        <a className="alink cp-all" href={buy.all.href}>
          {buy.all.label} <Arrow />
        </a>
      </div>
    </section>
  );
}

export function PartnersPage(): React.JSX.Element {
  return (
    <DocumentPage hero={{ title: hero.title, deck: hero.deck }} assessmentRow={false}>
      <Pair />
      <ProgramTiles
        id={who.id}
        title={who.title}
        cols={3}
        tiles={who.tiles.map((tile) => ({
          icon: TILE_ICONS[tile.icon],
          title: tile.title,
          line: named(tile.line),
        }))}
      />
      <ProgramTiles
        id={today.id}
        title={today.title}
        cols={3}
        tiles={today.tiles.map((tile) => ({
          icon: TILE_ICONS[tile.icon],
          title: tile.title,
          line: tile.line,
          href: tile.href,
        }))}
      />
      <Buy />
    </DocumentPage>
  );
}
