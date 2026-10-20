"use client";

import { useEffect, useState } from "react";

/**
 * Whether the top bar has passed the hero and must ground itself.
 *
 * ─── THIS IS LEGIBILITY, NOT DECORATION ────────────────────────────────────
 * Over the hero the bar is transparent and its wordmark and links are white,
 * because the hero is a dark photograph. Every section below it is white. A bar
 * that never flips is white type on white paper from the first scroll — the
 * navigation simply disappears, and it disappears for everyone rather than
 * degrading.
 *
 * ─── THE 24px OF HYSTERESIS IS THE WHOLE TRICK ─────────────────────────────
 * Ground and ink flip in the same frame, so a single threshold makes a scroll
 * that hovers on it STROBE — the bar blinking between two states while the
 * reader's finger is still on the trackpad. Holding whichever state we are
 * already in until the reader is 24px clear of the boundary costs nothing:
 * both states are self-grounded, so either one is legible anywhere in the band.
 *
 * The edge is the hero's own height less the bar, so the flip happens exactly
 * as the bar's bottom meets the hero's — measured rather than guessed, which is
 * why this takes the hero's height as an argument instead of a magic number.
 */

/** The bar's height. The flip lands when its bottom meets the hero's bottom. */
const BAR_H = 84;
const HYSTERESIS = 24;

export function useNavSolid(heroSelector = ".hero"): boolean {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(heroSelector);
    /* No hero on the page means nothing to pass, so the bar keeps its
       transparent state rather than grounding itself over nothing. */
    if (hero === null) return;

    let current = false;
    const sync = () => {
      const edge = hero.offsetHeight - BAR_H;
      const next = current ? window.scrollY > edge - HYSTERESIS : window.scrollY > edge;
      if (next === current) return;
      current = next;
      setSolid(next);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [heroSelector]);

  return solid;
}
