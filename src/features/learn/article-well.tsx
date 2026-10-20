"use client";

import { Fragment, useRef } from "react";

import { documentCopyButton } from "@/content/documents";
import { CopyGlyph, TickGlyph } from "@/features/assessment/assessment-marks";
import { useWellReach } from "@/features/documents/doc-command-well";
import { useCopyCommand } from "@/hooks/use-copy-command";

/**
 * A code well in a Learn article: the documents' dark `.as-well`, in the language its fence names.
 *
 * A shell well prints "$ " where each command starts, and nowhere else: not on a line that continues the one before
 * (it ends in `\`), a comment, a blank line, an indented line inside a loop, or the word that closes or turns a
 * block (`done`, `fi`, `else`…). The prompt is `aria-hidden` and not selectable, and Copy copies the plain lines.
 *
 * A YAML or JSON well (`is-yaml`) scrolls sideways rather than wrap, because a wrapped line would read as a new key;
 * a one-line well (`is-line`) scrolls sideways too. An output well, fenced as text or with no language, has no Copy
 * button: there is nothing in it to run.
 */

const SHELL = new Set(["bash", "sh", "shell", "console", "zsh"]);
const STRUCTURED = new Set(["yaml", "yml", "json"]);
const OUTPUT = new Set(["text", "txt", "output", ""]);

/** A line that closes or turns a shell block, which takes no prompt of its own. */
const BLOCK_WORD = /^(done|fi|esac|else|elif|then|do|\})\b/;

/** Which lines of a shell well start a command, and so take "$ ". */
export function promptedLines(lang: string, lines: readonly string[]): boolean[] {
  const shell = SHELL.has(lang.toLowerCase());
  let continued = false;
  return lines.map((line) => {
    const prompt =
      shell &&
      line.trim() !== "" &&
      !continued &&
      !line.trimStart().startsWith("#") &&
      line === line.trimStart() &&
      !BLOCK_WORD.test(line);
    continued = shell && line.trimEnd().endsWith("\\");
    return prompt;
  });
}

export function ArticleWell({
  lang,
  code,
}: {
  readonly lang: string;
  readonly code: string;
}): React.JSX.Element {
  const kind = lang.toLowerCase();
  const lines = code.split("\n");
  const prompts = promptedLines(kind, lines);
  const yaml = STRUCTURED.has(kind);
  const line = lines.length === 1;
  const copyable = !OUTPUT.has(kind);
  const pre = useRef<HTMLPreElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const { state, copy } = useCopyCommand(code, pre, button);
  useWellReach(pre, line);
  const done = state === "done";
  const classes = ["as-well", "doc-well", yaml ? "is-yaml" : null, line ? "is-line" : null];

  return (
    <div className={classes.filter(Boolean).join(" ")}>
      <pre ref={pre}>
        {lines.map((text, index) => (
          <Fragment key={index}>
            {index > 0 ? "\n" : null}
            {prompts[index] ? <i aria-hidden="true">$ </i> : null}
            {text}
          </Fragment>
        ))}
      </pre>
      {copyable ? (
        <>
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
          {/* Inside the well, so nothing stands between the well and what follows it in the prose. */}
          <span className="sr-only" aria-live="polite">
            {done ? documentCopyButton.doneAnnouncement : ""}
          </span>
        </>
      ) : null}
    </div>
  );
}
