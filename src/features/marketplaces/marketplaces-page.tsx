import type { ReactNode } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ChannelIcon } from "@/components/primitives/install-buttons";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import { storesListing, type MarketplaceId } from "@/config/marketplaces";
import {
  marketplacesPage,
  type MarketplacesIcon,
  type MarketplacesLink,
} from "@/content/marketplaces";
import { productOrder, products } from "@/content/products";
import { ArrowOutGlyph, DocGlyph } from "@/features/documents/document-glyphs";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { MailGlyph, PackageGlyph } from "@/features/programs/program-glyphs";
import {
  AskCard,
  ProgramPair,
  ProgramSection,
  programMailto,
} from "@/features/programs/program-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/marketplaces`, where to find Zoorik, as the program pages draw theirs (the documents' frame):
 *
 *   hero                 the page's name and its line
 *   the pair             on the band: every listing as a row on the white card, "<product> on <store>" with the store's
 *                        mark, Coral's first; a private offer on the navy one, a ready email to the founders
 *   Reviews              G2's two pages, two to a row
 *   Install from         the six registries Zoorik publishes on, each with its own icon
 *   Find us on the web   the company's profiles
 *
 * Only real listings link, every one read from config, each in a new tab, and no rating or review count is printed.
 * What does not apply is not drawn. No closing assessment row (the mock ends on Find us on the web). The pair rises
 * as it arrives; nothing else moves but hover.
 */

const { hero, band, reviews, install, web } = marketplacesPage;

/** Each store's mark on its row, as the mock's sprite draws it (`i-p-aws`, `i-p-azure`), sized by `.mp-m`. */
const STORE_MARKS: Readonly<Record<MarketplaceId, (key: string) => ReactNode>> = {
  aws: () => <AwsMark className="mp-m" />,
  microsoft: (key) => <AzureMark className="mp-m" idSuffix={key} />,
};

/** A tile's icon: the registry's own line icon, or the document glyph, at the tile icon's size. */
function TileIcon({ icon }: { readonly icon: MarketplacesIcon }): React.JSX.Element {
  return icon === "doc" ? (
    <DocGlyph className="dt-ic cp-ic" />
  ) : (
    <ChannelIcon channel={icon} className="dt-ic cp-ic" />
  );
}

/** The white card: its mark, title and line, then every listing as a row, each in a new tab. First to rise. */
function Listings(): React.JSX.Element {
  const { buy } = band;
  return (
    <Reveal className="as-card as-mini cp-w mp-c" order={0}>
      <PackageGlyph className="cp-own cp-own-l" />
      <h2 className="as-h">{buy.title}</h2>
      <p>{buy.line}</p>
      <ul className="mp-list">
        {productOrder.flatMap((product) =>
          storesListing(product).map((store) => {
            const href = store.listings[product]!;
            return (
              <li key={`${product}-${store.id}`}>
                <a className="mp-l" href={href} {...offSiteProps(href)}>
                  {STORE_MARKS[store.id](`mp-${product}`)}
                  <span>
                    <b>{named(products[product].name)}</b>
                    {buy.on}
                    {store.name}
                  </span>
                  <ArrowOutGlyph className="dt-go" />
                  <NewTabHint href={href} />
                </a>
              </li>
            );
          }),
        )}
      </ul>
    </Reveal>
  );
}

/** A section of tiles, each another site's page in a new tab. */
function Places({
  id,
  title,
  links,
  className,
}: {
  readonly id: string;
  readonly title: string;
  readonly links: readonly MarketplacesLink[];
  readonly className: string;
}): React.JSX.Element {
  return (
    <ProgramSection id={id} title={title}>
      <div className={`dt-grid ${className}`}>
        {links.map((link) => (
          <LinkTile
            key={link.href}
            href={link.href}
            icon={<TileIcon icon={link.icon} />}
            title={named(link.name)}
            line={named(link.line)}
          />
        ))}
      </div>
    </ProgramSection>
  );
}

export function MarketplacesPage(): React.JSX.Element {
  const { offer } = band;
  return (
    <DocumentPage hero={{ title: named(hero.title), deck: named(hero.deck) }} assessmentRow={false}>
      <ProgramPair>
        <Listings />
        <AskCard
          mark={<MailGlyph className="cp-own" />}
          title={offer.title}
          line={offer.line}
          go={{ label: offer.write.label, href: programMailto(offer.write.subject) }}
        />
      </ProgramPair>
      <Places {...reviews} className="mp-2" />
      <Places {...install} className="cp-3" />
      <Places {...web} className="cp-3" />
    </DocumentPage>
  );
}
