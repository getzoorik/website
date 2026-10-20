import type { ProductId } from "@/content/products";

/**
 * The two 2-minute films, one per product page, as the product tour mock draws
 * them.
 *
 * ─── YOUTUBE ONLY ──────────────────────────────────────────────────────────
 * Each film is 37 MB, over Cloudflare's 25 MiB limit for a static file, so the
 * site can never serve one itself. Both are on YouTube, and each chapter opens
 * the film at its second. 🔴 A film whose `url` is null draws neither the film
 * band nor the hero's "Watch the 2-minute film", so a page never leads to a
 * film that is not there.
 *
 * The posters are the films' white YouTube thumbnails, byte for byte, in place
 * of the mock's dark frame.
 */

/** A chapter: where it starts, in seconds, and its name, as the narration has them. */
export interface FilmChapter {
  readonly at: number;
  readonly label: string;
}

export interface ProductFilm {
  /** The film on YouTube; null draws no band (a film not uploaded yet). */
  readonly url: string | null;
  /** The band's h2; the product's name in it is kept out of translation. */
  readonly title: string;
  /** "m:ss", on the poster's tag; its minutes name the film ("the 2-minute film"). */
  readonly length: string;
  /** 1920×1080, from `public/films/`. */
  readonly poster: string;
  readonly chapters: readonly FilmChapter[];
}

/** The channel the site already lists: the organisation's `sameAs` (`socialProfiles`). */
export const youtubeChannel = "https://www.youtube.com/@getzoorik";

/** The words both bands share, verbatim from the mock's film band and the hero's button. */
export const filmWords = {
  /** The hero's second button, and the poster's name, around the film's minutes. */
  watch: (minutes: string) => `Watch the ${minutes}-minute film`,
  poster: (minutes: string, product: string) =>
    `Watch the ${minutes}-minute ${product} film on YouTube (opens in a new tab)`,
  /** Over a film that started muted: its sound on, in place. */
  sound: "Turn on sound",
  /** The player's title, once it takes the poster's place. */
  player: (minutes: string, product: string) =>
    `${product}: the ${minutes}-minute film, on YouTube`,
  tag: "Watch on YouTube",
  chapters: "Chapters of the film",
  more: "More films on",
  channel: "our YouTube channel",
} as const;

/* Each chapter starts where the narration does, and at least 10 seconds after
   the one before it, as YouTube chapters need. */
export const productFilms: Record<ProductId, ProductFilm> = {
  coral: {
    url: "https://youtu.be/aHRnAWhbzlo",
    title: "See Coral at work",
    length: "2:05",
    poster: "/films/coral-film-thumbnail-white.jpg",
    chapters: [
      { at: 0, label: "Connect" },
      { at: 21, label: "Monitoring" },
      { at: 33, label: "Recommendations" },
      { at: 43, label: "Workload optimization" },
      { at: 54, label: "Node optimization" },
      { at: 72, label: "Live migration" },
      { at: 89, label: "Rebalancing" },
      { at: 109, label: "Results" },
    ],
  },
  amoeba: {
    url: "https://youtu.be/H221xeryon4",
    title: "See Amoeba at work",
    length: "2:12",
    poster: "/films/amoeba-film-thumbnail-white.jpg",
    chapters: [
      { at: 0, label: "Connect your cloud" },
      { at: 15, label: "Onboard VMs" },
      { at: 35, label: "Dashboard and disks" },
      { at: 50, label: "The pool" },
      { at: 78, label: "Autopilot" },
      { at: 98, label: "Operations and Impact" },
      { at: 112, label: "Settings" },
    ],
  },
};
