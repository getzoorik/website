"use client";

import { useEffect } from "react";

/**
 * /referrals's and /partners's motion (the mock's `PV_JS`): each navy panel (`.pv-anim`) plays once, the first time a
 * quarter of it is in view (`.is-on`). On /referrals the line over the journey draws and the three steps rise one
 * after another; on /partners the three ranges grow along their scale.
 *
 * Under reduced motion the sheet hides and moves nothing (its motion rules live only under `no-preference`), so the
 * panels are drawn at rest; this marks them played anyway. A browser without IntersectionObserver plays them at once.
 *
 * ─── NOTHING HIDDEN WITHOUT SCRIPTING ──────────────────────────────────────
 * The sheet starts the steps faded and the line and the ranges undrawn, which is right while this runs and wrong when
 * it never will. The `<noscript>` style draws them at rest then, as reduced motion does, so a reader with scripting
 * off sees everything.
 */

const NO_SCRIPT =
  "<style>.pv-main .pv-anim .pv-step{opacity:1;transform:none;transition:none}" +
  ".pv-main .pv-anim .pv-line b,.pv-main .pv-anim .pv-track i{transform:none;transition:none}</style>";

/** The share of a panel in view that plays it (the mock's threshold). */
const THRESHOLD = 0.25;

export function ProgramsMotion(): React.JSX.Element {
  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>(".pv-main .pv-anim")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || typeof IntersectionObserver === "undefined") {
      for (const panel of panels) panel.classList.add("is-on");
      return;
    }
    const play = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-on");
          play.unobserve(entry.target);
        }
      },
      { threshold: THRESHOLD },
    );
    for (const panel of panels) play.observe(panel);
    return () => play.disconnect();
  }, []);

  return <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />;
}
