import { Fragment, type ReactNode } from "react";

import { titleLink } from "@/content/learn/published";
import { ArrowGlyph, ChevronGlyph } from "@/features/documents/document-glyphs";
import { DocumentFolds } from "@/features/documents/document-folds";
import { FaqChips } from "@/features/documents/faq-chips";

/**
 * The numbered rows in groups: the FAQ's layout, shared by the guides, /terms,
 * /security and the /learn hub, and by the Learn articles and the case study
 * in /security's frame. One frame for all of them, drawn as the mocks draw it:
 *
 *   .sec.doc-body > .wrap > nav.fq-chips (below 981px), article.doc-main.fq-main(.gd-main):
 *     div.fq-upd(.gd-top): what stays open over the groups (the Updated line, a summary, a short version)
 *     section.fq-sec#<group> > h2, .fq-sec-b > the lede, the callouts, .fq-list > the rows, the Related line
 *     then what closes the column (the FAQ's download line, /learn's line in div.fq-upd.gd-foot)
 *
 * From 981px each group's name stands sticky in the left column beside its
 * rows, and what stays open sits over the rows' column; below that the name
 * sits above its rows, and the row of group names stays under the bar.
 *
 * An article (`frame="article"`: the Learn articles and the case study) is
 * read through, so a group holds its section's
 * text, open, instead of rows: the column is `.ar-frame`, and the open block,
 * each section's text and the closing block are `.doc-prose`. There is no "On
 * this page" list: the names in the left column, and the chips on a phone, are
 * the page's contents.
 *
 * A row is a closed `<details>` (`DocRow`): its numeral ("01", hidden from
 * screen readers), its h3 and a chevron, then its body. The numbers run on
 * across the groups. A link to a row, or an address that names it, opens it
 * (`DocumentFolds`); with scripting off every row is a working disclosure. On
 * /learn a row is one link instead (`LinkRow`).
 *
 * Server components; the chips and the fold script are the client islands.
 */

export interface DocRowsGroup {
  readonly id: string;
  /** The h2. */
  readonly title: ReactNode;
  /** The group's chip on a phone: its name, as the h2 reads it (product names kept out of translation). */
  readonly chip: ReactNode;
  /** The muted line over the rows (a guide section's lede). */
  readonly lede?: ReactNode;
  /** Callouts that stay open over the rows. */
  readonly callouts?: ReactNode;
  /** The rows: `DocRow`s, or `LinkRow`s. */
  readonly rows?: ReactNode;
  /**
   * The rows are /pricing's, the FAQ's with no number column (`UnnumberedRow`s: the works-with pages' Questions, in
   * the article frame): the section takes `.pr-faq`, and its column holds rows, so it is the rows' `fq-sec-b`, never
   * prose. The two rules that drop the numeral's column are the page's own sheet (works-with.css), not this frame's.
   */
  readonly unnumbered?: boolean;
  /** An article's section: its text, open, in place of rows. */
  readonly body?: ReactNode;
  /** After the rows: a guide section's Related line. */
  readonly after?: ReactNode;
}

export interface DocRowsProps {
  readonly groups: readonly DocRowsGroup[];
  /** What stays open over the groups. */
  readonly top?: ReactNode;
  /**
   * The rows' frame (/terms, /security, /learn) rather than the FAQ's: the
   * column takes `gd-main` and the open block `gd-top`, which keeps 56px over the
   * first group. The guides take `gd-main` alone (`guide`). An article reads
   * through (`article`): `.ar-frame`, every block of text `.doc-prose`.
   */
  readonly frame?: "faq" | "guide" | "rows" | "article";
  /** After the last group, inside the column: the FAQ's download line. */
  readonly end?: ReactNode;
  /** The closing block, in `div.fq-upd.gd-foot`: /learn's line to Medium; an article's help box and sources. */
  readonly foot?: ReactNode;
}

/** The column's classes, its open block's and its closing block's, by frame. */
const FRAME = {
  faq: { main: "doc-main fq-main", top: "fq-upd", body: "fq-sec-b", foot: "fq-upd gd-foot" },
  guide: {
    main: "doc-main fq-main gd-main",
    top: "fq-upd",
    body: "fq-sec-b",
    foot: "fq-upd gd-foot",
  },
  rows: {
    main: "doc-main fq-main gd-main",
    top: "fq-upd gd-top",
    body: "fq-sec-b",
    foot: "fq-upd gd-foot",
  },
  article: {
    main: "doc-main fq-main ar-frame",
    top: "fq-upd doc-prose",
    body: "fq-sec-b doc-prose",
    foot: "fq-upd ar-foot doc-prose",
  },
} as const;

