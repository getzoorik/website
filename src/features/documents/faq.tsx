import { Fragment } from "react";

import { documents } from "@/content/documents";
import type { FaqDownload, FaqSection, FaqText } from "@/content/faq";
import { DocRow, DocRows, DocUpdated } from "@/features/doc-rows/doc-rows";
import { DocPlaceholder } from "@/features/documents/doc-placeholder";
import { documentFacts } from "@/features/documents/document-facts";
import { DownloadGlyph } from "@/features/documents/document-glyphs";
import { DocCallout, DocCode } from "@/features/documents/prose";

/**
 * The body of an FAQ page, `/coral/faq` and `/amoeba/faq`: a page of questions
 * that open in place, all closed on load,
 * in the numbered rows' frame (`DocRows`).
 *
 *   the Updated line over the questions' column;
 *   section.fq-sec#<group> > h2, .fq-sec-b > the callout (if any), .fq-list > details.fq#<question>
 *   then p.fq-dl, the one download line, when the FAQ has a PDF
 *
 * A question's summary is its numeral ("01", hidden from screen readers; the
 * numbers run on across the groups), the h3 and a chevron; its body is the
 * short answer's bullets.
 *
 * An FAQ with no PDF (Amoeba's) ends after its last question: no download line
 * and no "to come" row.
 */

export interface FaqProps<Id extends string> {
  readonly updated: string;
  readonly sections: readonly FaqSection<Id>[];
  readonly download?: FaqDownload;
}

/**
 * A line of FAQ text. A `ph` segment is a fact still to come; a `code` segment
 * keeps its flags whole, as the mock does.
 */
function FaqLine({ text }: { readonly text: FaqText }): React.JSX.Element {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((part, index) => {
        if (typeof part === "string") return <Fragment key={index}>{part}</Fragment>;
        if ("b" in part) return <b key={index}>{part.b}</b>;
        if ("code" in part) {
          return (
            <DocCode key={index} breaks>
              {part.code}
            </DocCode>
          );
        }
        if ("ph" in part) return <DocPlaceholder key={index}>{part.ph}</DocPlaceholder>;
        return (
          <a href={part.href} key={index}>
            {part.text}
          </a>
        );
      })}
    </>
  );
}

/** The one download line after the last group: "Download", then the PDF with its facts. */
function FaqDownloadLine({ label, document }: FaqDownload): React.JSX.Element {
  const facts = documentFacts(document);
  return (
    <p className="fq-dl">
      <span>Download</span>
      <a
        className="fq-dl-a"
        href={documents[document].pdf}
        download
        aria-label={`Download ${documents[document].spokenName}, ${facts.spoken}`}
      >
        <DownloadGlyph />
        {label}
        <small>{facts.short}</small>
      </a>
    </p>
  );
}

export function Faq<Id extends string>({
  updated,
  sections,
  download,
}: FaqProps<Id>): React.JSX.Element {
  /* The numbers run on across the groups. */
  let n = 0;
  return (
    <DocRows
      top={<DocUpdated>{updated}</DocUpdated>}
      groups={sections.map((section) => ({
        id: section.id,
        title: section.title,
        chip: section.title,
        callouts: section.callout ? (
          <DocCallout title={section.callout.title}>
            <p>
              <FaqLine text={section.callout.text} />
            </p>
          </DocCallout>
        ) : null,
        rows: section.questions.map((question) => (
          <DocRow id={question.id} n={++n} title={question.question} key={question.id}>
            <ul className="fq-a">
              {question.short.map((line, index) => (
                <li key={index}>
                  <FaqLine text={line} />
                </li>
              ))}
            </ul>
          </DocRow>
        )),
      }))}
      end={download ? <FaqDownloadLine {...download} /> : null}
    />
  );
}
