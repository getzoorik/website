import type { ReactNode } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import {
  designPartnerPlaces,
  designPartnersPage,
  type DesignPartnerGetIcon,
} from "@/content/design-partners";
import { EyeGlyph, PlayGlyph, SendGlyph } from "@/features/assessment/assessment-marks";
import { TickGlyph } from "@/features/brand-assets/brand-assets-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { CheckGlyph } from "@/features/programs/program-glyphs";
import {
  AskCard,
  OfferCard,
  ProgramPair,
  ProgramSection,
  ProgramTiles,
  programMailto,
} from "@/features/programs/program-parts";

/**
 * `/design-partners`, open now, on the documents' frame:
 *
 *   hero            the title and one line
 *   the pair        on the band: the offer on the white card ("Open now · the first 10", a slot for each place, free on
 *                   non-production, a ready email), and what we ask on the navy one (three things, ticked; Book a call,
 *                   in a new tab)
 *   What you get    four tiles, each with its glyph
 *   How it works    the program as a path: four numbered steps on one line
 *   Who it is for   four tiles, each with its product's mark
 *
 * One offer and one term, and no other figure: the places are `designPartnerPlaces`. No closing assessment row (the
 * mock ends on the last tiles). The pair rises as it arrives; nothing else moves.
 */

const { hero, offer, ask, get, journey, who } = designPartnersPage;

/** Each tile's glyph in What you get. */
const GET_ICONS: Readonly<Record<DesignPartnerGetIcon, ReactNode>> = {
  check: <CheckGlyph className="dt-ic cp-ic" />,
  play: <PlayGlyph className="dt-ic cp-ic" />,
  send: <SendGlyph className="dt-ic cp-ic" />,
  eye: <EyeGlyph className="dt-ic cp-ic" />,
};

/** A slot for each place, none shown as taken: a drawing, hidden from assistive tech (the pill and the line say it). */
function Slots(): React.JSX.Element {
  return (
    <div className="cp-slots" aria-hidden="true">
      {Array.from({ length: designPartnerPlaces }, (_, place) => (
        <i key={place} />
      ))}
    </div>
  );
}

function Pair(): React.JSX.Element {
  return (
    <ProgramPair>
      <OfferCard
        flag={offer.flag}
        mark={<Slots />}
        title={offer.title}
        line={named(offer.line)}
        go={{ label: offer.apply.label, href: programMailto(offer.apply.subject) }}
      />
      <AskCard
        mark={<SendGlyph className="cp-own" />}
        title={ask.title}
        line={ask.line}
        extra={
          <ul className="cp-ask">
            {ask.items.map((item) => (
              <li key={item}>
                <TickGlyph />
                <span>{named(item)}</span>
              </li>
            ))}
          </ul>
        }
        go={ask.call}
      />
    </ProgramPair>
  );
}

/** How it works: the four steps on one line, each numbered, the line joining one number to the next. */
function Steps(): React.JSX.Element {
  return (
    <ProgramSection id={journey.id} title={journey.title}>
      <ol className="cp-steps">
        {journey.steps.map((step, index) => (
          <li key={step.title}>
            <span className="cp-sn" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{step.title}</h3>
            <p>{step.line}</p>
          </li>
        ))}
      </ol>
    </ProgramSection>
  );
}

export function DesignPartnersPage(): React.JSX.Element {
  return (
    <DocumentPage hero={{ title: hero.title, deck: named(hero.deck) }} assessmentRow={false}>
      <Pair />
      <ProgramTiles
        id={get.id}
        title={get.title}
        cols={4}
        tiles={get.tiles.map((tile) => ({
          icon: GET_ICONS[tile.icon],
          title: tile.title,
          line: named(tile.line),
        }))}
      />
      <Steps />
      <ProgramTiles
        id={who.id}
        title={who.title}
        cols={4}
        tiles={who.teams.map((team) => ({
          icon: <ProductMark product={team.icon} className="dt-ic cp-ic" />,
          title: team.title,
          line: named(team.line),
        }))}
      />
    </DocumentPage>
  );
}
