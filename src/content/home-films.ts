import type { ProductId } from "@/content/products";

/**
 * The home page's two product films, as the mock draws them.
 *
 * Each product section on the home page shows its console's 5-second Overview in
 * the place the console panel stood: a black, silent film, played by
 * `HomeMotion` while it is in view. The films are the mock's own, byte for
 * byte; each poster is the mock's still as a 1302 × 732 WebP, twice the
 * 651 × 366 box it fills. All are served from `public/motion/` under a month's
 * cache (`public/_headers`).
 *
 * 🔴 THE FIGURES IN THE FILMS ARE EXAMPLES, AND BOTH LINES SAY SO. The caption
 * under each screen and the film's name for a screen reader open on it: what the
 * screen is (the product's console) and that its figures are examples. Each
 * caption names its product, so the two lines differ. A film is not described by
 * anything else on the page, so its label is all a screen reader gets: it says
 * what plays, in order, with the panels' own names.
 *
 * Amoeba's says "block storage cost" and "the cost once rightsized" where the
 * console says "disk spend" and "right-sized" (the site's words).
 */
export interface HomeFilm {
  readonly src: `/motion/${string}.mp4`;
  readonly poster: `/motion/${string}.webp`;
  /** The line under the screen (`.mo-cap`). */
  readonly caption: string;
  /** The film's `aria-label`: what it shows, example first. */
  readonly label: string;
}

export const homeFilms: Readonly<Record<ProductId, HomeFilm>> = {
  coral: {
    src: "/motion/coral-overview-5s.mp4",
    poster: "/motion/coral-poster.webp",
    caption: "Coral console with example figures.",
    label:
      "Coral console with example figures: the Overview, where today’s running cost, the cost at the optimum and the recoverable amount count up. Then the view closes in on CPU efficiency, workload optimization, node optimization and cost impact.",
  },
  amoeba: {
    src: "/motion/amoeba-overview-5s.mp4",
    poster: "/motion/amoeba-poster.webp",
    caption: "Amoeba console with example figures.",
    label:
      "Amoeba console with example figures: the Overview, where today’s block storage cost, the cost once rightsized and the recoverable amount count up. Then the view closes in on utilization, what needs you and the saving to date.",
  },
};
