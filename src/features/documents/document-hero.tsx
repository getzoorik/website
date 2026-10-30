import type { ReactNode } from "react";

import { TurningMark } from "@/components/brand/turning-mark";
import { SwitchItem } from "@/components/primitives/product-switch";
import { navMenus } from "@/config/site";
import { documents, type DocumentId } from "@/content/documents";
import type { ProductId } from "@/content/products";
import { documentFacts } from "@/features/documents/document-facts";
import { DownloadGlyph } from "@/features/documents/document-glyphs";

/**
 * The top of every document page, the utility hero: the dark `.hero` band
 * with no photograph, so the nav reads
 * white until it scrolls past it, as on every page. The turning Zoorik mark
 * (`TurningMark`) sits half past its right edge at the utility hero's size.
 *
 * Left: the h1, then on a guide or an FAQ "Choose a product" and the [Coral | Amoeba] switch, then the
 * deck. Right, on the guide and the case study: the download block, aligned to
 * the bottom of the text, stacked under it below 981px. `/docs` and `/privacy`
 * draw the h1 and the deck only. No eyebrow, breadcrumb, date line or second
 * line in the h1, except on the case study, which the mock gives a kicker over
 * its h1 and a second, green line inside it (`.cs-hero`), and on a glossary
 * term, whose kicker is its trail back to Learn and the glossary, with no deck
 * under its h1 (`.gl-hero`).
 */

/** One file in the download block: its label ("PDF") and the registry entry it reads. */
export interface HeroDownload {
  readonly label: string;
  readonly document: DocumentId;
}

/** The [Coral | Amoeba] switch: the same page for each product, and which one this is. */
export interface HeroSwitch {
  /** The row set in `navMenus` (site config) whose rows are these pages: "guide" or "faq"; the header no longer draws it. */
  readonly menu: "guide" | "faq";
  readonly current: ProductId;
}

export interface DocumentHeroProps {
  /** Plain text, or text whose product names are kept out of translation (`named()`). */
  readonly title: ReactNode;
  /** The line under the h1; a glossary term's page has none, its definition leads the column. */
  readonly deck?: ReactNode;
  /** A small line over the h1: the case study's kind, product and date, a glossary term's trail (`.cs-kick`). */
  readonly kicker?: ReactNode;
  /** A page's own class on the hero, beside `hero doc-hero` (the case study's `cs-hero`). */
  readonly className?: string;
  readonly productSwitch?: HeroSwitch;
  /** The files beside the text; none draws no block. */
  readonly downloads?: readonly HeroDownload[];
  /** Anything else beside the text, in the files' place (Value Lab's "Saved so far"). */
  readonly aside?: ReactNode;
  /** Buttons under the deck, in the home hero's row (`.hero-cta`): /pricing's assessment and Book a demo. */
  readonly actions?: ReactNode;
}

/**
 * The product switch: "Choose a product", then plain page
 * links, Coral first, the current one white, each with what it works on. The line names the switch for screen readers.
 * Its links are the guide or FAQ rows in `navMenus`, so a page the site holds back (`amoebaDocs`) is held back
 * here too, by the same one flag: while the Amoeba guide and FAQ are held, the switch shows Coral alone.
 */
function ProductSwitch({ menu, current }: HeroSwitch): React.JSX.Element {
  const rows = navMenus.find((entry) => entry.key === menu)?.rows ?? [];
  return (
    <>
      <p className="ax-pick" id="ax-pick">
        Choose a product
      </p>
      <nav className="as-switch ax-switch" aria-labelledby="ax-pick">
        {rows.map((row) => (
          <SwitchItem
            key={row.product}
            product={row.product}
            href={row.href}
            current={row.product === current}
          />
        ))}
      </nav>
    </>
  );
}

/**
 * The download block: one bordered block, one row per file. The facts are read
 * from the file at build ("11 pages · 0.3 MB", a no-break space between each
 * number and its unit); the accessible name carries them whole ("Download the
 * Coral product guide, PDF, 11 pages, 0.3 MB, A4").
 */
function DownloadBlock({
  downloads,
}: {
  readonly downloads: readonly HeroDownload[];
}): React.JSX.Element {
  return (
    <div className="dl">
      {downloads.map(({ label, document }) => {
        const facts = documentFacts(document);
        return (
          <a
            className="dl-r"
            href={documents[document].pdf}
            download
            aria-label={`Download ${documents[document].spokenName}, ${facts.spoken}`}
            key={document}
          >
            <DownloadGlyph />
            <span className="dl-t">{label}</span>
            <span className="dl-f">{facts.short}</span>
          </a>
        );
      })}
    </div>
  );
}

export function DocumentHero({
  title,
  deck,
  kicker,
  className,
  productSwitch,
  downloads = [],
  aside,
  actions,
}: DocumentHeroProps): React.JSX.Element {
  const text = (
    <>
      {kicker ? <p className="cs-kick">{kicker}</p> : null}
      <h1>{title}</h1>
      {productSwitch ? <ProductSwitch {...productSwitch} /> : null}
      {deck ? <p className="doc-deck">{deck}</p> : null}
      {actions}
    </>
  );

  return (
    <header className={className ? `hero doc-hero ${className}` : "hero doc-hero"} id="top">
      <TurningMark />
      <div className="wrap hero-in">
        {downloads.length > 0 || aside ? (
          <div className="doc-hero-grid">
            <div>{text}</div>
            {aside ?? <DownloadBlock downloads={downloads} />}
          </div>
        ) : (
          text
        )}
      </div>
    </header>
  );
}
