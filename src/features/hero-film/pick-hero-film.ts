import {
  heroFilm,
  heroFilmBase,
  heroFilmLargest,
  heroFilmPoster,
  type HeroFilmFormat,
  type HeroFilmId,
  type HeroFilmSize,
} from "@/features/hero-film/hero-films";

/**
 * Which of a hero film's files a screen gets, as the mocks' film script picks
 * it (the handoff's rules):
 *
 * 1. **The size** from the screen's device pixels, `max(screen.width,
 *    innerWidth) × devicePixelRatio`: 3000 or more takes 2160, 2000 or more
 *    1440, anything else 1080. So a 4K monitor, or a laptop of 1500 points or
 *    more at 2x, gets the 2160 film, and a phone the 1080.
 * 2. **The format**: the first the browser plays, AV1, then HEVC (every Mac and
 *    iPhone), then H.264, which every browser plays and is never asked about.
 *    The H.264 film stops at 1440: a 4K screen with neither AV1 nor HEVC gets
 *    the 1440 H.264 film.
 *
 * The poster follows the screen's size, as the mocks' does, not the film's: it
 * is the whole picture for a reader who asked for less motion.
 *
 * The same pick runs twice, once in each language: `heroFilmScript`, inline in
 * the film's element, while the page is parsed (the mocks' way), and
 * `pickHeroFilm` in `HeroFilm`'s effect, for an element drawn in the browser.
 * A test runs the script against `pickHeroFilm` at every size, for every
 * browser.
 */

/** What a browser is asked for each format (`canPlayType`), the mocks' strings. H.264 is not asked. */
export const heroFilmCodecs: Readonly<Record<Exclude<HeroFilmFormat, "h264">, string>> = {
  av1: 'video/mp4; codecs="av01.0.12M.10"',
  hevc: 'video/mp4; codecs="hvc1.2.4.L153.B0"',
};

/** The size a screen gets, by its device pixels. */
export function heroFilmSize(devicePixels: number): HeroFilmSize {
  return devicePixels >= 3000 ? 2160 : devicePixels >= 2000 ? 1440 : 1080;
}

/** The first format a browser plays, by its `canPlayType` ("" is no; "maybe" and "probably" are yes). */
export function heroFilmFormat(canPlayType: (type: string) => string): HeroFilmFormat {
  return canPlayType(heroFilmCodecs.av1)
    ? "av1"
    : canPlayType(heroFilmCodecs.hevc)
      ? "hevc"
      : "h264";
}

export interface HeroFilmPick {
  readonly poster: string;
  readonly src: string;
}

export function pickHeroFilm(
  film: HeroFilmId,
  size: HeroFilmSize,
  format: HeroFilmFormat,
): HeroFilmPick {
  const largest = heroFilmLargest[format];
  return {
    poster: heroFilmPoster(film, size),
    src: heroFilm(film, size > largest ? largest : size, format),
  };
}

/**
 * The mocks' film script (`make_options.py`, `make_product_pages.py`), for one
 * film: inline in the film's own element, so it runs as the parser reaches it,
 * before the page hydrates.
 *
 * ─── WHY INLINE, AS THE MOCKS DO IT ────────────────────────────────────────
 * The element's markup carries no poster and no film. A poster in the markup
 * would be fetched at once (the browser's preload scanner reads `poster`) and,
 * on a screen of 2x or more, fetched again at the screen's size; a film set
 * after hydration would start late. So the script sets both while the page is
 * parsed, as the mocks' script does: one poster, the screen's, then the film.
 *
 * The element is the script's parent (`document.currentScript.parentNode`): a
 * <script> inside a <video> runs like any other, and only the video is drawn.
 * Under reduced motion `autoplay` comes off and there is no film; the poster
 * stays.
 */
export function heroFilmScript(film: HeroFilmId): string {
  return (
    "(function(){var v=document.currentScript.parentNode," +
    `u="${heroFilmBase(film)}",` +
    "k=Math.max(screen.width,innerWidth)*(devicePixelRatio||1);" +
    "k=k>=3000?2160:k>=2000?1440:1080;" +
    `var c=v.canPlayType('${heroFilmCodecs.av1}')?"-av1":` +
    `v.canPlayType('${heroFilmCodecs.hevc}')?"-hevc":"";` +
    'v.poster=u+"poster-"+k+".jpg";' +
    'if(matchMedia("(prefers-reduced-motion: reduce)").matches){v.removeAttribute("autoplay");return}' +
    `v.src=u+(c||k<=${heroFilmLargest.h264}?k:${heroFilmLargest.h264})+c+".mp4";` +
    "v.play().catch(function(){})})();"
  );
}
