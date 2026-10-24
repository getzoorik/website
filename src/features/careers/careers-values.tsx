"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { careers } from "@/content/careers";
import { ValueScene } from "@/features/careers/careers-scenes";
import { named } from "@/features/legal/named";

/**
 * Our values (option A, 24 Oct 2026, as its third pass of 25 Oct leaves it):
 * six tabs, the chosen one in ink, and one panel at a time: the value's scene
 * (`ValueScene`), and beside it the value's name, its meaning in one line and
 * every behaviour by its name, after a small square bullet. On a phone the
 * scene sits on top. No question, no tint, no progress line and no
 * Previous/Next bar.
 *
 * ─── WAI-ARIA TABS ─────────────────────────────────────────────────────────
 * The arrow keys, Home and End move between the tabs and wrap; only the chosen
 * tab is in the tab order, and its panel follows it.
 *
 * ─── IT PLAYS BY ITSELF UNTIL TOUCHED ──────────────────────────────────────
 * While at least 40% of it is in view, the next value opens every seven
 * seconds. Hovering holds it; any click or key inside it, or focus moving into
 * it, stops it for good, so a keyboard or screen-reader user's tab never
 * changes under them. Under reduced motion it never plays.
 *
 * ─── EACH SCENE PLAYS WHILE ITS VALUE IS OPEN ──────────────────────────────
 * The open panel's scene loops while a quarter of the picker is in view
 * (`.is-on`); a hidden panel draws nothing. Under reduced motion, or without
 * scripting (the `<noscript>` style), each scene holds its still frame.
 *
 * ─── A VALUE HAS AN ADDRESS ────────────────────────────────────────────────
 * `#val-<id>` (or `#tab-<id>`) opens that value, on arrival or when the hash
 * changes, and brings the section into view: the browser cannot scroll to a
 * hidden panel. It stops the autoplay, as a click does. Every panel is in the
 * markup; without scripting the tabs, which would do nothing, step aside and
 * every value shows, one under the other.
 */

/** How long a value stays open before the next one plays. */
const AUTO_MS = 7000;
/** The mock's thresholds: the autoplay runs while 40% of the picker is in view, the scene while 25% is. */
const AUTO_IN_VIEW = 0.4;
const SCENE_IN_VIEW = 0.25;
const ON = "is-on";

/**
 * Without scripting: every value, no tabs, and each scene at its still frame, as reduced motion draws it
 * (careers-scenes.css). repo: Tailwind's preflight hides `[hidden]` with `!important` in `@layer base`, which no
 * unlayered rule can outrank, so the panels are shown from the same layer, by a more specific selector.
 */
const NO_SCRIPT =
  "<style>.cq-pick .cq-tabs{display:none}@layer base{.cq-pick .cq-panel[hidden]{display:grid!important}}" +
  ".sc *{animation:none!important;transition:none!important}</style>";

/** The value a hash names: `#val-<id>` (its panel) or `#tab-<id>` (its tab). */
const HASH = /^#(?:val|tab)-(.+)$/;

interface Pick {
  readonly index: number;
  /** Each pick, counted, so picking the open value again replays its panel. */
  readonly count: number;
  readonly focus: boolean;
}

