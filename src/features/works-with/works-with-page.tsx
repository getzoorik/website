import type { GuideBlock } from "@/content/open-source";
import { products } from "@/content/products";
import { worksWith, type WorksWithCopy } from "@/content/works-with";
import { DocRows, UnnumberedRow } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { RichText, richText } from "@/features/documents/rich-text";
import { Block, sectionSlug } from "@/features/open-source/os-guide-page";

/**
 * The six works-with pages (`/coral-works-with-<tool>`), in the Helm guide's article frame (`DocRows`,
 * `frame="article"`): each section's name beside its text, the chips on a phone, nothing else in the column.
 *
 *   hero            "Works with" over the h1 (`.hero-ey`), then the short answer as the deck; no Updated line
 *   #who-does-what  the docs' table: Job / <tool> / Coral, stacked on a phone
 *   #together       the guides' numbered steps (01, 02 in the accent)
 *   #leaves         what Coral leaves to the tool (What stays yours on Helm and Terraform), bullets with bold lead-ins
 *   #setup          bullets with bold lead-ins
 *   #questions      /pricing's rows: the FAQ's, closed, with no number column (`.pr-faq`), the column not prose
 *   #read-more      each link inline, then what it holds
 *   closing row     the site's, on Coral (`/assessment?p=coral`)
 *
 * The text is set as the mocks' `inline()` sets it (`richText`, as on /trust and /pricing): inline code whole, with
 * no break points, where the guides break it (`OsText`). These pages are not under Docs, so the header marks nothing.
 * A link to a question opens it (`DocumentFolds`, in the frame). No figure and no price: the copy holds none.
 */

/** Who does what's columns, as the mock sets them. */
const WHO_WIDTHS = ["24%", "38%", "38%"] as const;

/** A section of text: its anchor, its name, and its blocks as the guides draw them. */
function textGroup(id: string, title: string, blocks: readonly GuideBlock[]) {
  return {
    id,
    title: richText(title),
    /* A chip is plain text, as the mocks draw it: a name's span inside a chip loses the space before it. */
    chip: title,
    body: blocks.map((block, index) => <Block block={block} Text={RichText} key={index} />),
  };
}

export function WorksWithPage({ page }: { readonly page: WorksWithCopy }): React.JSX.Element {
  return (
    <DocumentPage
      hero={{
        eyebrow: worksWith.eyebrow,
        title: richText(page.hero.title),
        deck: richText(page.hero.deck),
      }}
      product="coral"
    >
      <DocRows
        frame="article"
        groups={[
          textGroup("who-does-what", worksWith.who.title, [
            {
              kind: "table",
              head: [worksWith.who.job, page.who.tool, products.coral.name],
              rows: page.who.rows,
              widths: WHO_WIDTHS,
            },
          ]),
          textGroup("together", worksWith.together, [{ kind: "steps", items: page.together }]),
          textGroup("leaves", page.leaves.title, [{ kind: "ul", items: page.leaves.items }]),
          textGroup("setup", worksWith.setup, [{ kind: "ul", items: page.setup }]),
          {
            id: "questions",
            title: worksWith.questions,
            chip: worksWith.questions,
            unnumbered: true,
            /* Each addressed as the mocks address a row: the question's first seven words. */
            rows: page.questions.map(({ question, answer }) => (
              <UnnumberedRow id={sectionSlug(question)} title={richText(question)} key={question}>
                {answer.map((text) => (
                  <p key={text}>{richText(text)}</p>
                ))}
              </UnnumberedRow>
            )),
          },
          textGroup("read-more", worksWith.readMore, [{ kind: "ul", items: page.readMore }]),
        ]}
      />
    </DocumentPage>
  );
}
