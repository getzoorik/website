import { Fragment, type ReactNode } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import {
  privacy,
  privacyShortVersionId,
  type PolicyBlock,
  type PolicyCell,
  type PolicyInline,
  type PolicySection,
  type PolicyText,
} from "@/content/privacy";
import { DocumentBody } from "@/features/documents/document-body";
import { DocumentPage } from "@/features/documents/document-page";
import { DocCallout, DocCode, DocProse, DocSection, DocTable } from "@/features/documents/prose";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * `/privacy`: the privacy policy, drawn from `src/content/privacy.ts` with the
 * documents section's kit, as `/coral-guide` is.
 *
 * The dark hero with the title and deck only, then the contents rail beside the
 * reading column: the date line, the opening paragraph, the short version's
 * box, and §1 to §15. No closing assessment row: a legal page ends on its last
 * section and the footer. A server component: every word is fixed at build, and
 * the page ships no script of its own.
 *
 * 🔴 §15'S ID IS `contact`, THE SAME ID AS THE ASSESSMENT ROW'S DARK CARD. That
 * is why the row cannot come back here: the id would be on the page twice, and
 * every "section 15" would land on the wrong one.
 *
 * Where this page and the mock differ, on purpose:
 *  - "(section 7(a) of the Act)" in §4 stays text: it is the DPDP Act's section,
 *    not this policy's §7, which the mock links it to.
 *  - In "sections 4.1, 4.3 (your Amoeba organisation), 4.4 and 4.7" every number
 *    is a link, where the mock links only the first. 32 cross-links, not 30.
 *  - Every table cell's content sits in one wrapper (the kit's `DocTable`), so a
 *    stacked cell on a phone stays one block beside its label. The mock deals a
 *    mixed cell out across the label and content columns at 640px and below.
 *  - A command-line flag in inline code stays whole (the kit's `DocCode`, the
 *    guides' `.nb`), where the mock lets "--anonymize" break after its "--".
 */

function inline(piece: PolicyInline, key: number): ReactNode {
  if (typeof piece === "string") return <Fragment key={key}>{named(piece)}</Fragment>;
  /* A flag in it ("--now") stays whole: the kit's `DocCode`. */
  if ("code" in piece) return <DocCode key={key}>{piece.code}</DocCode>;
  if ("b" in piece) return <strong key={key}>{named(piece.b)}</strong>;
  /* The address hands off to the mail client; the tab stays where it is. */
  if ("mail" in piece) {
    return (
      <a key={key} href={`mailto:${piece.mail}`}>
        {piece.mail}
      </a>
    );
  }
  /* Off-site, so a new tab, `noopener`, the arrow and the hint a screen reader
     hears, in the mock's order. */
  if ("href" in piece) {
    return (
      <a key={key} href={piece.href} {...offSiteProps(piece.href)}>
        {piece.text}
        <ExternalArrow />
        <NewTabHint href={piece.href} />
      </a>
    );
  }
  return (
    <a key={key} href={`#${piece.ref}`}>
      {piece.text}
    </a>
  );
}

/** A run of text, as React children. */
function policyText(text: PolicyText): ReactNode {
  return typeof text === "string" ? named(text) : text.map(inline);
}

function list(items: readonly PolicyText[], key?: number): ReactNode {
  return (
    <ul key={key}>
      {items.map((item, index) => (
        <li key={index}>{policyText(item)}</li>
      ))}
    </ul>
  );
}

function cell(content: PolicyCell): ReactNode {
  return typeof content === "object" && "list" in content
    ? list(content.list)
    : policyText(content);
}

function block(item: PolicyBlock, key: number): ReactNode {
  switch (item.kind) {
    case "p":
      return <p key={key}>{policyText(item.text)}</p>;
    case "label":
      return (
        <p key={key} className="pp-k">
          {named(item.text)}
        </p>
      );
    case "ul":
      return list(item.items, key);
    case "h3":
      return (
        <h3 key={key} id={item.id}>
          {item.number} {named(item.title)}
        </h3>
      );
    case "callout":
      /* The one sentence that must stand out, and the two steps that stop
         Amoeba. */
      return (
        <DocCallout key={key} title={item.title ? named(item.title) : undefined}>
          {item.body.map(block)}
        </DocCallout>
      );
    case "table":
      return (
        <DocTable
          key={key}
          columns={item.columns.map((label) => ({ label }))}
          rows={item.rows.map((row) => row.map(cell))}
        />
      );
  }
}

/** "4. What we collect, and why": the number stays in the heading, because the policy cross-refers by it. */
function Section({ section }: { readonly section: PolicySection }): React.JSX.Element {
  return (
    <DocSection id={section.id} title={`${section.number}. ${section.title}`} labelled>
      {section.body.map(block)}
    </DocSection>
  );
}

export function PrivacyPolicy(): React.JSX.Element {
  const { hero, effective, intro, short, sections } = privacy;
  return (
    <DocumentPage hero={hero} assessmentRow={false}>
      {/* The contents name §1 to §15 by title alone, with no numbers. */}
      <DocumentBody
        contents={sections.map((section) => ({ id: section.id, label: section.title }))}
      >
        <p className="pp-date">{effective}</p>
        <p>{named(intro)}</p>
        {/* The short version: the summary, at the top of the column before §1.
            Its title is a paragraph, not a heading, so the outline starts at §1. */}
        <div className="pp-short" id={privacyShortVersionId}>
          <p className="pp-short-t">{short.title}</p>
          {list(short.items)}
        </div>
        <DocProse className="pp-prose">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </DocProse>
      </DocumentBody>
    </DocumentPage>
  );
}
