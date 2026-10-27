"use client";

import { useEffect, useRef } from "react";

/**
 * "Without the risk"'s drawings, run only while the band is on screen.
 *
 * Every drawing loops (8s, the traffic 2.4s) on rules home.css writes paused;
 * this island gives the band `.wv-run` while at least 15% of it is in view and
 * takes it off again once it has gone, so the loops never run unseen. The mock's
 * own script, one observer on `#why`; this one finds its band as the section it
 * sits in.
 *
 * Under reduced motion the sheet holds each drawing's after state, whatever the
 * class. Without an observer the drawings simply run.
 *
 * ─── NOTHING HIDDEN WITHOUT SCRIPTING ──────────────────────────────────────
 * Paused at their first frame the log's entries would sit unseen, so the
 * `<noscript>` style puts each drawing in its after state, exactly as reduced
 * motion does.
 */

const RUN = "wv-run";
/** The mock's threshold: the loops run once 15% of the band is in view. */
const IN_VIEW = 0.15;

const NO_SCRIPT =
  "<style>#why .wv-svg *{animation:none!important}.wv-prov{transform:translateY(24px)}" +
  ".wv-nodeC{opacity:.28}.wv-c1,.wv-c2{transform:translate(-68px,20px)}" +
  ".wv-cap{transform:scaleX(.66)}.wv-sw{fill:var(--accent)}.wv-swk{transform:translateX(16px)}</style>";

export function WhyMotion(): React.JSX.Element {
  const marker = useRef<HTMLElement>(null);

  useEffect(() => {
    const band = marker.current?.closest("section");
    if (!band) return;
    if (typeof IntersectionObserver === "undefined") {
      band.classList.add(RUN);
      return;
    }
    const watch = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        if (latest) band.classList.toggle(RUN, latest.isIntersecting);
      },
      { threshold: IN_VIEW },
    );
    watch.observe(band);
    return () => watch.disconnect();
  }, []);

  return <noscript ref={marker} dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />;
}
