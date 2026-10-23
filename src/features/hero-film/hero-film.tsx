"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { preconnect } from "react-dom";

import { heroFilmGrounds, heroFilmOrigin, type HeroFilmId } from "@/features/hero-film/hero-films";
import {
  heroFilmFormat,
  heroFilmScript,
  heroFilmSize,
  pickHeroFilm,
} from "@/features/hero-film/pick-hero-film";

/**
 * A hero's film: the black hole on the home page, the data grid on /coral and
 * /amoeba, filling the whole hero behind its words and its scrim.
 *
 * The mocks' element, attribute for attribute: silent, inline, looping, set to
 * play by itself, hidden from a screen reader and from the tab order (the
 * words over it say everything), no picture-in-picture. The loop is the film's
 * own: each file is cut to join itself (`hero-films.ts`), so `loop` is all it
 * takes.
 *
 * ─── THE FILE IS CHOSEN WHILE THE PAGE IS PARSED ───────────────────────────
 * Which file fits depends on the screen and on the formats the browser plays
 * (`pick-hero-film.ts`), and neither exists on the server. So the server sends
 * the element with no poster and no film, and the mocks' script inside it
 * (`heroFilmScript`) sets both as the parser reaches it: the poster for this
 * screen, fetched once, and the film, playing before the page hydrates. The
 * element carries `suppressHydrationWarning` for those attributes: React owns
 * neither `poster` nor `src`, so it never sets them back.
 *
 * Both come from media.zoorik.com (`hero-films.ts`), another origin, so the
 * element asks for a preconnect to it (React DOM's `preconnect`): the server
 * puts one `<link rel="preconnect">` in the page's <head>, however many films
 * a page draws, and the connection opens while the head is parsed, before the
 * parser reaches the script. No `crossorigin`: the poster and the film are
 * plain (no-CORS) fetches, which a CORS connection would not serve.
 *
 * On an element drawn in the browser (a page reached inside the site, which the
 * site's plain links never do), the script does not run, and the effect makes
 * the same pick (`pickHeroFilm`). Where the script ran, the effect finds the
 * poster and the film set and leaves them: one pick per page.
 *
 * Read once, as the mocks' script reads it at load: nothing here listens for a
 * resize, so a window dragged to another screen keeps its film.
 *
 * ─── LESS MOTION: THE POSTER ONLY ──────────────────────────────────────────
 * Under `prefers-reduced-motion` no film is loaded, and `autoplay` comes off,
 * as the mocks do it; the poster at the screen's size stays. The effect follows
 * the preference, which the mocks do not: turned on while the film plays, it
 * stops it (taking `src` away alone stops nothing, so `load()` drops the film
 * and the poster shows again); turned off, the film starts.
 *
 * Without scripting the element is the film's ground, as in the mocks: there is
 * no poster in the markup, which is what keeps the poster to one fetch.
 *
 * ─── ITS BOX ────────────────────────────────────────────────────────────────
 * The film covers its parent whole (`object-fit: cover`) under the parent's
 * own scrim (`z-index: -2`, the scrim's `::after` at -1), on the film's ground
 * while it loads. That box is the same in all three heroes, so it travels with
 * the element. Where the frame sits is each page's (`object-position`, which
 * moves at 1080 px and below), so it is left to the page's sheet, on
 * `.hero-film`. The parent is `.hero`: positioned, isolated, clipped.
 */

export interface HeroFilmProps {
  readonly film: HeroFilmId;
  /** The ground under the film while it loads: the film's own sky unless given (`heroFilmGrounds`). */
  readonly ground?: string;
  /** The page's own class, beside `hero-film`. */
  readonly className?: string;
}

const FILL: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -2,
  pointerEvents: "none",
  userSelect: "none",
};

const LESS_MOTION = "(prefers-reduced-motion: reduce)";

export function HeroFilm({ film, ground, className }: HeroFilmProps): React.JSX.Element {
  const video = useRef<HTMLVideoElement>(null);
  preconnect(heroFilmOrigin);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const pick = pickHeroFilm(
      film,
      heroFilmSize(Math.max(screen.width, innerWidth) * (devicePixelRatio || 1)),
      heroFilmFormat((type) => element.canPlayType(type)),
    );
    if (!element.hasAttribute("poster")) element.poster = pick.poster;

    const less = window.matchMedia(LESS_MOTION);
    const follow = () => {
      if (less.matches) {
        element.removeAttribute("autoplay");
        if (element.hasAttribute("src")) {
          element.removeAttribute("src");
          element.load();
        }
      } else if (!element.hasAttribute("src")) {
        element.autoplay = true;
        element.src = pick.src;
        /* The mocks' `play()` beside `autoplay`; a browser that refuses keeps the poster. */
        element.play()?.catch(() => {});
      }
    };
    follow();
    less.addEventListener("change", follow);
    return () => less.removeEventListener("change", follow);
  }, [film]);

  return (
    <video
      ref={video}
      className={className ? `hero-film ${className}` : "hero-film"}
      muted
      playsInline
      loop
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      suppressHydrationWarning
      style={{ ...FILL, backgroundColor: ground ?? heroFilmGrounds[film] }}
    >
      <script dangerouslySetInnerHTML={{ __html: heroFilmScript(film) }} />
    </video>
  );
}
