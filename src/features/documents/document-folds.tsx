"use client";

import { useEffect } from "react";

/**
 * The folds of a document: the FAQ's questions and the guide's folded
 * subsections are closed `<details>` on load, and this opens the one a reader
 * is sent to. A script with no markup of its own: the page renders it once.
 *
 *  - An address that names one (`/coral/faq#nodes-held`) opens it on load and,
 *    two frames later, lands it under the bar. Nothing else opens.
 *  - An in-page link into one ("question 16", "Per-workload settings") opens it
 *    (the others stay as they are), scrolls to it (smooth; at once under
 *    reduced motion or beyond two screens), focuses its summary and writes
 *    `#id` with `replaceState`, so Back still leaves the page.
 *  - A hash change in the address opens its target and lands it at once.
 *  - Printing opens every fold in the column, and closing the print restores
 *    each one as it was.
 *
 * 🔴 ITS CLICK HANDLER LISTENS IN THE CAPTURE PHASE AND STOPS THE JUMP, as the
 * mock's does. The site's in-page script (`InPageLinks`) leaves a click whose
 * default is already prevented alone, so a link into a fold is handled here
 * once, and every other in-page link (the rail, the folded contents, the FAQ's
 * group chips, a section cross-reference) is still the site's. A modified click
 * (Ctrl, Cmd, Shift or Alt) is left to the browser.
 *
 * Toggling a question or a fold by hand never touches the address.
 */

const FOLDS = "details.fq, details.doc-fold";

export function DocumentFolds(): null {
  useEffect(() => {
    if (!document.querySelector(FOLDS)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** The fold that holds `id` (opened), or the element itself when no fold holds it. */
    const target = (id: string): HTMLElement | null => {
      const element = id ? document.getElementById(id) : null;
      if (!element) return null;
      const fold = element.closest<HTMLDetailsElement>(FOLDS);
      if (fold && !fold.open) fold.open = true;
      return fold ?? element;
    };

    const land = (element: HTMLElement, smooth: boolean) => {
      const far = Math.abs(element.getBoundingClientRect().top) > 2 * window.innerHeight;
      element.scrollIntoView({
        behavior: smooth && !reduced && !far ? "smooth" : "auto",
        block: "start",
      });
      const focusable =
        element instanceof HTMLDetailsElement
          ? (element.querySelector<HTMLElement>(":scope > summary") ?? element)
          : element;
      if (!focusable.matches("a[href], button, summary, [tabindex]")) {
        focusable.setAttribute("tabindex", "-1");
      }
      focusable.focus({ preventScroll: true });
    };

    const fromHash = () => target(decodeURIComponent(window.location.hash.slice(1)));

    let first = 0;
    let second = 0;
    const arrived = fromHash();
    if (arrived) {
      first = window.requestAnimationFrame(() => {
        second = window.requestAnimationFrame(() => arrived.scrollIntoView({ block: "start" }));
      });
    }

    const onClick = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const element = id ? document.getElementById(id) : null;
      if (!element?.closest(FOLDS)) return;
      event.preventDefault();
      const fold = target(id);
      if (fold) land(fold, true);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#${id}`,
      );
    };

    const onHashChange = () => {
      const element = fromHash();
      if (element) land(element, false);
    };

    let was: [HTMLDetailsElement, boolean][] | null = null;
    const beforePrint = () => {
      was = [...document.querySelectorAll<HTMLDetailsElement>(".doc-main details")].map(
        (details) => [details, details.open],
      );
      for (const [details] of was) details.open = true;
    };
    const afterPrint = () => {
      if (was) for (const [details, open] of was) details.open = open;
      was = null;
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  return null;
}
