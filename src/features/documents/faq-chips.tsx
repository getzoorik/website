"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The FAQ's row of group names on a phone (`.fq-chips`): one link per group,
 * pinned under the bar below 981px and hidden from 981px, where each group's
 * name stands beside its questions.
 *
 * The chip of the group being read carries `aria-current="true"`: the last
 * group whose top has passed 24px under the row's bottom, or the first while
 * the reader is above them all. It is read on load, then once a frame on
 * scroll and on resize, and only while the row is shown, so the desktop page
 * marks none. When the current chip is out of the row's view, the row scrolls
 * it to its left padding (smooth; at once under reduced motion).
 *
 * The links are plain in-page links: the site's in-page script lands a group
 * under the bar and the row, and writes its `#id` on this page.
 */

export interface FaqChip {
  readonly id: string;
  /** The group's name: text, or text whose product name is kept out of translation (`named()`). */
  readonly label: ReactNode;
}

export function FaqChips({ chips }: { readonly chips: readonly FaqChip[] }): React.JSX.Element {
  const row = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const key = chips.map((chip) => chip.id).join(" ");

  useEffect(() => {
    const nav = row.current;
    if (!nav) return;
    const ids = key.split(" ");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last: string | null = null;

    const spy = () => {
      if (getComputedStyle(nav).display === "none") return;
      const line = nav.getBoundingClientRect().bottom + 24;
      let index = 0;
      ids.forEach((id, at) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) index = at;
      });
      const id = ids[index]!;
      if (id === last) return;
      last = id;
      setCurrent(id);
      const chip = nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`);
      if (!chip) return;
      const left =
        chip.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
      const pad = parseFloat(getComputedStyle(nav).paddingLeft) || 0;
      if (
        left < nav.scrollLeft + pad ||
        left + chip.offsetWidth > nav.scrollLeft + nav.clientWidth - pad
      ) {
        nav.scrollTo({ left: Math.max(0, left - pad), behavior: reduced ? "auto" : "smooth" });
      }
    };

    let frame = 0;
    const request = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        spy();
      });
    };
    const onResize = () => {
      last = null;
      request();
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    spy();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
    };
  }, [key]);

  return (
    <nav className="fq-chips" aria-label="Sections" ref={row}>
      {chips.map((chip) => (
        <a
          href={`#${chip.id}`}
          aria-current={chip.id === current ? "true" : undefined}
          key={chip.id}
        >
          {chip.label}
        </a>
      ))}
    </nav>
  );
}
