import { Fragment, type ReactNode } from "react";

import type { GuideBlock, GuideContent, GuideInline, GuideText } from "@/content/guide";
import type { ProductId } from "@/content/products";
import { DocRelated, DocRow, DocRows, DocUpdated } from "@/features/doc-rows/doc-rows";
import { DocCommandWell } from "@/features/documents/doc-command-well";
import { DocOsWell } from "@/features/documents/doc-os-well";
import { DocPlaceholder } from "@/features/documents/doc-placeholder";
import { DocSummary } from "@/features/documents/doc-summary";
import { DocumentPage } from "@/features/documents/document-page";
import { DocCallout, DocCode, DocSteps, DocSubhead, DocTable } from "@/features/documents/prose";

/**
 * A product guide on the web, laid out like the FAQ, shared by `/coral-guide`
 * and `/amoeba-guide`:
 *
 *   the utility hero (h1, the [Coral | Amoeba] switch, the deck, the PDF when
 *   there is one); over the groups, the Updated line and the summary list; then
 *   one group per section, its lede and callouts open over its numbered rows,
 *   and a Related line where the guide names one; then the closing row.
 *
 * Every row is closed on load; a cross-reference into a row, or an address
 * that names one, opens it (`DocumentFolds`). A server component: every word
 * and the PDF's facts are fixed at build. The client islands are the chips, the
 * install's OS switch, the one-line wells and the fold script.
 */

function piece<Id extends string>(item: GuideInline<Id>, key: number): ReactNode {
  if (typeof item === "string") return <Fragment key={key}>{item}</Fragment>;
  if ("code" in item) {
    return (
      <DocCode key={key} breaks>
        {item.code}
      </DocCode>
    );
  }
  if ("b" in item) return <b key={key}>{item.b}</b>;
  if ("ph" in item) return <DocPlaceholder key={key}>{item.ph}</DocPlaceholder>;
  if ("br" in item) return <br key={key} />;
  if ("sub" in item) {
    return (
      <Fragment key={key}>
        <br />
        <span className="sub">{item.sub}</span>
      </Fragment>
    );
  }
  if ("ref" in item) {
    return (
      <a key={key} href={`#${item.ref}`}>
        {item.text}
      </a>
    );
  }
  return (
    <a key={key} href={item.href}>
      {item.text}
    </a>
  );
}

/** A run of text, as React children. */
function guideText<Id extends string>(text: GuideText<Id>): ReactNode {
  return typeof text === "string" ? text : text.map(piece);
}

/**
 * A command well. A plain command is the kit's well (one line scrolls
 * sideways); a line that holds a placeholder is drawn here, server-side, and
 * wraps, with its `$ ` prompt and no copy button or note, as the mock skips
 * `is-line` for a well that holds one.
 */
function Well<Id extends string>({
  item,
}: {
  readonly item: Extract<GuideBlock<Id>, { kind: "well" }>;
}): React.JSX.Element {
  const plain = item.lines.filter((line): line is string => typeof line === "string");
  if (plain.length === item.lines.length) {
    return <DocCommandWell lines={plain} prompt={item.prompt} yaml={item.yaml} note={item.note} />;
  }
  return (
    <div className="as-well doc-well">
      <pre>
        {item.lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 ? "\n" : null}
            {item.prompt ? <i aria-hidden="true">{item.prompt}</i> : null}
            {guideText(line)}
          </Fragment>
        ))}
      </pre>
    </div>
  );
}

function block<Id extends string>(item: GuideBlock<Id>, key: number): ReactNode {
  switch (item.kind) {
    case "p":
      return <p key={key}>{guideText(item.text)}</p>;
    case "ul":
      return (
        <ul key={key}>
          {item.items.map((entry, index) => (
            <li key={index}>{guideText(entry)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key}>
          {item.items.map((entry, index) => (
            <li key={index}>{guideText(entry)}</li>
          ))}
        </ol>
      );
    case "subhead":
      return <DocSubhead key={key}>{item.title}</DocSubhead>;
    case "steps":
      return (
        <DocSteps
          key={key}
          steps={item.steps.map((step) => ({ title: step.title, body: blocks(step.body) }))}
        />
      );
    case "callout":
      return (
        <DocCallout key={key} title={item.title}>
          {blocks(item.body)}
        </DocCallout>
      );
    case "table":
      return (
        <DocTable
          key={key}
          columns={item.columns}
          continuation={item.continuation}
          rows={item.rows.map((row) => row.map(guideText))}
        />
      );
    case "well":
      return <Well key={key} item={item} />;
    case "os":
      return <DocOsWell key={key} options={item.options} />;
  }
}

function blocks<Id extends string>(items: readonly GuideBlock<Id>[]): ReactNode {
  return items.map(block);
}

export interface GuidePageProps<Id extends string> {
  readonly guide: GuideContent<Id>;
  readonly product: ProductId;
}

export function GuidePage<Id extends string>({
  guide,
  product,
}: GuidePageProps<Id>): React.JSX.Element {
  const { hero, updated, summary, sections } = guide;
  /* The numbers run on across the groups. */
  let n = 0;
  return (
    <DocumentPage
      product={product}
      hero={{
        title: hero.title,
        deck: hero.deck,
        productSwitch: { menu: "guide", current: product },
        downloads: hero.downloads,
      }}
    >
      <DocRows
        frame="guide"
        top={
          <>
            <DocUpdated>{updated}</DocUpdated>
            <DocSummary
              entries={summary.map((entry) => ({
                term: entry.term,
                paragraphs: entry.text.map(guideText),
              }))}
            />
          </>
        }
        groups={sections.map((section) => ({
          id: section.id,
          title: section.title,
          chip: section.title,
          lede: guideText(section.lede),
          callouts: section.callouts ? blocks(section.callouts) : null,
          rows: section.rows.map((row) => (
            <DocRow id={row.id} n={++n} title={row.title} prose key={row.id}>
              {blocks(row.body)}
            </DocRow>
          )),
          after: section.related ? <DocRelated links={section.related} /> : null,
        }))}
      />
    </DocumentPage>
  );
}
