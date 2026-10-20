"use client";

import { useEffect, useRef, useState } from "react";

import { contentsLabel } from "@/content/documents";
import { ChevronGlyph, UpGlyph } from "@/features/documents/document-glyphs";

/**
 * "On this page": a sticky rail from 981px, and the
 * folded contents, a `<details>` at the top of the column, below that. The
 * sheet shows one and hides the other, so a screen reader meets one list.
 *
 * Both lists keep `role="list"`: `list-style:none` drops list semantics in
 * Safari. No section numbers.
 */

export interface ContentsItem {
  /** The section's id, and the link's fragment. */
  readonly id: string;
  /** The section's name, as its h2 reads. */
  readonly label: string;
}

/** A section is the one being read once its top has passed this line, 140px from the top of the viewport. */
export const CONTENTS_LINE = 140;

/**
 * The section being read: the last listed section whose top
 * has passed `CONTENTS_LINE`, or the first while the reader is above them all.
 * At the bottom of the page it is the last section, whose top may never reach
 * the line when it is short. Read on load and once a frame while
 * the page scrolls.
 *
 * That one rule also marks a section a link was followed to: a jump lands the
 * section's top at 96px (104px on /privacy), past the line, and the sections
 * under it are still below it.
 */
export function useSectionInView(ids: readonly string[]): string | null {
  const [current, setCurrent] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    const order = key.split(" ").filter(Boolean);
    const read = () => {
      let last = order[0] ?? null;
      for (const id of order) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= CONTENTS_LINE) last = id;
      }
      /* 2px of slack: a zoomed page can stop a fraction of a pixel short. */
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) last = order.at(-1) ?? last;
      setCurrent(last);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return current;
}

function ContentsList({
  items,
  current,
}: {
  readonly items: readonly ContentsItem[];
  readonly current?: string | null;
}): React.JSX.Element {
  return (
    <ol role="list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            className="rl"
            href={`#${item.id}`}
            aria-current={item.id === current ? "true" : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * From 981px: sticky at 104px, 228px wide, scrolling inside itself; the section
 * being read carries `aria-current="true"`. Its focus ring is inset in the
 * sheet, because the rail's `overflow:auto` clips a ring drawn outside it.
 *
 * "Back to top" scrolls to the top (at once under reduced motion), leaves no
 * hash in the address, and puts focus on `<main>` without scrolling. Its
 * handler stops the jump, so the site's in-page script leaves the click alone.
 */
export function ContentsRail({
  items,
}: {
  readonly items: readonly ContentsItem[];
}): React.JSX.Element {
  const current = useSectionInView(items.map((item) => item.id));
  return (
    <nav className="doc-rail" aria-label={contentsLabel}>
      <p>{contentsLabel}</p>
      <ContentsList items={items} current={current} />
      <a
        className="alink doc-top"
        href="#top"
        onClick={(event) => {
          event.preventDefault();
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          document.getElementById("main")?.focus({ preventScroll: true });
        }}
      >
        Back to top
        <UpGlyph />
      </a>
    </nav>
  );
}

/**
 * Below 981px: "On this page" as a white card, one 44px line at the top of the
 * column. Following a link closes it, before the page scrolls (React's handler
 * runs ahead of the site's document-level one), so the jump measures the page
 * as it will be and lands where it should.
 */
export function ContentsDisclosure({
  items,
}: {
  readonly items: readonly ContentsItem[];
}): React.JSX.Element {
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details className="doc-toc" ref={details}>
      <summary>
        {contentsLabel}
        <ChevronGlyph />
      </summary>
      <nav
        aria-label={contentsLabel}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a") && details.current) {
            details.current.open = false;
          }
        }}
      >
        <ContentsList items={items} />
      </nav>
    </details>
  );
}
