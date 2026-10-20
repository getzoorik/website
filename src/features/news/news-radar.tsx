import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { newsPage, newsRadar } from "@/content/news";
import { named } from "@/features/legal/named";
import { newsDay } from "@/features/news/news-facts";
import { offSiteProps } from "@/lib/links";

/**
 * Zoorik Radar on /news (the mock's `radar()` and `radar_art()`): the navy head with the radar's art, the week, the
 * title and the lede, then one column per stream, each item with its day, its title linked to its source (in a new
 * tab), its summary and its source's name. Server components.
 */

/* The rings' strokes, outer to inner, and the four blips (the mock's `radar_art()`). */
const RINGS = [
  [56, "rgba(250,247,243,.18)"],
  [42, "rgba(250,247,243,.22)"],
  [28, "rgba(250,247,243,.26)"],
  [14, "rgba(250,247,243,.30)"],
] as const;
const BLIPS = [
  [84, 38],
  [40, 76],
  [70, 88],
  [30, 44],
] as const;

/**
 * The radar: four rings, the sweep, four blips and the centre. Decoration (`aria-hidden`). The sweep turns into place
 * once as the page loads, and only under `prefers-reduced-motion: no-preference` (news.css); the mock has no script.
 */
function RadarArt(): React.JSX.Element {
  return (
    <svg className="nr-art" viewBox="0 0 120 120" aria-hidden="true">
      {RINGS.map(([r, stroke]) => (
        <circle cx="60" cy="60" r={r} fill="none" stroke={stroke} key={r} />
      ))}
      <path className="nr-sweep" d="M60 60 L60 4 A56 56 0 0 1 108.5 32 Z" fill="url(#nrg)" />
      <defs>
        <linearGradient id="nrg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(95,227,181,.0)" />
          <stop offset="1" stopColor="rgba(95,227,181,.35)" />
        </linearGradient>
      </defs>
      {BLIPS.map(([cx, cy]) => (
        <circle cx={cx} cy={cy} r="3" fill="#5FE3B5" key={`${cx} ${cy}`} />
      ))}
      <circle cx="60" cy="60" r="4" fill="#FAF7F3" />
    </svg>
  );
}

export function NewsRadar(): React.JSX.Element {
  const { radar } = newsPage;
  return (
    <>
      <div className="nr-head">
        <RadarArt />
        <div>
          <p className="nr-eyebrow">{named(radar.eyebrow(newsDay(newsRadar.week)))}</p>
          <h2 id={`${radar.id}-h`}>{radar.title}</h2>
          <p>{radar.lede(newsRadar.window)}</p>
        </div>
      </div>
      <div className="nr-cols">
        {newsRadar.streams.map((stream) => (
          <section
            className="nr-col"
            id={`${radar.id}-${stream.id}`}
            aria-labelledby={`${radar.id}-${stream.id}-h`}
            key={stream.id}
          >
            <header>
              <h3 id={`${radar.id}-${stream.id}-h`}>{stream.label}</h3>
              <p>{stream.lede}</p>
            </header>
            <ol>
              {stream.items.map((item) => (
                <li key={item.url}>
                  <time dateTime={item.date}>{newsDay(item.date, false)}</time>
                  <a className="nr-t" href={item.url} {...offSiteProps(item.url)}>
                    {item.title}
                    <ExternalArrow />
                    <NewTabHint href={item.url} />
                  </a>
                  <p>{item.summary}</p>
                  <small>{item.source}</small>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
