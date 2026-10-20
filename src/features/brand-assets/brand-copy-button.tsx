"use client";

import { useRef } from "react";

import { brandAssetsPage } from "@/content/brand-assets";
import { CopyGlyph, TickGlyph } from "@/features/brand-assets/brand-assets-glyphs";
import { useCopyCommand } from "@/hooks/use-copy-command";

/**
 * A Copy button on /brand-assets (the mock's `.bk-copy` and its script): it copies exactly `text`, the mock's
 * `data-copy`, then says "Copied" with a tick for 1.6 s and is ready again. Nothing is stored.
 *
 * The copying is the site's one copy of it (`useCopyCommand`): the clipboard, else the old `execCommand` route.
 * When both fail the mock does nothing, and so does this: there is no well to select (`pre` stays empty), so the
 * button keeps "Copy".
 *
 * The button is named for what it copies ("Copy navy", the mock's `aria-label`), which a screen reader reads in place
 * of the label, so "Copied" is also said once in a polite live region beside it, as every copy button on the site
 * says it. The region is `.sr-only` (absolute), so it takes no cell in the row's grid or the swatch's column.
 */
export interface BrandCopyButtonProps {
  readonly text: string;
  /** What the button copies, as its name says it: "navy", "tagline", "about zoorik". */
  readonly name: string;
}

export function BrandCopyButton({ text, name }: BrandCopyButtonProps): React.JSX.Element {
  const { copy: strings } = brandAssetsPage;
  const nothingToSelect = useRef<HTMLElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const { state, copy } = useCopyCommand(text, nothingToSelect, button);
  const done = state === "done";

  return (
    <>
      <button
        ref={button}
        type="button"
        className="bk-copy"
        data-copy={text}
        aria-label={`Copy ${name}`}
        data-done={done ? "" : undefined}
        onClick={copy}
      >
        <CopyGlyph className="bk-c1" />
        <TickGlyph className="bk-c2" />
        <span>{done ? strings.done : strings.idle}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? strings.announcement : ""}
      </span>
    </>
  );
}
