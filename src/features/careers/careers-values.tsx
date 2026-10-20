"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { Arrow } from "@/components/primitives/arrow";
import { careers } from "@/content/careers";
import { BackGlyph, TickGlyph } from "@/features/careers/careers-glyphs";
import { named } from "@/features/legal/named";

/**
 * Our values (the mock's picker): six tabs, one panel at a time with the
 * value's meaning in one line, every behaviour by its name, and the question
 * its values interview asks, under a plain "We ask", with no "C · 1 of 6" and
 * no blue caps label over a panel.
 *
 * ─── WAI-ARIA TABS ─────────────────────────────────────────────────────────
 * The arrow keys, Home and End move between the tabs and wrap; only the chosen
 * tab is in the tab order, and its panel follows it. Each panel ends on the way
 * to the previous and the next value, the last one on How we work.
 *
 * ─── IT PLAYS BY ITSELF UNTIL TOUCHED ──────────────────────────────────────
 * While at least 40% of it is in view, the chosen tab's underline fills over
 * seven seconds and the next value opens. Hovering holds it; any click or key
 * inside it, focus moving into it, or a click on a hero letter, stops it for
 * good, so a keyboard or screen-reader user's tab never changes under them.
 * Under reduced motion it never plays.
 *
 * The hero's six letters (`a[data-go]`, server-rendered in the hero) open
 * their value here: their href takes the reader to `#values`, and this picks
 * the value. Every panel is in the markup, so the page reads whole without
 * scripting, the first value open.
 */

/** How long a value stays open before the next one plays (the sheet's `--auto`). */
const AUTO_MS = 7000;

interface Pick {
  readonly index: number;
  /** Each pick, counted, so picking the open value again replays its panel. */
  readonly count: number;
  readonly focus: boolean;
}

export function CareersValues(): React.JSX.Element {
  const { list, tabsLabel, questionLabel, after } = careers.values;
  const [pick, setPick] = useState<Pick>({ index: 0, count: 0, focus: false });
  const root = useRef<HTMLDivElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  /** Stops the autoplay for good: set while it can play. */
  const stopAuto = useRef<() => void>(() => {});

  const choose = useCallback((index: number, focus = false) => {
    setPick((prev) => ({ index, count: prev.count + 1, focus }));
  }, []);

  /* The open panel arrives (`.is-in`, its behaviours one after another); the first paint has
     none, as the mock's does. A layout effect, so a panel the autoplay opens never paints once
     at rest before its fade starts: the mock un-hides it and replays it in one task. */
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

  /* The hero's letters, and the autoplay. */
  useEffect(() => {
    const el = root.current;
    if (el === null) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onLetter = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const letter = event.target.closest<HTMLAnchorElement>("a[data-go]");
      if (!letter) return;
      const index = list.findIndex((value) => value.id === letter.dataset.go);
      if (index < 0) return;
      stopAuto.current();
      choose(index);
    };
    document.addEventListener("click", onLetter);

    if (still || typeof IntersectionObserver === "undefined") {
      return () => document.removeEventListener("click", onLetter);
    }

    el.style.setProperty("--auto", `${AUTO_MS}ms`);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let seen = false;
    let stopped = false;
    const rest = () => {
      clearTimeout(timer);
      el.classList.remove("is-auto");
    };
    const run = () => {
      rest();
      if (stopped || !seen) return;
      void el.offsetWidth;
      el.classList.add("is-auto");
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
    stopAuto.current = stop;
    const hold = () => {
      if (!stopped) rest();
    };
    const resume = () => {
      if (!stopped) run();
    };

    el.addEventListener("click", stop, true);
    el.addEventListener("keydown", stop, true);
    el.addEventListener("focusin", stop);
    el.addEventListener("mouseenter", hold);
    el.addEventListener("mouseleave", resume);
    const inView = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? false;
        if (seen) run();
        else rest();
      },
      { threshold: 0.4 },
    );
    inView.observe(el);

    return () => {
      document.removeEventListener("click", onLetter);
      el.removeEventListener("click", stop, true);
      el.removeEventListener("keydown", stop, true);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("mouseenter", hold);
      el.removeEventListener("mouseleave", resume);
      inView.disconnect();
      rest();
      stopAuto.current = () => {};
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

  /** A panel's previous and next buttons: open that value, focus its tab, and bring the tabs into
   *  view. Focus first, as the mock does: the browser then scrolls the tab clear of the fixed bar,
   *  and the nearest scroll after it has nothing left to do. */
  const go = (index: number) => () => {
    const tab = tabs.current[index];
    choose(index, true);
    tab?.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tab?.scrollIntoView({
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div className="cr-pick rv" ref={root}>
      <div className="cr-tabs" role="tablist" aria-label={tabsLabel}>
        {list.map((value, i) => {
          const on = i === pick.index;
          return (
            <button
              className="cr-tab"
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
              <span className="cr-tl" aria-hidden="true">
                {value.letter}
              </span>
              <span className="cr-tn">{value.name}</span>
            </button>
          );
        })}
      </div>
      {list.map((value, i) => {
        const prev = list[i - 1];
        const next = list[i + 1];
        return (
          <div
            className="cr-panel"
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
            <div className="cr-pl">
              <h3>{value.name}</h3>
              <p className="cr-mean">{named(value.meaning)}</p>
              <p className="cr-q">
                <span>{questionLabel}</span>“{named(value.question)}”
              </p>
            </div>
            <ul className="cr-live">
              {value.behaviours.map((behaviour, n) => (
                <li style={{ "--k": n } as CSSProperties} key={behaviour}>
                  <span className="cr-tick">
                    <TickGlyph />
                  </span>
                  <h4>{behaviour}</h4>
                </li>
              ))}
            </ul>
            <div className="cr-pnav">
              {prev ? (
                <button type="button" className="cr-pb" onClick={go(i - 1)}>
                  <BackGlyph />
                  <span>{prev.name}</span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button type="button" className="cr-pb is-next" onClick={go(i + 1)}>
                  <span>Next: {next.name}</span>
                  <Arrow />
                </button>
              ) : (
                <a className="cr-pb is-next" href={after.href}>
                  <span>{after.label}</span>
                  <Arrow />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
