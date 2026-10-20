import { NamedText } from "@/components/primitives/named-text";
import { Reveal } from "@/components/primitives/reveal";
import { byDesignCards, byDesignHeader, type ByDesignCard } from "@/content/by-design";
import { ByDesignFigure } from "@/features/by-design/by-design-drawings";

/**
 * By design — "Cloud cost optimization, without the risk": the home page's one band, four
 * cards on `--surface-2`.
 *
 * A server component: the head and the cards reveal through `Reveal`, which owns
 * the observer and the stagger, and everything a card does after it has risen
 * is the site system's.
 *
 * Each card is a title, a drawing and one line: no icon chip, no hairlines
 * round the drawing, no shadow. They rise in turn, one step of the page's clock
 * apart, so the fourth arrives 240ms after the first — under the reveal's own
 * four-step cap.
 *
 * The heading is set in two spans (`.lm > span`) for the line mask: the outer
 * one clips, the inner one slides up into it when the head has risen
 * (engines.css). The h2 itself carries no class.
 *
 * `#why` is not in the nav. It has an id because every section does, and because
 * a link to it should not have to wait for one.
 */

/**
 * The row of cards on its own. The home band below is this row under its head.
 * `/coral` and `/amoeba` still draw their own four with it until those pages
 * are rebuilt without a By design row; a product page passes its product's
 * name, which its lines print, so the name is kept out of translation.
 */
export function ByDesignCards({
  cards,
  name,
}: {
  cards: readonly ByDesignCard[];
  name?: string;
}): React.JSX.Element {
  return (
    <div className="pls">
      {cards.map((card, index) => (
        <Reveal as="article" className="pl" order={index} key={card.id}>
          <h3>{card.title}</h3>
          <ByDesignFigure drawing={card.drawing} />
          <p>{name ? <NamedText text={card.caption} name={name} /> : card.caption}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function ByDesignSection(): React.JSX.Element {
  return (
    <section className="sec sec-band" id="why">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>
            <span className="lm">
              <span>{byDesignHeader.title}</span>
            </span>
          </h2>
        </Reveal>
        <ByDesignCards cards={byDesignCards} />
      </div>
    </section>
  );
}
