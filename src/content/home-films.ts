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
 * under each screen and the film's name for a screen reader open on it, in the
 * mock's words. A film is not described by anything else on the page, so its
 * label is all a screen reader gets: it says what plays, in order.
 *
 * The labels are the mock's, verbatim, its straight apostrophe ("today's") and
 * Amoeba's "right-sized spend" included.
 */
export interface HomeFilm {
  readonly src: `/motion/${string}.mp4`;
  readonly poster: `/motion/${string}.webp`;
  /** The film's `aria-label`: what it shows, example first. */
  readonly label: string;
}

/** The line under each screen (`.mo-cap`). */
export const filmCaption = "Product preview with example figures.";

export const homeFilms: Readonly<Record<ProductId, HomeFilm>> = {
  coral: {
    src: "/motion/coral-overview-5s.mp4",
    poster: "/motion/coral-poster.webp",
    label:
      "Coral product preview with example figures: the Overview, where today's running cost, the cost at the optimum and the recoverable amount count up, then the four engine figures.",
  },
  amoeba: {
    src: "/motion/amoeba-overview-5s.mp4",
    poster: "/motion/amoeba-poster.webp",
    label:
      "Amoeba product preview with example figures: the Overview, where today's disk spend, the right-sized spend and the recoverable amount count up, then utilization, what needs you and the saving to date.",
  },
};
