"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * A command well in a guide: the site's dark
 * `.as-well`, in IBM Plex Mono, with no copy button. The guide's one copyable
 * command, the install, is `DocOsWell`; the others carry a placeholder or are
 * an example to adapt (connect, disconnect, the YAML).
 *
 * Each line is printed after its prompt (`$ `), which is `aria-hidden` and not
 * selectable, so selecting the well copies the command alone.
 *
 * ─── ONE LINE STAYS ONE LINE ───────────────────────────────────────────────
 * A one-line command (`is-line`) never wraps: it scrolls sideways, with its
 * scrollbar hidden, under a 36px fade at the right edge that shows only while
 * there is more line to scroll to (`is-clip`, read on scroll and on resize).
 * The YAML example (`yaml`) scrolls the same way with a thin scrollbar, because
 * a wrapped YAML line would read as a new key.
 *
 * A well that scrolls sideways takes `tabindex="0"`, so a keyboard can scroll
 * it, and gives it back when it fits. The page itself never scrolls sideways.
 */

export interface DocCommandWellProps {
  /** The command's lines, without prompts. */
  readonly lines: readonly string[];
  /** The prompt printed before each line; none for the YAML example. */
  readonly prompt?: "$ " | "PS> ";
  /** The YAML example: no prompt, and it scrolls inside the well. */
  readonly yaml?: boolean;
  /** The note under the well: "Your own command, with its one-time token, comes from…". */
  readonly note?: string;
}

/**
 * Keeps a well's `pre` reachable by keyboard while it overflows, and fades a
 * one-line well's right edge while more line remains. Shared with `DocOsWell`.
 */
export function useWellReach(pre: React.RefObject<HTMLPreElement | null>, line: boolean): void {
  useEffect(() => {
    const node = pre.current;
    if (!node) return;
    const clip = () => {
      if (line) {
        node.classList.toggle("is-clip", node.scrollWidth - node.clientWidth - node.scrollLeft > 1);
      }
    };
    const reach = () => {
      if (node.scrollWidth > node.clientWidth + 1) node.setAttribute("tabindex", "0");
      else node.removeAttribute("tabindex");
      clip();
    };
    reach();
    node.addEventListener("scroll", clip, { passive: true });
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(reach) : null;
    if (observer) observer.observe(node);
    else window.addEventListener("resize", reach);
    return () => {
      node.removeEventListener("scroll", clip);
      observer?.disconnect();
      window.removeEventListener("resize", reach);
    };
  }, [pre, line]);
}

/**
 * A command's lines as the open-source pages print them: the prompt only where a
 * command starts, never on a line that continues one (the line before ends in `\`), and a continuation's leading
 * indent drawn as no-break spaces so it never wraps onto a line of its own. Copy keeps the plain lines.
 */
export function CommandLines({
  lines,
  prompt,
}: {
  readonly lines: readonly string[];
  readonly prompt?: string;
}): React.JSX.Element {
  return (
    <>
      {lines.map((line, index) => {
        const continued = index > 0 && lines[index - 1]!.endsWith("\\");
        const lead = line.length - line.trimStart().length;
        return (
          <Fragment key={index}>
            {index > 0 ? "\n" : null}
            {prompt && !continued ? <i aria-hidden="true">{prompt}</i> : null}
            {"\u00a0".repeat(lead)}
            {line.slice(lead)}
          </Fragment>
        );
      })}
    </>
  );
}

/** The lines as the well prints them: each after its prompt, joined by newlines. */
export function PromptedLines({
  lines,
  prompt,
}: {
  readonly lines: readonly string[];
  readonly prompt?: string;
}): React.JSX.Element {
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? "\n" : null}
          {prompt ? <i aria-hidden="true">{prompt}</i> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export function DocCommandWell({
  lines,
  prompt,
  yaml,
  note,
}: DocCommandWellProps): React.JSX.Element {
  const pre = useRef<HTMLPreElement>(null);
  const line = !yaml && lines.length === 1;
  useWellReach(pre, line);
  const classes = ["as-well", "doc-well", yaml ? "is-yaml" : null, line ? "is-line" : null];

  return (
    <>
      <div className={classes.filter(Boolean).join(" ")}>
        <pre ref={pre}>
          <PromptedLines lines={lines} prompt={yaml ? undefined : prompt} />
        </pre>
      </div>
      {note ? <p className="doc-well-note">{note}</p> : null}
    </>
  );
}
