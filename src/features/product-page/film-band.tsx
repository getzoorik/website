import type { JSX } from "react";

import { NamedText } from "@/components/primitives/named-text";
import { filmWords, youtubeChannel, type ProductFilm } from "@/content/product-films";
import type { ProductId } from "@/content/products";
import { products } from "@/content/products";
import { FILM_ID, filmMinutes } from "@/features/product-page/film-parts";
import { FilmPlayer } from "@/features/product-page/film-player";

/**
 * The film band (`section.pf-film#film`): after What is <product>?, in the
 * logo's navy, as home's case study band. The h2, the film's poster with one
 * play button and its length, the chapters, each opening the film at its
 * second, and the channel.
 *
 * 🔴 ONLY ONCE THE FILM IS ON YOUTUBE. With the film's `url` null this draws
 * nothing, and the hero draws no "Watch the 2-minute film" (`product-films.ts`):
 * the films are too large for the site to serve, so until the upload there is
 * nothing for either to open.
 *
 * The film plays on the page (`FilmPlayer`, the one client part: by itself on
 * arrival, with its sound as soon as the browser allows; on a press, with
 * sound). Without scripting, every link opens YouTube in a new tab, as the mock
 * writes them.
 */

export function FilmBand({
  product,
  film,
}: {
  readonly product: ProductId;
  readonly film: ProductFilm;
}): JSX.Element | null {
  const { url } = film;
  if (url === null) return null;
  const name = products[product].name;
  const minutes = filmMinutes(film);

  return (
    <section className="pf-film" id={FILM_ID} aria-labelledby="pf-film-h">
      <div className="wrap">
        <div className="pf-film-h">
          <h2 id="pf-film-h">
            <NamedText text={film.title} name={name} />
          </h2>
        </div>
        <FilmPlayer
          url={url}
          poster={film.poster}
          length={film.length}
          posterLabel={filmWords.poster(minutes, name)}
          playerTitle={filmWords.player(minutes, name)}
          tag={filmWords.tag}
          soundLabel={filmWords.sound}
          chaptersLabel={filmWords.chapters}
          chapters={film.chapters}
        />
        <p className="pf-film-more">
          {filmWords.more}{" "}
          <a href={youtubeChannel} target="_blank" rel="noopener">
            {filmWords.channel}
          </a>
        </p>
      </div>
    </section>
  );
}
