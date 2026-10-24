"use client";

import { useEffect, useRef } from "react";

/**
 * How we work's drawings, run only while each card is on screen.
 *
 * Every drawing loops (6s) on rules careers-work.css writes paused; this island
 * gives a card `.is-on` while at least 25% of it is in view and takes it off
 * again once it has gone, so the loops never run unseen. The mock's own script,
 * one observer per card; this one finds its cards in the section it sits in.
 *
 * Under reduced motion the sheet holds each drawing's end state, whatever the
 * class. Without an observer the drawings simply run.
 *
 * ─── NOTHING HIDDEN WITHOUT SCRIPTING ──────────────────────────────────────
 * Paused at their first frame the page's lines, the messages and the commits
 * would sit unseen, so the `<noscript>` style puts each drawing in its end
 * state, exactly as reduced motion does.
 */

const ON = "is-on";
/** The mock's threshold: a card's loop runs once 25% of it is in view. */
const IN_VIEW = 0.25;

const NO_SCRIPT =
  "<style>.cq-wk .il *{animation:none!important}" +
  ".cq-wk .il-w-clock .as-m,.cq-wk .il-w-target .mg-c{opacity:1}" +
  ".cq-wk .il-w-doc .w-ln,.cq-wk .il-w-doc .w-ok,.cq-wk .il-w-target .mg-br{stroke-dashoffset:0}" +
  ".cq-wk .il-w-globe .w-pkt,.cq-wk .il-w-clock .as-now{display:none}</style>";

export function CareersWorkMotion(): React.JSX.Element {
  const marker = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const cards = [...section.querySelectorAll<HTMLElement>(".cq-wk")];
    if (typeof IntersectionObserver === "undefined") {
      for (const card of cards) card.classList.add(ON);
      return;
    }
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle(ON, entry.isIntersecting);
      },
      { threshold: IN_VIEW },
    );
    for (const card of cards) watch.observe(card);
    return () => watch.disconnect();
  }, []);

  return <noscript ref={marker} dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />;
}
