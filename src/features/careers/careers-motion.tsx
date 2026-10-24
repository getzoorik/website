"use client";

import { useEffect } from "react";

/**
 * /careers's motion for the hero and What you will build, one island (the
 * mock's script for those parts). The values, How we work's drawings and the
 * hiring steps move by their own islands.
 *
 *   the rings   the hero's three rings turn while any of the figure is on
 *               screen (`.cq-orbit.is-on`), so the loop never runs unseen;
 *               the sheet holds them still under the pointer
 *   the films   each product's film plays while 35% of it is in view, and
 *               pauses when it leaves
 *
 * Under reduced motion the rings stand still (the sheet) and the films stay
 * on their posters. Without an observer the rings simply turn, and the films
 * stay on their posters, as the mock's do.
 *
 * Nothing is hidden before this runs: with scripting off the rings stand where
 * the mock places them and the films show their posters, so there is no
 * `<noscript>` style.
 */

const ON = "is-on";
/** The mock's threshold: a film plays once 35% of it is in view. */
const FILM_IN_VIEW = 0.35;

export function CareersMotion(): null {
  useEffect(() => {
    const orbit = document.querySelector(".cq-orbit");
    const films = [...document.querySelectorAll<HTMLVideoElement>(".cq-vid video")];
    if (typeof IntersectionObserver === "undefined") {
      orbit?.classList.add(ON);
      return;
    }
    const cleanups: (() => void)[] = [];

    if (orbit) {
      const turn = new IntersectionObserver((entries) => {
        const latest = entries[entries.length - 1];
        if (latest) orbit.classList.toggle(ON, latest.isIntersecting);
      });
      turn.observe(orbit);
      cleanups.push(() => turn.disconnect());
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const play = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) video.play()?.catch(() => {});
            else video.pause();
          }
        },
        { threshold: FILM_IN_VIEW },
      );
      for (const video of films) play.observe(video);
      cleanups.push(() => play.disconnect());
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
