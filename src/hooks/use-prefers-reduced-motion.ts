"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Whether the reader has asked for less motion.
 *
 * ─── WHY useSyncExternalStore RATHER THAN useState + useEffect ─────────────
 * The obvious shape reads the query in an effect and calls `setState`, which
 * renders the WRONG answer first and corrects it a frame later — so a reader who
 * asked for no motion still sees the first frame of the animation they opted out
 * of. This is the primitive for a value that lives outside React: it takes a
 * server snapshot and a client snapshot and lets them differ, which is the
 * honest description of a media query.
 *
 * The server snapshot is `false`. There is no way to know a preference before
 * there is a browser, and `false` is what the markup is authored for — every
 * animation on this site is additive, so guessing "no preference" degrades to
 * the static page rather than to a broken one.
 *
 * It also tracks CHANGES, which the mock does not: it reads the query once at
 * boot, so a reader who turns the preference on mid-session keeps the motion
 * until they reload.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
