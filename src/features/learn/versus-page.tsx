import { Fragment } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { contactEmail } from "@/config/site";
import { versusCopy, type VersusPage as VersusEntry } from "@/content/learn-compare";
import {
  marketChecked,
  marketMarks,
  versusFacts,
  type VersusCell,
  type VersusFacts,
} from "@/content/learn-market";
import { products } from "@/content/products";
import { named } from "@/features/legal/named";
import { LearnFrame, LearnSection, OutGlyph } from "@/features/learn/learn-parts";
import { marketOurs, marketTool } from "@/features/learn/market-rows";
import { offSiteProps } from "@/lib/links";

/**
 * A versus page (`/compare/<slug>`, one per product): the hero, then At a glance (each one in its maker's words, ours
 * on navy, theirs with its own page), then Side by side (the rows, each claim about the other tool with its source
 * link, then the published pricing with its sources) and the fine print with the day it was checked, then the
 * closing row.
 *
 * Every fact is `learn-market.ts`'s, so the page and the market map can never disagree; our own side's cells carry no
 * link (they are our product's own facts), every one of theirs does. A server component with no script.
 *
 * ─── TWO DIFFERENCES FROM THE MOCK, BOTH FOR "EVERY CLAIM WITH ITS SOURCE" ───────────────────────────────────────
 *   - where a claim rests on several pages, the mock joins their addresses into one href (" ; "), which opens nothing:
 *     here each page is its own link, "source 1", "source 2" (`Sources`);
 *   - the mock prints the other tool's published pricing with no link: here it carries the pages it is read from, as
 *     the check's record gives them (`learn-market.ts`).
 */

/** A live versus page's facts; a page without them fails the build. */
export function versusFactsOf(slug: string): VersusFacts {
  const facts = versusFacts.find((entry) => entry.slug === slug);
  if (!facts) throw new Error(`The market data has no rows for the versus page "${slug}".`);
  return facts;
}

/** The address a link prints for a tool's own page: no scheme, no slash at either end (the mock's form). */
export const shownUrl = (url: string): string =>
  (url.split("//").pop() ?? url).replace(/^\/+|\/+$/g, "");

/**
 * The links to the pages a claim comes from: "source" for one page; "source 1", "source 2" where a claim rests on
 * several, one link per page (the mock joins them into one href, which no browser can open). The space before the
 * first is the caller's, at the end of its text, as the mock writes it; a space parts the rest.
 */
export function Sources({ urls }: { readonly urls: readonly string[] }): React.JSX.Element {
  return (
    <>
      {urls.map((url, index) => (
        <Fragment key={url}>
          {index > 0 ? " " : null}
          <a className="vx-src" href={url} {...offSiteProps(url)}>
            {urls.length > 1 ? `${versusCopy.source} ${index + 1}` : versusCopy.source}
            <OutGlyph />
            <NewTabHint href={url} />
          </a>
        </Fragment>
      ))}
    </>
  );
}

/**
 * One side of a row: the mark, then its word, " · " and what backs it, and its sources. The text
 * after the word is one string, the space before the links in it, as the mock's one text node.
 */
function Cell({ cell }: { readonly cell: VersusCell }): React.JSX.Element {
  const { key, glyph, word } = marketMarks[cell.mark];
  const after = `${cell.note ? ` · ${cell.note}` : ""}${cell.sources.length > 0 ? " " : ""}`;
  return (
    <>
      <span className={`vx vx-${key}`} aria-label={word}>
        {glyph}
      </span>
      <span className="vx-t">
        <b>{word}</b>
        {named(after)}
        <Sources urls={cell.sources} />
      </span>
    </>
  );
}

export function VersusPage({ page }: { readonly page: VersusEntry }): React.JSX.Element {
  const facts = versusFactsOf(page.slug);
  const tool = marketTool(facts.tool);
  const ours = marketOurs(page.product);
  const product = products[page.product].name;
  const { glance, table } = versusCopy;
  const fine = versusCopy.fine(facts.name, marketChecked);

  return (
    <LearnFrame
      hero={{
        kicker: versusCopy.kicker(marketChecked),
        title: named(page.meta.title),
        deck: named(page.meta.description),
      }}
    >
      <LearnSection id={glance.id} title={glance.title} lede={glance.lede}>
        <div className="vp-glance">
          <article className="vp-side vp-ours">
            <p className="vp-k">{named(ours.company)}</p>
            <h3>{named(product)}</h3>
            <p>{named(ours.line)}</p>
            {/* One span around the label: `named()` splits it at "Coral", and in this flex link each part would be its
                own item, with the gap between them. */}
            <a className="fx-read" href={ours.href}>
              <span>{named(glance.see(product))}</span> <Arrow />
            </a>
          </article>
          <article className="vp-side">
            <p className="vp-k">{tool.company}</p>
            <h3>{facts.name}</h3>
            <p>{facts.line}</p>
            <a className="vp-out" href={tool.url} {...offSiteProps(tool.url)}>
              {shownUrl(tool.url)} <OutGlyph />
              <NewTabHint href={tool.url} />
            </a>
          </article>
        </div>
      </LearnSection>
      <LearnSection id={table.id} title={table.title} lede={table.lede} band>
        <div className="vp-tw">
          <table className="vp-t">
            <caption className="sr-only">{named(table.caption(product, facts.name))}</caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">{named(product)}</th>
                <th scope="col">{facts.name}</th>
              </tr>
            </thead>
            <tbody>
              {facts.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>
                    <Cell cell={row.ours} />
                  </td>
                  <td>
                    <Cell cell={row.theirs} />
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row">{facts.pricing.label}</th>
                <td>
                  <span className="vx-t">{named(facts.pricing.ours)}</span>
                </td>
                <td>
                  <span className="vx-t">
                    {`${facts.pricing.theirs} `}
                    <Sources urls={facts.pricing.sources} />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="vp-fine">
          {fine.before}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          {fine.after}
        </p>
      </LearnSection>
    </LearnFrame>
  );
}
