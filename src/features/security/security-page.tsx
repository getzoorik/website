import { Fragment, type ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import {
  securityGroups,
  securityPage,
  securitySummary,
  type SecurityBlock,
  type SecurityText,
} from "@/content/security";
import { DocRow, DocRows, DocUpdated } from "@/features/doc-rows/doc-rows";
import { DocSummary } from "@/features/documents/doc-summary";
import { DocumentPage } from "@/features/documents/document-page";
import { DocCallout, DocCode, DocTable } from "@/features/documents/prose";
import { named } from "@/features/legal/named";

/**
 * `/security`: the utility hero; then, open over the rows, the Updated line
 * and the summary (its title a paragraph, its list a summary list); then the
 * eleven sections as numbered rows in three groups (`DocRows`). No closing
 * assessment row: the page ends on its last row and the footer.
 *
 * A server component: every word is fixed at build. The client islands are the
 * chips and the fold script.
 */

/** A run of text: the product names kept out of translation, code kept whole where it must be. */
function text(value: SecurityText): ReactNode {
  if (typeof value === "string") return named(value);
  return value.map((piece, index) => {
    if (typeof piece === "string") return <Fragment key={index}>{named(piece)}</Fragment>;
    if ("code" in piece) {
      return (
        <DocCode key={index} breaks>
          {piece.code}
        </DocCode>
      );
    }
    return (
      <a href={piece.href} key={index}>
        {piece.text}
      </a>
    );
  });
}

function block(item: SecurityBlock, key: number): ReactNode {
  switch (item.kind) {
    case "p":
      return <p key={key}>{text(item.text)}</p>;
    case "ul":
      return (
        <ul key={key}>
          {item.items.map((entry, index) => (
            <li key={index}>{text(entry)}</li>
          ))}
        </ul>
      );
    case "h4":
      return (
        <h4 className="doc-sub" key={key}>
          {item.title}
        </h4>
      );
    case "table":
      return (
        <DocTable
          key={key}
          className="nw-tbl"
          columns={item.columns}
          rows={item.rows.map((row) => row.map((cell) => (cell === null ? null : text(cell))))}
        />
      );
    case "callout":
      return (
        <DocCallout key={key} legal>
          <p>{text(item.text)}</p>
        </DocCallout>
      );
    case "links":
      return (
        <p className="nw-links" key={key}>
          {item.links.map((link) => (
            <a className="alink" href={link.href} key={link.href}>
              {/* the words in one span, so the flex row's gap falls only before the arrow */}
              <span>{link.text}</span>
              <Arrow />
            </a>
          ))}
        </p>
      );
  }
}

export function SecurityPage(): React.JSX.Element {
  let n = 0;
  return (
    <DocumentPage hero={securityPage.hero} assessmentRow={false}>
      <DocRows
        frame="rows"
        top={
          <div className="pp-prose">
            <DocUpdated>{securityPage.updated}</DocUpdated>
            <div id="summary">
              <p className="sc-sum-t">{securityPage.summaryTitle}</p>
              <DocSummary
                entries={securitySummary.map((entry) => ({
                  term: entry.term,
                  paragraphs: [text(entry.text)],
                }))}
              />
            </div>
          </div>
        }
        groups={securityGroups.map((group) => ({
          id: group.id,
          title: group.title,
          chip: group.title,
          rows: group.rows.map((row) => (
            <DocRow id={row.id} n={++n} title={named(row.title)} prose key={row.id}>
              {row.body.map(block)}
            </DocRow>
          )),
        }))}
      />
    </DocumentPage>
  );
}
