import { Arrow } from "@/components/primitives/arrow";
import { routes } from "@/config/site";
import {
  openSourceGuides,
  openSourceUpdated,
  type GuideBlock,
  type OpenSourceGuideId,
} from "@/content/open-source";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { OsCommandWell } from "@/features/open-source/os-command-well";
import { OsText } from "@/features/open-source/os-text";

/**
 * The three guides under /docs, in the article frame: each section's name beside its text, nothing folded.
 * The top line is "Updated 16 October 2026 · Published by Zoorik", then the short answer where there is one. Command
 * wells have "$ " on a command's first line only, and a Copy button; values, YAML and HCL blocks scroll sideways with
 * no prompt and no copy; tables stack on phones as the docs tables do. The foot is the related links, then the
 * closing row on Coral.
 */

/** A section's address: its name, lower-cased, words joined by hyphens. */
const slug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Block({ block }: { readonly block: GuideBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <OsText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <OsText text={item} />
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
                  <OsText text={item} />
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
                  <OsText text={label} />
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
                      <OsText text={cell} />
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

export function OsGuidePage({ id }: { readonly id: OpenSourceGuideId }): React.JSX.Element {
  const guide = openSourceGuides[id];
  return (
    <DocumentPage
      hero={{ title: named(guide.hero.title), deck: named(guide.hero.deck) }}
      product="coral"
    >
      <DocRows
        frame="article"
        top={
          <>
            <p className="doc-updated">
              Updated {openSourceUpdated} · Published by <a href={routes.about}>Zoorik</a>
            </p>
            {guide.short ? (
              <p className="ar-short">
                <OsText text={guide.short} />
              </p>
            ) : null}
          </>
        }
        groups={guide.sections.map((section) => {
          const sectionId = slug(section.title);
          return {
            id: sectionId,
            title: named(section.title),
            chip: named(section.title),
            body: section.blocks.map((block, index) => <Block block={block} key={index} />),
          };
        })}
        foot={
          <p className="nw-links">
            {guide.related.map((link) => (
              <a className="alink" href={link.href} key={link.href}>
                {named(link.text)}
                <Arrow />
              </a>
            ))}
          </p>
        }
      />
    </DocumentPage>
  );
}
