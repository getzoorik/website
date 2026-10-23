/**
 * The heroes' films and their posters, by film, size and format, as the mocks
 * name them.
 *
 * Two films, each filling a whole hero: the black hole "Gargantua" on the home
 * page (Adobe Stock 476310128, Kari) and the data grid on /coral and /amoeba
 * (Adobe Stock 1976857782, Infi Studio), both Enhanced licences held by the
 * owner. The files are the mocks' own, byte for byte, already `faststart`,
 * with no sound track. Each loops by itself: the black hole through a dark dip,
 * the grid through a 2 s crossfade.
 *
 * ─── WHERE THEY ARE: media.zoorik.com, NOT public/ ─────────────────────────
 * Every file sits in the Cloudflare R2 bucket `zoorik-media`, served on
 * https://media.zoorik.com under `/hero-films/`, uploaded by the website lane;
 * a new cut gets a new file name, as each is cached for a month. Not in
 * `public/`, for two reasons: the site's Workers static assets refuse any file
 * over 25 MiB, and eight of the sixteen films are over it; and the footage is
 * third-party, licensed by the owner, so it must not sit as files in this
 * public, Apache-licensed repository.
 *
 * ─── THE FULL SET, PER FILM ────────────────────────────────────────────────
 * Each film in three sizes (1080, 1440, 2160) and three formats: AV1 and HEVC
 * at every size, H.264 up to 1440 (`heroFilmLargest`), so 8 films; and a
 * poster at each size, which is what a reader who asked for less motion sees
 * in the film's place. H.264 takes no suffix: `hero-gargantua-1440.mp4`.
 */
export type HeroFilmId = "gargantua" | "datagrid";
export type HeroFilmSize = 1080 | 1440 | 2160;
export type HeroFilmFormat = "av1" | "hevc" | "h264";

/** The bucket's origin, which the page also preconnects to. */
export const heroFilmOrigin = "https://media.zoorik.com";

/** The largest size each format is made in: the H.264 film stops at 1440. */
export const heroFilmLargest: Readonly<Record<HeroFilmFormat, HeroFilmSize>> = {
  av1: 2160,
  hevc: 2160,
  h264: 1440,
};

/** What every file of one film starts with: `…/hero-films/hero-<film>-`. */
export function heroFilmBase(film: HeroFilmId): string {
  return `${heroFilmOrigin}/hero-films/hero-${film}-`;
}

/** A film's file at one size, in one format. */
export function heroFilm(film: HeroFilmId, size: HeroFilmSize, format: HeroFilmFormat): string {
  return `${heroFilmBase(film)}${size}${format === "h264" ? "" : `-${format}`}.mp4`;
}

/** A film's poster at one size. */
export function heroFilmPoster(film: HeroFilmId, size: HeroFilmSize): string {
  return `${heroFilmBase(film)}poster-${size}.jpg`;
}

/**
 * Each film's sky, which the page puts under it: the video's own ground while
 * it loads, the hero's ground and its scrim's colour, and the bar's 84 px strip
 * over the hero. Home #080014; /coral and /amoeba #000817.
 */
export const heroFilmGrounds: Readonly<Record<HeroFilmId, `#${string}`>> = {
  gargantua: "#080014",
  datagrid: "#000817",
};
