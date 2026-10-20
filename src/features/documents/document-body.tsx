import type { ReactNode } from "react";

import {
  ContentsDisclosure,
  ContentsRail,
  type ContentsItem,
} from "@/features/documents/document-contents";

/**
 * The reading layout between a document's hero and its closing row:
 *
 *   .sec.doc-body > .wrap > .doc-layout:
 *     rail (from 981px) | article.doc-main: folded contents (below 981px), then the children
 *
 * The grid is `228px / up to 720px` with a 64px gap; the reading column is at
 * most 720px wide. The children are what the column holds: the guide's summary
 * list and its prose, or /privacy's date line, opening, short version and prose.
 *
 * 🔴 IT IS A `.sec`, AS IN THE MOCKS. The site system's `.sec + .sec` takes the
 * top padding off the closing row that follows it, so the row sits as close
 * under the last section as the mock draws it.
 */

export interface DocumentBodyProps {
  /** The sections the contents list, in document order. */
  readonly contents: readonly ContentsItem[];
  readonly children: ReactNode;
}

export function DocumentBody({ contents, children }: DocumentBodyProps): React.JSX.Element {
  return (
    <div className="sec doc-body">
      <div className="wrap">
        <div className="doc-layout">
          <ContentsRail items={contents} />
          <article className="doc-main">
            <ContentsDisclosure items={contents} />
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
