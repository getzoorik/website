import type { ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import type { CalculatorBlock, CalculatorCopy } from "@/content/calculators";
import { pricesRetrieved } from "@/content/cloud-prices";
import type { ProductId } from "@/content/products";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { ChevronGlyph } from "@/features/documents/document-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { richText } from "@/features/documents/rich-text";
import { sectionSlug } from "@/features/open-source/os-guide-page";

import type { ReferenceTable } from "./reference-tables";

/**
 * A calculator's page, in the tools hub's family (the two calculators at /eks-and-aks-pricing-calculator and
 * /ebs-and-azure-disk-pricing):
 *
 *   hero          the title and one line
 *   calculator    the two paragraphs, the form and its result side by side (stacked below 900px), then the formula
 *                 and the prices' sources with their day
 *   the frame     Worked example, How the calculator works, Sources (with the reference tables, closed) and Related
 *                 reading, each section's name beside its text: the guides' article frame
 *   closing row   one line on what the page was and where the reader's own figure is, then the site's row for the
 *                 calculator's product
 *
 * The calculator itself is the one client island (`NodeCalculator`, `DiskCalculator`); everything else is fixed at
 * build. A month is 730 hours.
 */

function Blocks({ blocks }: { readonly blocks: readonly CalculatorBlock[] }): ReactNode {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "p":
        return <p key={index}>{richText(block.text)}</p>;
      case "h3":
        return <h3 key={index}>{richText(block.text)}</h3>;
      case "ul":
        return (
          <ul key={index}>
            {block.items.map((item) => (
              <li key={item}>{richText(item)}</li>
            ))}
          </ul>
        );
    }
  });
}

/** A reference table: the docs' table, its widths the mock's, stacked on a phone with each cell labelled. */
function Table({ table }: { readonly table: ReferenceTable }): React.JSX.Element {
  return (
    <>
      <h4>{richText(table.title)}</h4>
      <table className="doc-tbl nw-tbl" role="table">
        <colgroup>
          {table.widths.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead role="rowgroup">
          <tr role="row">
            {table.head.map((label) => (
              <th scope="col" role="columnheader" key={label}>
                {richText(label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {table.rows.map((cells, row) => (
            <tr role="row" key={row}>
              {cells.map((cell, index) => (
                <td role="cell" data-label={table.head[index]} key={index}>
                  <div>{richText(cell)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note ? <p>{richText(table.note)}</p> : null}
    </>
  );
}

export function CalculatorPage({
  copy,
  product,
  tablesLabel,
  tables,
  children,
}: {
  readonly copy: CalculatorCopy;
  /** The closing row's product: Coral for nodes, Amoeba for disks. */
  readonly product: ProductId;
  /** The reference tables' fold, before its day: "List prices and reserves". */
  readonly tablesLabel: string;
  readonly tables: readonly ReferenceTable[];
  /** The calculator: the form and its result. */
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: richText(copy.hero.title), deck: richText(copy.hero.deck) }}
      product={product}
      assessmentLead={richText(copy.close)}
    >
      <section className="sec" id="calculator" aria-labelledby="calculator-h">
        <div className="wrap">
          {/* The section's h2, for the outline only: the node result's h3s would otherwise follow the h1. */}
          <h2 className="sr-only" id="calculator-h">
            Calculator
          </h2>
          <div className="calc-intro">
            {copy.intro.map((line) => (
              <p key={line}>{richText(line)}</p>
            ))}
          </div>
          {children}
          <p className="mk-note calc-src">
            {richText(copy.method)} {richText(copy.sourceFirst)}
          </p>
        </div>
      </section>
      <DocRows
        frame="article"
        groups={copy.frame.map((section) => ({
          id: sectionSlug(section.title),
          title: richText(section.title),
          chip: section.title,
          body: section.related ? (
            <p className="nw-links">
              {section.related.map((link) => (
                <a className="alink" href={link.href} key={link.href}>
                  {/* An .alink is a flex row: its words go in one span, so a name's span takes no gap of its own. */}
                  <span>{richText(link.text)}</span>
                  <Arrow />
                </a>
              ))}
            </p>
          ) : (
            <>
              <Blocks blocks={section.blocks ?? []} />
              {section.title === "Sources" ? (
                <details className="fq gd-row" id="list-prices">
                  <summary>
                    <h3>{`${tablesLabel}, ${pricesRetrieved}`}</h3>
                    <ChevronGlyph className="fq-chev" />
                  </summary>
                  <div className="fq-body doc-prose">
                    {tables.map((table) => (
                      <Table table={table} key={table.title} />
                    ))}
                  </div>
                </details>
              ) : null}
            </>
          ),
        }))}
      />
    </DocumentPage>
  );
}
