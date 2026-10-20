"use client";

import { useEffect } from "react";

/**
 * The home page's motion pass: one entrance for what the pass adds, and the
 * two product films played one at a time.
 *
 * ─── ONE OBSERVER FOR THE PASS ─────────────────────────────────────────────
 * Every element the pass brings in carries `.mo-r` (the films, the case-study
 * band, What we offer's side and its rows), server-rendered by its own section.
 * This island finds them and gives each `.is-in` the first time it is a little
 * inside the window; the sheets key their end state off that class (the band's
 * bars, and each offer row's band and rolling figure, included). Under reduced
 * motion, or without an observer, every one gets it at once.
 *
 * What we offer is the one part the mock gives an observer of its own, which
 * marks the whole section once 35% of it is in view, so its rows play 260ms
 * apart from that one start. Here it rides this one like everything else, and
 * its rows keep that start through `data-mo-clock` on their list: the first
 * of them in starts the list's clock, and each one gets `--late`, how long
 * after that first one it came in. The sheet takes it off the row's place in
 * the stagger (home-offers.css), so rows that come in together, or close
 * behind each other, still play 260ms apart from the first, as the mock's do,
 * and a row that comes in after its turn plays at once rather than waiting
 * out its stagger a second time. A row below the fold still waits to be seen.
 *
 * ─── THE FILMS: ONE AT A TIME ──────────────────────────────────────────────
 * The film most in view (at least 40% of it) plays; at its end it rests 2.5s on
 * its last frame and plays again; the other waits. Under reduced motion they
 * stay on their poster.
 *
 * ─── NOTHING HIDDEN WITHOUT SCRIPTING ──────────────────────────────────────
 * The mock's sheets start these elements hidden (faded, low, bars at zero,
 * each offer's figure on its strip's first 0), which is right while this
 * script runs and wrong when it never will. The `<noscript>` style puts every
 * one in its end state then, exactly as reduced motion does, so a reader or a
 * preview with scripting off sees the whole page.
 */

const NO_SCRIPT =
  "<style>.mo-r,.mo-film.mo-r{opacity:1;transform:none;transition:none}" +
  ".mo-b,.mo-b b{transform:none;opacity:1;transition:none}" +
  /* What we offer's entrance outranks `.mo-r` (home-offers.css), so it is named at its own
     weight; its bands drawn whole, and each digit's strip at the digit. */
  ".ofx .ofx-in{opacity:1;transform:none;transition:none}" +
  ".ofx-track i{transform:none;transition:none}" +
  ".od-d::before{transform:translateY(calc(var(--v) * -1em));transition:none}</style>";

/** The mock's own margin: an element comes in once it is 10% inside the window. */
const ROOT_MARGIN = "0px 0px -10% 0px";
/** A list whose entering elements share one clock (What we offer's rows). */
const CLOCK = "[data-mo-clock]";
/** A film plays once at least this much of it is in view. */
const IN_VIEW = 0.4;
/** How long a film rests on its last frame before it plays again. */
const REST_MS = 2500;

interface Film {
  readonly video: HTMLVideoElement;
  ratio: number;
  rest: ReturnType<typeof setTimeout> | undefined;
}

export function HomeMotion(): React.JSX.Element {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observes = typeof IntersectionObserver !== "undefined";
    const entering = [...document.querySelectorAll<HTMLElement>(".mo-r")];

    if (reduced || !observes) {
      for (const el of entering) el.classList.add("is-in");
      return;
    }

    /* When each clock started: the moment the first of its elements came in. */
    const started = new Map<Element, number>();
    const entrances = new IntersectionObserver(
      (entries) => {
        /* One moment for the whole callback, so the elements that come in together are on time
           together, and keep their stagger between them. */
        const now = performance.now();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const clock = el.closest(CLOCK);
          if (clock) {
            const start = started.get(clock) ?? now;
            started.set(clock, start);
            el.style.setProperty("--late", `${Math.round(now - start)}ms`);
          }
          el.classList.add("is-in");
          entrances.unobserve(el);
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    for (const el of entering) entrances.observe(el);

    const films: Film[] = [...document.querySelectorAll<HTMLVideoElement>(".mo-vid")].map(
      (video) => ({ video, ratio: 0, rest: undefined }),
    );
    let current: Film | null = null;

    const play = (film: Film) => {
      film.video.play()?.catch(() => {});
    };
    const fromStart = (film: Film) => {
      try {
        film.video.currentTime = 0;
      } catch {
        /* a film with no metadata yet starts at 0 anyway */
      }
    };
    const pick = () => {
      let best: Film | null = null;
      for (const film of films) {
        if (film.ratio >= IN_VIEW && (best === null || film.ratio > best.ratio)) best = film;
      }
      for (const film of films) {
        if (film === best) continue;
        clearTimeout(film.rest);
        film.video.pause();
      }
      if (best !== null && best !== current) {
        if (best.video.ended) fromStart(best);
        play(best);
      }
      current = best;
    };

    const onEnded = new Map<Film, () => void>();
    for (const film of films) {
      const ended = () => {
        clearTimeout(film.rest);
        film.rest = setTimeout(() => {
          if (current !== film) return;
          fromStart(film);
          play(film);
        }, REST_MS);
      };
      onEnded.set(film, ended);
      film.video.addEventListener("ended", ended);
    }

    const thresholds = Array.from({ length: 21 }, (_, step) => step / 20);
    const inView = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const film = films.find((f) => f.video === entry.target);
          if (film) film.ratio = entry.intersectionRatio;
        }
        pick();
      },
      { threshold: thresholds },
    );
    for (const film of films) inView.observe(film.video);

    return () => {
      entrances.disconnect();
      inView.disconnect();
      for (const film of films) {
        clearTimeout(film.rest);
        film.video.removeEventListener("ended", onEnded.get(film)!);
      }
    };
  }, []);

  return <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />;
}
