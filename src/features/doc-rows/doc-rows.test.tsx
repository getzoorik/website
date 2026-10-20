import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { DocRelated, DocRow, DocRows, DocUpdated, LinkRow } from "@/features/doc-rows/doc-rows";
import { DocPlaceholder } from "@/features/documents/doc-placeholder";
import { DocTable } from "@/features/documents/prose";

/**
 * The numbered rows in groups, the one frame the FAQs, the guides, /terms,
 * /security and /learn share: the three frames' classes, a row's summary, a
 * link row, and the sheet's place. Each page's own test covers its content.
 */

const group = (id: string, rows: React.ReactNode) => ({ id, title: id, chip: id, rows });

describe("DocRows", () => {
  it("draws the FAQ's frame: chips ahead of the column, what stays open first, then the groups", () => {
    const { container } = render(
      <DocRows
        top={<DocUpdated>Updated 9 October 2026</DocUpdated>}
        groups={[
          group(
            "one",
            <DocRow id="q" n={1} title="Q?">
              A
            </DocRow>,
          ),
        ]}
        end={<p className="fq-dl">Download</p>}
      />,
    );
    const article = container.querySelector(".sec.doc-body > .wrap > nav.fq-chips + article")!;
    expect(article.className).toBe("doc-main fq-main");
    expect([...article.children].map((child) => child.className)).toEqual([
      "fq-upd",
      "fq-sec",
      "fq-dl",
    ]);
    const section = article.querySelector("section#one")!;
    expect(section).toHaveAttribute("aria-labelledby", "one-h");
    expect(
      section.querySelector(":scope > h2#one-h + .fq-sec-b > .fq-list > details.fq"),
    ).not.toBeNull();
  });

  it("draws the rows' frame with gd-main and gd-top, and the closing line in gd-foot", () => {
    const { container } = render(
      <DocRows
        frame="rows"
        top={<p>open</p>}
        groups={[group("one", null), group("two", null)]}
        foot={<p className="ln-foot">foot</p>}
      />,
    );
    const article = container.querySelector("article")!;
    expect(article.className).toBe("doc-main fq-main gd-main");
    expect(article.firstElementChild!.className).toBe("fq-upd gd-top");
    expect(article.lastElementChild!.className).toBe("fq-upd gd-foot");
    expect(
      [...container.querySelectorAll(".fq-chips a")].map((a) => a.getAttribute("href")),
    ).toEqual(["#one", "#two"]);
  });

  it("draws the guides' frame with gd-main and a plain open block, a lede over the rows and a Related line after", () => {
    const { container } = render(
      <DocRows
        frame="guide"
        top={<p>open</p>}
        groups={[
          {
            ...group(
              "one",
              <DocRow id="r" n={1} title="Row" prose>
                body
              </DocRow>,
            ),
            lede: "Lede.",
            after: (
              <DocRelated
                links={[
                  { text: "A", href: "/a" },
                  { text: "B", href: "/b" },
                ]}
              />
            ),
          },
        ]}
      />,
    );
    expect(container.querySelector("article")!.className).toBe("doc-main fq-main gd-main");
    expect(container.querySelector("article > .fq-upd")!.className).toBe("fq-upd");
    const body = container.querySelector(".fq-sec-b")!;
    expect([...body.children].map((child) => child.className)).toEqual([
      "gd-lede",
      "fq-list",
      "doc-related",
    ]);
    expect(body.querySelector(".doc-related")!.textContent).toBe("Related: A · B");
  });
});

describe("a row", () => {
  it("is a closed details: its numeral hidden from screen readers, its h3, a chevron; then its body", () => {
    const { container } = render(
      <DocRow id="who-we-are" n={7} title="Who we are" prose>
        <p>Text</p>
      </DocRow>,
    );
    const row = container.querySelector("details#who-we-are")!;
    expect(row.className).toBe("fq gd-row");
    expect(row).not.toHaveAttribute("open");
    const summary = row.querySelector(":scope > summary")!;
    expect([...summary.children].map((child) => child.tagName.toLowerCase())).toEqual([
      "span",
      "h3",
      "svg",
    ]);
    expect(summary.querySelector(".fq-n")).toHaveAttribute("aria-hidden", "true");
    expect(summary.querySelector(".fq-n")!.textContent).toBe("07");
    expect(row.querySelector(":scope > .fq-body")!.className).toBe("fq-body doc-prose");
  });

  it("is one link on /learn: numeral, title, line and date, an arrow where the chevron goes", () => {
    const { container } = render(
      <LinkRow href="/learn/x" n={3} title="Title" line="Line." updated="Updated 9 October 2026" />,
    );
    const row = container.querySelector("a.ln-row")!;
    expect(row).toHaveAttribute("href", "/learn/x");
    expect([...row.children].map((child) => child.getAttribute("class"))).toEqual([
      "fq-n",
      "ln-rt",
      "ln-go",
    ]);
    expect(
      [...row.querySelector(".ln-rt")!.children].map((child) => child.tagName.toLowerCase()),
    ).toEqual(["h3", "span", "span"]);
  });
});

describe("the pieces the rows share with the documents kit", () => {
  it("prints a placeholder's “To come: ” as its own text, kept out of search snippets", () => {
    const { container } = render(<DocPlaceholder>the console address</DocPlaceholder>);
    const ph = container.querySelector("span.ph")!;
    expect(ph).toHaveAttribute("data-nosnippet");
    expect(ph.innerHTML).toBe('<span class="ph-k">To come: </span>the console address');
  });

  it("leaves an empty table cell empty, so a stacked nw-tbl hides it", () => {
    const { container } = render(
      <DocTable
        className="nw-tbl"
        columns={[{ label: "A" }, { label: "B" }]}
        rows={[["one", null]]}
      />,
    );
    expect(container.querySelector("table")!.className).toBe("doc-tbl nw-tbl");
    const cells = [...container.querySelectorAll("td")];
    expect(cells.map((cell) => cell.innerHTML)).toEqual(["<div>one</div>", ""]);
    expect(cells[1]).toHaveAttribute("data-label", "B");
  });

  it("loads its sheet after the privacy page's, as the mocks order them", () => {
    const globals = readFileSync("src/app/globals.css", "utf8");
    expect(globals.indexOf('"../styles/doc-rows.css"')).toBeGreaterThan(
      globals.indexOf('"../styles/privacy.css"'),
    );
  });
});
