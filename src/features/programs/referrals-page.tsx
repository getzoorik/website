import { Fragment, type ReactNode } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { assessmentProducts } from "@/content/assessment";
import { productOrder } from "@/content/products";
import { referralsPage, type ReferralTeamIcon } from "@/content/referrals";
import { EyeGlyph, SendGlyph, ShieldGlyph } from "@/features/assessment/assessment-marks";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { ChainArrow, MailGlyph } from "@/features/programs/program-glyphs";
import {
  AskCard,
  OfferCard,
  ProgramPair,
  ProgramSection,
  ProgramTiles,
  programMailto,
} from "@/features/programs/program-parts";
import { ShareCommand } from "@/features/programs/share-command";

/**
 * `/referrals`, coming soon, on the documents' frame:
 *
 *   hero                      the title and one line
 *   the pair                  on the band: the program on the white card ("Coming soon", the free assessment's two
 *                             commands to share, each with its Copy button), and a ready email on the navy one
 *   How it will work          who hands what to whom: three cards joined by arrows
 *   Who you could introduce   six tiles, each with its mark and its product
 *
 * No terms, no reward amount, no figure of our own making: the program has none yet. No closing assessment row (the
 * mock ends on the last tiles). The pair rises as it arrives; the Copy buttons are the one island.
 */

const { hero, offer, copy, ask, journey, who } = referralsPage;

/** Each team's glyph: a product's mark, or a line glyph for the roles both products serve. */
const TEAM_ICONS: Readonly<Record<ReferralTeamIcon, ReactNode>> = {
  coral: <ProductMark product="coral" className="dt-ic cp-ic" />,
  amoeba: <ProductMark product="amoeba" className="dt-ic cp-ic" />,
  eye: <EyeGlyph className="dt-ic cp-ic" />,
  shield: <ShieldGlyph className="dt-ic cp-ic" />,
};

/** The free assessment's two commands, the assessment's own (`assessment.ts`), each to copy. */
function Share(): React.JSX.Element {
  return (
    <div className="cp-share">
      {productOrder.map((id) => (
        <ShareCommand
          key={id}
          command={assessmentProducts[id].run}
          label={assessmentProducts[id].copy}
          strings={copy}
        />
      ))}
    </div>
  );
}

function Pair(): React.JSX.Element {
  return (
    <ProgramPair>
      <OfferCard
        flag={offer.flag}
        mark={<SendGlyph className="cp-own cp-own-l" />}
        title={offer.title}
        line={offer.line}
        extra={<Share />}
        go={offer.go}
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
 * How it will work: three cards, each naming who acts, joined by arrows. A list holds only items, so each arrow is an
 * item of its own, hidden from assistive tech: the list reads as its three cards.
 */
function Chain(): React.JSX.Element {
  return (
    <ProgramSection id={journey.id} title={journey.title}>
      <ol className="cp-chain">
        {journey.steps.map((step, index) => (
          <Fragment key={step.title}>
            {index > 0 ? (
              <li className="cp-ar" aria-hidden="true">
                <ChainArrow />
              </li>
            ) : null}
            <li>
              <span className="cp-who">{named(step.who)}</span>
              <h3>{step.title}</h3>
              <p>{step.line}</p>
            </li>
          </Fragment>
        ))}
      </ol>
    </ProgramSection>
  );
}

export function ReferralsPage(): React.JSX.Element {
  return (
    <DocumentPage hero={{ title: hero.title, deck: hero.deck }} assessmentRow={false}>
      <Pair />
      <Chain />
      <ProgramTiles
        id={who.id}
        title={who.title}
        cols={3}
        tiles={who.teams.map((team) => ({
          icon: TEAM_ICONS[team.icon],
          title: team.title,
          line: named(team.line),
        }))}
      />
    </DocumentPage>
  );
}
