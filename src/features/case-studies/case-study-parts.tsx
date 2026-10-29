import { Fragment, type ReactNode } from "react";

import {
  GIB_PER_SQUARE,
  type CaseStudyCell,
  type CaseStudyCostStep,
  type CaseStudyDiskCard,
  type CaseStudyIcon,
  type CaseStudyMachine,
  type CaseStudyStep,
  type CaseStudyText,
} from "@/content/case-studies";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { named } from "@/features/legal/named";
import { share } from "@/lib/share";

/**
 * What the Value Lab studies share: the Coral study (`case-study-page.tsx`) and the Amoeba study
 * (`amoeba-study-page.tsx`) draw the same parts, in the site's figure style:
 *
 *   the result band  the date and "Published by Zoorik", the four figures in one line, what the product is
 *   the frame        /security's (`DocRows`, `frame="article"`): each numbered section's name beside its text
 *   the cards        a machine or a disk as a hairline card: its badge, name, what it is, its squares, its price
 *                    or size, a note; in a row, or as a swap with an arrow between
 *   the steps        a step's head (mark, title, date), then its card with the picture and a pill
 *   the figures      the bars (one per row, the longest at 78% of the track), the steps on one scale, a table, and
 *                    the share removed as a ring
 *
 * Each picture is one image to a screen reader, its words in its label. Server components.
 */

/** A run of text: its product names kept out of translation, its bold runs bold. */
export function Text({ text }: { readonly text: CaseStudyText }): ReactNode {
  if (typeof text === "string") return named(text);
  return text.map((piece, index) =>
    typeof piece === "string" ? (
      <Fragment key={index}>{named(piece)}</Fragment>
    ) : (
      <b key={index}>{named(piece.b)}</b>
    ),
  );
}