export function DocRows({
  groups,
  top,
  frame = "faq",
  end,
  foot,
}: DocRowsProps): React.JSX.Element {
  const classes = FRAME[frame];
  return (
    <div className="sec doc-body">
      <div className="wrap">
        <FaqChips chips={groups.map((group) => ({ id: group.id, label: group.chip }))} />
        <article className={classes.main}>
          {top ? <div className={classes.top}>{top}</div> : null}
          {groups.map((group) => (
            <section
              className={group.unnumbered ? "fq-sec pr-faq" : "fq-sec"}
              id={group.id}
              aria-labelledby={`${group.id}-h`}
              key={group.id}
            >
              <h2 id={`${group.id}-h`}>{group.title}</h2>
              <div className={group.unnumbered ? "fq-sec-b" : classes.body}>
                {group.lede ? <p className="gd-lede">{group.lede}</p> : null}
                {group.callouts}
                {group.rows ? <div className="fq-list">{group.rows}</div> : null}
                {group.body}
                {group.after}
              </div>
            </section>
          ))}
          {end}
          {foot ? <div className={classes.foot}>{foot}</div> : null}
        </article>
      </div>
      <DocumentFolds />
    </div>
  );
}

/** "01": a row's numeral, two digits. */
const numeral = (n: number): string => String(n).padStart(2, "0");

export interface DocRowProps {
  readonly id: string;
  /** Its place on the page, from 1; the numbers run on across the groups. */
  readonly n: number;
  readonly title: ReactNode;
  /**
   * A row that opens onto a document's prose (the guides, /terms, /security):
   * `.gd-row`, its body `.doc-prose`. An FAQ question is neither.
   */
  readonly prose?: boolean;
  readonly children: ReactNode;
}

/** One row that opens in place: a closed `<details>` carrying the row's id. */
export function DocRow({ id, n, title, prose, children }: DocRowProps): React.JSX.Element {
  return (
    <details className={prose ? "fq gd-row" : "fq"} id={id}>
      <summary>
        <span className="fq-n" aria-hidden="true">
          {numeral(n)}
        </span>
        <h3>{title}</h3>
        <ChevronGlyph className="fq-chev" />
      </summary>
      <div className={prose ? "fq-body doc-prose" : "fq-body"}>{children}</div>
    </details>
  );
}

export interface UnnumberedRowProps {
  readonly id: string;
  readonly title: ReactNode;
  /** The answer, set as prose. */
  readonly children: ReactNode;
}

/**
 * One row with no numeral, closed: /pricing's question rows, which the per-cloud
 * and works-with pages draw too. Its h3 and a chevron, then the answer as
 * prose. Its section takes `.pr-faq`, whose two rules drop the numeral's column
 * (the page's own sheet: cloud-page.css, works-with.css).
 */
export function UnnumberedRow({ id, title, children }: UnnumberedRowProps): React.JSX.Element {
  return (
    <details className="fq" id={id}>
      <summary>
        <h3>{title}</h3>
        <ChevronGlyph className="fq-chev" />
      </summary>
      <div className="fq-body doc-prose">{children}</div>
    </details>
  );
}

export interface LinkRowProps {
  readonly href: string;
  readonly n: number;
  readonly title: ReactNode;
  /** The muted line under the title. */
  readonly line: ReactNode;
  /** Between the line and the date: anything a row adds. */
  readonly extra?: ReactNode;
  /** "Updated 9 October 2026". */
  readonly updated: ReactNode;
}

/**
 * One row that is one link (/learn): the FAQ row's grid and
 * type, the title, its line and its date, and an arrow where the chevron goes.
 */
export function LinkRow({ href, n, title, line, extra, updated }: LinkRowProps): React.JSX.Element {
  return (
    <a className="ln-row" href={href}>
      <span className="fq-n" aria-hidden="true">
        {numeral(n)}
      </span>
      <span className="ln-rt">
        <h3>{title}</h3>
        <span className="ln-rl">{line}</span>
        {extra}
        <span className="ln-ru">{updated}</span>
      </span>
      <ArrowGlyph className="ln-go" weight={2.2} />
    </a>
  );
}

/** The Updated line, first over the rows. */
export function DocUpdated({ children }: { readonly children: ReactNode }): React.JSX.Element {
  return <p className="doc-updated">{children}</p>;
}

/** "Related:" and its links, after a guide section's rows. */
export function DocRelated({
  links,
}: {
  readonly links: readonly { readonly text: string; readonly href: string }[];
}): React.JSX.Element {
  return (
    <p className="doc-related">
      Related:{" "}
      {links.map((stored, index) => {
        /* A Learn article is named by its h1, and stands as plain words until it is published. */
        const link = titleLink(stored);
        return (
          <Fragment key={stored.href}>
            {index > 0 ? " · " : null}
            {link.href ? <a href={link.href}>{link.text}</a> : link.text}
          </Fragment>
        );
      })}
    </p>
  );
}
