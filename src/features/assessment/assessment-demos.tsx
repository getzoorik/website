"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { assessmentCopy } from "@/content/assessment";
import { DownGlyph } from "@/features/assessment/assessment-marks";

const { run, get } = assessmentCopy;

/** The example report under the run, as the server page read it from the file ("PDF · 4 pages · 219 KB"). */
export interface DemoFile {
  readonly pdf: string;
  readonly facts: string;
  /** "Download the example report, PDF, 4 pages, 219 KB". */
  readonly spoken: string;
}

/** Where the run stands: at rest (`armed` false) it is shown finished; armed, it shows what has played so far. */
interface RunState {
  readonly armed: boolean;
  /** How many of the lines are on. */
  readonly on: number;
  /** The characters of the command typed so far. */
  readonly typed: number;
  readonly typing: boolean;
  readonly fileOn: boolean;
}

/** The typed command, the tick line, and the three result lines. */
const LINES = 2 + get.lines.length;
const AT_REST: RunState = { armed: false, on: LINES, typed: 0, typing: false, fileOn: false };
const ARMED: RunState = { armed: true, on: 0, typed: 0, typing: false, fileOn: false };

const subscribeToNothing = () => () => {};

/** Motion is allowed where the browser can tell when the run is in view and the reader has not asked for less. */
const motionAllowed = () =>
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * What you get's run: a terminal (decorative, `aria-hidden`, its five-line height reserved from the start) and, under
 * it, the example report to download.
 *
 * ─── THE RUN PLAYS ONCE, AS IT COMES INTO VIEW ─────────────────────────────
 * When its terminal is half in view below the fixed nav: 220ms, the command (`npx zoorik assess`) types (38–72ms a
 * character, with a blinking caret) and holds 280ms; the first output follows 720ms after it, the next 300ms apart;
 * 260ms after the last line the report card rises, and its Download button nudges once. The terminal alone is watched:
 * on a phone the card under it would hold the run back.
 *
 * ─── NO MOTION WITHOUT SCRIPT, AND NONE FOR READERS WHO ASK FOR LESS ───────
 * The server draws the run finished. Only a browser that allows motion and has an IntersectionObserver arms it (hides
 * what is still to come), just before it plays.
 */
export function AssessmentDemo({ file }: { readonly file: DemoFile }): React.JSX.Element {
  /* False on the server and in the render that hydrates, so the prerendered run is finished; true straight after
     where motion is allowed, which arms it. */
  const motion = useSyncExternalStore(subscribeToNothing, motionAllowed, () => false);
  const [played, setPlayed] = useState<RunState>(ARMED);
  const term = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion || !term.current) return;
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    const update = (change: (state: RunState) => RunState) => setPlayed(change);

    const play = async () => {
      await wait(220);
      if (!alive) return;
      update((state) => ({ ...state, on: 1, typing: true }));
      for (let char = 1; char <= run.command.length; char += 1) {
        update((state) => ({ ...state, typed: char }));
        await wait(38 + Math.random() * 34);
        if (!alive) return;
      }
      await wait(280);
      update((state) => ({ ...state, typing: false }));
      for (let line = 1; line < LINES; line += 1) {
        await wait(line === 1 ? 720 : 300);
        if (!alive) return;
        update((state) => ({ ...state, on: line + 1 }));
      }
      await wait(260);
      if (alive) update((state) => ({ ...state, fileOn: true }));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void play();
      },
      { threshold: 0.5, rootMargin: "-96px 0px 0px 0px" },
    );
    observer.observe(term.current);
    return () => {
      alive = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [motion]);

  const state = motion ? played : AT_REST;
  const on = (line: number) => (state.armed && state.on > line ? " on" : "");

  return (
    <div className={state.armed ? "ax-demo is-armed" : "ax-demo"}>
      <div className="ax-term" aria-hidden="true" ref={term}>
        <div className="ax-term-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="ax-term-b">
          <div className={`ln cmd${on(0)}`}>
            <span className="p">$ </span>
            <span className={state.typing ? "ty is-typing" : "ty"}>
              {state.armed ? run.command.slice(0, state.typed) : run.command}
            </span>
          </div>
          <div className={`ln out${on(1)}`}>
            <span className="ok">✓</span> {get.found}
          </div>
          {get.lines.map((line, index) => (
            <div className={`ln out${on(index + 2)}`} key={line.key}>
              <span className="k">{line.key}</span>
              <span className={line.tone}>{line.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={state.armed && state.fileOn ? "ax-file on" : "ax-file"}>
        <div className="ax-file-t">
          <b>{get.kind}</b>
          <span>{file.facts}</span>
        </div>
        <a className="ax-dl" href={file.pdf} download={get.downloadAs} aria-label={file.spoken}>
          <DownGlyph />
          <span>{get.download}</span>
        </a>
      </div>
    </div>
  );
}
