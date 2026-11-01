import { Reveal } from "@/components/primitives/reveal";
import { byDesignCards, byDesignHeader } from "@/content/by-design";
import { ByDesignFigure } from "@/features/by-design/by-design-drawings";
import { WhyMotion } from "@/features/by-design/why-motion";
import { Text } from "@/features/learn/article-page";

/**
 * By design — "Cloud cost optimization, without the risk": the home page's one
 * band, four cards on `--surface-2`.
 *
 * Each card is one drawing with its title as the caption (owner, 23 Oct 2026:
 * "It should not heavy on texts + it should use proper visuals + motions"). The
 * sentence each card carried is its drawing's name for a screen reader
 * (`role="img"`, `aria-label`), word for word, so the band still says it.
 *
 * A server component: the head and the cards reveal through `Reveal`, which
 * owns the observer and the stagger, so they rise in turn, one step of the
 * page's clock apart. The drawings loop only while the band is on screen,
 * which is the one thing that needs the browser (`WhyMotion`).
 *
 * The heading is set in two spans (`.lm > span`) for the line mask: the outer
 * one clips, the inner one slides up into it when the head has risen
 * (engines.css). The h2 itself carries no class; its first words are a link to
 * the cloud cost pillar, inside the inner span, so they slide up with the rest.
 *
 * `#why` is not in the nav. It has an id because every section does, and because
 * a link to it should not have to wait for one; the drawings' rules hang on it.
 */
export function ByDesignSection(): React.JSX.Element {
  return (
    <section className="sec sec-band" id="why">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>
            <span className="lm">
              <span>
                <Text text={byDesignHeader.title} breaks={false} />
              </span>
            </span>
          </h2>
        </Reveal>
        <div className="pls wv">
          {byDesignCards.map((card, index) => (
            <Reveal as="article" className="pl" order={index} key={card.id}>
              <ByDesignFigure drawing={card.drawing} description={card.description} />
              <h3>{card.title}</h3>
            </Reveal>
          ))}
        </div>
      </div>
      <WhyMotion />
    </section>
  );
}
