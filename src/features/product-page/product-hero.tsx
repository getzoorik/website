import type { JSX } from "react";

import {
  AwsMark,
  AzureMark,
  KubernetesMark,
  LinuxMark,
  WindowsMark,
} from "@/components/brand/cloud-marks";
import { AutoscalerMark } from "@/components/brand/autoscaler-logos";
import { TurningMark } from "@/components/brand/turning-mark";
import { Arrow } from "@/components/primitives/arrow";
import { MarketplaceLine } from "@/components/primitives/marketplace-line";
import { builtFor } from "@/content/footer";
import { filmWords } from "@/content/product-films";
import type { ProductPageContent } from "@/content/product-page";
import type { ProductId } from "@/content/products";
import { heroPhoto } from "@/features/hero/hero-image";
import { HeroPhoto } from "@/features/hero/hero-photo";
import { FILM_ID, filmMinutes, PlayGlyph } from "@/features/product-page/film-parts";
import { OfferingIcon } from "@/features/product-page/offering-icon";
import { ProductRange } from "@/features/product-page/product-range";

/**
 * A product page's hero: the dark `.hero` band over the home page's graded
 * rack photograph, so the bar reads white until it scrolls past it, with the
 * turning Zoorik mark at its right edge.
 *
 * Split in two from 1100px (`.pf-split`). Left, top to bottom: two badges
 * ("Built for Azure and AWS", then where the product runs), the h1, the
 * offerings as tags, the buttons, the marketplace line (this product's
 * listings; none on /amoeba until Amoeba is listed), and on Coral the
 * autoscalers it works beside, two with their logos. Right, the range card
 * (`ProductRange`). Below 1100px the card follows the words. There is no deck:
 * the h1 is the product's search term, and the tags say what it does.
 *
 * ─── THE BUTTONS ───────────────────────────────────────────────────────────
 * "Estimate your saving", white, same tab, to this product's assessment. Book a
 * demo stays in the bar and in the closing row; no hero repeats it. Then, once
 * the film is on YouTube, "Watch the 2-minute film", a wire button down to the
 * film band (`#film`); with the film's URL null it is not drawn, as the band is
 * not.
 *
 * ─── THE TAGS ARE LINKS TO THEIR ROWS ──────────────────────────────────────
 * Each tag is `#id` of its row under "What <product> does", built from the same
 * `Offering`, so a tag cannot point at a row that is not there. The site's
 * `InPageLinks` does the rest: it lands the row 104px under the top (the row's
 * own `scroll-margin-top`), focuses it, and keeps the hash out of the address
 * bar, and the rows' tour shows that row and holds it (`OfferingTour`). With
 * scripting off the browser's own fragment jump lands it the same way.
 */

/**
 * The second badge's marks: the helm for Coral, Windows and Tux for Amoeba.
 * 🔴 CORAL NEVER DRAWS WINDOWS OR LINUX, so the marks are keyed by the product
 * rather than chosen in the content, where a copy edit could pair the wrong
 * ones.
 */
const supportedMarks: Record<ProductId, JSX.Element> = {
  coral: <KubernetesMark className="az-mark" />,
  amoeba: (
    <>
      <WindowsMark className="az-mark" />
      {/* `tux` takes the badge's white ink (`.hero .hero-badge svg.tux`). */}
      <LinuxMark className="az-mark tux" />
    </>
  ),
};

/**
 * "Compatible with your native" and the autoscalers, exactly as the design
 * draws the row: Karpenter and KEDA with their logos, NAP and the Cluster
 * Autoscaler as names, with no mark and no empty slot. The marks are
 * decorative; each name carries its item. The list is labelled by the lead-in,
 * so a screen reader hears "Compatible with your native, list, 4 items";
 * `role="list"` is restated because Safari drops the list role under
 * `list-style:none`. The label's id is the page's own.
 */
function CompatibleWith({
  id,
  label,
  items,
}: {
  readonly id: string;
  readonly label: string;
  readonly items: NonNullable<ProductPageContent["hero"]["compatibleWith"]>["items"];
}): JSX.Element {
  return (
    <div className="hero-logos">
      <div className="vk-logos">
        <span className="vk-logos-l" id={id}>
          {label}
        </span>
        <ul role="list" aria-labelledby={id}>
          {items.map((item) => (
            <li key={item.name}>
              {item.logo ? <AutoscalerMark logo={item.logo} /> : null}
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProductHero({ content }: { content: ProductPageContent }): JSX.Element {
  const { film, hero, offerings, product, what } = content;

  return (
    <header className="hero pp-hero" id="top">
      <TurningMark />
      <HeroPhoto {...heroPhoto} />
      <div className="wrap hero-in pf-split">
        <div className="pf-hero-l">
          <div className="hero-badges">
            <p className="az-badge hero-badge">
              {/* The footer draws the same badge: its own gradient ids keep the
                  page free of duplicates. */}
              <AzureMark idSuffix="hero" className="az-mark" />{" "}
              <AwsMark crop="badge" className="az-mark az-aws" /> {builtFor.common.label}{" "}
              <b>{builtFor.common.platforms}</b>
            </p>
            <p className="az-badge hero-badge">
              {supportedMarks[product]} {hero.supportedOn.label} <b>{hero.supportedOn.platforms}</b>
            </p>
          </div>
          <h1>{hero.title}</h1>
          {/* Named by the section the tags lead into: "What Coral does". */}
          <ul className="offer" role="list" aria-label={what.title}>
            {offerings.map((offering) => (
              <li key={offering.id}>
                <a href={`#${offering.id}`}>
                  <OfferingIcon icon={offering.icon} />
                  {offering.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hero-cta">
            <a className="btn btn-light" href={hero.cta.href}>
              {hero.cta.label} <Arrow />
            </a>
            {film.url !== null ? (
              <a className="btn btn-wire pf-watch" href={`#${FILM_ID}`}>
                <PlayGlyph />
                {filmWords.watch(filmMinutes(film))}
              </a>
            ) : null}
          </div>
          <MarketplaceLine className="hero-mkt" product={product} icon />
          {hero.compatibleWith ? (
            <CompatibleWith
              id={`${product}-compatible`}
              label={hero.compatibleWith.label}
              items={hero.compatibleWith.items}
            />
          ) : null}
        </div>
        <div className="pf-hero-r">
          <ProductRange product={product} />
        </div>
      </div>
    </header>
  );
}