/** The PDF's own marks, one stroke icon each. */
const ICON_PATHS: Record<CaseStudyIcon, ReactNode> = {
  node: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  wl: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  rb: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  safe: (
    <>
      <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
};

export function Icon({ icon }: { readonly icon: CaseStudyIcon }): React.JSX.Element {
  return (
    <svg
      className="cs-ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}

/** One card: its badge, its name, what it is, its squares, its price or size, and a note under it. */
function Card({
  tone,
  badge,
  name,
  kind,
  squares,
  price,
  note,
}: {
  readonly tone: CaseStudyMachine["tone"];
  readonly badge: string;
  readonly name: string;
  readonly kind?: string;
  readonly squares: ReactNode;
  readonly price: ReactNode;
  readonly note?: string;
}): React.JSX.Element {
  return (
    <div className={`cs-mc is-${tone}`}>
      <span className="cs-badge">{badge}</span>
      <span className="cs-mn">{name}</span>
      {kind ? <span className="cs-mk">{named(kind)}</span> : null}
      {squares}
      {price ? <span className="cs-mp">{price}</span> : null}
      {note ? <span className="cs-mnote">{named(note)}</span> : null}
    </div>
  );
}

/** One machine: its CPU as squares, its monthly price. */
export function Machine({ machine }: { readonly machine: CaseStudyMachine }): React.JSX.Element {
  return (
    <Card
      {...machine}
      squares={
        <span className="cs-cores" aria-hidden="true">
          {Array.from({ length: machine.cpu }, (_, core) => (
            <i key={core} />
          ))}
        </span>
      }
      price={
        <>
          {machine.price}
          <small> a month</small>
        </>
      }
    />
  );
}

/** One VM or one disk: each disk a run of squares, one square per 8 GiB, a run wrapping as a whole; its size. */
export function DiskCard({ card }: { readonly card: CaseStudyDiskCard }): React.JSX.Element {
  return (
    <Card
      {...card}
      squares={
        card.disks.length > 0 ? (
          <span className="cs-cores is-disks" aria-hidden="true">
            {card.disks.map((gib, disk) => (
              <span key={disk}>
                {Array.from({ length: gib / GIB_PER_SQUARE }, (_, square) => (
                  <i key={square} />
                ))}
              </span>
            ))}
          </span>
        ) : null
      }
      price={card.size}
    />
  );
}

/** A picture's words for a screen reader: one image, its label. None leaves the cards as they are. */
const picture = (label?: string) => (label ? { role: "img", "aria-label": label } : {});

/** Cards side by side: three, or two (`is-2`). */
export function CardRow({
  className = "cs-mrow",
  label,
  children,
}: {
  readonly className?: string;
  readonly label?: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <div className={className} {...picture(label)}>
      {children}
    </div>
  );
}

/** The swap: the card before, an arrow, the card after. */
export function Swap({
  label,
  before,
  after,
}: {
  readonly label?: string;
  readonly before: ReactNode;
  readonly after: ReactNode;
}): React.JSX.Element {
  return (
    <div className="cs-swap" {...picture(label)}>
      {before}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
      {after}
    </div>
  );
}

/** Three cards: the features, or the safety rules, each its mark, its name and one line. */
export function Three({
  cards,
}: {
  readonly cards: readonly {
    readonly icon: CaseStudyIcon;
    readonly title: string;
    readonly text: string;
  }[];
}): React.JSX.Element {
  return (
    <div className="cs-three">
      {cards.map((card) => (
        <div key={card.title}>
          <Icon icon={card.icon} />
          <b>{card.title}</b>
          <p>{named(card.text)}</p>
        </div>
      ))}
    </div>
  );
}

/** A step of what the product did: its head (mark, title, date), then its card with the picture and a pill. */
export function Step({
  step,
  children,
}: {
  readonly step: CaseStudyStep;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <>
      <div className="cs-chap">
        <span className="cs-ib">
          <Icon icon={step.icon} />
        </span>
        <h3 id={step.id}>{named(step.title)}</h3>
        <span className="cs-date">{step.date}</span>
      </div>
      <div className="cs-stage">
        <p>
          <Text text={step.text} />
        </p>
        {children}
        <span className="cs-pill">{step.pill}</span>
      </div>
    </>
  );
}

/** A study's result band: the date and publisher, the four figures in one line, what the product is. */
export function StudyBand({
  band,
}: {
  readonly band: {
    readonly label: string;
    readonly date: string;
    readonly by: string;
    readonly publisher: { readonly text: string; readonly href: string };
    readonly stats: readonly {
      readonly value: string;
      readonly label: string;
      readonly good: boolean;
    }[];
    readonly about: CaseStudyText;
  };
}): React.JSX.Element {
  return (
    <section className="cs-band" aria-label={band.label}>
      <div className="wrap">
        <div className="cs-band-in">
          <p className="doc-updated">
            {band.date}
            {band.by}
            <a href={band.publisher.href}>{band.publisher.text}</a>
          </p>
          <div className="cs-stats">
            {band.stats.map((stat) => (
              <p className="cs-stat" key={stat.value}>
                <span className={stat.good ? "cs-v is-good" : "cs-v"}>{stat.value}</span>
                <span className="cs-k">{named(stat.label)}</span>
              </p>
            ))}
          </div>
          <div className="doc-call">
            <p>
              <Text text={band.about} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A study's sections in /security's frame: the number beside each section's name, its text beside it. */
export function StudyFrame({
  sections,
  foot,
}: {
  readonly sections: readonly {
    readonly id: string;
    /** The h2's words: plain, or with the product's name kept out of translation. */
    readonly title: ReactNode;
    /** The chip on a phone: plain text, as the mocks draw it. */
    readonly chip: string;
    readonly body: ReactNode;
  }[];
  readonly foot: ReactNode;
}): React.JSX.Element {
  return (
    <DocRows
      frame="article"
      groups={sections.map((section, index) => ({
        id: section.id,
        /* The number beside the section's name, the number hidden from a screen reader. */
        title: (
          <>
            <span className="cs-no" aria-hidden="true">
              {index + 1}
            </span>
            <span>{section.title}</span>
          </>
        ),
        chip: section.chip,
        body: section.body,
      }))}
      foot={foot}
    />
  );
}

/** One row of the bars: its name, its share of the track, its figure, and what follows the bar. */
export interface BarRow {
  readonly name: string;
  readonly value: number;
  readonly label: string;
  readonly after?: string;
}

/** Bars, one per row, on one scale: the longest at 78% of the track, its figure after the bar. */
export function Bars({
  caption,
  unit,
  alt,
  className = "cs-hb",
  rows,
  up,
}: {
  readonly caption: string;
  readonly unit: string;
  readonly alt: string;
  readonly className?: string;
  readonly rows: readonly BarRow[];
  /** The green line under the bars. */
  readonly up: ReactNode;
}): React.JSX.Element {
  const longest = Math.max(...rows.map((row) => row.value));
  return (
    <figure className="cs-fig">
      <figcaption className="cs-fh">
        <span>{caption}</span>
        <small>{unit}</small>
      </figcaption>
      <div className={className} role="img" aria-label={alt}>
        <div>
          {rows.map((row) => (
            <p className="cs-hr" key={row.name}>
              <span className="cs-hl">{named(row.name)}</span>
              <span className="cs-ht">
                <i style={{ width: `${((row.value / longest) * 78).toFixed(1)}%` }} />
                <b>{row.label}</b>
              </span>
              {row.after ? <small>{row.after}</small> : null}
            </p>
          ))}
        </div>
      </div>
      <p className="cs-up">{up}</p>
    </figure>
  );
}

const BAR: Record<CaseStudyCostStep["kind"], string> = {
  start: "cs-bar is-start",
  drop: "cs-bar is-drop",
  end: "cs-bar is-end",
};

/** The steps: where it started, each drop and where it ended, each bar on the start's scale. */
export function Steps({
  caption,
  unit,
  alt,
  top,
  steps,
  className = "cs-wf",
}: {
  readonly caption: string;
  readonly unit: string;
  readonly alt: string;
  /** The scale's top: where it started. */
  readonly top: number;
  readonly steps: readonly CaseStudyCostStep[];
  readonly className?: string;
}): React.JSX.Element {
  return (
    <figure className="cs-fig">
      <figcaption className="cs-fh">
        <span>{caption}</span>
        <small>{unit}</small>
      </figcaption>
      <div className={className} role="img" aria-label={alt}>
        {steps.map((step) => (
          <div className="cs-col" key={step.name}>
            <div className="cs-plot">
              <span
                className={BAR[step.kind]}
                style={{
                  bottom: share(step.from, top, 2),
                  height: share(step.amount, top, 2),
                }}
              >
                <b>{step.label}</b>
              </span>
            </div>
            <p className="cs-x">
              {step.name}
              <small>{step.date}</small>
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

const CELL: Record<NonNullable<CaseStudyCell["tone"]>, string> = {
  good: "cs-g",
  muted: "is-muted",
};

/**
 * A study's table: its caption, then the head (the rows' column named for a screen reader only, or not at all where
 * the columns name it), a row per measure, and a caption under it where it has one.
 */
export function StudyTable({
  caption,
  className = "cs-tb",
  measure,
  columns,
  rows,
  cap,
}: {
  readonly caption: string;
  readonly className?: string;
  /** The rows' column, named for a screen reader only; none when `columns` names it. */
  readonly measure?: string;
  readonly columns: readonly string[];
  readonly rows: readonly { readonly name: string; readonly cells: readonly CaseStudyCell[] }[];
  readonly cap?: string;
}): React.JSX.Element {
  return (
    <figure className="cs-fig">
      <figcaption className="cs-fh">{caption}</figcaption>
      <table className={className}>
        <thead>
          <tr>
            {measure ? (
              <th scope="col">
                <span className="sr-only">{measure}</span>
              </th>
            ) : null}
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              {row.cells.map((cell, index) => (
                <td className={cell.tone ? CELL[cell.tone] : undefined} key={index}>
                  {named(cell.text)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {cap ? <p className="cs-cap">{cap}</p> : null}
    </figure>
  );
}

/** The share removed: a ring, its green arc the part removed, the figure in its middle, a line under it. */
export function ShareRing({
  ring: removed,
}: {
  readonly ring: {
    readonly caption: string;
    readonly alt: string;
    readonly value: string;
    readonly word: string;
    readonly removed: number;
    readonly of: number;
    readonly line: string;
  };
}): React.JSX.Element {
  const ring = 2 * Math.PI * 56;
  const arc = (ring * removed.removed) / removed.of;
  return (
    <figure className="cs-fig cs-donut-card">
      <figcaption className="cs-fh">{removed.caption}</figcaption>
      <svg className="cs-donut" viewBox="0 0 150 150" role="img" aria-label={removed.alt}>
        <circle cx="75" cy="75" r="56" fill="none" stroke="#E4E7F2" strokeWidth={16} />
        <circle
          cx="75"
          cy="75"
          r="56"
          fill="none"
          stroke="#12A97A"
          strokeWidth={16}
          strokeDasharray={`${arc.toFixed(2)} ${ring.toFixed(2)}`}
          transform="rotate(-90 75 75)"
        />
        <text x="75" y="82" textAnchor="middle" className="cs-dv">
          {removed.value}
        </text>
        <text x="75" y="100" textAnchor="middle" className="cs-ds">
          {removed.word}
        </text>
      </svg>
      <p className="cs-cap">{removed.line}</p>
    </figure>
  );
}
