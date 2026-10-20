"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { assessmentCopy } from "@/content/assessment";
import type { ProductId } from "@/content/products";
import { DownGlyph } from "@/features/assessment/assessment-marks";

const { get, run: runCopy } = assessmentCopy;

/** One run, as the page draws it (the facts of its report are read at build by the server page). */
export interface DemoView {
  readonly product: ProductId;
  readonly name: string;
  readonly kind: string;
  readonly run: string;
  readonly found: string;
  readonly saving: string;
  readonly file: string;
  readonly download: string;
  readonly pdf: string;
  readonly thumb: string;
  /** "Example report · PDF · 2 pages · 138 KB". */
  readonly facts: string;
  /** "Download the Coral example report, PDF, 2 pages, 138 KB". */
  readonly spoken: string;
}

/** Where a run stands: at rest (`armed` false) it is shown finished; armed, it shows what has played so far. */
interface RunState {
  readonly armed: boolean;
  /** How many of the four lines are on. */
  readonly on: number;
  /** The characters typed on each command line. */
  readonly typed: readonly number[];
  readonly typing: number | null;
  readonly fileOn: boolean;
}

const LINES = 4;
const AT_REST: RunState = { armed: false, on: LINES, typed: [], typing: null, fileOn: false };
const ARMED: RunState = {
  armed: true,
  on: 0,
  typed: Array(LINES).fill(0),
  typing: null,
  fileOn: false,
};

const subscribeToNothing = () => () => {};

/** Motion is allowed where the browser can tell when a run is in view and the reader has not asked for less. */
const motionAllowed = () =>
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The four lines' commands: the one that is typed, and `null` for an output line. */
const commands = (demo: DemoView): readonly (string | null)[] => [demo.run, null, null, null];

/**
 * What you get: Coral's run and Amoeba's side by side, both always shown. Each is a terminal
 * (decorative, `aria-hidden`, its four-line height reserved from the start) and, under it, its example report to
 * download.
 *
 * ─── EACH RUN PLAYS ONCE, AS IT COMES INTO VIEW ────────────────────────────
 * When a run is half in view: 220ms, its one command (`npx -y zoorik assess …`) types (38–72ms a character, with a
 * blinking caret) and holds 280ms; the first output follows 720ms after it, the next 300ms apart; 260ms after the
 * last line the report card rises, and its Download button nudges once. Two runs that arrive together
 * start Coral first and Amoeba 700ms later.
 *
 * ─── NO MOTION WITHOUT SCRIPT, AND NONE FOR READERS WHO ASK FOR LESS ───────
 * The server draws both runs finished. Only a browser that allows motion and has an IntersectionObserver arms them
 * (hides what is still to come), just before they play.
 */
export function AssessmentDemos({
  demos,
}: {
  readonly demos: readonly DemoView[];
}): React.JSX.Element {
  /* False on the server and in the render that hydrates, so the prerendered runs are finished; true straight after
     where motion is allowed, which arms them. */
  const motion = useSyncExternalStore(subscribeToNothing, motionAllowed, () => false);
  const [runs, setRuns] = useState<readonly RunState[]>(() => demos.map(() => ARMED));
  const boxes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!motion) return;
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    const update = (index: number, change: (state: RunState) => RunState) =>
      setRuns((all) => all.map((state, at) => (at === index ? change(state) : state)));

    const play = async (index: number, delay: number) => {
      const lines = commands(demos[index]!);
      await wait(delay);
      let previousWasCommand = false;
      for (let line = 0; line < LINES; line += 1) {
        const command = lines[line];
        await wait(command ? 220 : previousWasCommand ? 720 : 300);
        previousWasCommand = Boolean(command);
        if (!alive) return;
        update(index, (state) => ({ ...state, on: line + 1, typing: command ? line : null }));
        if (!command) continue;
        for (let char = 1; char <= command.length; char += 1) {
          update(index, (state) => ({
            ...state,
            typed: state.typed.map((count, at) => (at === line ? char : count)),
          }));
          await wait(38 + Math.random() * 34);
          if (!alive) return;
        }
        await wait(280);
        update(index, (state) => ({ ...state, typing: null }));
      }
      await wait(260);
      if (alive) update(index, (state) => ({ ...state, fileOn: true }));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, order) => {
            observer.unobserve(entry.target);
            void play(boxes.current.indexOf(entry.target as HTMLDivElement), order * 700);
          });
      },
      { threshold: 0.5 },
    );
    boxes.current.forEach((box) => box && observer.observe(box));
    return () => {
      alive = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [demos, motion]);

  return (
    <div className="ax-get-in" id="ax-demos">
      {demos.map((demo, index) => {
        const state = motion ? (runs[index] ?? ARMED) : AT_REST;
        const lines = commands(demo);
        const on = (line: number) => (state.armed && state.on > line ? " on" : "");
        const typed = (line: number) => {
          const text = lines[line] ?? "";
          return (
            <span className={state.typing === line ? "ty is-typing" : "ty"}>
              {state.armed ? text.slice(0, state.typed[line] ?? 0) : text}
            </span>
          );
        };
        return (
          <div
            className={state.armed ? "ax-demo is-armed" : "ax-demo"}
            data-p={demo.product}
            key={demo.product}
            ref={(node) => {
              boxes.current[index] = node;
            }}
          >
            <p className="ax-demo-h">
              <ProductMark product={demo.product} />
              <span translate="no">{demo.name}</span> <small>{demo.kind}</small>
            </p>
            <div className="ax-term" aria-hidden="true">
              <div className="ax-term-bar">
                <i />
                <i />
                <i />
                <span>{runCopy.bar}</span>
              </div>
              <div className="ax-term-b">
                <div className={`ln cmd${on(0)}`}>
                  <span className="p">$ </span>
                  {typed(0)}
                </div>
                <div className={`ln out${on(1)}`}>
                  <span className="ok">✓</span> {demo.found}
                </div>
                <div className={`ln out${on(2)}`}>
                  <span className="k">{get.saving}</span>
                  <span className="v">{demo.saving}</span>
                </div>
                <div className={`ln out${on(3)}`}>
                  <span className="k">{get.report}</span>
                  <span className="f">{demo.file}</span>
                </div>
              </div>
            </div>
            <div className={state.armed && state.fileOn ? "ax-file on" : "ax-file"}>
              {/* A plain <img>: the thumbnail is encoded once in public/reports, and the sheet owns its box. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
              <img
                className="ax-file-th"
                src={demo.thumb}
                alt=""
                width={92}
                height={130}
                loading="lazy"
              />
              <div className="ax-file-t">
                <b translate="no">{demo.file}</b>
                <span>{demo.facts}</span>
              </div>
              <a
                className="ax-dl"
                href={demo.pdf}
                download={demo.download}
                aria-label={demo.spoken}
              >
                <DownGlyph />
                <span>{get.download}</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
