import type { ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import { contactEmail } from "@/config/site";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { MailGlyph } from "@/features/programs/program-glyphs";
import { offSiteProps } from "@/lib/links";

/**
 * What /design-partners, /referrals and /partners share, on the documents' frame (the utility hero: the title and one
 * line): the pair on the band, the closing row's two cards (the offer on the white card with its quiet pill, the ask
 * on the navy one), and the sections under it, each a heading and its own element: Read more tiles, numbered steps,
 * or cards joined by arrows. Server components; the pair's cards rise as they arrive (`Reveal`), and /referrals's Copy
 * buttons are the one island of their own (`ShareCommand`).
 *
 * /marketplaces draws the navy close (`ProgramClose`) and its ready email from here too.
 */

/** A ready email to the founders, its subject naming the program (`Referral%20program`, as the mock encodes it). */
export const programMailto = (subject: string): string =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

/** A link's label and where it leads. */
interface Go {
  readonly label: string;
  readonly href: string;
}

/** The pair on the band: the white card, then the navy one. No heading of its own: each card has its h2. */
export function ProgramPair({ children }: { readonly children: ReactNode }): React.JSX.Element {
  return (
    <section className="sec sec-band cp-pair">
      <div className="wrap">
        <div className="as-grid">{children}</div>
      </div>
    </section>
  );
}

/**
 * The white card: the quiet pill at its top right, the page's own mark or element, the offer's title and line, what
 * the page draws under the line (the commands, the ranges), and the ink button. First to rise.
 */
export function OfferCard({
  flag,
  mark,
  title,
  line,
  extra,
  go,
}: {
  readonly flag: string;
  readonly mark: ReactNode;
  readonly title: string;
  readonly line: ReactNode;
  readonly extra?: ReactNode;
  readonly go: Go;
}): React.JSX.Element {
  return (
    <Reveal className="as-card as-mini cp-w" order={0}>
      <span className="cp-flag">{flag}</span>
      {mark}
      <h2 className="as-h">{title}</h2>
      <p>{line}</p>
      {extra}
      <a className="btn-ink" href={go.href}>
        {go.label} <Arrow />
      </a>
    </Reveal>
  );
}

/**
 * The navy card: its mark, the ask's title and line, what the page draws under the line (the three things we ask),
 * and the white button: a ready email, or the calendar in a new tab, which says so to a screen reader. Both leave the
 * page, so the button ends on the arrow out. Second to rise.
 */
export function AskCard({
  mark,
  title,
  line,
  extra,
  go,
}: {
  readonly mark: ReactNode;
  readonly title: string;
  readonly line: string;
  readonly extra?: ReactNode;
  readonly go: Go;
}): React.JSX.Element {
  return (
    <Reveal className="as-cal cp-d" order={1}>
      {mark}
      <h2 className="as-h">{title}</h2>
      <p>{line}</p>
      {extra}
      <a className="cta-go" href={go.href} {...offSiteProps(go.href)}>
        <span>
          {go.label}
          <NewTabHint href={go.href} />
        </span>
        <ExternalArrow />
      </a>
    </Reveal>
  );
}

/** A section under the pair: its heading in the site's row, then the page's own element. */
export function ProgramSection({
  id,
  title,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <section className="sec cp-sec" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${id}-h`}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/** One Read more tile: its glyph, title and line, and where it leads (none draws it as words alone). */
interface ProgramTile {
  readonly icon: ReactNode;
  readonly title: string;
  readonly line: ReactNode;
  readonly href?: string;
}

/** A section of Read more tiles, three or four to a row. */
export function ProgramTiles({
  id,
  title,
  cols,
  tiles,
}: {
  readonly id: string;
  readonly title: string;
  readonly cols: 3 | 4;
  readonly tiles: readonly ProgramTile[];
}): React.JSX.Element {
  return (
    <ProgramSection id={id} title={title}>
      <div className={`dt-grid cp-${cols}`}>
        {tiles.map((tile) => (
          <LinkTile
            key={tile.title}
            href={tile.href ?? null}
            icon={tile.icon}
            title={tile.title}
            line={tile.line}
          />
        ))}
      </div>
    </ProgramSection>
  );
}

/**
 * /marketplaces's navy close: the question, its line (its product names kept from translation), and "Write to us",
 * a ready email to the founders. No id and no heading anchor, as the mock draws it.
 */
export function ProgramClose({
  title,
  line,
  write,
}: {
  readonly title: string;
  readonly line: string;
  readonly write: { readonly label: string; readonly subject: string };
}): React.JSX.Element {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="pv-close">
          <div>
            <h2>{title}</h2>
            <p>{named(line)}</p>
          </div>
          <a className="pv-cta" href={programMailto(write.subject)}>
            <MailGlyph /> {write.label}
          </a>
        </div>
      </div>
    </section>
  );
}
