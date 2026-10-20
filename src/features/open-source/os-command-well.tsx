"use client";

import { useRef } from "react";

import { documentCopyButton } from "@/content/documents";
import { CopyGlyph, TickGlyph } from "@/features/assessment/assessment-marks";
import { CommandLines, useWellReach } from "@/features/documents/doc-command-well";
import { useCopyCommand } from "@/hooks/use-copy-command";

/**
 * A guide's command well: "$ " only where a command starts, a continuation's
 * indent kept on its line, and the docs' Copy button, which copies the plain lines.
 */
export function OsCommandWell({ text }: { readonly text: string }): React.JSX.Element {
  const lines = text.split("\n");
  const pre = useRef<HTMLPreElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const { state, copy } = useCopyCommand(text, pre, button);
  useWellReach(pre, false);
  const done = state === "done";
  return (
    <>
      <div className="as-well doc-well">
        <pre ref={pre}>
          <CommandLines lines={lines} prompt="$ " />
        </pre>
        <button
          ref={button}
          className="as-copy"
          type="button"
          aria-label="Copy the command"
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
    </>
  );
}
