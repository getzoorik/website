"use client";

import { useRef } from "react";

import { CopyGlyph, TickGlyph } from "@/features/brand-assets/brand-assets-glyphs";
import { useCopyCommand } from "@/hooks/use-copy-command";

/**
 * One command to share on /referrals's white card: a muted `$ `, the command, and its Copy button, which copies
 * exactly the command, then says "Copied" with a tick for 1.6 s and is ready again. Nothing is stored.
 *
 * The copying is the site's one copy of it (`useCopyCommand`): the clipboard, else the old `execCommand` route, else
 * the command is selected in its line so the reader is one keystroke from done; the button keeps "Copy" then.
 *
 * The button is named for what it copies (`label`, the assessment's own "Copy the Coral command"), which a screen
 * reader reads in place of the label, so "Copied" is also said once in a polite live region beside it, as every copy
 * button on the site says it. The region is `.sr-only` (absolute), so it takes no place in the line's row.
 *
 * Without scripting the command is on the page all the same, ready to select.
 */
export function ShareCommand({
  command,
  label,
  strings,
}: {
  readonly command: string;
  readonly label: string;
  readonly strings: { readonly idle: string; readonly done: string; readonly announcement: string };
}): React.JSX.Element {
  const line = useRef<HTMLElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const { state, copy } = useCopyCommand(command, line, button);
  const done = state === "done";

  return (
    <div className="cp-cmd">
      <code ref={line} translate="no">
        <i aria-hidden="true">$ </i>
        {command}
      </code>
      <button
        ref={button}
        type="button"
        className="cp-copy"
        data-copy={command}
        aria-label={label}
        data-done={done ? "" : undefined}
        onClick={copy}
      >
        <CopyGlyph className="cp-c1" />
        <TickGlyph className="cp-c2" />
        <span>{done ? strings.done : strings.idle}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? strings.announcement : ""}
      </span>
    </div>
  );
}