export function CareersValues(): React.JSX.Element {
  const { id, title, tabsLabel, list } = careers.values;
  const [pick, setPick] = useState<Pick>({ index: 0, count: 0, focus: false });
  const root = useRef<HTMLDivElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const choose = useCallback((index: number, focus = false) => {
    setPick((prev) => ({ index, count: prev.count + 1, focus }));
  }, []);

  /* The open panel arrives (`.is-in`); the first paint has none, as the mock's does. A layout
     effect, so a panel the autoplay opens never paints once at rest before its fade starts: the
     mock un-hides it and replays it in one task. */
  useLayoutEffect(() => {
    if (pick.count === 0) return;
    const panel = panels.current[pick.index];
    if (panel) {
      panel.classList.remove("is-in");
      void panel.offsetWidth;
      panel.classList.add("is-in");
    }
    if (pick.focus) tabs.current[pick.index]?.focus();
  }, [pick]);

  /* The autoplay, the scenes' trigger and the values' addresses. */
  useEffect(() => {
    const el = root.current;
    if (el === null) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observes = typeof IntersectionObserver !== "undefined";

    let timer: ReturnType<typeof setTimeout> | undefined;
    let seen = false;
    let held = false;
    let stopped = false;
    const rest = () => clearTimeout(timer);
    const run = () => {
      rest();
      if (still || stopped || held || !seen) return;
      timer = setTimeout(() => {
        setPick((prev) => ({
          index: (prev.index + 1) % list.length,
          count: prev.count + 1,
          focus: false,
        }));
        run();
      }, AUTO_MS);
    };
    const stop = () => {
      stopped = true;
      rest();
    };
    const hold = () => {
      held = true;
      rest();
    };
    const resume = () => {
      held = false;
      run();
    };

    const fromHash = () => {
      const wanted = HASH.exec(window.location.hash)?.[1];
      const index = list.findIndex((value) => value.id === wanted);
      if (index < 0) return;
      stop();
      choose(index);
      el.closest("section")?.scrollIntoView({ block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);

    el.addEventListener("click", stop, true);
    el.addEventListener("keydown", stop, true);
    el.addEventListener("focusin", stop);
    el.addEventListener("mouseenter", hold);
    el.addEventListener("mouseleave", resume);

    const watches: IntersectionObserver[] = [];
    if (still || !observes) {
      el.classList.add(ON);
    } else {
      const play = new IntersectionObserver(
        (entries) => {
          const latest = entries[entries.length - 1];
          if (latest) el.classList.toggle(ON, latest.isIntersecting);
        },
        { threshold: SCENE_IN_VIEW },
      );
      const auto = new IntersectionObserver(
        (entries) => {
          seen = entries[entries.length - 1]?.isIntersecting ?? false;
          if (seen) run();
          else rest();
        },
        { threshold: AUTO_IN_VIEW },
      );
      play.observe(el);
      auto.observe(el);
      watches.push(play, auto);
    }

    return () => {
      window.removeEventListener("hashchange", fromHash);
      el.removeEventListener("click", stop, true);
      el.removeEventListener("keydown", stop, true);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("mouseenter", hold);
      el.removeEventListener("mouseleave", resume);
      for (const watch of watches) watch.disconnect();
      rest();
    };
  }, [choose, list]);

  const onKey = (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const to = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: list.length - 1 }[
      event.key
    ];
    if (to === undefined) return;
    event.preventDefault();
    choose((to + list.length) % list.length, true);
  };

  return (
    <section className="sec sec-band cq-band" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${id}-h`}>{title}</h2>
        </div>
        <div className="cq-pick" ref={root}>
          <div className="cq-tabs" role="tablist" aria-label={tabsLabel}>
            {list.map((value, i) => {
              const on = i === pick.index;
              return (
                <button
                  className="cq-tab"
                  role="tab"
                  type="button"
                  id={`tab-${value.id}`}
                  aria-controls={`val-${value.id}`}
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(i)}
                  onKeyDown={onKey(i)}
                  ref={(node) => {
                    tabs.current[i] = node;
                  }}
                  key={value.id}
                >
                  <span className="cq-tl" aria-hidden="true">
                    {value.letter}
                  </span>
                  <span className="cq-tn">{value.name}</span>
                </button>
              );
            })}
          </div>
          {list.map((value, i) => (
            <div
              className="cq-panel"
              role="tabpanel"
              id={`val-${value.id}`}
              aria-labelledby={`tab-${value.id}`}
              tabIndex={0}
              hidden={i !== pick.index}
              ref={(node) => {
                panels.current[i] = node;
              }}
              key={value.id}
            >
              <ValueScene id={value.id} />
              <div className="cq-pr">
                <h3>{value.name}</h3>
                <p className="cq-mean">{named(value.meaning)}</p>
                <ul className="cq-beh">
                  {value.behaviours.map((behaviour) => (
                    <li key={behaviour}>{behaviour}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />
      </div>
    </section>
  );
}
