"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { documentCopyButton } from "@/content/documents";
import { CopyGlyph, TickGlyph } from "@/features/assessment/assessment-marks";
import { PromptedLines, useWellReach } from "@/features/documents/doc-command-well";
import { useCopyCommand } from "@/hooks/use-copy-command";

/**
 * The install, one well under a [macOS | Linux | Windows] switch: a light
 * segmented control, then the dark well with the chosen system's command and a
 * copy button.
 *
 * ─── THE VISITOR'S SYSTEM FIRST, AND NOTHING STORED ────────────────────────
 * The page is prerendered with macOS checked, as the mock's markup is; once in
 * the browser the visitor's own system is read from the user agent, the mock's
 * rule word for word: Windows on `win`, Linux on `linux`, `x11` or `cros` (but
 * not Android), macOS otherwise. A pick lasts until the page is left: no
 * cookie and no browser storage, as the privacy policy promises.
 *
 * ─── A RADIO GROUP ─────────────────────────────────────────────────────────
 * Click selects. Arrow Right or Down picks the next, Left or Up the previous
 * (both wrap), Home and End the first and the last; keyboard selection moves
 * focus with it. Only the checked button is in the tab order.
 *
 * ─── COPY ──────────────────────────────────────────────────────────────────
 * `useCopyCommand`, shared with the assessment: the command alone, no prompt.
 * "Copied" with a tick for 1.6s, announced once in the polite live region. If
 * both copy routes fail, the command is selected in its well and the label
 * stays "Copy", as the mock does. The button's accessible name ("Copy the
 * macOS command") follows the switch and never changes on copy; a new pick
 * clears a standing "Copied".
 */

export type OsKey = "mac" | "linux" | "windows";

export interface DocOsOption {
  readonly os: OsKey;
  /** The button's label, and the system the copy button names: "macOS". */
  readonly name: string;
  readonly prompt: "$ " | "PS> ";
  /** The command's lines, without prompts: what Copy copies. */
  readonly lines: readonly string[];
}

/** The visitor's system, from the user agent (the mock's rule). */
function systemOs(): OsKey {
  const agent = navigator as Navigator & {
    readonly userAgentData?: { readonly platform?: string };
  };
  const ua = `${agent.userAgentData?.platform || agent.platform || ""} ${agent.userAgent}`;
  if (/win/i.test(ua)) return "windows";
  if (/linux|x11|cros/i.test(ua) && !/android/i.test(ua)) return "linux";
  return "mac";
}

/* The user agent does not change while the page is open: nothing to subscribe to. */
const noChange = () => () => {};

export function DocOsWell({
  options,
}: {
  readonly options: readonly DocOsOption[];
}): React.JSX.Element {
  /* macOS while prerendering and hydrating, so the markup matches; then the visitor's. */
  const system = useSyncExternalStore<OsKey>(noChange, systemOs, () => "mac");
  const [choice, setChoice] = useState<OsKey | null>(null);
  const wanted = choice ?? system;
  const current = options.find((option) => option.os === wanted) ?? options[0]!;

  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const pre = useRef<HTMLPreElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const { state, copy, reset } = useCopyCommand(current.lines.join("\n"), pre, copyButton);
  useWellReach(pre, false);

  const pick = (index: number, focus: boolean) => {
    const option = options[index];
    if (!option) return;
    setChoice(option.os);
    reset();
    if (focus) buttons.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    pick(next, true);
  };

  const done = state === "done";
  return (
    <div className="os">
      <div className="os-sw" role="radiogroup" aria-label="Operating system">
        {options.map((option, index) => {
          const on = option === current;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={on ? "true" : "false"}
              tabIndex={on ? 0 : -1}
              data-os={option.os}
              key={option.os}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              onClick={() => pick(index, false)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {option.name}
            </button>
          );
        })}
      </div>
      <div className="as-well doc-well">
        <pre ref={pre}>
          <PromptedLines lines={current.lines} prompt={current.prompt} />
        </pre>
        <button
          ref={copyButton}
          className="as-copy"
          type="button"
          aria-label={`Copy the ${current.name} command`}
          data-done={done ? "" : undefined}
          onClick={copy}
        >
          <CopyGlyph className="c1" />
          <TickGlyph className="c2" />
          <span>{done ? documentCopyButton.done : documentCopyButton.idle}</span>
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {done ? documentCopyButton.doneAnnouncement : ""}
      </span>
    </div>
  );
}
