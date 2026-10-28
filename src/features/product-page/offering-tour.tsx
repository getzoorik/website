"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * What <product> does, the rows taking turns (ported line for line from the
 * mock's script): the list, around rows the server renders.
 *
 * While at least half of What <product> does is in view, each row is read for
 * `DWELL_MS`, then the next; after the last, the first. The row being read
 * plays its drawing in that time (product-tour.css, on `aria-selected`); no
 * tint and no progress line mark it (owner, 23 Oct 2026). A click, Enter or
 * Space holds the row chosen, and the arrows move the hold; a pointer resting
 * on a row for `HOVER_MS` shows it and pauses the turn until it leaves; a link
 * to a row (`#id`) holds that row. Under reduced motion nothing turns: the
 * first row is shown, and a click, a key or a link still choose.
 *
 * ─── WITHOUT SCRIPTING, A PLAIN LIST ───────────────────────────────────────
 * Every row and its line are server-rendered and always drawn, so nothing moves
 * when the row being read changes, and with scripting off the list is a list:
 * no row is selected, no tab role. This only adds the roles, the selection and
 * the turning on top.
 *
 * ─── THE DOM, NOT STATE ────────────────────────────────────────────────────
 * The clock runs every frame, and a row's selection is three attributes on a
 * server-rendered element, so this keeps the mock's own shape: one effect, the
 * rows read from the list, the attributes written in place. No React state
 * changes, so React never re-renders the rows under it.
 */

/** How long each row is read, in ms. */
const DWELL_MS = 4800;
/** How long a pointer rests on a row before it is shown, in ms. */
const HOVER_MS = 220;

export function OfferingTour({ children }: { readonly children: ReactNode }): React.JSX.Element {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    /* The mock observes the whole column (`#what`): its heading, the rows and
       the chips under them. */
    const box = list?.parentElement;
    if (!list || !box) return;
    const rows = [...list.querySelectorAll<HTMLLIElement>(":scope > li.has-i")];
    if (rows.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cur = 0;
    let fill = 0;
    let seen = false;
    let held = false;
    let over = false;
    let t0 = 0;
    let hover: ReturnType<typeof setTimeout> | undefined;
    let jump: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    const show = (index: number) => {
      cur = index;
      fill = 0;
      rows.forEach((row, k) => {
        row.setAttribute("aria-selected", k === index ? "true" : "false");
        row.tabIndex = k === index ? 0 : -1;
      });
      t0 = performance.now();
    };

    /* A link to a row holds it. */
    const pick = (id: string) => {
      rows.forEach((row, k) => {
        if (row.id === id) {
          held = true;
          show(k);
        }
      });
    };

    const off: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      row: HTMLLIElement,
      type: K,
      listener: (event: HTMLElementEventMap[K]) => void,
    ) => {
      row.addEventListener(type, listener);
      off.push(() => row.removeEventListener(type, listener));
    };

    rows.forEach((row, k) => {
      row.setAttribute("role", "tab");
      on(row, "click", () => {
        held = true;
        show(k);
      });
      on(row, "mouseenter", () => {
        over = true;
        clearTimeout(hover);
        hover = setTimeout(() => {
          if (cur !== k) show(k);
        }, HOVER_MS);
      });
      on(row, "mouseleave", () => {
        over = false;
        clearTimeout(hover);
        t0 = performance.now();
      });
      on(row, "keydown", (event) => {
        let next = -1;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (k + 1) % rows.length;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
          next = (k + rows.length - 1) % rows.length;
        else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          held = true;
          show(k);
          return;
        }
        if (next > -1) {
          event.preventDefault();
          held = true;
          rows[next]!.focus();
          show(next);
        }
      });
    });
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-orientation", "vertical");

    const onHashChange = () => pick(decodeURIComponent(window.location.hash.slice(1)));
    /* The site's in-page links keep the hash out of the address bar, so a link's
       click is read here, after the jump it starts. */
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      clearTimeout(jump);
      jump = setTimeout(() => pick(id), 0);
    };
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      /* Out of view or under the pointer, the row's time stands still. */
      const tick = (now: number) => {
        if (seen && !held && !over) {
          fill = Math.min(1, (now - t0) / DWELL_MS);
          if (fill >= 1) show((cur + 1) % rows.length);
        } else if (!seen || over) t0 = now - fill * DWELL_MS;
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) seen = entry.isIntersecting;
          },
          { threshold: 0.5 },
        );
        io.observe(box);
      } else seen = true;
    }

    show(0);
    if (window.location.hash) pick(decodeURIComponent(window.location.hash.slice(1)));

    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      clearTimeout(hover);
      clearTimeout(jump);
      off.forEach((remove) => remove());
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <ul className="flist" role="list" ref={ref}>
      {children}
    </ul>
  );
}
