import type { ReactNode } from "react";

/**
 * What a guide says first, at the top of its column: a list of terms and
 * their text, ruled above and under each row,
 * `180px | text` from 641px, each term running into its text on a phone.
 *
 * 🔴 NOT HEADINGS. The terms are `dt`: the list summarises the sections below
 * it, and headings here would add entries to the page's outline above the
 * sections they summarise.
 */

export interface SummaryEntry {
  readonly term: string;
  /** One paragraph per entry; the second sits 8px under the first. */
  readonly paragraphs: readonly ReactNode[];
}

export function DocSummary({
  entries,
}: {
  readonly entries: readonly SummaryEntry[];
}): React.JSX.Element {
  return (
    <dl className="doc-sum">
      {entries.map((entry) => (
        <div key={entry.term}>
          <dt>{entry.term}</dt>
          <dd>
            {entry.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
