import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { learnFilmLines, learnMedium, learnPage } from "@/content/learn";
import { productFilms } from "@/content/product-films";
import type { ProductId } from "@/content/products";
import { named } from "@/features/legal/named";
import { LearnSection, OutGlyph } from "@/features/learn/learn-parts";
import { PlayGlyph } from "@/features/product-page/film-parts";
import { offSiteProps } from "@/lib/links";

/**
 * /learn's Watch and read, on the band: each product's film as a card that opens it
 * on YouTube (its white thumbnail, the play button and its length, then "YouTube", its title, its line and "Watch on
 * YouTube"), then the navy Medium panel: the live post and the two follow links. Every link leaves the site and says
 * so, by the mock's arrow (`OutGlyph`) and, for the ear, the hidden "(opens in a new tab)". A server component: the
 * mock has no script here, and its only motion is the thumbnail's hover zoom (learn.css).
 */

const films = (["coral", "amoeba"] as const satisfies readonly ProductId[]).flatMap((product) => {
  const film = productFilms[product];
  return film.url ? [{ product, ...film, url: film.url, line: learnFilmLines[product] }] : [];
});

export function WatchAndRead(): React.JSX.Element {
  const { watch } = learnPage;
  const { post } = learnMedium;
  const follow = [
    { label: watch.medium.follow, href: learnMedium.follow },
    { label: watch.medium.subscribe, href: learnMedium.subscribe },
  ];
  return (
    <LearnSection id={watch.id} title={watch.title} lede={watch.lede} band>
      <div className="wr">
        {/* Each link's key comes before its spread props: after a spread the compiler falls back to createElement, and the
            server render warns about the list's keys. */}
        {films.map((film) => (
          <a key={film.product} className="wr-film" href={film.url} {...offSiteProps(film.url)}>
            <span className="wr-th">
              {/* A plain <img>, as the product pages' poster: the ported sheet owns the box (`.wr-th img`), and the
                  thumbnail is a file in public/films. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
              <img
                src={film.poster}
                alt=""
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
              />
              <span className="wr-play" aria-hidden="true">
                <PlayGlyph />
              </span>
              <span className="wr-dur">{film.length}</span>
            </span>
            <span className="wr-k">{watch.film.kicker}</span>
            <span className="wr-t">{named(film.title)}</span>
            <span className="wr-l">{named(film.line)}</span>
            <span className="fx-read">
              {watch.film.go} <OutGlyph />
            </span>
            <NewTabHint href={film.url} />
          </a>
        ))}
        <div className="wr-med">
          <span className="wr-k">{watch.medium.kicker}</span>
          <a className="wr-post" href={post.url} {...offSiteProps(post.url)}>
            <span className="wr-pd">{post.date}</span>
            <span className="wr-pt">{post.title}</span>
            <span className="wr-pl">{post.line}</span>
            <span className="wr-go">
              {watch.medium.go} <OutGlyph />
            </span>
            <NewTabHint href={post.url} />
          </a>
          <div className="wr-sub">
            {follow.map((link) => (
              <a key={link.href} href={link.href} {...offSiteProps(link.href)}>
                {link.label} <OutGlyph />
                <NewTabHint href={link.href} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </LearnSection>
  );
}
