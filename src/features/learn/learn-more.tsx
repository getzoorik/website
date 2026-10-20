import { Arrow } from "@/components/primitives/arrow";
import { learnMore, learnPage } from "@/content/learn";
import { named } from "@/features/legal/named";

/**
 * /learn's More from Zoorik: the head's h2 alone, with no lede, then three navy cards,
 * to Zoorik News, Cloud cost optimization tools and Community, each with its name, its line, one more line
 * (the week's headline, the tools' kinds, r/zoorik) and "Open". The pages Learn hands its old sections to. A server
 * component: the cards' only motion is the arrow's hover nudge, the sheet's own (`.fx-read`).
 */
export function MoreFromZoorik(): React.JSX.Element {
  const { more } = learnPage;
  return (
    <section className="sec lv-sec" id={more.id} aria-labelledby={`${more.id}-h`}>
      <div className="wrap">
        <div className="lv-head">
          <h2 id={`${more.id}-h`}>{named(more.title)}</h2>
        </div>
        <div className="lv-more">
          {learnMore.map((card) => (
            <a className="lv-mc" href={card.href} key={card.href}>
              <span className="lv-mt">{card.title}</span>
              <span className="lv-ml">{card.line}</span>
              <span className="lv-mx">{card.extra}</span>
              <span className="fx-read">
                {more.open} <Arrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
