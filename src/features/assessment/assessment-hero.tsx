"use client";

import { useEffect, useRef } from "react";

import { clarityEvent, clarityEvents } from "@/components/analytics/clarity-events";
import { assessmentCopy } from "@/content/assessment";
import { CopyGlyph, TickGlyph } from "@/features/assessment/assessment-marks";
import { useCopyCommand } from "@/hooks/use-copy-command";

const { run } = assessmentCopy;

/** The query keys of the product switch and the cloud tabs this page once had: an older link's copy of them leaves the
 *  address once the page arrives. */
const RETIRED_KEYS = ["p", "c"] as const;

/**
 * The hero's right side: What you get's terminal, its bar and the one command, `npx zoorik assess`, with Copy the one
 * white button. A copy turns the button to a tick and "Copied" for 1.6s; with no clipboard the line is selected
 * instead, and the live region says to copy it with the keyboard (`useCopyCommand`).
 */
export function AssessmentCommand(): React.JSX.Element {
  const pre = useRef<HTMLPreElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  /* A copy that worked names itself to Clarity (that a command was copied, not what); a blocked one is not counted,
     since nothing was copied. */
  const { state, copy } = useCopyCommand(run.command, pre, button, () =>
    clarityEvent(clarityEvents.commandCopied),
  );
  const done = state === "done";

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (!RETIRED_KEYS.some((key) => query.has(key))) return;
    RETIRED_KEYS.forEach((key) => query.delete(key));
    const rest = query.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`,
    );
  }, []);

  return (
    <div className="ax-hero-r">
      <div className="ax-term ax-cmds">
        <div className="ax-term-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="ax-line">
          <pre ref={pre} translate="no">
            <i aria-hidden="true">$ </i>
            {run.command}
          </pre>
          <button
            ref={button}
            className="ax-copy"
            type="button"
            aria-label={run.label}
            data-done={done ? "" : undefined}
            onClick={copy}
          >
            <CopyGlyph className="c1" />
            <TickGlyph className="c2" />
            <span>{done ? run.copied : run.copy}</span>
          </button>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {state === "done" ? run.copied : state === "blocked" ? run.blocked : ""}
      </span>
    </div>
  );
}
