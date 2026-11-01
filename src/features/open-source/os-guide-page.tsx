import type { ComponentType } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { routes } from "@/config/site";
import { openSourceUpdated, type GuideBlock, type OpenSourceGuide } from "@/content/open-source";
import type { ProductId } from "@/content/products";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { OsCommandWell } from "@/features/open-source/os-command-well";
import { OsText } from "@/features/open-source/os-text";

/**
 * The guides in the article frame: the three install and contributing guides under /docs and the two
 * troubleshooting pages. Each section's name beside its text, nothing folded.
 * The top line is "Updated 1 November 2026 · Published by Zoorik" (the guide's own date where it has one), then the
 * short answer where there is one. Command
 * wells have "$ " on a command's first line only, and a Copy button; values, YAML and HCL blocks scroll sideways with
 * no prompt and no copy; tables stack on phones as the docs tables do. The foot is the related links, then the
 * closing row on the guide's product (Coral unless it names another), or on both (`about={null}`: Contributing, whose
 * repositories serve both products).
 */

/**
 * A section's address, as the mocks' `slug()` makes it: its first seven words, lower-cased and joined by hyphens,
 * apostrophes dropped ("Read why a shrink can’t run" is `read-why-a-shrink-cant-run`).
 */
export const sectionSlug = (title: string): string =>
  (
    title
      .toLowerCase()
      .replace(/['’]/g, "")
      .match(/[a-z0-9]+/g) ?? []
  )
    .slice(0, 7)
    .join("-");

/**
 * One block of a guide's section, as the guides draw it. The works-with pages draw theirs with it too, their text set
 * by `RichText` (their mocks print inline code whole); a guide's is `OsText`, the default.
 */
export function Block({
  block,
  Text = OsText,
}: {
  readonly block: GuideBlock;
  readonly Text?: ComponentType<{ readonly text: string }>;
}) {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <Text text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <Text text={item} />
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="doc-steps" role="list">
          {block.items.map((item) => (
            <li key={item}>
              <div>
                <p>
                  <Text text={item} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "h3":
      return <h3>{named(block.text)}</h3>;
    case "cmd":
      return <OsCommandWell text={block.text} />;
    case "code":
      return (
        <div className="as-well doc-well is-yaml">
          <pre>{block.text}</pre>
        </div>
      );
    case "table":
      return (
        <table className="doc-tbl nw-tbl" role="table">
          <colgroup>
            {block.widths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead role="rowgroup">
            <tr role="row">
              {block.head.map((label) => (
                <th scope="col" role="columnheader" key={label}>
                  <Text text={label} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {block.rows.map((cells, row) => (
              <tr role="row" key={row}>
                {cells.map((cell, index) => (
                  <td role="cell" data-label={block.head[index]} key={index}>
                    <div>
                      <Text text={cell} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

export function OsGuidePage({
  guide,
  about = guide.product ?? "coral",
}: {
  readonly guide: OpenSourceGuide;
  /** The closing row's product, as the structured data's `osGuideEntry` takes it: `null` names both. */
  readonly about?: ProductId | null;
}): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: named(guide.hero.title), deck: named(guide.hero.deck) }}
      product={about ?? undefined}
    >
      <DocRows
        frame="article"
        top={
          <>
            <p className="doc-updated">
              Updated {guide.updated ?? openSourceUpdated} · Published by{" "}
              <a href={routes.about}>Zoorik</a>
            </p>
            {guide.short ? (
              <p className="ar-short">
                <OsText text={guide.short} />
              </p>
            ) : null}
          </>
        }
        groups={guide.sections.map((section) => {
          const sectionId = section.id ?? sectionSlug(section.title);
          return {
            id: sectionId,
            title: named(section.title),
            /* A chip is plain text, as the mocks draw it: a name's span inside a chip loses the space before it. */
            chip: section.chip ?? section.title,
            body: section.blocks.map((block, index) => <Block block={block} key={index} />),
          };
        })}
        foot={
          <p className="nw-links">
            {guide.related.map((link) => (
              <a className="alink" href={link.href} key={link.href}>
                {/* An .alink is a flex row: its words go in one span, so a name's span takes no gap of its own. */}
                <span>{named(link.text)}</span>
                <Arrow />
              </a>
            ))}
          </p>
        }
      />
    </DocumentPage>
  );
}
