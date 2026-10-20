"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** How long "Copied" stands before the button offers to copy again: 1.6s, as the guide and the assessment flow draw it. */
const DONE_MS = 1600;

export type CopyState = "idle" | "done" | "blocked";

/**
 * Copying a command from a dark well: the assessment's two lines and every copy
 * button in the documents. One copy of the logic, so a fix to copying is made
 * once.
 *
 * ─── COPYING CAN FAIL, AND THE BUTTON SAYS WHAT TO DO INSTEAD ──────────────
 * The clipboard API needs a secure context and a permission the page may not
 * have. When it is missing or refuses, the old `execCommand` route is tried;
 * when that fails too, the command is SELECTED in its well (`pre`) and the
 * state is `blocked`, so the button can say "Select and copy" and the reader is
 * one keystroke from done rather than looking at a button that silently did
 * nothing. Focus goes back to the button (`button`), which the scratch
 * textarea took.
 *
 * `done` stands for 1.6s and then returns to `idle`; the timer restarts on
 * each copy. The caller draws the label and the polite announcement from the
 * state, each from its own strings, and may `reset` the button to `idle` (the
 * guide's OS switch does when the command changes).
 */
export function useCopyCommand(
  command: string,
  pre: RefObject<HTMLElement | null>,
  button: RefObject<HTMLElement | null>,
  onCopied?: () => void,
): { state: CopyState; copy: () => void; reset: () => void } {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copied = () => {
    onCopied?.();
    setState("done");
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState("idle"), DONE_MS);
  };

  /** The route for a page with no clipboard API, or one that refused. */
  const fallback = () => {
    const scratch = document.createElement("textarea");
    scratch.value = command;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(scratch);
    button.current?.focus();
    if (ok) {
      copied();
      return;
    }

    const node = pre.current;
    const selection = window.getSelection();
    if (node && selection) {
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    window.clearTimeout(resetTimer.current);
    setState("blocked");
  };

  const copy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(command).then(copied, fallback);
    } else {
      fallback();
    }
  };

  const reset = () => {
    window.clearTimeout(resetTimer.current);
    setState("idle");
  };

  return { state, copy, reset };
}
