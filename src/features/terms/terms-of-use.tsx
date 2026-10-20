import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Fragment, type ReactNode } from "react";

import { termsCopy } from "@/content/terms";
import { DocRow, DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { DocCallout, DocCode } from "@/features/documents/prose";
import { named } from "@/features/legal/named";

import { parseTerms, type TermsBlock, type TermsInline } from "./parse-terms";

/**
 * `/terms`: the terms of use, laid out like the FAQ. The dark hero with title
 * and deck; then, open over the rows, the date line, the opening paragraph and
 * the short version's box; then the twenty clauses as numbered rows in six
 * groups (`DocRows`), each clause numbered as the document numbers it; then the
 * footer. No closing assessment row, as on /privacy: a legal page ends on its
 * last clause.
 *
 * 🔴 EVERY CLAUSE KEEPS ITS ANCHOR. /privacy, the consoles and replies to
 * customers cite `/terms#who-we-are` … `/terms#contact`: each id is now its
 * row's, and an address that names one opens that row on load and lands it
 * under the bar (`DocumentFolds`), as a "section N" link in the text does.
 *
 * A server component that reads the terms at build, so every word is fixed in
 * the prerendered page.
 */

export const terms = parseTerms(
  readFileSync(join(process.cwd(), "src/content/legal/terms-of-use.md"), "utf8"),
);

function piece(part: TermsInline, key: number): ReactNode {
  if (typeof part === "string") return <Fragment key={key}>{named(part)}</Fragment>;
  if ("b" in part) return <strong key={key}>{named(part.b)}</strong>;
  /* A command keeps its flags and short names whole, as code in the rows does. */
  if ("code" in part) {
    return (
      <DocCode key={key} breaks>
        {part.code}
      </DocCode>
    );
  }
  /* The address hands off to the mail client; the tab stays where it is. */
  if ("mail" in part) {
    return (
      <a key={key} href={`mailto:${part.mail}`}>
        {part.mail}
      </a>
    );
  }
  return (
    <a key={key} href={part.href}>
      {named(part.text)}
    </a>
  );
}

const text = (parts: readonly TermsInline[]): ReactNode => parts.map(piece);

function block(item: TermsBlock, key: number): ReactNode {
  switch (item.kind) {
    case "p":
      return <p key={key}>{text(item.text)}</p>;
    case "label":
      return (
        <p key={key} className="pp-k">
          {named(item.text)}
        </p>
      );
    case "ul":
      return (
        <ul key={key}>
          {item.items.map((entry, index) => (
            <li key={index}>{text(entry)}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <DocCallout key={key} title={item.title ? named(item.title) : undefined} legal>
          <p>{text(item.text)}</p>
        </DocCallout>
      );
  }
}

export function TermsOfUse(): React.JSX.Element {
  const byNumber = new Map(terms.sections.map((section) => [Number(section.number), section]));
  return (
    <DocumentPage hero={termsCopy.hero} assessmentRow={false}>
      <DocRows
        frame="rows"
        top={
          <div className="pp-prose">
            <p className="pp-date">{terms.effective}</p>
            {terms.intro.map((paragraph, index) => (
              <p key={index}>{text(paragraph)}</p>
            ))}
            {/* The short version: a paragraph title, not a heading, so the outline starts at the groups. */}
            <div className="pp-short" id="short-version">
              <p className="pp-short-t">The short version</p>
              <ul>
                {terms.short.map((entry, index) => (
                  <li key={index}>{text(entry)}</li>
                ))}
              </ul>
            </div>
          </div>
        }
        groups={termsCopy.groups.map((group) => ({
          id: group.id,
          title: group.title,
          chip: group.title,
          rows: group.clauses.map((n) => {
            const section = byNumber.get(n)!;
            /* "14": the row's numeral is the clause's number, which the terms cross-refer by. */
            return (
              <DocRow id={section.id} n={n} title={named(section.title)} prose key={section.id}>
                {section.blocks.map(block)}
              </DocRow>
            );
          }),
        }))}
      />
    </DocumentPage>
  );
}
