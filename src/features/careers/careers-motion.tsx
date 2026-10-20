"use client";

import { useEffect } from "react";

/**
 * /careers's motion (the approved mock's script), one island for the whole
 * page. The values picker plays itself (`CareersValues`).
 *
 *   reveal      each `.rv` rises in the first time 18% of it is in view
 *               (`.is-in`); How we work's pictures play off the same class
 *   the letters a light walks across the hero's six letters, one every 1.6s,
 *               until the reader hovers one
 *   the films   each product's film plays while 35% of it is in view, and
 *               pauses when it leaves
 *   the steps   the line over How we hire draws once 60% of it is in view
 *
 * Motion plays once, except the films, the letters' light and the closing
 * card's turning mark. Under reduced motion every `.rv` is placed at once, the
 * letters stay unlit and the films stay on their posters.
 *
 * ─── NOTHING HIDDEN WITHOUT SCRIPTING ──────────────────────────────────────
 * The sheet starts each `.rv` low and faded, which is right while this runs
 * and wrong when it never will. The `<noscript>` style draws the page at rest
 * then, as reduced motion does, so a reader with scripting off sees all of it.
 */

const NO_SCRIPT =
  "<style>.cr-main .rv{opacity:1;transform:none;transition:none}" +
  ".v-team .on,.v-async .msg{opacity:1;transform:none}" +
  ".v-team .link,.v-doc .ln,.v-doc .ok,.v-res .up{stroke-dashoffset:0}" +
  ".v-res .bar{transform:none}.cr-line i{transition:none;transform:none}</style>";

/** The mock's margin: an element comes in a little before it reaches the fold. */
const ROOT_MARGIN = "0px 0px -6% 0px";
/** How long the light rests on each letter. */
const LIGHT_MS = 1600;

export function CareersMotion(): React.JSX.Element {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observes = typeof IntersectionObserver !== "undefined";
    const cleanups: (() => void)[] = [];

    const entering = [...document.querySelectorAll<HTMLElement>(".cr-main .rv")];
    if (still || !observes) {
      for (const el of entering) el.classList.add("is-in");
    } else {
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        },
        { threshold: 0.18, rootMargin: ROOT_MARGIN },
      );
      for (const el of entering) reveal.observe(el);
      cleanups.push(() => reveal.disconnect());
    }

    const letters = [...document.querySelectorAll<HTMLElement>(".cr-ht")];
    if (letters.length > 0 && !still) {
      let next = 0;
      let held = false;
      const hold = () => {
        held = true;
        for (const letter of letters) letter.classList.remove("is-lit");
      };
      const release = () => {
        held = false;
      };
      for (const letter of letters) {
        letter.addEventListener("mouseenter", hold);
        letter.addEventListener("mouseleave", release);
      }
      const walk = setInterval(() => {
        if (held || document.hidden) return;
        letters.forEach((letter, i) => letter.classList.toggle("is-lit", i === next));
        next = (next + 1) % letters.length;
      }, LIGHT_MS);
      cleanups.push(() => {
        clearInterval(walk);
        for (const letter of letters) {
          letter.removeEventListener("mouseenter", hold);
          letter.removeEventListener("mouseleave", release);
        }
      });
    }

    if (observes) {
      if (!still) {
        const films = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const video = entry.target as HTMLVideoElement;
              if (entry.isIntersecting) video.play()?.catch(() => {});
              else video.pause();
            }
          },
          { threshold: 0.35 },
        );
        for (const video of document.querySelectorAll(".cr-vid video")) films.observe(video);
        cleanups.push(() => films.disconnect());
      }

      const line = document.querySelector(".cr-line");
      if (line) {
        const draw = new IntersectionObserver(
          (entries) => {
            if (!entries[0]?.isIntersecting) return;
            line.classList.add("is-on");
            draw.disconnect();
          },
          { threshold: 0.6 },
        );
        draw.observe(line);
        cleanups.push(() => draw.disconnect());
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />;
}
