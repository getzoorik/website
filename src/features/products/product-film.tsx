import type { CSSProperties } from "react";

import { homeFilms } from "@/content/home-films";
import type { ProductId } from "@/content/products";

/**
 * A product's film on the home page: the console's 5-second Overview in a
 * framed screen, and the line under it that says its figures are examples. It
 * stands where the console panel stood in the home sections; no page draws the
 * panel now.
 *
 * A server component: nothing here moves by itself. `HomeMotion`, the home
 * page's one island, brings the figure in (`.mo-r`, 120ms after the copy) and
 * plays the films one at a time while they are in view; under reduced motion
 * each stays on its poster. Without scripting the poster shows, and the
 * island's `<noscript>` style keeps the figure in its end state.
 *
 * 🔴 `muted` AND `playsInline` ARE WHAT LET IT PLAY. The film is started by
 * script, not by `autoplay`, and a browser lets a script start only a muted
 * film without a gesture; iOS also needs `playsinline` to keep it in the page.
 * No `controls` and no `loop`: the island rests it on its last frame, then
 * plays it again, as the mock does.
 *
 * `preload="none"`, where the mock has "metadata": the poster is all the page
 * needs until the film is in view, when the island's play() fetches it. So the
 * first view fetches no film bytes, and under reduced motion none at all.
 */
export function ProductFilm({ product }: { product: ProductId }): React.JSX.Element {
  const film = homeFilms[product];

  return (
    <figure className="mo-film mo-r" style={{ "--d": "120ms" } as CSSProperties}>
      <div className="mo-screen">
        <video
          className="mo-vid"
          muted
          playsInline
          preload="none"
          poster={film.poster}
          src={film.src}
          aria-label={film.label}
        />
      </div>
      <figcaption className="mo-cap">{film.caption}</figcaption>
    </figure>
  );
}
