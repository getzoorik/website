import type { ReactNode } from "react";

import { documents } from "@/content/documents";
import { trustPage, trustUpdated, type TrustBlock, type TrustItem } from "@/content/trust";
import { DocumentBody } from "@/features/documents/document-body";
import { documentFacts } from "@/features/documents/document-facts";
import { DocumentPage } from "@/features/documents/document-page";
import { DocProse, DocTable } from "@/features/documents/prose";
import { plainText, richText } from "@/features/documents/rich-text";

/**
 * `/trust`: the Trust center, on /privacy's frame. The dark hero with the title and the deck, then the On this page
 * rail beside the reading column (folded at the top of the column below 981px): the Updated line, the opening
 * paragraph, and the four sections. The rail lists the security overview's six parts under it, one step in. No
 * closing assessment row: like the legal pages it ends on its last section and the footer.
 *
 * The DPA's download line prints the file's own pages and size, read at build as every PDF row on the site is, and
 * its accessible name carries them whole ("Download the data processing agreement, version 1.0, PDF, 7 pages, 0.1 MB,
 * A4"). The sub-processors are /privacy's table, which stacks on a phone. A server component: every word is fixed at
 * build, and the page ships no script of its own beyond the rail's.
 */

/** A list item: a run of text, or the DPA's download and its facts. */
function Item({ item }: { readonly item: TrustItem }): ReactNode {
  if (typeof item === "string") return richText(item);
  const document = documents[item.download];
  const facts = documentFacts(item.download);
  return (
    <>
      <a
        href={document.pdf}
        download
        aria-label={`Download ${document.spokenName}, ${facts.spoken}`}
      >
        {item.text}
      </a>
      {` · ${facts.short}`}
    </>
  );
}

function Block({ block }: { readonly block: TrustBlock }): ReactNode {
  switch (block.kind) {
    case "p":
      return <p>{richText(block.text)}</p>;
    case "h3":
      return <h3 id={block.id}>{richText(block.text)}</h3>;
    case "h4":
      return <h4>{richText(block.text)}</h4>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <Item item={item} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <DocTable
          className="pp-tbl"
          columns={block.head.map((label) => ({ label: plainText(label), head: richText(label) }))}
          rows={block.rows.map((row) => row.map((cell) => richText(cell)))}
        />
      );
  }
}

export function TrustPage(): React.JSX.Element {
  const { hero, intro, sections } = trustPage;
  return (
    <DocumentPage
      hero={{ title: richText(hero.title), deck: richText(hero.deck) }}
      assessmentRow={false}
    >
      <DocumentBody
        contents={sections.map((section) => ({
          id: section.id,
          label: plainText(section.title),
          children: section.blocks.flatMap((block) =>
            block.kind === "h3" && block.id ? [{ id: block.id, label: plainText(block.text) }] : [],
          ),
        }))}
      >
        <p className="doc-updated">{trustUpdated}</p>
        <DocProse className="pp-prose tr-prose">
          <p>{richText(intro)}</p>
          {sections.map((section) => (
            <section id={section.id} aria-labelledby={`${section.id}-h`} key={section.id}>
              <h2 id={`${section.id}-h`}>{richText(section.title)}</h2>
              {section.blocks.map((block, index) => (
                <Block block={block} key={index} />
              ))}
            </section>
          ))}
        </DocProse>
      </DocumentBody>
    </DocumentPage>
  );
}
