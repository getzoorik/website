import { Fragment, type ReactNode } from "react";

/**
 * The prose kit every document is written in (the document mocks), one
 * measure and one rhythm: 17px / 1.7 text, h2, h3 and h4, lists with 5px dots,
 * accent links, inline code, numbered steps, one callout and tables that stack
 * below 640px. A guide's subsections open in place as numbered rows
 * (`DocRow`, in `src/features/doc-rows`). The command wells are `DocCommandWell`
 * and `DocOsWell` (client islands).
 *
 * Plain elements inside `<DocProse>` are already styled: `<p>`, `<ul>`, `<ol>`,
 * `<a>`, `<code>`, `<b>` and `<h3 id>`. The components below are the pieces
 * that carry structure or ARIA of their own.
 */

/**
 * The guide's reading column: every section of a prose document goes inside it.
 * A page with rules of its own adds its class (`/privacy`: `pp-prose`).
 */
export function DocProse({
  className,
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return <div className={className ? `doc-prose ${className}` : "doc-prose"}>{children}</div>;
}

export interface DocSectionProps {
  /** The anchor id: the contract for shared links, kept when the heading changes. */
  readonly id: string;
  readonly title: string;
  /** The muted 18px paragraph under the h2. */
  readonly lede?: ReactNode;
  /**
   * Name the section by its heading: the h2 takes `<id>-h` and the section
   * `aria-labelledby` it, as the privacy mock marks up its fifteen sections. A
   * named section is a region a screen reader can jump between.
   */
  readonly labelled?: boolean;
  readonly children?: ReactNode;
}

/** One `<section id>` with its h2 and lede; sections sit 72px apart and land under the bar. */
export function DocSection({
  id,
  title,
  lede,
  labelled,
  children,
}: DocSectionProps): React.JSX.Element {
  const headingId = labelled ? `${id}-h` : undefined;
  return (
    <section id={id} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {lede ? <p className="doc-lede">{lede}</p> : null}
      {children}
    </section>
  );
}

/**
 * A group subhead between continuation tables: an h3 drawn at the h4 size
 * (`h3.doc-sub`). It sits under the section's h2, where an h4 would skip a level.
 */
export function DocSubhead({ children }: { readonly children: ReactNode }): React.JSX.Element {
  return <h3 className="doc-sub">{children}</h3>;
}

export interface DocStep {
  /** The step's title, set at 600. */
  readonly title: ReactNode;
  /** Its body: paragraphs, wells, lists. */
  readonly body: ReactNode;
}

/**
 * Numbered steps: "01", "02"… in the mono face and the accent, drawn from a
 * counter beside each step's title and body, with no box.
 */
export function DocSteps({ steps }: { readonly steps: readonly DocStep[] }): React.JSX.Element {
  return (
    <ol className="doc-steps" role="list">
      {steps.map((step, index) => (
        <li key={index}>
          <div>
            <p className="doc-st">{step.title}</p>
            {step.body}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface DocCalloutProps {
  /**
   * "Review it first", "Good to know", "Stopping Amoeba". None for a callout
   * that is one sentence to stand out (the privacy policy's "Once a snapshot is
   * deleted…"): its body is the whole of it.
   */
  readonly title?: ReactNode;
  /**
   * A legal page's callout inside a numbered row (`pp-call`, /terms and
   * /security): the privacy sheet's margins, where `.pp-prose` cannot reach it.
   */
  readonly legal?: boolean;
  readonly children: ReactNode;
}

/**
 * A callout: an `<aside>` inside its section, so it is not a page landmark.
 * One kind: an accent wash and a hairline, the title a plain
 * line of text with no glyph. A title is one run of text in a block, so a name
 * in it (`<span translate="no">`) spaces like any other word.
 */
export function DocCallout({ title, legal, children }: DocCalloutProps): React.JSX.Element {
  return (
    <aside className={legal ? "doc-call pp-call" : "doc-call"}>
      {title ? <p className="doc-call-t">{title}</p> : null}
      {children}
    </aside>
  );
}

/** A command-line flag: two hyphens, then a word that may hold more hyphens. */
const FLAG = /(--[a-z][\w-]*)/;

/**
 * Inline code whose command-line flags stay whole: each flag sits in a
 * `.nb` span that does not wrap, as the mocks mark them. Chrome may break
 * a line after any hyphen, so on a phone "--now" read "--" at the end of one
 * line and "now" on the next, and "--anonymize-clusters" read "-" then
 * "-anonymize-clusters". The spaces between words still wrap, and copying the
 * code still yields the plain text.
 */
export function DocCode({
  children,
  breaks,
}: {
  readonly children: string;
  /** The guides' wider rule (`codeBreaks`) in place of the flags alone. */
  readonly breaks?: boolean;
}): React.JSX.Element {
  if (breaks) return <code>{codeBreaks(children)}</code>;
  /* A capturing split: the flags land at the odd indexes. */
  const parts = children.split(FLAG);
  return (
    <code>
      {parts.length === 1
        ? children
        : parts.map((part, index) =>
            index % 2 === 1 ? (
              <span className="nb" key={index}>
                {part}
              </span>
            ) : (
              <Fragment key={index}>{part}</Fragment>
            ),
          )}
    </code>
  );
}

/** After a dot or a slash that a word character follows: where a long name may part. */
const NAME_JOINT = /(?<=[/.])(?=\w)/;

/**
 * A guide's inline code, broken where it may part and held where it may not:
 * each word is split after every dot or
 * slash a word character follows, with a `<wbr>` at each split, and each part
 * that holds a hyphen and is 20 characters or fewer sits in a `.nb` span that
 * does not wrap. So `zoorik.com/login` may part after its dot and its slash,
 * and `--kube-context` or `grant-node-deletion` never parts at its hyphens.
 * Copying the code still yields the plain text.
 */
export function codeBreaks(text: string): ReactNode {
  /* A capturing split: the runs of white space land at the odd indexes. */
  return text.split(/(\s+)/).map((word, index) => {
    if (!word.trim()) return <Fragment key={index}>{word}</Fragment>;
    return (
      <Fragment key={index}>
        {word.split(NAME_JOINT).map((part, at) => (
          <Fragment key={at}>
            {at > 0 ? <wbr /> : null}
            {part.includes("-") && part.length <= 20 ? <span className="nb">{part}</span> : part}
          </Fragment>
        ))}
      </Fragment>
    );
  });
}

export interface DocTableColumn {
  readonly label: string;
  /** The PDF's column width, e.g. "24%". */
  readonly width?: string;
}

export interface DocTableProps {
  readonly columns: readonly DocTableColumn[];
  /**
   * One array of cells per row, in column order. The first cell is the row's
   * title. `null` is a cell left empty: it draws nothing, so a table marked
   * `nw-tbl` hides it, label and all, when it stacks.
   */
  readonly rows: readonly (readonly ReactNode[])[];
  /** A page's own class beside `doc-tbl`: /security's `nw-tbl`. */
  readonly className?: string;
  /**
   * A continuation table: its header is visually hidden (still read), because
   * the subhead above it continues a table whose header is already on screen.
   */
  readonly continuation?: boolean;
}

/**
 * A table that stacks below 640px: each row becomes a block, the first cell its
 * title and every other cell labelled inline with its column name (CSS
 * generated content from `data-label`, with empty alt text so it is not read
 * twice).
 *
 * 🔴 THE ARIA TABLE ROLES ARE EXPLICIT. `display:block` drops a table's
 * semantics in some browsers; the roles keep it a table for a screen reader at
 * every width. They are in the markup, not added by a script.
 *
 * 🔴 AND EVERY CELL'S CONTENT SITS IN ONE `<div>`. Stacked, a cell is a
 * two-column grid, the label then the content, and in a grid every child
 * element and every run of text between them is a grid item of its own. A cell
 * that reads "Hosts <span>Coral</span> and <span>Amoeba</span>…" would be
 * dealt out across the label column and the content column, one fragment per
 * row (the privacy mock does exactly that at 390). One wrapper is one item, so
 * the content stays one block beside its label at every width; it changes
 * nothing in a table-cell.
 */
export function DocTable({
  columns,
  rows,
  continuation,
  className,
}: DocTableProps): React.JSX.Element {
  const classes = ["doc-tbl", className, continuation ? "is-cont" : null];
  return (
    <table className={classes.filter(Boolean).join(" ")} role="table">
      {columns.some((column) => column.width) ? (
        <colgroup>
          {columns.map((column) => (
            <col key={column.label} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
      ) : null}
      <thead role="rowgroup">
        <tr role="row">
          {columns.map((column) => (
            <th scope="col" role="columnheader" key={column.label}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((cells, row) => (
          <tr role="row" key={row}>
            {cells.map((cell, index) => (
              <td role="cell" data-label={columns[index]?.label} key={index}>
                {cell === null ? null : <div>{cell}</div>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
